// src/lib/googleMerchantSync.ts
//
// Fire-and-forget triggers for the google-merchant-sync edge function. Called
// from product/variant CRUD hooks right after a Supabase write succeeds, so
// every create/update/delete/stock change pushes to Google Merchant Center
// without a separate manual step. Never awaited by callers on the critical
// path — a Merchant API outage must not block or roll back the actual
// product save, so failures are only logged here, not thrown.
import { supabase } from './supabase';

function invokeSync(action: string, body: Record<string, unknown>) {
    supabase.functions
        .invoke('google-merchant-sync', { body: { action, ...body } })
        .then(({ error }) => {
            if (error) console.error(`[GoogleMerchant] ${action} failed:`, error);
        })
        .catch((err) => console.error(`[GoogleMerchant] ${action} threw:`, err));
}

/** Re-syncs every listing derived from this product (its variants, or the bare product if it has none). */
export const syncProductToMerchant = (productId: string) => invokeSync('upsert', { productId });

/** Removes one or more listings from Merchant Center (offerId = variant id, or product id for a variant-less product). */
export const deleteMerchantListing = (offerIds: string | string[]) =>
    invokeSync('delete', { offerIds: Array.isArray(offerIds) ? offerIds : [offerIds] });
