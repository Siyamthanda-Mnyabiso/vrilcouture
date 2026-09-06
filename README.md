# Vril Couture

A boutique fashion storefront: a customer-facing shop plus an admin panel, built with React 19, TypeScript, Vite, Tailwind CSS v4, and Supabase (Postgres, Auth, Edge Functions).

## Stack

- **Frontend:** React 19 + React Router 7, Zustand for cart state, Tailwind v4
- **Backend:** Supabase (Postgres + Auth) with Deno-based Edge Functions for checkout, payments, and email
- **Payments:** Stitch (Express API) via a payment-link checkout flow
- **Product sync:** Google Merchant Center, kept in sync automatically on product/variant create, update, delete, and stock changes
- **Analytics:** Vercel Web Analytics

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

Other scripts:

```bash
npm run build      # tsc -b && vite build
npm run lint        # eslint .
npm run preview     # preview a production build
npm run gen:types   # regenerate src/types/database.ts from the linked Supabase project
```

## Project structure

```
src/
  components/   UI building blocks (auth, cart, category, hero, layout, product, ui)
  features/     Domain types (products, categories, orders)
  hooks/        Data-fetching hooks (one per resource, wrapping Supabase queries)
  pages/        Route-level views: store, account, auth, admin
  routes/       React Router route definitions, grouped by area
  store/        Zustand stores (cart)
  context/      React context providers (auth)
  lib/          Supabase client, Google Merchant sync client, misc integrations
supabase/
  functions/    Edge Functions (Deno) — see below
```

## Supabase Edge Functions

| Function | Purpose |
|---|---|
| `checkout` | Validates cart items/stock, creates a `pending` order, and requests a Stitch payment link |
| `stitch-webhook` | Confirms payment, atomically decrements stock, and triggers the confirmation email |
| `send-confirmation-email` | Sends customer order-confirmation and admin new-order-alert emails via Resend |
| `google-merchant-sync` | Pushes product/variant changes to Google Merchant Center |

Local secrets for these functions live in `supabase/functions/.env` (gitignored) — see `supabase/functions/.env.example` for the required variables and setup notes.

**Note:** the database schema (tables, RLS policies, RPC functions like `decrement_stock_for_order`) is not currently tracked as SQL migrations in this repo — it lives only in the linked Supabase project. Pull it locally with `supabase db pull` before making schema changes, so changes stay reproducible.

## Environment variables

Copy `.env.example` to `.env` for the frontend (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Server-side secrets (Stitch, Resend, Google Merchant service account) belong only in `supabase/functions/.env` / Supabase project secrets — never prefixed `VITE_`, and never referenced from `src/`.
