import { Link } from 'react-router-dom';
import { MegaMenuColumn } from './MegaMenuColumn';

interface MegaMenuProps {
    activeCategory: string | null;
}

export const MegaMenu = ({ activeCategory }: MegaMenuProps) => {
    const categories = {
        men: {
            columns: [
                {
                    title: 'New & Trending',
                    links: [
                        'New Arrivals',
                        'New Offer',
                        'Best Sellers',
                        'Latest Drops',
                        'New In Air Max',
                        'Shop Latest Sale Styles',
                    ],
                },
                {
                    title: 'Shoes',
                    links: [
                        'Basketball',
                        'Lifestyle',
                        'Jordan',
                        'Retro Running',
                        'Running',
                        'Training & Gym',
                        'Sandals & Slides',
                        'Shoes $100 & Under',
                    ],
                },
                {
                    title: 'Clothing',
                    links: [
                        'Hoodies & Sweatshirts',
                        'Jordan',
                        'Jackets & Vests',
                        'Tracksuits',
                        '24.7 Collection',
                        'Pants',
                        'Shorts',
                        'Tops & T-Shirts',
                    ],
                },
                {
                    title: 'Accessories',
                    links: [
                        'Bags & Backpacks',
                        'Hats & Headwear',
                        'Socks',
                        'Sunglasses',
                        'Belts',
                    ],
                },
                {
                    title: 'Shop By Sport',
                    links: [
                        'Baseball',
                        'Basketball',
                        'Cycling',
                        'Football',
                        'Golf',
                        'Hiking',
                        'Outdoor',
                        'Running',
                        'Soccer',
                        'Tennis',
                        'Workout & Gym',
                        'Yoga',
                    ],
                },
                {
                    title: 'Shop By Color',
                    links: [
                        'Elemental Pink',
                        'University Red',
                        'Electric Blue',
                        'Mink Brown',
                        'Black And Sail',
                    ],
                },
            ],
            bottomLinks: [
                'All Men\'s Shoes',
                'All Men\'s Clothing',
                'All Men\'s Accessories',
                'All Men\'s Sport',
                'All Men\'s',
            ],
        },
        women: {
            columns: [
                {
                    title: 'New & Trending',
                    links: [
                        'New Arrivals',
                        'New Offer',
                        'Best Sellers',
                        'Latest Drops',
                        'New In Dresses',
                        'Shop Latest Sale Styles',
                    ],
                },
                {
                    title: 'Shoes',
                    links: [
                        'Basketball',
                        'Lifestyle',
                        'Jordan',
                        'Running',
                        'Training & Gym',
                        'Sandals & Slides',
                        'Shoes $100 & Under',
                    ],
                },
                {
                    title: 'Clothing',
                    links: [
                        'Hoodies & Sweatshirts',
                        'Jordan',
                        'Jackets & Vests',
                        'Tracksuits',
                        'Dresses',
                        'Pants',
                        'Shorts',
                        'Tops & T-Shirts',
                    ],
                },
                {
                    title: 'Accessories',
                    links: [
                        'Bags & Backpacks',
                        'Hats & Headwear',
                        'Socks',
                        'Sunglasses',
                        'Belts',
                        'Scarves',
                    ],
                },
                {
                    title: 'Shop By Sport',
                    links: [
                        'Basketball',
                        'Cycling',
                        'Golf',
                        'Hiking',
                        'Running',
                        'Tennis',
                        'Workout & Gym',
                        'Yoga',
                    ],
                },
                {
                    title: 'Shop By Color',
                    links: [
                        'Elemental Pink',
                        'University Red',
                        'Electric Blue',
                        'Mink Brown',
                        'Black And Sail',
                    ],
                },
            ],
            bottomLinks: [
                'All Women\'s Shoes',
                'All Women\'s Clothing',
                'All Women\'s Accessories',
                'All Women\'s Sport',
                'All Women\'s',
            ],
        },
    };

    const data = activeCategory === 'men' ? categories.men : categories.women;

    return (
        <div className="w-full bg-[#6B5D4F] shadow-lg">
            <div className="max-w-[1440px] mx-auto px-6 py-8">
                {/* Top nav row inside mega menu */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#5A4D40]">
                    <div className="flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-white text-xl font-bold tracking-wider"
                            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                        >
                            VRIL COUTURE.
                        </Link>
                        <div className="flex items-center gap-6">
                            {['New', 'Men', 'Women', 'Kids', 'Sports'].map((item) => (
                                <Link
                                    key={item}
                                    to={`/category/${item.toLowerCase()}`}
                                    className={`text-sm tracking-[0.1em] uppercase font-medium transition-colors ${
                                        item.toLowerCase() === activeCategory
                                            ? 'text-white border-b-2 border-white pb-1'
                                            : 'text-[#C4B8A8] hover:text-white'
                                    }`}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-white hover:opacity-80 transition-opacity">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="square" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <button className="text-white hover:opacity-80 transition-opacity">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="square" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </button>
                        <button className="text-white hover:opacity-80 transition-opacity">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="square" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Columns grid */}
                <div className="grid grid-cols-5 gap-8">
                    {data.columns.map((column, index) => (
                        <MegaMenuColumn
                            key={column.title}
                            title={column.title}
                            links={column.links}
                            isFirst={index === 0}
                        />
                    ))}
                </div>

                {/* Bottom links */}
                <div className="mt-8 pt-4 border-t border-[#5A4D40]">
                    <div className="flex items-center justify-center gap-8">
                        {data.bottomLinks.map((link) => (
                            <Link
                                key={link}
                                to={`/category/${link.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-white text-sm font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity"
                            >
                                {link}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};