import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Category } from '../features/categories/category.types';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });
            if (fetchError) throw fetchError;
            setCategories(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const createCategory = async (input: { name: string; slug?: string }) => {
        const slug =
            input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const { data, error: insertError } = await supabase
            .from('categories')
            .insert({ name: input.name, slug })
            .select()
            .single();

        if (insertError) throw insertError;
        setCategories((prev) => [...prev, data]);
        return data as Category;
    };

    const updateCategory = async (id: string, input: { name?: string; slug?: string }) => {
        const { data, error: updateError } = await supabase
            .from('categories')
            .update(input)
            .eq('id', id)
            .select()
            .single();
        if (updateError) throw updateError;
        setCategories((prev) => prev.map((c) => (c.id === id ? data : c)));
        return data as Category;
    };

    const deleteCategory = async (id: string) => {
        const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);
        if (deleteError) throw deleteError;
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
}