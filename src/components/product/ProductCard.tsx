// src/components/product/ProductCard.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import type { Product } from '../../features/products/product.types';
import { QuickAddModal } from './QuickAddModal';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [quickAddOpen, setQuickAddOpen] = useState(false);

    return (
        <>
            <Link
                to={`/product/${product.id}`}
                className="group block"
            >
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ImageOff className="w-10 h-10 text-gray-400" />
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuickAddOpen(true);
                        }}
                        className="
                        absolute inset-x-0 bottom-0
                        bg-black text-white
                        text-xs uppercase tracking-[0.3em]
                        py-3
                        opacity-0 translate-y-2
                        group-hover:opacity-100 group-hover:translate-y-0
                        transition-all duration-300
                        "
                    >
                        Add To Cart
                    </button>
                </div>

                <div className="pt-3">
                    <p className="text-[11px] uppercase tracking-wide text-gray-500">
                        {product.brand || 'Vril Couture'}
                    </p>

                    <h3 className="mt-1 text-sm font-medium uppercase">
                        {product.name}
                    </h3>

                    <p className="mt-1 text-sm font-bold">
                        R{product.price}
                    </p>
                </div>
            </Link>

            <QuickAddModal
                product={product}
                isOpen={quickAddOpen}
                onClose={() => setQuickAddOpen(false)}
            />
        </>
    );
}
