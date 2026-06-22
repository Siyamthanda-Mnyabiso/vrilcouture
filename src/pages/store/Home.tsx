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
        return products.slice(0, 6);
    }, [products]);


    return (
        <main>

            <Hero />

            <AnnouncementBar />


            <ProductGrid
                title="The Archive"
                products={featuredProducts}
                loading={productsLoading}
            />


            <CategoryBanner
                categoryName="Obsidian Series"
                categorySlug="obsidian-series"
                description="A study in structure and shadow. Designed with precision, built for presence."
                imageUrl="/categories/1.jpg"
            />


            <section className="py-20 px-8 md:px-12 text-center border-t border-black">

                <h2 className="
                    font-display
                    text-3xl md:text-5xl
                    font-light
                    uppercase
                    tracking-tight
                    mb-4
                ">
                    Enter The Archive
                </h2>


                <p className="
                    text-black/50
                    text-sm
                    max-w-md
                    mx-auto
                    mb-8
                ">
                    Discover the latest pieces from our current collection.
                    Limited releases. Timeless silhouettes.
                </p>


                <Link
                    to="/shop"
                    className="
                        inline-block
                        bg-black
                        text-white
                        px-8
                        py-3
                        text-xs
                        uppercase
                        tracking-[0.4em]
                    "
                >
                    View Collection
                </Link>

            </section>

        </main>
    );
};

export default Home;