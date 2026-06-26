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

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts({
            category: selectedCategory || undefined,
            sortBy: sortBy as 'newest' | 'price-low' | 'price-high' | 'popular',
        });
    }, [selectedCategory, sortBy]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);

        const params = new URLSearchParams(searchParams);

        if (category) params.set('category', category);
        else params.delete('category');

        setSearchParams(params);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSortBy(value);

        const params = new URLSearchParams(searchParams);
        params.set('sort', value);

        setSearchParams(params);
    };

    return (
        <main className="bg-[#FAFAF8] min-h-screen py-10 md:py-16">

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="mb-10 md:mb-16 text-center px-2">
                    <p className="text-[9px] sm:text-[10px] tracking-[0.4em] md:tracking-[0.6em] uppercase text-black/40">
                        Vril Collection
                    </p>

                    <h1 className="mt-3 md:mt-4 text-3xl sm:text-5xl md:text-7xl font-display uppercase tracking-[-0.04em] font-light text-black">
                        The Archive
                    </h1>
                </div>

                {/* FILTER BAR */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10 md:mb-14 border-t border-b border-black/10 py-5 md:py-6">

                    {/* Categories (mobile scrollable) */}
                    <div className="flex gap-4 md:gap-10 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide">

                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] transition flex-shrink-0 ${
                                !selectedCategory ? 'text-black' : 'text-black/40 hover:text-black'
                            }`}
                        >
                            All
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] transition flex-shrink-0 ${
                                    selectedCategory === cat.id ? 'text-black' : 'text-black/40 hover:text-black'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* SORT */}
                    <div className="w-full md:w-auto">
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="w-full md:w-auto bg-transparent text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] text-black/60 focus:outline-none border border-black/10 px-3 py-2"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-low">Price ↑</option>
                            <option value="price-high">Price ↓</option>
                            <option value="popular">Most Viewed</option>
                        </select>
                    </div>

                </div>

                {/* PRODUCTS */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[3/4] bg-black/5 animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <ProductGrid products={products} columns={4} />
                )}

                {/* EMPTY */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-16 md:py-24 px-4">
                        <p className="text-black/40 uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs">
                            No pieces found
                        </p>
                    </div>
                )}

            </div>
        </main>
    );
};

export default Shop;