// src/components/hero/CategoryHeroTile.tsx
import { Link } from 'react-router-dom';
import type { HeroCategory } from './categoryHeroData';

interface CategoryHeroTileProps {
    category: HeroCategory;
    className?: string;
    nameClassName?: string;
    align?: 'left' | 'center';
}

export function CategoryHeroTile({
    category,
    className = '',
    nameClassName = 'text-xl md:text-2xl',
    align = 'left',
}: CategoryHeroTileProps) {
    const isCentered = align === 'center';

    return (
        <Link
            to={category.href}
            aria-label={`Shop ${category.name}`}
            className={`group relative block overflow-hidden bg-black ${className}`}
        >
            <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                style={{ objectPosition: category.objectPosition }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[450ms] ease-out group-hover:scale-[1.02]"
            />

            <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-[450ms] ease-out group-hover:bg-black/15" />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

            <div
                className={`relative flex h-full flex-col justify-end p-4 md:p-6 ${
                    isCentered ? 'items-center text-center' : 'items-start text-left'
                }`}
            >
                <span
                    className={`font-display uppercase text-white tracking-[0.2em] leading-none transition-transform duration-[450ms] ease-out group-hover:-translate-y-0.5 ${nameClassName}`}
                >
                    {category.name}
                </span>
            </div>
        </Link>
    );
}
