// src/pages/store/CategoryDetails.tsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import type { Category } from '../../types/category';

export const CategoryDetails = () => {

    const { slug } = useParams<{ slug: string }>();

    const [category, setCategory] = useState<Category | null>(null);
    const [categoryChecked, setCategoryChecked] = useState(false);

    const { categories, loading: categoriesLoading, fetchCategories } = useCategories();

    const { products, fetchProducts, loading: productsLoading } = useProducts();



    useEffect(() => {
        fetchCategories();
    }, []);




    useEffect(() => {

        if (!slug || categoriesLoading) return;


        const categoryData = categories.find(
            (c) => c.slug === slug
        ) ?? null;


        setCategory(categoryData);
        setCategoryChecked(true);



        if(categoryData){

            fetchProducts({
                category: categoryData.id
            });

        }


    }, [slug, categories, categoriesLoading]);



    // Still waiting on categories to load, or we haven't finished checking
    // whether this slug matches a real category yet.
    const isLoading = categoriesLoading || !categoryChecked || (!!category && productsLoading);

    if (isLoading) {

        return (

            <div className="
            min-h-screen
            flex
            items-center
            justify-center
            ">

                <div className="
                w-12
                h-12
                border-4
                border-black
                border-t-transparent
                rounded-full
                animate-spin
                "/>

            </div>

        );

    }




    if (!category) {

        return (

            <div className="
            min-h-screen
            flex
            flex-col
            items-center
            justify-center
            text-center
            ">

                <h2 className="
                text-3xl
                font-bold
                mb-4
                ">

                    COMING SOON!

                </h2>


                <Link
                    to="/shop"
                    className="
                uppercase
                tracking-widest
                text-xs
                "
                >

                    Browse Products

                </Link>


            </div>

        );

    }





    return (

        <main className="py-12 md:py-20">


            <div className="
            max-w-[1440px]
            mx-auto
            px-6
            ">



                {/* HEADER */}

                <div className="mb-16">


                    <p className="
                    text-[10px]
                    tracking-[0.6em]
                    uppercase
                    text-black/40
                    mb-4
                    ">

                        Vril Collection

                    </p>



                    <h1 className="
                    text-5xl
                    md:text-7xl
                    font-display
                    uppercase
                    tracking-tight
                    font-light
                    ">

                        {category.name}

                    </h1>


                </div>





                {/* PRODUCTS */}


                {products.length === 0 ? (


                    // COMING SOON

                    <div className="
                    min-h-[450px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    ">


                        <h2 className="
                        text-6xl
                        md:text-8xl
                        font-display
                        uppercase
                        tracking-tight
                        font-light
                        ">

                            Coming Soon

                        </h2>



                        <p className="
                        mt-6
                        text-black/40
                        uppercase
                        tracking-[0.4em]
                        text-xs
                        ">

                            {category.name} collection arriving soon

                        </p>



                    </div>



                ) : (


                    <>

                        <p className="
                        text-black/40
                        text-xs
                        uppercase
                        tracking-[0.4em]
                        mb-8
                        ">

                            {products.length} products

                        </p>




                        <div className="
                        grid
                        grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        gap-6
                        ">


                            {products.map((product)=> (


                                <Link

                                    key={product.id}

                                    to={`/product/${product.id}`}

                                    className="group"

                                >


                                    <div className="
                                    aspect-square
                                    bg-black/5
                                    overflow-hidden
                                    "
                                    >


                                        {product.image_url ? (

                                            <img

                                                src={product.image_url}

                                                alt={product.name}

                                                className="
                                            w-full
                                            h-full
                                            object-cover
                                            group-hover:scale-105
                                            transition
                                            duration-700
                                            "

                                            />

                                        ) : (

                                            <div className="
                                            w-full
                                            h-full
                                            flex
                                            items-center
                                            justify-center
                                            text-black/30
                                            "
                                            >
                                                No Image
                                            </div>

                                        )}


                                    </div>




                                    <h3 className="
                                    mt-3
                                    font-medium
                                    "
                                    >

                                        {product.name}

                                    </h3>


                                    <p className="
                                    text-black/50
                                    "
                                    >

                                        R{product.price.toFixed(2)}

                                    </p>



                                </Link>


                            ))}


                        </div>

                    </>

                )}



            </div>


        </main>

    );

};


export default CategoryDetails;