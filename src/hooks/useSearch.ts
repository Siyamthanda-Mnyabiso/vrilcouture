// src/hooks/useSearch.ts
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../features/products/product.types';
import type { Category } from '../features/categories/category.types';

export function useSearch() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = async (query: string) => {
        const trimmed = query.trim();

        if (!trimmed) {
            setProducts([]);
            setCategories([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [productsRes, categoriesRes] = await Promise.all([
                supabase
                    .from('products')
                    .select('*')
                    .or(`name.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('categories')
                    .select('*')
                    .ilike('name', `%${trimmed}%`)
                    .order('name', { ascending: true }),
            ]);

            if (productsRes.error) throw productsRes.error;
            if (categoriesRes.error) throw categoriesRes.error;

            setProducts(productsRes.data ?? []);
            setCategories(categoriesRes.data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
            setProducts([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        categories,
        loading,
        error,
        search,
    };
}