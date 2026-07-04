import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavSection {
    title: string;
    items: string[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    navigation: NavSection[];
    categories: Category[];
}

export const MobileNav = ({ isOpen, onClose, navigation, categories }: MobileNavProps) => {
    const { user, signOut } = useAuth();
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (title: string) => {
        setOpenSection((prev) => (prev === title ? null : title));
    };

    const topLinks = [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Shop', path: '/shop' },
        { label: 'Contact', path: '/contact' },
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
            <div className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-xs sm:w-80 bg-white shadow-xl animate-in slide-in-from-left duration-300">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-black shrink-0">
                        <span
                            className="text-black text-xl sm:text-2xl font-bold tracking-wider"
                            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                        >
                            VRIL COUTURE
                        </span>
                        <button
                            onClick={onClose}
                            className="text-black hover:opacity-60 transition-opacity"
                            aria-label="Close menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="square" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-6">

                        {/* Top-level links — matches desktop Home / About / Shop / Contact */}
                        <ul className="space-y-4 pb-6 border-b border-black/10">
                            {topLinks.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={onClose}
                                        className="block text-black text-lg font-medium tracking-wide hover:opacity-60 transition-opacity"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Category accordion — mirrors desktop Shop dropdown */}
                        <ul className="pt-2">
                            {navigation.map((section) => {
                                const isOpenSection = openSection === section.title;
                                const hasItems = section.items.length > 0;

                                return (
                                    <li key={section.title} className="border-b border-black/10">
                                        {hasItems ? (
                                            <>
                                                <button
                                                    onClick={() => toggleSection(section.title)}
                                                    className="w-full flex items-center justify-between py-4 text-left"
                                                    aria-expanded={isOpenSection}
                                                >
                                                    <span className="text-xs tracking-[0.3em] font-bold">
                                                        {section.title}
                                                    </span>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform ${isOpenSection ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                {isOpenSection && (
                                                    <div className="pb-4 pl-2">
                                                        {section.items.map((item) => (
                                                            <Link
                                                                key={item}
                                                                to={`/category/${item.toLowerCase().replaceAll(' ', '-')}`}
                                                                onClick={onClose}
                                                                className="block text-sm py-2 hover:opacity-60 transition-opacity"
                                                            >
                                                                {item}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <Link
                                                to={`/category/${section.title.toLowerCase()}`}
                                                onClick={onClose}
                                                className="block py-4 text-xs tracking-[0.3em] font-bold hover:opacity-60 transition-opacity"
                                            >
                                                {section.title}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}

                            {/* Dynamic COLLECTIONS — mirrors desktop's useCategories() section */}
                            {categories.length > 0 && (
                                <li className="border-b border-black/10">
                                    <button
                                        onClick={() => toggleSection('COLLECTIONS')}
                                        className="w-full flex items-center justify-between py-4 text-left"
                                        aria-expanded={openSection === 'COLLECTIONS'}
                                    >
                                        <span className="text-xs tracking-[0.3em] font-bold">
                                            COLLECTIONS
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${openSection === 'COLLECTIONS' ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {openSection === 'COLLECTIONS' && (
                                        <div className="pb-4 pl-2">
                                            {categories.slice(0, 5).map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    to={`/category/${cat.slug}`}
                                                    onClick={onClose}
                                                    className="block text-sm py-2 hover:opacity-60 transition-opacity"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            )}
                        </ul>

                        {/* SHOP ALL — matches desktop dropdown footer */}
                        <Link
                            to="/shop"
                            onClick={onClose}
                            className="block py-4 text-xs uppercase tracking-[0.3em] hover:opacity-60 transition-opacity"
                        >
                            SHOP ALL
                        </Link>

                        {/* Auth buttons */}
                        {/* Spotify Player */}
                        <div className="mt-8 pt-6 border-t border-black/10">
                            <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-4">
                                Now Playing
                            </h3>

                            <iframe
                                style={{ borderRadius: "12px" }}
                                src="https://open.spotify.com/embed/album/0Hr4UiqidZHMMzCMTFXxzD?utm_source=generator"
                                width="100%"
                                height="152"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                title="Spotify Album"
                            />

                            <a
                                href="https://open.spotify.com/album/0Hr4UiqidZHMMzCMTFXxzD"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
            mt-4
            block
            w-full
            text-center
            bg-black
            text-white
            text-xs
            uppercase
            tracking-[0.3em]
            py-3
            rounded-full
            hover:bg-neutral-800
            transition
        "
                            >
                                ▶ Play on Spotify
                            </a>
                        </div>

                        {/* Auth buttons */}
                        <div className="mt-8 pt-8 border-t border-black">
                            {user ? (
                                <div className="space-y-4">
                                    <p className="text-black text-sm">
                                        Hello, {user.email}
                                    </p>
                                    {user.role === 'admin' && (
                                        <Link
                                            to="/admin/products"
                                            onClick={onClose}
                                            className="block text-black text-sm font-medium uppercase tracking-wider hover:opacity-60 transition-opacity"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            signOut();
                                            onClose();
                                        }}
                                        className="text-black text-sm font-medium uppercase tracking-wider hover:opacity-60 transition-opacity"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        to="/login"
                                        onClick={onClose}
                                        className="block w-full text-center px-4 py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={onClose}
                                        className="block w-full text-center px-4 py-3 border-2 border-black text-black text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
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