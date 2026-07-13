// src/components/product/ProductCard.tsx

import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import type { Product } from '../../features/products/product.types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="group block"
        >
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
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
    );
}