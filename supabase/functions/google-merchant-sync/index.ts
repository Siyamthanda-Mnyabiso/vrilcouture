// supabase/functions/google-merchant-sync/index.ts
//
// Pushes product/variant create-update-delete events to Google Merchant
// Center in real time, instead of relying on a periodically-fetched feed
// file. Product CRUD in this app runs client-side against Supabase
// (src/hooks/useProducts.ts, useAdminProductVariants.ts) — there is no
// Node/Express backend — so those hooks call this function (via
// supabase.functions.invoke, see src/lib/googleMerchantSync.ts) right after
// each successful database write. This function does the actual Google
// Merchant API calls, using a service-account key that only ever lives in
// this function's environment — never sent to or stored in the browser.
//
// verify_jwt is left at its default (true), and the admin-role check below
// is on top of that: only a logged-in admin's session can trigger a sync.

import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import {
    toProductInput,
    upsertProduct,
    deleteProduct,
    runWithConcurrency,
    MerchantApiError,
    type ProductRow,
    type VariantRow,
    type CategoryRow,
    type SyncResult,
} from './merchantClient.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

async function fetchPrimaryImage(
    supabase: SupabaseClient,
    productId: string
): Promise<string | null> {
    const { data } = await supabase
        .from('product_media')
        .select('url')
        .eq('product_id', productId)
        .eq('media_type', 'image')
        .order('sort_order', { ascending: true })
        .limit(1)
        .maybeSingle();
    return data?.url ?? null;
}

/** Syncs every listing (one per variant, or one for the bare product) derived from a single product row. */
async function syncProduct(
    supabase: SupabaseClient,
    productId: string
): Promise<SyncResult[]> {
    const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, brand, sku, stock, category_id')
        .eq('id', productId)
        .single();

    if (productError || !product) {
        return [{ offerId: productId, ok: false, error: `product not found: ${productError?.message}` }];
    }

    const [{ data: variants }, primaryImage, categoryResult] = await Promise.all([
        supabase
            .from('product_variants')
            .select('id, product_id, size, color, stock, sku')
            .eq('product_id', productId),
        fetchPrimaryImage(supabase, productId),
        product.category_id
            ? supabase.from('categories').select('id, name, slug').eq('id', product.category_id).single()
            : Promise.resolve({ data: null }),
    ]);

    const category = (categoryResult.data as CategoryRow | null) ?? null;
    const variantRows = (variants ?? []) as VariantRow[];
    const productRow = product as ProductRow;

    const inputs = variantRows.length > 0
        ? variantRows.map((v) => toProductInput(productRow, v, primaryImage, category))
        : [toProductInput(productRow, null, primaryImage, category)];

    return runWithConcurrency(inputs, async (input) => {
        try {
            await upsertProduct(input);
            return { offerId: input.offerId, ok: true };
        } catch (err) {
            const message = err instanceof MerchantApiError ? err.message : String(err);
            console.error(`[google-merchant-sync] upsert failed for offerId=${input.offerId}:`, message);
            return { offerId: input.offerId, ok: false, error: message };
        }
    });
}

function deleteListings(offerIds: string[]): Promise<SyncResult[]> {
    return runWithConcurrency(offerIds, async (offerId) => {
        try {
            await deleteProduct(offerId);
            return { offerId, ok: true };
        } catch (err) {
            const message = err instanceof MerchantApiError ? err.message : String(err);
            console.error(`[google-merchant-sync] delete failed for offerId=${offerId}:`, message);
            return { offerId, ok: false, error: message };
        }
    });
}

