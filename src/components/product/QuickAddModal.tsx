// src/components/product/QuickAddModal.tsx

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ImageOff, Heart } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useCart } from '../../hooks/useCart';
import { useProductVariants } from '../../hooks/useProductVariants';
import type { Product } from '../../features/products/product.types';

interface QuickAddModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

// Lightweight color-name -> swatch mapping for common fashion colors.
// Extend this as needed, or replace with a real hex value coming from your
// variant data if/when the backend starts returning one.
const COLOR_SWATCH_MAP: Record<string, string> = {
    black: '#111111',
    white: '#f5f5f0',
    ivory: '#f4ecdf',
    cream: '#f2e8d5',
    beige: '#d9c7a8',
    nude: '#e0b8a0',
    tan: '#c9a37a',
    brown: '#6b4a34',
    camel: '#b98c5a',
    navy: '#1b2a4a',
    blue: '#3a5f8a',
    denim: '#4a6b8a',
    grey: '#8a8a8a',
    gray: '#8a8a8a',
    charcoal: '#3a3a3a',
    red: '#a3242c',
    burgundy: '#5e1f2e',
    maroon: '#5e1f2e',
    pink: '#e6b8c2',
    rose: '#c98a97',
    blush: '#e8c9cf',
    green: '#4a5e42',
    olive: '#5c5a3a',
    khaki: '#8a8460',
    yellow: '#e0c14a',
    mustard: '#c9a227',
    orange: '#d17a3a',
    purple: '#5c4a6e',
    lilac: '#c3b3d9',
};

function getSwatchColor(colorName: string): string {
    const key = colorName.trim().toLowerCase();
    return COLOR_SWATCH_MAP[key] ?? '#bdbdbd';
}

export function QuickAddModal({ product, isOpen, onClose }: QuickAddModalProps) {
    const { addToCart } = useCart();
    const { variants, loading: variantsLoading, fetchVariants } = useProductVariants();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [justAdded, setJustAdded] = useState(false);

    // Purely visual for now — wire this up to your real wishlist hook when
    // one exists (e.g. useWishlist()).
    const [wishlisted, setWishlisted] = useState(false);

    // Reset selections whenever the modal is (re)opened for a product.
    const resetKey = isOpen ? product.id : null;
    const [prevResetKey, setPrevResetKey] = useState(resetKey);
    if (resetKey !== prevResetKey) {
        setPrevResetKey(resetKey);
        if (resetKey !== null) {
            setSelectedSize(null);
            setSelectedColor(null);
            setQuantity(1);
            setJustAdded(false);
        }
    }

    useEffect(() => {
        if (!isOpen) return;
        fetchVariants(product.id);
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

                <div className="flex-1 flex flex-col gap-5">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-black/40 mb-2">
                            {product.brand || 'Vril Couture'}
                        </p>
                        <h3 className="font-serif text-2xl leading-snug text-black">
                            {product.name}
                        </h3>
                        <p className="font-serif text-lg text-black/70 mt-1">
                            R{product.price.toFixed(2)}
                        </p>
                    </div>

                    {variantsLoading ? (
                        <p className="text-xs text-black/40 uppercase tracking-wide">Loading options...</p>
                    ) : hasVariants ? (
                        <div className="flex flex-col gap-5">
                            {colors.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-black mb-3">Color</p>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((color) => {
                                            const isSelected = selectedColor === color;
                                            const disabled = !!selectedSize && !isColorAvailableForSize(selectedSize, color);
                                            return (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    title={color}
                                                    onClick={() => { setSelectedColor(color); setQuantity(1); }}
                                                    disabled={disabled}
                                                    className={`relative w-8 h-8 rounded-full transition-all ${
                                                        isSelected
                                                            ? 'ring-2 ring-black ring-offset-2'
                                                            : 'ring-1 ring-black/15 ring-offset-2 hover:ring-black/40'
                                                    } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                    style={{ backgroundColor: getSwatchColor(color) }}
                                                >
                                                    <span className="sr-only">{color}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-medium text-black">Size</p>
                                    <button
                                        type="button"
                                        className="text-xs text-black/40 hover:text-black transition-colors"
                                        onClick={() => {
                                            // TODO: wire up to a real size guide modal/route
                                        }}
                                    >
                                        Size Guide
                                    </button>
                                </div>
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
                                                className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm transition-colors ${
                                                    isSelected
                                                        ? 'border-black border-2 text-black'
                                                        : 'border-black/20 text-black hover:border-black'
                                                } ${!sizeHasAnyStock ? 'opacity-30 cursor-not-allowed hover:border-black/20' : ''}`}
                                            >
                                                {size}
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

                    <div className="flex items-center gap-3 mt-auto">
                        <div className="flex items-center border border-black/20 rounded-full h-11 shrink-0">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                                className="w-9 h-full flex items-center justify-center text-black hover:bg-black/5 disabled:opacity-30 transition-colors rounded-l-full"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-black">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.min(maxQuantity || 1, q + 1))}
                                disabled={maxQuantity > 0 && quantity >= maxQuantity}
                                className="w-9 h-full flex items-center justify-center text-black hover:bg-black/5 disabled:opacity-30 transition-colors rounded-r-full"
                                aria-label="Increase quantity"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={!canAddToCart}
                            className="flex-1 h-11 rounded-full bg-black text-white text-xs uppercase tracking-[0.25em] hover:bg-black/85 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black"
                        >
                            {justAdded
                                ? 'Added To Cart'
                                : canAddToCart
                                    ? 'Add To Cart'
                                    : hasVariants && (!selectedSize || !selectedColor)
                                        ? 'Select Size & Color'
                                        : 'Out Of Stock'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setWishlisted((w) => !w)}
                            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            className="w-11 h-11 shrink-0 rounded-full border border-black/20 flex items-center justify-center hover:border-black transition-colors"
                        >
                            <Heart
                                className={`w-4 h-4 transition-colors ${
                                    wishlisted ? 'fill-black text-black' : 'text-black/60'
                                }`}
                            />
                        </button>
                    </div>

                    <Link
                        to={`/product/${product.id}`}
                        onClick={onClose}
                        className="text-xs text-black/50 hover:text-black transition-colors"
                    >
                        View product details
                    </Link>
                </div>
            </div>
        </Modal>
    );
}