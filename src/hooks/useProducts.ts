import { useState } from 'react';
import { mockProducts } from '../data/mockProducts';
import type {
    Product,
    CreateProductInput,
    UpdateProductInput,
} from '../features/products/product.types';

type FetchProductsParams = {
    limit?: number;
    sortBy?: 'newest' | 'price-low' | 'price-high' | 'popular';
    category?: string;
};

let productStore: Product[] = [...mockProducts];

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async (params?: FetchProductsParams) => {
        setLoading(true);
        setError(null);

        try {
            let result = [...productStore];

            if (params?.category) {
                result = result.filter((p) => p.category_id === params.category);
            }

            if (params?.sortBy === 'newest') {
                result.sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
            }

            if (params?.sortBy === 'price-low') {
                result.sort((a, b) => a.price - b.price);
            }

            if (params?.sortBy === 'price-high') {
                result.sort((a, b) => b.price - a.price);
            }

            if (params?.sortBy === 'popular') {
                result.sort(
                    (a, b) =>
                        ((b as { views?: number }).views ?? 0) - ((a as { views?: number }).views ?? 0)
                );
            }

            if (params?.limit) {
                result = result.slice(0, params.limit);
            }

            setProducts(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductById = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = productStore.find((p) => p.id === id) ?? null;
            setCurrentProduct(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (input: CreateProductInput) => {
        const now = new Date().toISOString();
        const newProduct: Product = {
            id: crypto.randomUUID(),
            name: input.name,
            description: input.description ?? null,
            price: input.price,
            original_price: input.original_price ?? null,
            image_url: input.image_url ?? null,
            category_id: input.category_id ?? null,
            brand: input.brand ?? null,
            sku: input.sku ?? null,
            stock: input.stock ?? 0,
            created_at: now,
            updated_at: now,
        };
        productStore = [newProduct, ...productStore];
        setProducts((prev) => [newProduct, ...prev]);
        return newProduct;
    };

    const updateProduct = async (id: string, input: UpdateProductInput) => {
        const existing = productStore.find((p) => p.id === id);
        if (!existing) throw new Error('Product not found');

        const updated: Product = {
            ...existing,
            ...input,
            updated_at: new Date().toISOString(),
        };

        productStore = productStore.map((p) => (p.id === id ? updated : p));
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));

        if (currentProduct?.id === id) {
            setCurrentProduct(updated);
        }

        return updated;
    };

    const deleteProduct = async (id: string) => {
        productStore = productStore.filter((p) => p.id !== id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return {
        products,
        currentProduct,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}