// src/pages/home/Home.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../../components/hero/Hero';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { ProductGrid } from '../../components/product/ProductGrid';
import { CategoryBanner } from '../../components/category/CategoryBanner';
import { useProducts } from '../../hooks/useProducts';
import { useParallax } from '../../hooks/useParallax';

export const Home = () => {
    const { products, loading: productsLoading, fetchProducts } = useProducts();
    // Both the video and the text measure the same stable, untransformed
    // section (never the elements being transformed) — sharing one DOM
    // node via a merged ref callback, each keeping its own speed/clamp.
    const { ref: videoMeasureRef, offset: videoOffset } = useParallax<HTMLElement>(0.2);
    const { ref: textMeasureRef, offset: textOffset } = useParallax<HTMLElement>(-0.08);
    const setVrilSectionRef = (node: HTMLElement | null) => {
        videoMeasureRef.current = node;
        textMeasureRef.current = node;
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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

            <section ref={setVrilSectionRef} className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-black">
                <video
                    src="https://cdn.cosmos.so/83febc38-6f69-4265-8d11-75b379937b4e.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute -inset-y-[30%] inset-x-0 w-full h-[160%] object-cover opacity-90 will-change-transform"
                    style={{ transform: `translate3d(0, ${videoOffset}px, 0)` }}
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="relative h-full flex items-center justify-center px-6">
                    <h2
                        className="font-display text-white text-4xl md:text-7xl uppercase tracking-tight text-center leading-[0.9] will-change-transform"
                        style={{ transform: `translate3d(0, ${textOffset}px, 0)` }}
                    >
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