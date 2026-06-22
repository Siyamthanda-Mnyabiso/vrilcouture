// src/types/category.ts
export interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface CreateCategoryInput {
    name: string;
    slug: string;
}

export interface UpdateCategoryInput {
    name?: string;
    slug?: string;
}