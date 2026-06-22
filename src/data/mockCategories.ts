// src/data/mockCategories.ts
import type { Category } from '../features/categories/category.types';

const now = new Date().toISOString();

export const mockCategories: Category[] = [
    { id: 'cat-1', name: 'Outerwear', slug: 'outerwear', created_at: now },
    { id: 'cat-2', name: 'Tops', slug: 'tops', created_at: now },
    { id: 'cat-3', name: 'Bottoms', slug: 'bottoms', created_at: now },
    { id: 'cat-4', name: 'Accessories', slug: 'accessories', created_at: now },
];