import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../../components/product/ProductGrid';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';

export const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { products, loading, fetchProducts } = useProducts();
    const { categories, fetchCategories } = useCategories();

    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get('category') || ''
    );

    const [sortBy, setSortBy] = useState(
        searchParams.get('sort') || 'newest'
    );

    // ✅ ONLY LOAD ONCE
    useEffect(() => {
        fetchCategories();
    }, []);

    // ✅ SINGLE SOURCE OF TRUTH FOR PRODUCTS
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);

        const params = new URLSearchParams(searchParams);

        if (category) params.set('category', category);
        else params.delete('category');

        setSearchParams(params);

        // optional re-fetch (safe)
        fetchProducts();
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSortBy(value);

        const params = new URLSearchParams(searchParams);
        params.set('sort', value);

        setSearchParams(params);

        // optional re-fetch (safe)
        fetchProducts();
    };

    return (
        <main className="bg-[#FAFAF8] min-h-screen py-16">

            <div className="max-w-[1400px] mx-auto px-8">

                {/* HEADER */}
                <div className="mb-16 text-center">
                    <p className="text-[10px] tracking-[0.6em] uppercase text-black/40">
                        Vril Collection
                    </p>

                    <h1 className="mt-4 text-5xl md:text-7xl font-display uppercase tracking-[-0.04em] font-light text-black">
                        The Archive
                    </h1>
                </div>

                {/* FILTER BAR */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-14 border-t border-b border-black/10 py-6">

                    {/* Categories */}
                    <div className="flex gap-10 flex-wrap">

                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`text-xs uppercase tracking-[0.4em] transition ${
                                !selectedCategory ? 'text-black' : 'text-black/40 hover:text-black'
                            }`}
                        >
                            All
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`text-xs uppercase tracking-[0.4em] transition ${
                                    selectedCategory === cat.id ? 'text-black' : 'text-black/40 hover:text-black'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* SORT */}
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="bg-transparent text-xs uppercase tracking-[0.4em] text-black/60 focus:outline-none"
                    >
                        <option value="newest">Newest</option>
                        <option value="price-low">Price ↑</option>
                        <option value="price-high">Price ↓</option>
                        <option value="popular">Most Viewed</option>
                    </select>

                </div>

                {/* PRODUCTS */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-black/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <ProductGrid products={products} columns={4} />
                )}

                {/* EMPTY */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-black/40 uppercase tracking-[0.4em] text-xs">
                            No pieces found
                        </p>
                    </div>
                )}

            </div>
        </main>
    );
};

export default Shop;