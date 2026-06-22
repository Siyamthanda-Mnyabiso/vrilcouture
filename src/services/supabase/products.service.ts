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
            .insert({
                name: input.name,
                description: input.description || null,
                price: input.price,
                original_price: input.original_price || null,
                image_url: input.image_url || null,
                category_id: input.category_id || null,
                brand: input.brand || null,
                sku: input.sku || null,
                stock: input.stock || 0,
            })
            .select()
            .single();

        if (error) throw error;
        return data as Product;
    },

    async update(id: string, input: UpdateProductInput): Promise<Product> {
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (input.name !== undefined) updateData.name = input.name;
        if (input.description !== undefined) updateData.description = input.description;
        if (input.price !== undefined) updateData.price = input.price;
        if (input.original_price !== undefined) updateData.original_price = input.original_price;
        if (input.image_url !== undefined) updateData.image_url = input.image_url;
        if (input.category_id !== undefined) updateData.category_id = input.category_id;
        if (input.brand !== undefined) updateData.brand = input.brand;
        if (input.sku !== undefined) updateData.sku = input.sku;
        if (input.stock !== undefined) updateData.stock = input.stock;

        const { data, error } = await supabase
            .from('products')
            .update(updateData)
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