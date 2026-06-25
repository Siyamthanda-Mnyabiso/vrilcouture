// src/components/layout/Navbar.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, ChevronDown } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useCategories } from '../../hooks/useCategories';
import { AccountDropdown } from './AccountDropdown';
import { MobileNav } from './MobileNav';

export function Navbar() {
    const { itemCount } = useCart();
    const { categories, fetchCategories } = useCategories();

    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);

    // Load real categories once so the Shop dropdown can link straight to
    // each category's own page instead of /shop?category=... query params.
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            <nav className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-10 lg:px-14 bg-white">

                {/* LEFT */}
                <div className="flex items-center gap-3 flex-shrink-0">

                    <button
                        type="button"
                        aria-label="Open menu"
                        className="md:hidden text-black hover:opacity-60 transition"
                        onClick={() => setMobileNavOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <Link
                        to="/"
                        className="font-display text-sm sm:text-base font-black uppercase leading-tight tracking-tight text-black whitespace-nowrap"
                    >
                        Vril<br />Couture.
                    </Link>

                </div>

                {/* CENTER */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">

                    <Link to="/" className="text-sm font-medium hover:opacity-60 transition">
                        Home
                    </Link>

                    <Link to="/about" className="text-sm font-medium hover:opacity-60 transition">
                        About Us
                    </Link>

                    {/* SHOP DROPDOWN */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShopOpen(true)}
                        onMouseLeave={() => setShopOpen(false)}
                    >
                        <button className="flex items-center gap-1 text-sm font-medium hover:opacity-60 transition">
                            Shop
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`} />
                        </button>

                        {shopOpen && (
                            <div className="
                                absolute left-1/2 -translate-x-1/2 top-full pt-6 z-50
                                animate-in fade-in slide-in-from-top-3 duration-300
                            ">
                                <div className="
                                    w-[800px]
                                    bg-white/95
                                    backdrop-blur-xl
                                    border border-black/10
                                    shadow-2xl
                                    rounded-3xl
                                    overflow-hidden
                                ">

                                    {/* TOP BAR */}
                                    <div className="flex justify-end items-center px-10 py-6 border-b border-black/10">
                                        <Link to="/shop" className="text-xs uppercase tracking-[0.25em] hover:opacity-60">
                                            View All
                                        </Link>
                                    </div>

                                    {/* CONTENT */}
                                    {categories.length === 0 ? (
                                        <div className="p-10 text-center text-sm text-black/40">
                                            No categories yet.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-[1fr_1fr_1fr_280px] gap-10 p-10">

                                            {/* Categories split across up to 3 columns */}
                                            {[0, 1, 2].map((colIndex) => {
                                                const perCol = Math.ceil(categories.length / 3);
                                                const colCategories = categories.slice(
                                                    colIndex * perCol,
                                                    colIndex * perCol + perCol
                                                );

                                                if (colCategories.length === 0) return null;

                                                return (
                                                    <div key={colIndex}>
                                                        {colCategories.map((cat) => (
                                                            <Link
                                                                key={cat.id}
                                                                to={`/category/${cat.slug}`}
                                                                className="block text-sm mb-4 hover:translate-x-2 transition"
                                                            >
                                                                {cat.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                );
                                            })}

                                            {/* FEATURED */}
                                            <div className="space-y-5">

                                                {categories.slice(0, 2).map((cat, i) => (
                                                    <Link
                                                        key={cat.id}
                                                        to={`/category/${cat.slug}`}
                                                        className="relative rounded-2xl overflow-hidden group block"
                                                    >
                                                        <img
                                                            src={`/categories/${i === 0 ? '3' : '1'}.jpeg`}
                                                            className="h-[160px] w-full object-cover group-hover:scale-110 transition duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-black/30 flex items-end p-5">
                                                            <p className="text-white text-sm font-semibold">
                                                                {cat.name}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}

                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/contact" className="text-sm font-medium hover:opacity-60 transition">
                        Contact Us
                    </Link>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 flex-shrink-0">

                    {/* Spotify (RESTORED EXACTLY) */}
                    <div className="w-[160px] sm:w-[220px] md:w-[260px] lg:w-[300px]">
                        <iframe
                            title="Spotify Album"
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/album/0Hr4UiqidZHMMzCMTFXxzD?utm_source=generator&si=1fa8475b06814189"
                            width="100%"
                            height="80"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    </div>

                    {/* Search */}
                    <button className="hidden sm:inline-flex hover:opacity-60 transition">
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Account */}
                    <AccountDropdown />

                    {/* Cart */}
                    <Link to="/cart" className="relative hover:opacity-60 transition">
                        <ShoppingBag className="w-5 h-5" />

                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                </div>

            </nav>

            <MobileNav
                isOpen={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
            />
        </>
    );
}

export default Navbar;