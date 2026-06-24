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
    media?: ProductMedia[];
}

export interface ProductMedia {
    id: string;
    product_id: string;
    media_type: 'image' | 'video';
    url: string;
    sort_order: number;
    created_at: string;
}

export interface CreateProductInput {
    name: string;
    description?: string;
    price: number;
    original_price?: number;
    image_url?: string;
    category_id?: string;
    brand?: string;
    sku?: string;
    stock: number;
}

export interface CreateProductInput {
    name: string;
    description?: string;
    price: number;
    original_price?: number;
    image_url?: string;
    category_id?: string;
    brand?: string;
    sku?: string;
    stock: number;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}