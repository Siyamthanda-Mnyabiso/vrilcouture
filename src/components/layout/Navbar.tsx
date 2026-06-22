// src/components/layout/Navbar.tsx
import { Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { AmbientAudioToggle } from '../hero/AmbientAudioToggle';
import { AccountDropdown } from './AccountDropdown';

export function Navbar() {
    const { itemCount } = useCart();
    const { user } = useAuth();
    console.log('Current user:', user);

    return (
        <nav className="flex items-center justify-between px-8 py-5 md:px-12 bg-white">
            <Link to="/" className="font-display text-base font-black uppercase leading-tight tracking-tight text-black">
                Vril<br />Couture.
            </Link>

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

            <div className="flex items-center gap-5">
                <AmbientAudioToggle />
                <button aria-label="Search" className="text-black hover:opacity-60 transition-opacity">
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
    );
}

export default Navbar;