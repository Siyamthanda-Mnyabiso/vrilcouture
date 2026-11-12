// src/lib/featureFlags.ts
// Temporary switches. Set the variable to "true" in Vercel (and redeploy) to
// turn a part OFF. Remove the variable (or set it to anything else) and
// redeploy to turn it back ON. Nothing is deleted when a part is switched off.
//
//   VITE_DISABLE_CHECKOUT=true   -> cart, checkout and order-success unavailable
//   VITE_DISABLE_ADMIN=true      -> /admin/* unavailable
//   VITE_SITE_OFFLINE=true       -> whole site replaced by a holding page

export const featureFlags = {
    siteOffline: import.meta.env.VITE_SITE_OFFLINE === 'true',
    checkoutDisabled: import.meta.env.VITE_DISABLE_CHECKOUT === 'true',
    adminDisabled: import.meta.env.VITE_DISABLE_ADMIN === 'true',
};
