// src/components/product/ProductGrid.tsx

import { Link } from 'react-router-dom';
import type { Product } from '../../features/products/product.types';
import { ProductCard } from './ProductCard';
import { Loader } from '../ui/Loader';

interface ProductGridProps {
    title?: string;
    products: Product[];
    loading?: boolean;
    columns?: number;
    viewAllHref?: string;
}

export function ProductGrid({
                                title,
                                products,
                                loading = false,
                                viewAllHref,
                            }: ProductGridProps) {
    if (loading) {
        return (
            <div className="flex justify-center py-32">
                <Loader size="lg" />
            </div>
        );
    }

    // Show all products
    const displayedProducts = products;

    return (
        <section className="bg-[#FAFAF8] py-20">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                {(title || viewAllHref) && (
                    <div className="flex items-end justify-between mb-16 border-b border-black/10 pb-6">
                        <div>
                            <p className="text-[10px] tracking-[0.6em] uppercase text-black/40">
                                Vril Archive
                            </p>

                            {title && (
                                <h2
                                    className="
                                        mt-4
                                        font-display
                                        text-4xl
                                        md:text-5xl
                                        uppercase
                                        tracking-[-0.03em]
                                        font-light
                                        text-black
                                    "
                                >
                                    {title}
                                </h2>
                            )}
                        </div>

                        {viewAllHref && (
                            <Link
                                to={viewAllHref}
                                className="
                                    hidden
                                    md:inline-flex
                                    items-center
                                    gap-4
                                    text-xs
                                    uppercase
                                    tracking-[0.4em]
                                    text-black
                                    group
                                    shrink-0
                                    pb-1
                                "
                            >
                                See More

                                <span
                                    className="
                                        w-10
                                        h-px
                                        bg-black
                                        transition-all
                                        duration-300
                                        group-hover:w-16
                                    "
                                />
                            </Link>
                        )}
                    </div>
                )}

                {displayedProducts.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-black/40 uppercase tracking-[0.4em] text-xs">
                            No pieces available
                        </p>
                    </div>
                ) : (
                    <div
                        className="
                            grid
                            grid-cols-2
                            sm:grid-cols-2
                            md:grid-cols-3
                            lg:grid-cols-4
                            gap-4
                            md:gap-8
                        "
                    >
                        {displayedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}

                {viewAllHref && (
                    <div className="mt-12 text-center md:hidden">
                        <Link
                            to={viewAllHref}
                            className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.4em] text-black"
                        >
                            See More
                            <span className="w-10 h-px bg-black" />
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
}