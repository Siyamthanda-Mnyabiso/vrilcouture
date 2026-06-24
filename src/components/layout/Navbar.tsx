import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

import { AccountDropdown } from './AccountDropdown';
import { MobileNav } from './MobileNav';

export function Navbar() {
    const { itemCount } = useCart();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <>
            <nav className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-10 lg:px-14 bg-white">

                {/* LEFT */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        type="button"
                        aria-label="Open menu"
                        className="md:hidden text-black hover:opacity-60 transition-opacity"
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

                {/* CENTER LINKS */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    <Link to="/shop?gender=women" className="text-sm font-medium text-black hover:opacity-60">
                        Women
                    </Link>
                    <Link to="/shop?gender=men" className="text-sm font-medium text-black hover:opacity-60">
                        Men
                    </Link>
                    <Link to="/shop" className="text-sm font-medium text-black hover:opacity-60">
                        Categories
                    </Link>
                    <Link to="/shop?sale=true" className="text-sm font-medium text-black hover:opacity-60">
                        Sale
                    </Link>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 flex-shrink-0">

                    {/* 🎧 MUSIC FEATURE (OPTION A FIXED) */}
                    <div className="relative group">

                        {/* MOBILE */}
                        <div className="sm:hidden">
                            <details className="relative">
                                <summary className="list-none cursor-pointer px-3 py-1 border border-black/10 rounded-full text-xs flex items-center gap-2">
                                    <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                    Now Playing
                                </summary>

                                <div className="absolute right-0 mt-3 w-[260px] z-50 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden">
                                    <iframe
                                        title="Spotify Album"
                                        style={{ borderRadius: '12px' }}
                                        src="https://open.spotify.com/embed/album/0Hr4UiqidZHMMzCMTFXxzD?utm_source=generator&si=1fa8475b06814189"
                                        width="100%"
                                        height="152"
                                        frameBorder="0"
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                    />
                                </div>
                            </details>
                        </div>

                        {/* DESKTOP */}
                        <div className="hidden sm:block">

                            <div className="flex items-center gap-2 px-3 py-1 border border-black/10 rounded-full cursor-pointer hover:border-black/30 transition-all">
                                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                <span className="text-xs font-medium">Now Playing</span>
                            </div>

                            <div className="absolute right-0 top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none group-hover:pointer-events-auto">
                                <div className="w-[260px] bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden">

                                    <iframe
                                        title="Spotify Album"
                                        style={{ borderRadius: '12px' }}
                                        src="https://open.spotify.com/embed/album/0Hr4UiqidZHMMzCMTFXxzD?utm_source=generator&si=1fa8475b06814189"
                                        width="100%"
                                        height="152"
                                        frameBorder="0"
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                    />

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Search */}
                    <button
                        aria-label="Search"
                        className="hidden sm:inline-flex text-black hover:opacity-60 transition-opacity"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Account */}
                    <AccountDropdown />

                    {/* Cart */}
                    <Link
                        to="/cart"
                        aria-label="Cart"
                        className="relative text-black hover:opacity-60 transition-opacity"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                </div>
            </nav>

            {/* Mobile Nav */}
            <MobileNav
                isOpen={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
            />
        </>
    );
}

export default Navbar;