import { Link } from 'react-router-dom';

interface CategoryBannerProps {
    categoryName: string;
    categorySlug: string;
    description: string;
    imageUrl: string;
}

export function CategoryBanner({
                                   categoryName,
                                   categorySlug,
                                   description,
                                   imageUrl
                               }: CategoryBannerProps) {
    return (
        <section className="
            relative
            overflow-hidden
            bg-[#F8F8F6]
            px-8
            md:px-20
            py-24
        ">

            {/* background detail */}
            <div className="
                absolute
                top-10
                right-10
                text-black/5
                text-[12rem]
                font-display
                uppercase
                leading-none
                pointer-events-none
            ">
                {categoryName}
            </div>


            <div className="
                relative
                z-10
                max-w-[1400px]
                mx-auto
                grid
                md:grid-cols-2
                gap-16
                items-center
            ">


                {/* Text */}
                <div>

                    <p className="
                        text-black/40
                        uppercase
                        text-xs
                        tracking-[0.6em]
                        mb-6
                    ">
                        Vril Collection
                    </p>


                    <h2 className="
                        font-display
                        text-black
                        text-6xl
                        md:text-8xl
                        uppercase
                        tracking-tight
                        leading-[0.85]
                        font-light
                    ">
                        {categoryName}
                    </h2>


                    <p className="
                        mt-8
                        max-w-md
                        text-black/60
                        text-sm
                        leading-relaxed
                    ">
                        {description}
                    </p>


                    <Link
                        to={`/category/${categorySlug}`}
                        className="
                            inline-flex
                            mt-10
                            items-center
                            gap-4
                            text-xs
                            uppercase
                            tracking-[0.4em]
                            text-black
                            group
                        "
                    >
                        Explore

                        <span className="
                            w-10
                            h-px
                            bg-black
                            transition-all
                            group-hover:w-16
                        " />
                    </Link>

                </div>



                {/* Image */}
                <div className="
                    relative
                    flex
                    justify-center
                ">

                    <div className="
                        absolute
                        inset-10
                        bg-black/5
                        blur-3xl
                    "/>


                    <img
                        src={imageUrl}
                        alt={categoryName}
                        className="
                            relative
                            z-10
                            max-h-[550px]
                            object-contain
                            transition-transform
                            duration-700
                            hover:scale-105
                        "
                    />

                </div>


            </div>

        </section>
    );
}