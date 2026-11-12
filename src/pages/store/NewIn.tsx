// src/pages/store/NewIn.tsx
// Shows only the products Vril Couture has ticked "Show on the New In page"
// for in the admin area. It is not the full archive (that is /shop).
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductGrid } from '../../components/product/ProductGrid';
import { useProducts } from '../../hooks/useProducts';

export const NewIn = () => {
    const { products, loading, error, fetchProducts } = useProducts();

    useEffect(() => {
        fetchProducts({ newInOnly: true, sortBy: 'newest' });
    }, [fetchProducts]);

    return (
        <main className="bg-[#FAFAF8] min-h-screen py-10 md:py-16">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="mb-10 md:mb-16 text-center px-2">
                    <p className="text-[9px] sm:text-[10px] tracking-[0.4em] md:tracking-[0.6em] uppercase text-black/40">
                        Vril Collection
                    </p>

                    <h1 className="mt-3 md:mt-4 text-3xl sm:text-5xl md:text-7xl font-display uppercase tracking-[-0.04em] font-light text-black">
                        New In
                    </h1>
                </div>

                <div className="border-t border-black/10 mb-10 md:mb-14" />

                {/* PRODUCTS */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-black/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    products.length > 0 && <ProductGrid products={products} columns={4} />
                )}

                {/* EMPTY / ERROR */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-16 md:py-24 px-4">
                        <p className="text-black/40 uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs mb-6">
                            {error ? 'Could not load New In right now' : 'New pieces are on the way'}
                        </p>
                        <Link
                            to="/shop"
                            className="text-xs uppercase tracking-[0.3em] underline hover:opacity-60 transition-opacity"
                        >
                            Browse the full collection
                        </Link>
                    </div>
                )}

            </div>
        </main>
    );
};
