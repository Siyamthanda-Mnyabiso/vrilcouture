import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Package, UserCog, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function AccountDropdown() {
    const { user, signOut } = useAuth();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut();
        setOpen(false);
        navigate('/');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Account"
                className="text-black hover:opacity-60 transition-opacity"
            >
                <UserIcon className="w-5 h-5" />
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-black z-30">
                    {user ? (
                        <>
                            <div className="px-4 py-3 border-b border-black">
                                <p className="text-sm font-medium truncate">{user.full_name || user.email}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>

                            <Link
                                to="/account"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                            >
                                <UserCog className="w-4 h-4" />
                                Profile
                            </Link>

                            <Link
                                to="/account/orders"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                            >
                                <Package className="w-4 h-4" />
                                Orders
                            </Link>

                            <Link
                                to="/account/addresses"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                            >
                                <MapPin className="w-4 h-4" />
                                Addresses
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition-colors w-full text-left border-t border-black"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setOpen(false)}
                            className="block px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                        >
                            Login
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}