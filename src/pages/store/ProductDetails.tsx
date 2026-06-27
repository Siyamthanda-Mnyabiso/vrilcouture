// src/pages/store/ProductDetails.tsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, Minus, Plus, Play, Truck, RotateCcw } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useProductVariants } from '../../hooks/useProductVariants';

export const ProductDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const { currentProduct: product, products, fetchProductById, fetchProducts, loading } = useProducts();
    const { addToCart } = useCart();
    const { variants, loading: variantsLoading, fetchVariants } = useProductVariants();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [justAdded, setJustAdded] = useState(false);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [descriptionOpen, setDescriptionOpen] = useState(true);
    const [deliveryOpen, setDeliveryOpen] = useState(true);

    useEffect(() => {
        if (slug) fetchProductById(slug);
    }, [slug]);

    useEffect(() => {
        if (product?.id) fetchVariants(product.id);
        setActiveMediaIndex(0);
        setQuantity(1);
    }, [product?.id]);

    useEffect(() => {
        if (product?.category_id) {
            fetchProducts({ category: product.category_id, limit: 5 });
        }
    }, [product?.category_id]);

    const relatedProducts = products.filter((p) => p.id !== product?.id).slice(0, 4);

    const media = useMemo(() => {
        if (product?.media && product.media.length > 0) {
            return [...product.media].sort((a, b) => a.sort_order - b.sort_order);
        }
        if (product?.image_url) {
            return [{ id: 'fallback', media_type: 'image' as const, url: product.image_url, sort_order: 0, product_id: product.id, created_at: '' }];
        }
        return [];
    }, [product]);

    const activeMedia = media[activeMediaIndex] ?? null;

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-16 text-center">
                <h2 className="font-display text-3xl uppercase tracking-tight text-black mb-2">Not Found</h2>
                <p className="text-black/50 mb-6">The product you're looking for doesn't exist.</p>
                <Link
                    to="/shop"
                    className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.4em] hover:bg-black/80 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const hasVariants = variants.length > 0;
    const maxQuantity = hasVariants ? (selectedVariant?.stock ?? 0) : product.stock;

    const handleAddToCart = () => {
        console.log('🔵 handleAddToCart called. hasVariants:', hasVariants, 'selectedVariant:', selectedVariant, 'product.id:', product.id);
        if (hasVariants) {
            if (!selectedVariant) return;
            console.log('🔵 Adding WITH variant. variantId will be:', selectedVariant.id);
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
            console.log('🔵 Adding WITHOUT variant (fallback). variantId will be product.id:', product.id);
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

    const canAddToCart = hasVariants ? !!selectedVariant && selectedVariant.stock > 0 : product.stock > 0;

    return (
        <main className="bg-white">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12 py-6 md:py-10">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] mb-8 md:mb-10 text-black/40">
                    <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-black truncate">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">

                    {/* LEFT: GALLERY */}
                    <div>
                        <div className="relative aspect-square bg-[#F8F8F6] overflow-hidden">
                            {activeMedia ? (
                                activeMedia.media_type === 'image' ? (
                                    <img
                                        src={activeMedia.url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <video
                                        src={activeMedia.url}
                                        className="w-full h-full object-cover"
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                    />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-black/30 text-sm uppercase tracking-widest">
                                    No Image
                                </div>
                            )}

                            {/* Signature: contact-sheet frame counter */}
                            {media.length > 1 && (
                                <div className="absolute bottom-4 right-4 font-display text-white bg-black/70 px-3 py-1 text-xs tracking-widest">
                                    {String(activeMediaIndex + 1).padStart(2, '0')} / {String(media.length).padStart(2, '0')}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails below main image, like reference */}
                        {media.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-3">
                                {media.map((item, i) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveMediaIndex(i)}
                                        className={`relative aspect-square bg-[#F8F8F6] overflow-hidden transition-all ${
                                            i === activeMediaIndex ? 'ring-1 ring-black' : 'opacity-50 hover:opacity-100'
                                        }`}
                                    >
                                        {item.media_type === 'image' ? (
                                            <img src={item.url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <video src={item.url} className="w-full h-full object-cover" muted />
                                                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <Play className="w-4 h-4 text-white fill-white" />
                                                </span>
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: INFO */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.3em] text-black/40 mb-2">
                                {product.brand || 'Vril Couture'}
                            </p>
                            <h1 className="font-display text-3xl md:text-4xl uppercase tracking-tight leading-[0.95] text-black mb-3">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-semibold text-black">
                                    R{product.price.toFixed(2)}
                                </span>
                                {product.original_price && (
                                    <span className="text-base text-black/30 line-through">
                                        R{product.original_price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* DESCRIPTION ACCORDION */}
                        {product.description && (
                            <div className="border border-black/10">
                                <button
                                    onClick={() => setDescriptionOpen((v) => !v)}
                                    className="w-full flex items-center justify-between px-5 py-4"
                                >
                                    <span className="text-sm font-medium uppercase tracking-wide text-black">
                                        Description
                                    </span>
                                    {descriptionOpen ? (
                                        <ChevronUp className="w-4 h-4 text-black/50" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-black/50" />
                                    )}
                                </button>
                                {descriptionOpen && (
                                    <p className="px-5 pb-4 text-sm text-black/60 leading-relaxed">
                                        {product.description}
                                    </p>
                                )}
                            </div>
                        )}

                        {hasVariants && !variantsLoading && (
                            <div className="flex flex-col gap-5">
                                {/* SIZE */}
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-black/40 mb-3">
                                        Size
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size) => {
                                            const isSelected = selectedSize === size;
                                            const sizeHasAnyStock = variants.some((v) => v.size === size && v.stock > 0);
                                            return (
                                                <button
                                                    key={size}
                                                    onClick={() => { setSelectedSize(size); setQuantity(1); }}
                                                    disabled={!sizeHasAnyStock}
                                                    className={`min-w-[44px] h-10 px-3 text-xs uppercase tracking-wide rounded-full border transition-colors ${
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

                                {/* COLOR */}
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-black/40 mb-3">
                                        Color
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((color) => {
                                            const isSelected = selectedColor === color;
                                            const disabled = !selectedSize || !isColorAvailableForSize(selectedSize, color);
                                            return (
                                                <button
                                                    key={color}
                                                    onClick={() => { setSelectedColor(color); setQuantity(1); }}
                                                    disabled={disabled}
                                                    className={`h-10 px-4 text-xs uppercase tracking-wide rounded-full border transition-colors ${
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
                        )}

                        {/* QUANTITY + ADD TO CART */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-black/20 h-12">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    className="w-10 h-full flex items-center justify-center text-black hover:bg-black/5 disabled:opacity-30 transition-colors"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-10 text-center text-sm font-medium text-black">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => Math.min(maxQuantity || 1, q + 1))}
                                    disabled={maxQuantity > 0 && quantity >= maxQuantity}
                                    className="w-10 h-full flex items-center justify-center text-black hover:bg-black/5 disabled:opacity-30 transition-colors"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <button
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

                        {hasVariants
                            ? selectedVariant && (
                            <p className="text-xs text-black/40 uppercase tracking-wide -mt-2">
                                {selectedVariant.stock > 0 ? `${selectedVariant.stock} In Stock` : 'Out Of Stock'}
                            </p>
                        )
                            : product.stock !== undefined && (
                            <p className="text-xs text-black/40 uppercase tracking-wide -mt-2">
                                {product.stock > 0 ? `${product.stock} In Stock` : 'Out Of Stock'}
                            </p>
                        )}

                        {/* DELIVERY OPTIONS ACCORDION */}
                        <div className="border border-black/10">
                            <button
                                onClick={() => setDeliveryOpen((v) => !v)}
                                className="w-full flex items-center justify-between px-5 py-4"
                            >
                                <span className="text-sm font-medium uppercase tracking-wide text-black">
                                    Delivery Options
                                </span>
                                {deliveryOpen ? (
                                    <ChevronUp className="w-4 h-4 text-black/50" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-black/50" />
                                )}
                            </button>
                            {deliveryOpen && (
                                <div className="px-5 pb-5 grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2">
                                        <Truck className="w-4 h-4 text-black/40 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-black/40 uppercase tracking-wide">Delivery Time</p>
                                            <p className="text-sm text-black">3–5 Working Days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <RotateCcw className="w-4 h-4 text-black/40 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-black/40 uppercase tracking-wide">Returns</p>
                                            <p className="text-sm text-black">7 Days Easy Return</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <section className="mt-20 md:mt-28 pt-10 border-t border-black/10">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-black/40 mb-2">
                            From The Archive
                        </p>
                        <h3 className="font-display text-2xl uppercase tracking-tight text-black mb-8">
                            You Might Also Like
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((related) => (
                                <Link key={related.id} to={`/product/${related.id}`} className="group block">
                                    <div className="aspect-[3/4] bg-[#F8F8F6] overflow-hidden">
                                        {related.image_url ? (
                                            <img
                                                src={related.image_url}
                                                alt={related.name}
                                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-black/30">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="mt-3 text-sm font-medium uppercase tracking-wide text-black">
                                        {related.name}
                                    </h4>
                                    <p className="text-sm text-black/50 mt-0.5">R{related.price.toFixed(2)}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};