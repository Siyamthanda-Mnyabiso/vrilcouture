// src/components/product/ProductCard.tsx
import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import type { Product } from '../../features/products/product.types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link to={`/product/${product.id}`} className="group block border border-black">
            <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <ImageOff className="w-10 h-10 text-gray-400" />
                )}
            </div>

            <div className="p-3 border-t border-black">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    {product.brand || 'Vril Couture'}
                </p>
                <h3 className="text-sm font-medium uppercase mt-0.5">
                    {product.name}
                </h3>
                <p className="text-sm font-bold mt-1">
                    R{product.price}
                </p>
            </div>
        </Link>
    );
}