// Vercel function behind /sitemap.xml (see vercel.json). Built on request so
// that products and categories added in the admin area appear without a deploy.

const SITE = 'https://www.vrilcouture.co.za';
const STATIC_PATHS = ['/', '/shop', '/new-in', '/about', '/contact', '/terms', '/returns', '/privacy'];
const PAGE_SIZE = 1000;

async function fetchAll<T>(table: string, columns: string): Promise<T[]> {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing Supabase environment variables');

    const rows: T[] = [];
    for (let offset = 0; ; offset += PAGE_SIZE) {
        const response = await fetch(
            `${url}/rest/v1/${table}?select=${columns}&order=id&limit=${PAGE_SIZE}&offset=${offset}`,
            { headers: { apikey: key, Authorization: `Bearer ${key}` } }
        );
        if (!response.ok) throw new Error(`Loading ${table} failed: ${response.status}`);
        const page = (await response.json()) as T[];
        rows.push(...page);
        if (page.length < PAGE_SIZE) return rows;
    }
}

const escapeXml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET() {
    try {
        const [products, categories] = await Promise.all([
            fetchAll<{ id: string; updated_at: string | null }>('products', 'id,updated_at'),
            fetchAll<{ slug: string }>('categories', 'slug'),
        ]);

        const entries = [
            ...STATIC_PATHS.map((path) => ({ path, lastmod: null })),
            ...categories.map((c) => ({ path: `/category/${encodeURIComponent(c.slug)}`, lastmod: null })),
            ...products.map((p) => ({ path: `/product/${p.id}`, lastmod: p.updated_at })),
        ];

        const body = entries
            .map(({ path, lastmod }) => {
                const modified = lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : '';
                return `  <url><loc>${escapeXml(SITE + path)}</loc>${modified}</url>`;
            })
            .join('\n');

        return new Response(
            `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`,
            {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                },
            }
        );
    } catch (err) {
        console.error(err);
        return new Response('Sitemap unavailable', { status: 503 });
    }
}
