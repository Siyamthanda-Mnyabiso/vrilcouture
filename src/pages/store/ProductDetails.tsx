// src/pages/store/ProductDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../../data/mockProducts';
import type { Product } from '../../features/products/product.types';
import { useCart } from '../../hooks/useCart';

export const ProductDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const productData = mockProducts.find((p) => p.id === slug) ?? null;
                if (productData) {
                    setProduct(productData);

                    if (productData.category_id) {
                        const related = mockProducts
                            .filter((p) => p.category_id === productData.category_id && p.id !== productData.id)
                            .slice(0, 4);
                        setRelatedProducts(related);
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#6B5D4F] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-16 text-center">
                <h2 className="text-2xl font-bold text-[#2C2420] mb-2">Product Not Found</h2>
                <p className="text-[#8A8378] mb-6">The product you're looking for doesn't exist.</p>
                <Link
                    to="/shop"
                    className="px-8 py-3 bg-[#6B5D4F] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#5A4D40] transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image_url: product.image_url || '',
            stock: product.stock
        });
    };

    return (
        <main className="py-8 md:py-12">
            <div className="max-w-[1440px] mx-auto px-6">
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <Link to="/" className="text-[#8A8378] hover:text-[#2C2420] transition-colors">
                        Home
                    </Link>
                    <span className="text-[#8A8378]">/</span>
                    <Link to="/shop" className="text-[#8A8378] hover:text-[#2C2420] transition-colors">
                        Shop
                    </Link>
                    <span className="text-[#8A8378]">/</span>
                    <span className="text-[#2C2420] font-medium truncate">
                        {product.name}
                    </span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl font-bold text-[#2C2420]">{product.name}</h1>

                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-semibold text-[#2C2420]">
                                R{product.price.toFixed(2)}
                            </span>
                            {product.original_price && (
                                <span className="text-lg text-gray-400 line-through">
                                    R{product.original_price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {product.description && (
                            <p className="text-[#8A8378]">{product.description}</p>
                        )}

                        <div className="flex items-center gap-4 mt-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 py-3 bg-[#6B5D4F] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#5A4D40] transition-colors"
                                disabled={product.stock === 0}
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>

                        {product.stock !== undefined && (
                            <p className="text-sm text-[#8A8378]">
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </p>
                        )}
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <section className="mt-16 md:mt-24 pt-8 border-t border-[#D5C9B9]">
                        <h3 className="text-2xl font-bold text-[#2C2420] tracking-wide mb-8">
                            You Might Also Like
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map((related) => (
                                <Link
                                    key={related.id}
                                    to={`/product/${related.id}`}
                                    className="group"
                                >
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        {related.image_url ? (
                                            <img
                                                src={related.image_url}
                                                alt={related.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="mt-2 font-medium text-[#2C2420]">{related.name}</h3>
                                    <p className="text-[#8A8378]">R{related.price.toFixed(2)}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};