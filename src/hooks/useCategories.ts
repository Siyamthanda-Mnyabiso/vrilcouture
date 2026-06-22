import { useState } from 'react';
import { categoriesService } from '../services/supabase/categories.service';
import type { Category } from '../features/categories/category.types';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await categoriesService.getAll();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const createCategory = async (input: { name: string }) => {
        const newCategory = await categoriesService.create(input);
        setCategories((prev) => [...prev, newCategory]);
        return newCategory;
    };

    const updateCategory = async (id: string, input: { name?: string }) => {
        const updated = await categoriesService.update(id, input);
        setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
        return updated;
    };

    const deleteCategory = async (id: string) => {
        await categoriesService.delete(id);
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