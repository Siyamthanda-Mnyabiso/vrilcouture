// src/services/supabase/categories.service.ts
import { supabase } from './client';

export interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at?: string;
}

export const categoriesService = {
    async getAll(): Promise<Category[]> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data ?? [];
    },

    async getById(id: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Category;
    },

    async getBySlug(slug: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return null;
        return data as Category;
    },

    async create(input: { name: string; slug?: string }): Promise<Category> {
        const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const { data, error } = await supabase
            .from('categories')
            .insert({
                name: input.name,
                slug: slug
            })
            .select()
            .single();

        if (error) throw error;
        return data as Category;
    },

    async update(id: string, input: { name?: string; slug?: string }): Promise<Category> {
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (input.name !== undefined) updateData.name = input.name;
        if (input.slug !== undefined) updateData.slug = input.slug;

        const { data, error } = await supabase
            .from('categories')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Category;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};