import { useState } from 'react';
import { productsService } from '../services/supabase/products.service';
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

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async (params?: FetchProductsParams) => {
        setLoading(true);
        setError(null);

        try {
            // fallback safe call (your service still works)
            const data = await productsService.getAll();

            let result = [...data];

            // CATEGORY FILTER
            if (params?.category) {
                result = result.filter(
                    (p) => p.category_id === params.category
                );
            }

            // SORTING
            if (params?.sortBy === 'newest') {
                result.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
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
                        ((b as { views?: number }).views ?? 0) -
                        ((a as { views?: number }).views ?? 0)
                );
            }

            // LIMIT
            if (params?.limit) {
                result = result.slice(0, params.limit);
            }

            setProducts(result);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch products'
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchProductById = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await productsService.getById(id);
            setCurrentProduct(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch product'
            );
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (input: CreateProductInput) => {
        const newProduct = await productsService.create(input);
        setProducts((prev) => [newProduct, ...prev]);
        return newProduct;
    };

    const updateProduct = async (
        id: string,
        input: UpdateProductInput
    ) => {
        const updated = await productsService.update(id, input);

        setProducts((prev) =>
            prev.map((p) => (p.id === id ? updated : p))
        );

        if (currentProduct?.id === id) {
            setCurrentProduct(updated);
        }

        return updated;
    };

    const deleteProduct = async (id: string) => {
        await productsService.delete(id);
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