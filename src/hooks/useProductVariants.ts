// src/hooks/useProductVariants.ts
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface ProductVariant {
    id: string;
    product_id: string;
    size: string;
    color: string;
    stock: number;
    sku: string | null;
}

export function useProductVariants() {
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVariants = async (productId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('product_variants')
                .select('*')
                .eq('product_id', productId)
                .order('size', { ascending: true });
            if (fetchError) throw fetchError;
            setVariants((data ?? []) as ProductVariant[]);
            return (data ?? []) as ProductVariant[];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch variants');
            return [];
        } finally {
            setLoading(false);
        }
    };

    return { variants, loading, error, fetchVariants };
}