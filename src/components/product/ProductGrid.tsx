import type {Product} from '../../features/products/product.types';
import {ProductCard} from './ProductCard';
import {Loader} from '../ui/Loader';

interface ProductGridProps {
    title?: string,
    products: Product[],
    loading?: boolean,
    columns?: number
}

export function ProductGrid({
                                title,
                                products,
                                loading = false
                            }: ProductGridProps) {

    if (loading) {
        return (
            <div className="flex justify-center py-32">
                <Loader size="lg"/>
            </div>
        );
    }

    return (
        <section className="bg-[#FAFAF8] px-6 md:px-12 py-20">

            {/* subtle header */}
            {title && (
                <div className="mb-16 text-center">
                    <p className="text-[10px] tracking-[0.6em] uppercase text-black/40">
                        Vril Archive
                    </p>

                    <h2 className="
                        mt-4
                        font-display
                        text-4xl md:text-5xl
                        uppercase
                        tracking-[-0.03em]
                        font-light
                        text-black
                    ">
                        {title}
                    </h2>
                </div>
            )}


            {products.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-black/40 uppercase tracking-[0.4em] text-xs">
                        No pieces available
                    </p>
                </div>
            ) : (
                <div className="
                    grid
                    grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    gap-y-16
                    gap-x-8
                ">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="
                                group
                                relative
                                transition-all
                                duration-500
                                hover:-translate-y-2
                            "
                        >
                            <ProductCard product={product}/>
                        </div>
                    ))}
                </div>
            )}

        </section>
    );
}