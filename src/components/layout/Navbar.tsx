// src/components/layout/Navbar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import { AmbientAudioToggle } from '../hero/AmbientAudioToggle';
import { AccountDropdown } from './AccountDropdown';
import { MobileNav } from './MobileNav';

export function Navbar() {
    const { itemCount } = useCart();
    const { user } = useAuth();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    console.log('Current user:', user);

    return (
        <>
            <nav className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-12 md:py-5 bg-white">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Open menu"
                        className="md:hidden text-black hover:opacity-60 transition-opacity"
                        onClick={() => setMobileNavOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <Link to="/" className="font-display text-sm sm:text-base font-black uppercase leading-tight tracking-tight text-black">
                        Vril<br />Couture.
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/shop?gender=women" className="text-sm font-medium text-black hover:opacity-60 transition-opacity">
                        Women
                    </Link>
                    <Link to="/shop?gender=men" className="text-sm font-medium text-black hover:opacity-60 transition-opacity">
                        Men
                    </Link>
                    <Link to="/shop" className="text-sm font-medium text-black hover:opacity-60 transition-opacity">
                        Categories
                    </Link>
                    <Link to="/shop?sale=true" className="text-sm font-medium text-black hover:opacity-60 transition-opacity">
                        Sale
                    </Link>
                </div>

                <div className="flex items-center gap-3 sm:gap-5">
                    <div className="hidden sm:block">
                        <AmbientAudioToggle />
                    </div>
                    <button aria-label="Search" className="hidden sm:inline-flex text-black hover:opacity-60 transition-opacity">
                        <Search className="w-5 h-5" />
                    </button>
                    <AccountDropdown />
                    <Link to="/cart" aria-label="Cart" className="relative text-black hover:opacity-60 transition-opacity">
                        <ShoppingBag className="w-5 h-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>

            <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        </>
    );
}

export default Navbar;