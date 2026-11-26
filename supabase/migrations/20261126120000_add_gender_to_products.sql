-- Lets Vril Couture say who a product is for, so it lists under Men or Women.
-- Safe to run more than once. Existing products start with no gender and keep
-- showing in both sections until one is chosen.

alter table public.products
    add column if not exists gender text
    check (gender in ('men', 'women', 'unisex'));

-- Fill in the products whose names already say who they are for.
update public.products set gender = 'women' where gender is null and name ilike '%(women)%';
update public.products set gender = 'men' where gender is null and name ilike '%(men)%';