/** Full catalog resync — bulk-loads everything up front to avoid N+1 queries, then dispatches with bounded concurrency. */
async function fullResync(supabase: SupabaseClient): Promise<SyncResult[]> {
    const [{ data: products }, { data: variants }, { data: media }, { data: categories }] = await Promise.all([
        supabase.from('products').select('id, name, description, price, image_url, brand, sku, stock, category_id'),
        supabase.from('product_variants').select('id, product_id, size, color, stock, sku'),
        supabase
            .from('product_media')
            .select('product_id, url, sort_order')
            .eq('media_type', 'image')
            .order('sort_order', { ascending: true }),
        supabase.from('categories').select('id, name, slug'),
    ]);

    const categoryById = new Map((categories ?? []).map((c) => [c.id, c as CategoryRow]));
    const variantsByProduct = new Map<string, VariantRow[]>();
    for (const v of (variants ?? []) as VariantRow[]) {
        const list = variantsByProduct.get(v.product_id) ?? [];
        list.push(v);
        variantsByProduct.set(v.product_id, list);
    }
    const primaryImageByProduct = new Map<string, string>();
    for (const m of (media ?? []) as { product_id: string; url: string }[]) {
        if (!primaryImageByProduct.has(m.product_id)) primaryImageByProduct.set(m.product_id, m.url);
    }

    const inputs = ((products ?? []) as ProductRow[]).flatMap((product) => {
        const productVariants = variantsByProduct.get(product.id) ?? [];
        const image = primaryImageByProduct.get(product.id) ?? null;
        const category = product.category_id ? categoryById.get(product.category_id) ?? null : null;

        return productVariants.length > 0
            ? productVariants.map((v) => toProductInput(product, v, image, category))
            : [toProductInput(product, null, image, category)];
    });

    return runWithConcurrency(inputs, async (input) => {
        try {
            await upsertProduct(input);
            return { offerId: input.offerId, ok: true };
        } catch (err) {
            const message = err instanceof MerchantApiError ? err.message : String(err);
            console.error(`[google-merchant-sync] full_resync upsert failed for offerId=${input.offerId}:`, message);
            return { offerId: input.offerId, ok: false, error: message };
        }
    }, 8);
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    if (req.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405);
    }

    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return json({ error: 'Missing authorization' }, 401);

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        const bearerToken = authHeader.replace('Bearer ', '');

        // Two legitimate callers: an admin's browser (real Supabase user JWT,
        // checked against users.role below), or another edge function acting
        // server-to-server — stitch-webhook, after decrementing stock for a
        // paid order, or a manual `full_resync` run via curl — which
        // authenticates by presenting the project's service-role key
        // directly. Only server-side code that already holds that secret
        // (never shipped to a browser) can take this branch.
        const isTrustedServerCall = bearerToken === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!isTrustedServerCall) {
            const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(bearerToken);
            if (userError || !userData?.user) return json({ error: 'Invalid session' }, 401);

            const { data: profile, error: profileError } = await supabaseAdmin
                .from('users')
                .select('role')
                .eq('id', userData.user.id)
                .single();
            if (profileError || profile?.role !== 'admin') {
                return json({ error: 'Admin access required' }, 403);
            }
        }

        const body = await req.json();
        const action = body.action as string;

        if (action === 'upsert') {
            if (!body.productId) return json({ error: 'productId is required' }, 400);
            const results = await syncProduct(supabaseAdmin, body.productId);
            return json({ action, results });
        }

        if (action === 'upsert_many') {
            const productIds: string[] = Array.isArray(body.productIds) ? body.productIds : [];
            if (productIds.length === 0) return json({ error: 'productIds is required' }, 400);
            const results = (
                await Promise.all(productIds.map((id) => syncProduct(supabaseAdmin, id)))
            ).flat();
            return json({ action, results });
        }

        if (action === 'delete') {
            const offerIds: string[] = Array.isArray(body.offerIds)
                ? body.offerIds
                : body.offerId
                    ? [body.offerId]
                    : [];
            if (offerIds.length === 0) return json({ error: 'offerId or offerIds is required' }, 400);
            const results = await deleteListings(offerIds);
            return json({ action, results });
        }

        if (action === 'full_resync') {
            const results = await fullResync(supabaseAdmin);
            const failed = results.filter((r) => !r.ok);
            return json({
                action,
                total: results.length,
                succeeded: results.length - failed.length,
                failed,
            });
        }

        return json({ error: `Unknown action: ${action}` }, 400);
    } catch (error) {
        console.error('[google-merchant-sync] error:', error);
        return json(
            { error: 'Internal server error', message: error instanceof Error ? error.message : String(error) },
            500
        );
    }
});
