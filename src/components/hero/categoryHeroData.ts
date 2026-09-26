// src/components/hero/categoryHeroData.ts

export interface HeroCategory {
    number: string;
    name: string;
    image: string;
    href: string;
    objectPosition: string;
    /** grid-area name applied on desktop (md and up) */
    area: 'hoodies' | 'tshirts' | 'shorts' | 'sweaters' | 'accessories' | 'newArrivals' | 'limitedEdition';
}

export const heroCategories: HeroCategory[] = [
    {
        number: '01',
        name: 'Hoodies',
        image: '/category-hero/hoodies.png',
        href: '/category/hoodies',
        objectPosition: 'center 15%',
        area: 'hoodies',
    },
    {
        number: '02',
        name: 'T-Shirts',
        image: '/category-hero/t-shirts.png',
        href: '/category/t-shirts',
        objectPosition: 'center 20%',
        area: 'tshirts',
    },
    {
        number: '03',
        name: 'Shorts',
        image: '/category-hero/shorts.png',
        href: '/category/shorts',
        objectPosition: 'center 30%',
        area: 'shorts',
    },
    {
        number: '04',
        name: 'Sweaters',
        image: '/category-hero/sweaters.png',
        href: '/category/sweaters',
        objectPosition: 'center 15%',
        area: 'sweaters',
    },
    {
        number: '05',
        name: 'Accessories',
        image: '/category-hero/accessories.png',
        href: '/category/accessories',
        objectPosition: 'center center',
        area: 'accessories',
    },
    {
        number: '06',
        name: 'New Arrivals',
        image: '/category-hero/new-arrivals.png',
        href: '/shop',
        objectPosition: 'center 35%',
        area: 'newArrivals',
    },
    {
        number: '07',
        name: 'Limited Edition',
        image: '/category-hero/limited-edition.png',
        href: '/category/limited-edition',
        objectPosition: 'center 20%',
        area: 'limitedEdition',
    },
];
