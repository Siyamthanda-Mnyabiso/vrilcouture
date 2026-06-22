import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductGallery } from '../../components/product/ProductGallery';
import { ProductInfo } from '../../components/product/ProductInfo';
import { ProductGrid } from '../../components/product/ProductGrid';
import { useProducts } from '../../hooks/useProducts';

export const ProductDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const {
        currentProduct,
        loading,
        fetchProductBySlug,
        fetchRelatedProducts,
        relatedProducts
    } = useProducts();

    useEffect(() => {
        if (slug) {
            fetchProductBySlug(slug);
        }
    }, [slug]);

    useEffect(() => {
        if (currentProduct) {
            fetchRelatedProducts(currentProduct.id, currentProduct.category?.id);
        }
    }, [currentProduct]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#6B5D4F] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!currentProduct) {
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

    return (
        <main className="py-8 md:py-12">
            <div className="max-w-[1440px] mx-auto px-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <Link to="/" className="text-[#8A8378] hover:text-[#2C2420] transition-colors">
                        Home
                    </Link>
                    <span className="text-[#8A8378]">/</span>
                    {currentProduct.category && (
                        <>
                            <Link
                                to={`/category/${currentProduct.category.slug}`}
                                className="text-[#8A8378] hover:text-[#2C2420] transition-colors"
                            >
                                {currentProduct.category.name}
                            </Link>
                            <span className="text-[#8A8378]">/</span>
                        </>
                    )}
                    <span className="text-[#2C2420] font-medium truncate">
            {currentProduct.name}
          </span>
                </nav>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <ProductGallery
                        images={currentProduct.images || []}
                        productName={currentProduct.name}
                    />
                    <ProductInfo product={currentProduct} />
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16 md:mt-24 pt-8 border-t border-[#D5C9B9]">
                        <h3 className="text-2xl font-bold text-[#2C2420] tracking-wide mb-8">
                            You Might Also Like
                        </h3>
                        <ProductGrid products={relatedProducts} columns={4} />
                    </section>
                )}
            </div>
        </main>
    );
};