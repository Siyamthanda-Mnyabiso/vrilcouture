import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
    const { user, signOut } = useAuth();

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Shop', path: '/shop' },
        { label: 'Men', path: '/category/men' },
        { label: 'Women', path: '/category/women' },
        { label: 'Kids', path: '/category/kids' },
        { label: 'Accessories', path: '/category/accessories' },
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/50"
                onClick={onClose}
            />

            {/* Menu */}
            <div className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-[#F5F1EA] shadow-xl animate-in slide-in-from-left duration-300">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[#D5C9B9]">
            <span
                className="text-[#2C2420] text-2xl font-bold tracking-wider"
                style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
            >
              VRIL COUTURE
            </span>
                        <button
                            onClick={onClose}
                            className="text-[#8A8378] hover:text-[#2C2420] transition-colors"
                            aria-label="Close menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="square" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-6">
                        <ul className="space-y-4">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={onClose}
                                        className="block text-[#2C2420] text-lg font-medium tracking-wide hover:text-[#6B5D4F] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Auth buttons */}
                        <div className="mt-8 pt-8 border-t border-[#D5C9B9]">
                            {user ? (
                                <div className="space-y-4">
                                    <p className="text-[#2C2420] text-sm">
                                        Hello, {user.email}
                                    </p>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            onClose();
                                        }}
                                        className="text-[#6B5D4F] text-sm font-medium uppercase tracking-wider hover:opacity-80 transition-opacity"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        to="/login"
                                        onClick={onClose}
                                        className="block w-full text-center px-4 py-3 bg-[#6B5D4F] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#5A4D40] transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={onClose}
                                        className="block w-full text-center px-4 py-3 border-2 border-[#6B5D4F] text-[#6B5D4F] text-sm font-medium uppercase tracking-wider hover:bg-[#6B5D4F] hover:text-white transition-colors"
                                    >
                                        Create Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};