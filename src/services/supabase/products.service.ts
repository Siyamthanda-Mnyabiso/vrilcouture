// src/services/supabase/products.service.ts
import { supabase } from './client';

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    original_price: number | null;
    image_url: string | null;
    category_id: string | null;
    brand: string | null;
    sku: string | null;
    stock: number;
    created_at: string;
    updated_at: string;
}

export interface CreateProductInput {
    name: string;
    description?: string | null;
    price: number;
    original_price?: number | null;
    image_url?: string | null;
    category_id?: string | null;
    brand?: string | null;
    sku?: string | null;
    stock?: number;
}

export interface UpdateProductInput {
    name?: string;
    description?: string | null;
    price?: number;
    original_price?: number | null;
    image_url?: string | null;
    category_id?: string | null;
    brand?: string | null;
    sku?: string | null;
    stock?: number;
}

export const productsService = {
    async getAll(): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Product[];
    },

    async getById(id: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Product;
    },

    async getBySlug(slug: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching product by slug:', error);
            return null;
        }
        return data as Product;
    },

    async getProductsByCategory(categoryId: string): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Product[];
    },

    async getRelatedProducts(productId: string, categoryId: string): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .neq('id', productId)
            .limit(4)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Product[];
    },

    async create(input: CreateProductInput): Promise<Product> {
        const { data, error } = await supabase
            .from('products')
            .insert(input)
            .select()
            .single();

        if (error) throw error;
        return data as Product;
    },

    async update(id: string, input: UpdateProductInput): Promise<Product> {
        const { data, error } = await supabase
            .from('products')
            .update({
                ...input,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Product;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};