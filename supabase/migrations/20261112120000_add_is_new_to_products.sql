-- Adds a flag so Vril Couture can choose which products appear on the New In page.
-- Safe to run more than once. Existing products default to not shown.

alter table public.products
    add column if not exists is_new boolean not null default false;

create index if not exists products_is_new_idx
    on public.products (is_new)
    where is_new = true;
