// supabase/functions/google-merchant-sync/merchantClient.ts
//
// Server-to-server client for the Google Merchant API (merchantapi.googleapis.com,
// "products" sub-API — the replacement for the old Content API for Shopping).
// Auth is a service-account JWT signed with Web Crypto (crypto.subtle) rather than
// the googleapis/google-auth-library npm packages: those pull in Node-specific
// dependencies (gaxios, gcp-metadata, fs access) that don't reliably run in the
// Supabase/Deno Edge Runtime. Hand-rolled RS256 JWT + a plain fetch token exchange
// is the pattern Supabase's own docs use for Google service-account auth in edge
// functions, and it has zero third-party dependencies.
//
// NOTE ON API VERSION: v1beta was discontinued 2026-02-28 — confirmed live,
// it now 409s with "V1BETA_RAMP_DOWN". GOOGLE_MERCHANT_API_VERSION defaults
// to v1 (stable) below.

export interface ProductRow {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    brand: string | null;
    sku: string | null;
    stock: number;
    category_id: string | null;
}

export interface VariantRow {
    id: string;
    product_id: string;
    size: string;
    color: string;
    stock: number;
    sku: string | null;
}

export interface CategoryRow {
    id: string;
    name: string;
    slug: string;
}

interface MerchantConfig {
    accountId: string;
    dataSourceId: string;
    apiVersion: string;
    feedLabel: string;
    contentLanguage: string;
    siteUrl: string;
    defaultBrand: string;
}

function loadConfig(): MerchantConfig {
    const accountId = Deno.env.get('GOOGLE_MERCHANT_ACCOUNT_ID');
    const dataSourceId = Deno.env.get('GOOGLE_MERCHANT_DATA_SOURCE_ID');
    if (!accountId) throw new Error('GOOGLE_MERCHANT_ACCOUNT_ID is not configured');
    if (!dataSourceId) throw new Error('GOOGLE_MERCHANT_DATA_SOURCE_ID is not configured');

    return {
        accountId,
        dataSourceId,
        apiVersion: Deno.env.get('GOOGLE_MERCHANT_API_VERSION') || 'v1',
        feedLabel: Deno.env.get('GOOGLE_MERCHANT_FEED_LABEL') || 'ZA',
        contentLanguage: Deno.env.get('GOOGLE_MERCHANT_CONTENT_LANGUAGE') || 'en',
        siteUrl: Deno.env.get('GOOGLE_MERCHANT_SITE_URL') || 'https://vrilcouture.com',
        defaultBrand: Deno.env.get('GOOGLE_MERCHANT_DEFAULT_BRAND') || 'Vril Couture',
    };
}

// ---- Auth --------------------------------------------------------------

let cachedToken: { value: string; expiresAt: number } | null = null;

function base64url(bytes: Uint8Array): string {
    let str = '';
    for (const b of bytes) str += String.fromCharCode(b);
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\s/g, '');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
}

async function getAccessToken(): Promise<string> {
    if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
        return cachedToken.value;
    }

    // Base64-encoded, not raw JSON: Supabase's `secrets set --env-file`
    // mangled the raw JSON down to a single `{` character, because the
    // dotenv-style parser doesn't handle a value packed with unescaped
    // double quotes. Base64 has no quotes/newlines for it to trip on.
    const keyB64 = Deno.env.get('GOOGLE_MERCHANT_SERVICE_ACCOUNT_KEY_B64');
    if (!keyB64) throw new Error('GOOGLE_MERCHANT_SERVICE_ACCOUNT_KEY_B64 is not configured');

    let key: { client_email: string; private_key: string };
    try {
        key = JSON.parse(atob(keyB64));
    } catch (err) {
        throw new Error(
            `GOOGLE_MERCHANT_SERVICE_ACCOUNT_KEY_B64 did not decode to valid JSON: ${err instanceof Error ? err.message : String(err)}`,
            { cause: err }
        );
    }

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claims = {
        iss: key.client_email,
        scope: 'https://www.googleapis.com/auth/content',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
    };

    const encPart = (obj: unknown) => base64url(new TextEncoder().encode(JSON.stringify(obj)));
    const unsigned = `${encPart(header)}.${encPart(claims)}`;

    const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(key.private_key),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        new TextEncoder().encode(unsigned)
    );
    const jwt = `${unsigned}.${base64url(new Uint8Array(signature))}`;

    const resp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });

    if (!resp.ok) {
        throw new Error(`Google token exchange failed (${resp.status}): ${await resp.text()}`);
    }

    const data = await resp.json();
    cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
    return cachedToken.value;
}

// ---- Resource mapping ----------------------------------------------------

