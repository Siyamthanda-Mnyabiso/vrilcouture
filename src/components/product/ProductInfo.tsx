import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currency';
import { StockBadge } from './StockBadge';
import { Button } from '../ui/Button';

interface ProductInfoProps {
    product: {
        id: string;
        name: string;
        description?: string;
        price: number;
        compare_at_price?: number;
        inventory_count: number;
        category?: {
            name: string;
            slug: string;
        };
    };
    className?: string;
}

export const ProductInfo = ({
                                product,
                                className = '',
                            }: ProductInfoProps) => {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);

    const isInStock = product.inventory_count > 0;

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= product.inventory_count) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: '', // Will be populated by product card
        });
    };

    return (
        <div className={`flex flex-col gap-6 ${className}`}>
            {/* Category */}
            {product.category && (
                <span className="text-[#8A8378] text-sm uppercase tracking-wider">
          {product.category.name}
        </span>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#2C2420] tracking-wide">
                {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3">
        <span className="text-2xl font-medium text-[#2C2420]">
          {formatCurrency(product.price)}
        </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="text-[#8A8378] text-lg line-through">
            {formatCurrency(product.compare_at_price)}
          </span>
                )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
                <StockBadge inventoryCount={product.inventory_count} />
                {isInStock && (
                    <span className="text-[#8A8378] text-sm">
            {product.inventory_count} available
          </span>
                )}
            </div>

            {/* Description */}
            {product.description && (
                <p className="text-[#2C2420] leading-relaxed border-t border-b border-[#D5C9B9] py-4">
                    {product.description}
                </p>
            )}

            {/* Quantity Selector */}
            {isInStock && (
                <div className="flex items-center gap-4">
                    <label className="text-sm text-[#2C2420] uppercase tracking-wider font-medium">
                        Quantity
                    </label>
                    <div className="flex items-center border border-[#D5C9B9]">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="px-4 py-2 text-[#2C2420] hover:bg-[#F5F1EA] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="square" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="px-6 py-2 text-[#2C2420] font-medium min-w-[48px] text-center">
              {quantity}
            </span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= product.inventory_count}
                            className="px-4 py-2 text-[#2C2420] hover:bg-[#F5F1EA] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Increase quantity"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="square" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Add to Cart Button */}
            <Button
                onClick={handleAddToCart}
                disabled={!isInStock}
                size="lg"
                fullWidth
                className="mt-2"
            >
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-[#D5C9B9]">
                <div className="grid grid-cols-2 gap-2 text-sm text-[#8A8378]">
                    <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="square" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        </svg>
                        <span>Free shipping over $2550</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="square" strokeLinejoin="round" d="M4 4v16h16V4H4zm4 4h8m-8 4h8m-8 4h8" />
                        </svg>
                        <span>30-day returns</span>
                    </div>
                </div>
            </div>
        </div>
    );
};