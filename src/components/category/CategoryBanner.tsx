// src/components/category/CategoryBanner.tsx
import { useParallax } from '../../hooks/useParallax';

interface CategoryBannerProps {
    categoryName: string;
    categorySlug: string;
    description: string;
    imageUrl: string;
}

export function CategoryBanner({ categoryName, description, imageUrl }: CategoryBannerProps) {
    const { ref, offset } = useParallax<HTMLElement>(0.2);

    return (
        <section ref={ref} className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-black">
            <img
                src={imageUrl}
                alt={categoryName}
                className="absolute -inset-y-[30%] inset-x-0 w-full h-[160%] object-cover opacity-80 will-change-transform"
                style={{ transform: `translate3d(0, ${offset}px, 0)` }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="relative h-full flex flex-col items-start justify-end px-6 md:px-12 pb-12 md:pb-16">
                <h2 className="font-display text-3xl md:text-6xl uppercase tracking-tight text-white mb-3">
                    {categoryName}
                </h2>

                <p className="text-white/70 text-sm md:text-base max-w-md mb-6">
                    {description}
                </p>


            </div>
        </section>
    );
}