export interface ProductInputResource {
    offerId: string;
    contentLanguage: string;
    feedLabel: string;
    productAttributes: Record<string, unknown>;
}

/**
 * Maps one internal product (optionally scoped to a single variant) to a
 * Merchant API ProductInput. When `variant` is given, offerId is the
 * variant id and the listing is grouped under the parent product via
 * itemGroupId — that's how Merchant Center represents size/colour variants.
 */
export function toProductInput(
    product: ProductRow,
    variant: VariantRow | null,
    primaryImageUrl: string | null,
    category: CategoryRow | null
): ProductInputResource {
    const config = loadConfig();
    const stock = variant ? variant.stock : product.stock;
    const offerId = variant ? variant.id : product.id;

    const productAttributes: Record<string, unknown> = {
        title: product.name,
        description: product.description || product.name,
        link: `${config.siteUrl}/product/${product.id}`,
        imageLink: primaryImageUrl || product.image_url || undefined,
        availability: stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
        condition: 'NEW',
        brand: product.brand || config.defaultBrand,
        price: {
            amountMicros: String(Math.round(product.price * 1_000_000)),
            currencyCode: 'ZAR',
        },
    };

    if (category) productAttributes.productTypes = [category.name];
    if (product.sku) productAttributes.mpn = product.sku;

    if (variant) {
        productAttributes.itemGroupId = product.id;
        // Confirmed against the live API: "sizes" (plural/array, the old
        // Content API field name) is rejected with "Unknown name \"sizes\"".
        // The Product data spec's size field is singular.
        productAttributes.size = variant.size;
        productAttributes.color = variant.color;
    }

    return {
        offerId,
        contentLanguage: config.contentLanguage,
        feedLabel: config.feedLabel,
        productAttributes,
    };
}

// ---- REST calls ------------------------------------------------------------

function apiBase(config: MerchantConfig) {
    return `https://merchantapi.googleapis.com/products/${config.apiVersion}/accounts/${config.accountId}`;
}

export class MerchantApiError extends Error {
    constructor(public offerId: string, message: string) {
        super(message);
        this.name = 'MerchantApiError';
    }
}

export async function upsertProduct(input: ProductInputResource): Promise<void> {
    const config = loadConfig();
    const token = await getAccessToken();
    const dataSource = `accounts/${config.accountId}/dataSources/${config.dataSourceId}`;

    const resp = await fetch(
        `${apiBase(config)}/productInputs:insert?dataSource=${encodeURIComponent(dataSource)}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }
    );

    if (!resp.ok) {
        const body = await resp.text();
        throw new MerchantApiError(input.offerId, `upsert failed (${resp.status}): ${body}`);
    }
}

export async function deleteProduct(offerId: string): Promise<void> {
    const config = loadConfig();
    const token = await getAccessToken();
    const dataSource = `accounts/${config.accountId}/dataSources/${config.dataSourceId}`;
    const name = `${config.contentLanguage}~${config.feedLabel}~${offerId}`;
    // v1 requires the contentLanguage~feedLabel~offerId identifier to be
    // unpadded base64url-encoded in the resource path (RFC 4648 §5) — plain
    // percent-encoding of the raw string is a v1beta-era pattern that no
    // longer resolves the resource.
    const encodedName = base64url(new TextEncoder().encode(name));

    const resp = await fetch(
        `${apiBase(config)}/productInputs/${encodedName}?dataSource=${encodeURIComponent(dataSource)}`,
        {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    // A 404 here means the listing was never synced (e.g. it was created and
    // deleted before its first successful sync) — not a real failure.
    if (!resp.ok && resp.status !== 404) {
        const body = await resp.text();
        throw new MerchantApiError(offerId, `delete failed (${resp.status}): ${body}`);
    }
}

// ---- Bounded-concurrency batch runner ------------------------------------
//
// The Merchant API has no documented multi-item batch RPC for productInputs
// (unlike the old Content API's custombatch) — Google's own guidance is to
// fire concurrent per-item requests instead. This runs a bounded number of
// them at once rather than either a slow sequential loop or an unbounded
// Promise.all that could trip the per-minute rate limit.

export interface SyncResult {
    offerId: string;
    ok: boolean;
    error?: string;
}

export async function runWithConcurrency<T>(
    items: T[],
    worker: (item: T) => Promise<SyncResult>,
    concurrency = 8
): Promise<SyncResult[]> {
    const results: SyncResult[] = new Array(items.length);
    let next = 0;

    async function runNext(): Promise<void> {
        while (true) {
            const i = next++;
            if (i >= items.length) return;
            results[i] = await worker(items[i]);
        }
    }

    await Promise.all(
        Array.from({ length: Math.min(concurrency, items.length) }, runNext)
    );

    return results;
}
