import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { syncProductToMerchant, deleteMerchantListing } from '../lib/googleMerchantSync';
import type {
    Product,
    CreateProductInput,
    UpdateProductInput,
    ProductMedia,
} from '../features/products/product.types';

type FetchProductsParams = {
    limit?: number;
    sortBy?: 'newest' | 'price-low' | 'price-high' | 'popular';
    category?: string;
};

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async (params?: FetchProductsParams) => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase.from('products').select('*');

            if (params?.category) {
                query = query.eq('category_id', params.category);
            }

            if (params?.sortBy === 'newest') {
                query = query.order('created_at', { ascending: false });
            } else if (params?.sortBy === 'price-low') {
                query = query.order('price', { ascending: true });
            } else if (params?.sortBy === 'price-high') {
                query = query.order('price', { ascending: false });
            }

            if (params?.limit) {
                query = query.limit(params.limit);
            }

            const { data, error: fetchError } = await query;
            if (fetchError) throw fetchError;
            setProducts(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductById = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data: product, error: fetchError } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();
            if (fetchError) throw fetchError;

            const { data: media } = await supabase
                .from('product_media')
                .select('*')
                .eq('product_id', id)
                .order('sort_order', { ascending: true });

            setCurrentProduct({ ...product, media: (media ?? []) as ProductMedia[] });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch product');
            setCurrentProduct(null);
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (input: CreateProductInput) => {
        const { data, error: insertError } = await supabase
            .from('products')
            .insert({
                name: input.name,
                description: input.description ?? null,
                price: input.price,
                original_price: input.original_price ?? null,
                image_url: input.image_url ?? null,
                category_id: input.category_id ?? null,
                brand: input.brand ?? null,
                sku: input.sku ?? null,
                stock: input.stock ?? 0,
            })
            .select()
            .single();

        if (insertError) throw insertError;
        setProducts((prev) => [data, ...prev]);
        syncProductToMerchant(data.id);
        return data as Product;
    };

    const updateProduct = async (id: string, input: UpdateProductInput) => {
        const { data, error: updateError } = await supabase
            .from('products')
            .update({ ...input, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;
        setProducts((prev) => prev.map((p) => (p.id === id ? data : p)));
        if (currentProduct?.id === id) setCurrentProduct({ ...currentProduct, ...data });
        syncProductToMerchant(id);
        return data as Product;
    };

    const deleteProduct = async (id: string) => {
        // Capture the offer id(s) this product maps to in Merchant Center
        // *before* deleting — once the row (and its variants, via FK cascade)
        // is gone, there's nothing left to look up.
        const { data: variants } = await supabase
            .from('product_variants')
            .select('id')
            .eq('product_id', id);
        const offerIds = variants && variants.length > 0 ? variants.map((v) => v.id) : [id];

        const { error: deleteError } = await supabase.from('products').delete().eq('id', id);
        if (deleteError) throw deleteError;
        setProducts((prev) => prev.filter((p) => p.id !== id));
        deleteMerchantListing(offerIds);
    };

    const addProductMedia = async (
        productId: string,
        items: { media_type: 'image' | 'video'; url: string; sort_order?: number }[]
    ) => {
        const inserted: ProductMedia[] = [];
        for (const item of items) {
            const { data, error: insertError } = await supabase
                .from('product_media')
                .insert({ ...item, product_id: productId })
                .select()
                .single();
            if (insertError) throw insertError;
            inserted.push(data as ProductMedia);
        }
        return inserted;
    };

    const deleteProductMedia = async (mediaId: string) => {
        const { error: deleteError } = await supabase
            .from('product_media')
            .delete()
            .eq('id', mediaId);
        if (deleteError) throw deleteError;
    };

    return {
        products,
        currentProduct,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        addProductMedia,
        deleteProductMedia,
    };
}