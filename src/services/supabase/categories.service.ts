import { supabase } from './client';
import type { Category } from '../../features/categories/category.types';

export const categoriesService = {
    async getAll(): Promise<Category[]> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data;
    },

    async create(input: { name: string }): Promise<Category> {
        const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const { data, error } = await supabase
            .from('categories')
            .insert({ name: input.name, slug })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, input: { name?: string }): Promise<Category> {
        const { data, error } = await supabase
            .from('categories')
            .update(input)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};