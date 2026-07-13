// src/components/product/QuickAddModal.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ImageOff } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useCart } from '../../hooks/useCart';
import { useProductVariants } from '../../hooks/useProductVariants';
import type { Product } from '../../features/products/product.types';

interface QuickAddModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export function QuickAddModal({ product, isOpen, onClose }: QuickAddModalProps) {
    const { addToCart } = useCart();
    const { variants, loading: variantsLoading, fetchVariants } = useProductVariants();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [justAdded, setJustAdded] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        fetchVariants(product.id);
        setSelectedSize(null);
        setSelectedColor(null);
        setQuantity(1);
        setJustAdded(false);
    }, [isOpen, product.id]);

    const sizes = useMemo(() => Array.from(new Set(variants.map((v) => v.size))), [variants]);
    const colors = useMemo(() => Array.from(new Set(variants.map((v) => v.color))), [variants]);

    const selectedVariant = useMemo(() => {
        if (!selectedSize || !selectedColor) return null;
        return variants.find((v) => v.size === selectedSize && v.color === selectedColor) ?? null;
    }, [variants, selectedSize, selectedColor]);

    const isColorAvailableForSize = (size: string, color: string) => {
        const v = variants.find((variant) => variant.size === size && variant.color === color);
        return !!v && v.stock > 0;
    };

    const hasVariants = variants.length > 0;
    const maxQuantity = hasVariants ? (selectedVariant?.stock ?? 0) : product.stock;
    const canAddToCart = hasVariants ? !!selectedVariant && selectedVariant.stock > 0 : product.stock > 0;

    const handleAddToCart = () => {
        if (hasVariants) {
            if (!selectedVariant) return;
            addToCart({
                variantId: selectedVariant.id,
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                image_url: product.image_url || '',
                stock: selectedVariant.stock,
                size: selectedVariant.size,
                color: selectedVariant.color,
            });
        } else {
            addToCart({
                variantId: product.id,
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                image_url: product.image_url || '',
                stock: product.stock,
                size: 'One Size',
                color: 'Default',
            });
        }
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <div className="flex flex-col sm:flex-row gap-8">
                <div className="w-full sm:w-80 shrink-0 aspect-[3/4] bg-gray-100 overflow-hidden">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ImageOff className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-black/40 mb-2">
                            {product.brand || 'Vril Couture'}
                        </p>
                        <h3 className="text-2xl font-medium uppercase tracking-tight text-black">
                            {product.name}
                        </h3>
                        <p className="text-xl font-semibold text-black mt-2">
                            R{product.price.toFixed(2)}
                        </p>
                    </div>

                    {variantsLoading ? (
                        <p className="text-xs text-black/40 uppercase tracking-wide">Loading options...</p>
                    ) : hasVariants ? (
                        <div className="flex flex-col gap-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-black/40 mb-3">
                                    Size
                                </p>
                                <div className="flex flex-wrap gap-2.5">
                                    {sizes.map((size) => {
                                        const isSelected = selectedSize === size;
                                        const sizeHasAnyStock = variants.some((v) => v.size === size && v.stock > 0);
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => { setSelectedSize(size); setQuantity(1); }}
                                                disabled={!sizeHasAnyStock}
                                                className={`min-w-[44px] h-11 px-4 text-sm uppercase tracking-wide rounded-full border transition-colors ${
                                                    isSelected
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-black/20 text-black hover:border-black'
                                                } ${!sizeHasAnyStock ? 'opacity-30 cursor-not-allowed line-through hover:border-black/20' : ''}`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-black/40 mb-3">
                                    Color
                                </p>
                                <div className="flex flex-wrap gap-2.5">
                                    {colors.map((color) => {
                                        const isSelected = selectedColor === color;
                                        const disabled = !selectedSize || !isColorAvailableForSize(selectedSize, color);
                                        return (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => { setSelectedColor(color); setQuantity(1); }}
                                                disabled={disabled}
                                                className={`h-11 px-4 text-sm uppercase tracking-wide rounded-full border transition-colors ${
                                                    isSelected
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-black/20 text-black hover:border-black'
                                                } ${disabled ? 'opacity-30 cursor-not-allowed hover:border-black/20' : ''}`}
                                            >
                                                {color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedSize && selectedColor && !selectedVariant && (
                                <p className="text-xs text-red-600">That combination isn't available.</p>
                            )}
                        </div>
                    ) : null}

                    <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center border border-black/20 h-12 shrink-0">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                                className="w-10 h-full flex items-center justify-center text-black hover:bg-black/5 disabled:opacity-30 transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-medium text-black">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.min(maxQuantity || 1, q + 1))}
                                disabled={maxQuantity > 0 && quantity >= maxQuantity}
                                className="w-10 h-full flex items-center justify-center text-black hover:bg-black/5 disabled:opacity-30 transition-colors"
                                aria-label="Increase quantity"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={!canAddToCart}
                            className="flex-1 h-12 bg-black text-white text-xs uppercase tracking-[0.3em] hover:bg-black/85 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black"
                        >
                            {justAdded
                                ? 'Added To Cart'
                                : canAddToCart
                                    ? 'Add To Cart'
                                    : hasVariants && (!selectedSize || !selectedColor)
                                        ? 'Select Size & Color'
                                        : 'Out Of Stock'}
                        </button>
                    </div>

                    <Link
                        to={`/product/${product.id}`}
                        onClick={onClose}
                        className="text-xs uppercase tracking-[0.25em] text-black/50 hover:text-black transition-colors"
                    >
                        View Full Details
                    </Link>
                </div>
            </div>
        </Modal>
    );
}
