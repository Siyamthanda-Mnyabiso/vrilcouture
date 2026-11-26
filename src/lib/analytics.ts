// Google tag helpers. The tag itself is loaded in index.html.
import { supabase } from './supabase';

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

const ADS_PURCHASE_CONVERSION = 'AW-18434709463/ejCoCMDTobcdENevrdZE';

// Must match the key read in index.html.
const CONSENT_KEY = 'vc_cookie_consent';

export type ConsentChoice = 'granted' | 'denied';

export function getConsentChoice(): ConsentChoice | null {
    try {
        const value = localStorage.getItem(CONSENT_KEY);
        return value === 'granted' || value === 'denied' ? value : null;
    } catch {
        return null;
    }
}

export function saveConsentChoice(choice: ConsentChoice) {
    try {
        localStorage.setItem(CONSENT_KEY, choice);
    } catch {
        // Storage blocked: the choice still applies to this visit.
    }
    window.gtag?.('consent', 'update', {
        ad_storage: choice,
        ad_user_data: choice,
        ad_personalization: choice,
        analytics_storage: choice,
    });
}

/**
 * Sends the GA4 purchase and Google Ads conversion events for a paid order,
 * once per order in this browser. Google also de-duplicates on transaction_id.
 */
export async function trackPurchase(orderId: string) {
    const sentKey = `purchase_tracked_${orderId}`;
    if (localStorage.getItem(sentKey)) return;

    const [orderRes, itemsRes] = await Promise.all([
        supabase.from('orders').select('total, status').eq('id', orderId).single(),
        supabase
            .from('order_items')
            .select('product_id, variant_id, product_name, price, quantity')
            .eq('order_id', orderId),
    ]);

    // Without the real values, send nothing; a later visit can try again.
    if (orderRes.error || itemsRes.error || orderRes.data.status !== 'paid') return;
    const items = itemsRes.data;
    if (items.length === 0) return;

    const variantIds = items.flatMap((i) => (i.variant_id ? [i.variant_id] : []));
    const productIds = items.flatMap((i) => (i.product_id ? [i.product_id] : []));
    const [variantsRes, productsRes] = await Promise.all([
        supabase.from('product_variants').select('id, sku').in('id', variantIds),
        supabase.from('products').select('id, sku').in('id', productIds),
    ]);
    const variantSkus = new Map(variantsRes.data?.map((v) => [v.id, v.sku]));
    const productSkus = new Map(productsRes.data?.map((p) => [p.id, p.sku]));

    // Checked again after the awaits: the effect can run twice at once.
    if (!window.gtag || localStorage.getItem(sentKey)) return;
    localStorage.setItem(sentKey, 'true');

    const value = Number(orderRes.data.total);

    window.gtag('event', 'purchase', {
        transaction_id: orderId,
        value,
        currency: 'ZAR',
        items: items.map((i) => ({
            item_id:
                (i.variant_id && variantSkus.get(i.variant_id)) ||
                (i.product_id && productSkus.get(i.product_id)) ||
                i.variant_id ||
                i.product_id,
            item_name: i.product_name,
            price: Number(i.price),
            quantity: i.quantity,
        })),
    });

    window.gtag('event', 'conversion', {
        send_to: ADS_PURCHASE_CONVERSION,
        value,
        currency: 'ZAR',
        transaction_id: orderId,
    });
}
