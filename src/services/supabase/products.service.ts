import { supabase } from './client';
import type { Product, CreateProductInput, UpdateProductInput } from '../../features/products/product.types';

export const productsService = {
    async getAll(): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getById(id: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(input: CreateProductInput): Promise<Product> {
        const { data, error } = await supabase
            .from('products')
            .insert(input)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, input: UpdateProductInput): Promise<Product> {
        const { data, error } = await supabase
            .from('products')
            .update(input)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};