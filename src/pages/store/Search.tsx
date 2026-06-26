// src/pages/store/Search.tsx

import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../../components/product/ProductGrid';
import { useSearch } from '../../hooks/useSearch';

export const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const { products, categories, loading, search } = useSearch();

    useEffect(() => {
        search(query);
    }, [query]);

    return (
        <main className="bg-[#FAFAF8] min-h-screen py-16">

            <div className="max-w-[1400px] mx-auto px-8">

                {/* HEADER */}
                <div className="mb-16 text-center">
                    <p className="text-[10px] tracking-[0.6em] uppercase text-black/40">
                        Search Results
                    </p>

                    <h1 className="mt-4 text-4xl md:text-6xl font-display uppercase tracking-[-0.04em] font-light text-black">
                        "{query}"
                    </h1>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-black/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* CATEGORY MATCHES */}
                        {categories.length > 0 && (
                            <div className="mb-16">
                                <h2 className="text-xs uppercase tracking-[0.4em] text-black/40 mb-6">
                                    Categories
                                </h2>

                                <div className="flex gap-6 flex-wrap">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            to={`/category/${cat.slug}`}
                                            className="text-sm uppercase tracking-[0.2em] border border-black px-5 py-3 hover:bg-black hover:text-white transition"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PRODUCT MATCHES */}
                        <h2 className="text-xs uppercase tracking-[0.4em] text-black/40 mb-6">
                            Products
                        </h2>

                        {products.length === 0 ? (
                            <div className="text-center py-24">
                                <p className="text-black/40 uppercase tracking-[0.4em] text-xs">
                                    No pieces found
                                </p>
                            </div>
                        ) : (
                            <ProductGrid products={products} columns={4} />
                        )}
                    </>
                )}

            </div>
        </main>
    );
};

export default Search;