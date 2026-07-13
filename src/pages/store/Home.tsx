// src/pages/home/Home.tsx
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../../components/hero/Hero';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { ProductGrid } from '../../components/product/ProductGrid';
import { CategoryBanner } from '../../components/category/CategoryBanner';
import { useProducts } from '../../hooks/useProducts';

export const Home = () => {
    const { products, loading: productsLoading, fetchProducts } = useProducts();

    useEffect(() => {
        fetchProducts();
    }, []);

    const featuredProducts = useMemo(() => {
        return products;
    }, [products]);

    return (
        <main>

            <Hero />

            <AnnouncementBar />

            <ProductGrid
                title="New Arrivals"
                products={products}
                loading={productsLoading}
                viewAllHref="/shop"
            />

            <CategoryBanner
                categoryName="Obsidian Series"
                categorySlug="obsidian-series"
                description="A study in structure and shadow. Designed with precision, built for presence."
                imageUrl="/categories/1.jpeg"
            />

            <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-black">
                <video
                    src="https://cdn.cosmos.so/83febc38-6f69-4265-8d11-75b379937b4e.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="relative h-full flex items-center justify-center px-6">
                    <h2 className="font-display text-white text-4xl md:text-7xl uppercase tracking-tight text-center leading-[0.9]">
                        Vril
                    </h2>
                </div>
            </section>

            <section className="py-20 px-8 md:px-12 text-center bg-white border-t border-black">
                <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight mb-4 text-black">
                    Enter The Drop
                </h2>

                <p className="text-black/50 text-sm max-w-md mx-auto mb-8">
                    Discover the latest pieces from our current collection.
                    Limited releases. No restocks.
                </p>

                <Link
                    to="/shop"
                    className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-[0.4em] hover:bg-black/80 transition-colors"
                >
                    View Collection
                </Link>
            </section>

        </main>
    );
};

export default Home;