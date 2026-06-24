// src/pages/store/CategoryDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import type { Category } from '../../types/category';

export const CategoryDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const [category, setCategory] = useState<Category | null>(null);
    const { categories, fetchCategories } = useCategories();
    const { products, fetchProducts, loading } = useProducts();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!slug || categories.length === 0) return;
        const categoryData = categories.find((c) => c.slug === slug) ?? null;
        setCategory(categoryData);
        if (categoryData) {
            fetchProducts({ category: categoryData.id });
        }
    }, [slug, categories]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#6B5D4F] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-16 text-center">
                <h2 className="text-2xl font-bold text-[#2C2420] mb-2">Category Not Found</h2>
                <p className="text-[#8A8378] mb-6">The category you're looking for doesn't exist.</p>
                <Link
                    to="/shop"
                    className="px-8 py-3 bg-[#6B5D4F] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#5A4D40] transition-colors"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <main className="py-8 md:py-12">
            <div className="max-w-[1440px] mx-auto px-6">
                <h1 className="text-3xl font-bold text-[#2C2420] mb-2">{category.name}</h1>
                <p className="text-[#8A8378] mb-8">{products.length} products</p>

                {products.length === 0 ? (
                    <p className="text-[#8A8378]">No products found in this category.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="group"
                            >
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <h3 className="mt-2 font-medium text-[#2C2420]">{product.name}</h3>
                                <p className="text-[#8A8378]">R{product.price.toFixed(2)}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};