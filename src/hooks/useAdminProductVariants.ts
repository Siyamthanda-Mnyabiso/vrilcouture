// src/hooks/useAdminProductVariants.ts

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { syncProductToMerchant, deleteMerchantListing } from '../lib/googleMerchantSync';

export interface ProductVariant {
    id: string;
    product_id: string;
    size: string;
    color: string;
    stock: number;
    sku: string | null;
}

export function useAdminProductVariants() {
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
            return data ?? [];
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch variants'
            );
            return [];
        } finally {
            setLoading(false);
        }
    };


    const addVariant = async (
        productId: string,
        variant: Omit<ProductVariant, 'id' | 'product_id' | 'sku'>
    ) => {

        const { data, error } = await supabase
            .from('product_variants')
            .insert({
                product_id: productId,
                size: variant.size,
                color: variant.color,
                stock: variant.stock,
            })
            .select()
            .single();

        if (error) throw error;

        setVariants(prev => [...prev, data]);
        syncProductToMerchant(productId);

        return data;
    };


    const updateVariant = async (
        id: string,
        updates: Partial<ProductVariant>
    ) => {

        const { error } = await supabase
            .from('product_variants')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        setVariants(prev =>
            prev.map(v =>
                v.id === id
                    ? { ...v, ...updates }
                    : v
            )
        );

        const productId = variants.find(v => v.id === id)?.product_id;
        if (productId) syncProductToMerchant(productId);
    };


    const deleteVariant = async (id: string) => {

        const { error } = await supabase
            .from('product_variants')
            .delete()
            .eq('id', id);

        if (error) throw error;

        setVariants(prev =>
            prev.filter(v => v.id !== id)
        );
        deleteMerchantListing(id);
    };


    return {
        variants,
        loading,
        error,
        fetchVariants,
        addVariant,
        updateVariant,
        deleteVariant,
    };
}