import { useState } from 'react';
import { mockCategories } from '../data/mockCategories';
import type { Category } from '../features/categories/category.types';

let categoryStore: Category[] = [...mockCategories];

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = [...categoryStore].sort((a, b) => a.name.localeCompare(b.name));
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const createCategory = async (input: { name: string; slug?: string }) => {
        const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const newCategory: Category = {
            id: crypto.randomUUID(),
            name: input.name,
            slug,
            created_at: new Date().toISOString(),
        };
        categoryStore = [...categoryStore, newCategory];
        setCategories((prev) => [...prev, newCategory]);
        return newCategory;
    };

    const updateCategory = async (id: string, input: { name?: string; slug?: string }) => {
        const existing = categoryStore.find((c) => c.id === id);
        if (!existing) throw new Error('Category not found');
        const updated: Category = { ...existing, ...input };
        categoryStore = categoryStore.map((c) => (c.id === id ? updated : c));
        setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
        return updated;
    };

    const deleteCategory = async (id: string) => {
        categoryStore = categoryStore.filter((c) => c.id !== id);
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