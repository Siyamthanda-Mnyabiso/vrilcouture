// Vercel function behind /shop, /new-in, /category/* and /product/* (see
// vercel.json). The site is built in the browser, so index.html arrives empty.
// This sends the same file with the page's title, description and content
// already in it, for search engines and link previews. In a browser that content
// stays hidden and React replaces it, so the site looks the same as before.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isGender, matchesGender } from '../src/utils/gender.js';
import {
    NEW_IN_META,
    SHOP_META,
    SITE_URL,
    categoryHeading,
    categoryMeta,
    productMeta,
    type PageMeta,
} from '../src/utils/seo.js';

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    original_price: number | null;
    image_url: string | null;
    brand: string | null;
    sku: string | null;
    stock: number;
    gender?: string | null;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Page {
    status: number;
    /** Missing for pages that do not exist; those are kept out of search. */
    meta?: PageMeta;
    content: string;
    image?: string | null;
    structuredData?: object;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NOT_FOUND: Page = { status: 404, content: '<h1>Not Found</h1><p><a href="/shop">Shop</a></p>' };

async function query<T>(path: string): Promise<T[]> {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing Supabase environment variables');

    const response = await fetch(`${url}/rest/v1/${path}`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        // A slow database must not hold up the page.
        signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error(`Query failed: ${response.status}`);
    return (await response.json()) as T[];
}

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const price = (value: number) => `R${Number(value).toFixed(2)}`;

const image = (url: string, alt: string) =>
    `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" width="300" loading="lazy">`;

const productList = (products: Product[]) => {
    if (products.length === 0) return '<p>Coming soon</p>';
    const items = products.map(
        (p) =>
            `<li><a href="/product/${escapeHtml(p.id)}">${
                p.image_url ? image(p.image_url, p.name) : ''
            }${escapeHtml(p.name)}</a> ${price(p.price)}</li>`
    );
    return `<ul>${items.join('')}</ul>`;
};

const categoryLinks = (categories: Category[]) =>
    `<nav>${categories
        .map((c) => `<a href="/category/${encodeURIComponent(c.slug)}">${escapeHtml(c.name)}</a>`)
        .join(' ')}</nav>`;

async function productPage(id: string): Promise<Page> {
    if (!UUID.test(id)) return NOT_FOUND;

    const [products, media, variants] = await Promise.all([
        query<Product>(`products?select=*&id=eq.${id}`),
        query<{ url: string; media_type: string }>(
            `product_media?select=url,media_type&product_id=eq.${id}&order=sort_order`
        ),
        query<{ stock: number }>(`product_variants?select=stock&product_id=eq.${id}`),
    ]);
    const product = products[0];
    if (!product) return NOT_FOUND;

    const meta = productMeta(product);
    const photos = media.filter((m) => m.media_type === 'image').map((m) => m.url);
    if (photos.length === 0 && product.image_url) photos.push(product.image_url);
    const brand = product.brand || 'Vril Couture';
    // Same rule as the product page: sizes decide stock when a product has them.
    const inStock = variants.length > 0 ? variants.some((v) => v.stock > 0) : product.stock > 0;

    const content = [
        '<nav><a href="/">Home</a> / <a href="/shop">Shop</a></nav>',
        `<p>${escapeHtml(brand)}</p>`,
        `<h1>${escapeHtml(product.name)}</h1>`,
        `<p>${price(product.price)}${
            product.original_price ? ` <s>${price(product.original_price)}</s>` : ''
        }</p>`,
        `<p>${inStock ? 'In Stock' : 'Out Of Stock'}</p>`,
        product.description
            ? `<p style="white-space: pre-line">${escapeHtml(product.description)}</p>`
            : '',
        ...photos.map((url) => image(url, product.name)),
    ].join('');

    return {
        status: 200,
        meta,
        content,
        image: photos[0],
        // Lets Google show price and availability with the search result.
        structuredData: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description || meta.description,
            image: photos.length > 0 ? photos : undefined,
            sku: product.sku || undefined,
            brand: { '@type': 'Brand', name: brand },
            offers: {
                '@type': 'Offer',
                url: SITE_URL + meta.path,
                priceCurrency: 'ZAR',
                price: Number(product.price).toFixed(2),
                availability: `https://schema.org/${inStock ? 'InStock' : 'OutOfStock'}`,
            },
        },
    };
}

async function listingPage(meta: PageMeta, heading: string, filter = ''): Promise<Page> {
    const [products, categories] = await Promise.all([
        query<Product>(`products?select=*&order=created_at.desc${filter}`),
        query<Category>('categories?select=id,name,slug&order=name'),
    ]);
    return {
        status: 200,
        meta,
        content: `<h1>${escapeHtml(heading)}</h1>${categoryLinks(categories)}${productList(products)}`,
        image: products.find((p) => p.image_url)?.image_url,
    };
}

async function categoryPage(slug: string, gender: string | null): Promise<Page> {
    const categories = await query<Category>('categories?select=id,name,slug&order=name');
    const category = categories.find((c) => c.slug === slug);
    // The app shows "Coming Soon" for these, so they are not an error.
    if (!category) return { status: 200, content: '<h1>Coming Soon</h1>' };

    const section = isGender(gender) ? gender : undefined;
    const all = await query<Product>(
        `products?select=*&order=created_at.desc&category_id=eq.${encodeURIComponent(category.id)}`
    );
    const products = section ? all.filter((p) => matchesGender(p.gender, section)) : all;

    return {
        status: 200,
        meta: categoryMeta(category, section),
        content: `<h1>${escapeHtml(categoryHeading(category.name, section))}</h1>${categoryLinks(
            categories
        )}${productList(products)}`,
        image: products.find((p) => p.image_url)?.image_url,
    };
}

async function findPage(route: string, gender: string | null): Promise<Page> {
    const [, section, value = ''] = route.split('/');
    if (section === 'shop') return listingPage(SHOP_META, 'Shop');
    if (section === 'new-in') return listingPage(NEW_IN_META, 'New In', '&is_new=eq.true');
    if (section === 'product') return productPage(value);
    if (section === 'category') return categoryPage(decodeURIComponent(value), gender);
    return NOT_FOUND;
}

/** Puts the page's details and content into the built index.html. */
function fill(template: string, { meta, content, image: picture, structuredData }: Page) {
    const path = meta?.path ?? '';
    const mark = `data-seo="${escapeHtml(path)}"`;
    const tag = (attribute: string, name: string, value: string) =>
        `<meta ${attribute}="${name}" content="${escapeHtml(value)}" ${mark}>`;

    const head = meta
        ? [
              `<title>${escapeHtml(meta.title)}</title>`,
              tag('name', 'description', meta.description),
              `<link rel="canonical" href="${escapeHtml(SITE_URL + path)}" ${mark}>`,
              tag('property', 'og:site_name', 'Vril Couture'),
              tag('property', 'og:type', structuredData ? 'product' : 'website'),
              tag('property', 'og:title', meta.title),
              tag('property', 'og:description', meta.description),
              tag('property', 'og:url', SITE_URL + path),
              picture ? tag('property', 'og:image', picture) : '',
              structuredData
                  ? `<script type="application/ld+json" ${mark}>${JSON.stringify(
                        structuredData
                    ).replace(/</g, '\\u003c')}</script>`
                  : '',
          ]
        : [`<title>VRILCOUTURE</title>`, tag('name', 'robots', 'noindex')];

    // Hidden straight away when JavaScript runs, so visitors never see it flash.
    const body = `<div id="root"><div id="prerender">${content}</div><script>document.getElementById('prerender').hidden = true</script></div>`;

    // Functions rather than strings, so a "$" in a product name stays a "$".
    return template
        .replace(/<title>[\s\S]*?<\/title>/, () => head.filter(Boolean).join('\n  '))
        .replace('<div id="root"></div>', () => body);
}

async function loadTemplate(origin: string) {
    try {
        // Bundled with the function by "includeFiles" in vercel.json.
        return await readFile(join(process.cwd(), 'dist', 'index.html'), 'utf8');
    } catch {
        const response = await fetch(`${origin}/index.html`);
        if (!response.ok) throw new Error(`Loading index.html failed: ${response.status}`);
        return response.text();
    }
}

const html = (body: string, status: number, cache: string) =>
    new Response(body, {
        status,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': cache },
    });

export async function GET(request: Request) {
    const url = new URL(request.url, SITE_URL);
    let template: string;
    try {
        template = await loadTemplate(url.origin);
    } catch (err) {
        console.error(err);
        return html('The page could not be loaded. Please try again.', 503, 'no-store');
    }

    if (process.env.VITE_SITE_OFFLINE === 'true') return html(template, 200, 'no-store');

    try {
        const page = await findPage(
            url.searchParams.get('route') ?? url.pathname,
            url.searchParams.get('gender')
        );
        return html(
            fill(template, page),
            page.status,
            'public, max-age=0, s-maxage=300, stale-while-revalidate=3600'
        );
    } catch (err) {
        // If the database cannot be read, send the plain page: the site still
        // works in the browser, as it did before this function existed.
        console.error(err);
        return html(template, 200, 'no-store');
    }
}
