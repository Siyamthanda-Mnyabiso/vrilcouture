// src/components/hero/categoryHeroData.ts

export interface HeroCategory {
    name: string;
    image: string;
    href: string;
    objectPosition: string;
    /** grid-area name applied on desktop (md and up) */
    area: 'hoodies' | 'tshirts' | 'shorts' | 'sweaters' | 'accessories' | 'newArrivals' | 'limitedEdition';
}

export const heroCategories: HeroCategory[] = [
    {
        name: 'Hoodies',
        image: '/category-hero/hoodies.png',
        href: '/category/hoodies',
        objectPosition: 'center 15%',
        area: 'hoodies',
    },
    {
        name: 'T-Shirts',
        image: '/category-hero/t-shirts.png',
        href: '/category/t-shirts',
        objectPosition: 'center 20%',
        area: 'tshirts',
    },
    {
        name: 'Shorts',
        image: '/category-hero/shorts.png',
        href: '/category/shorts',
        objectPosition: 'center 30%',
        area: 'shorts',
    },
    {
        name: 'Sweaters',
        image: '/category-hero/sweaters.png',
        href: '/category/sweaters',
        objectPosition: 'center 15%',
        area: 'sweaters',
    },
    {
        name: 'Accessories',
        image: '/category-hero/accessories.png',
        href: '/category/accessories',
        objectPosition: 'center center',
        area: 'accessories',
    },
    {
        name: 'New Arrivals',
        image: '/category-hero/new-arrivals.png',
        href: '/shop',
        objectPosition: 'center 35%',
        area: 'newArrivals',
    },
    {
        name: 'Limited Edition',
        image: '/category-hero/limited-edition.png',
        href: '/category/limited-edition',
        objectPosition: 'center 20%',
        area: 'limitedEdition',
    },
];
