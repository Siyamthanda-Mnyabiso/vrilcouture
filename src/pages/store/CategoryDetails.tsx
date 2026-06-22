import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductGrid } from '../../components/product/ProductGrid';
import { CategoryBanner } from '../../components/category/CategoryBanner';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';

export const CategoryDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const [sortBy, setSortBy] = useState<string>('newest');
    const { products, loading, fetchProducts } = useProducts();
    const { categories, fetchCategories } = useCategories();

    const currentCategory = categories.find((c) => c.slug === slug);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (currentCategory) {
            fetchProducts({
                category: currentCategory.id,
                sortBy: sortBy as any
            });
        }
    }, [currentCategory, sortBy]);

    if (!currentCategory) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-16 text-center">
                <h2 className="text-2xl font-bold text-[#2C2420] mb-2">Category Not Found</h2>
                <p className="text-[#8A8378] mb-6">The category you're looking for doesn't exist.</p>
            </div>
        );
    }

    return (
        <main>
            {/* Category Banner */}
            <CategoryBanner
                category={currentCategory}
                size="large"
            />

            <div className="max-w-[1440px] mx-auto px-6 py-12">
                {/* Sort */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D5C9B9]">
                    <p className="text-sm text-[#8A8378]">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </p>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-[#8A8378] uppercase tracking-wider">
                            Sort
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-[#D5C9B9] bg-white text-[#2C2420] text-sm focus:outline-none focus:border-[#6B5D4F]"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>
                </div>

                {/* Products */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-[#D5C9B9] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <ProductGrid products={products} columns={4} />
                )}
            </div>
        </main>
    );
};