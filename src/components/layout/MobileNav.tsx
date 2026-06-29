import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MusicPlayer from '../layout/MusicPlayer'; // ✅ ADD THIS

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

export const MobileNav = ({ isOpen, onClose, navigation }: MobileNavProps) => {
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
                        <span className="text-black text-xl sm:text-2xl font-bold tracking-wider">
                            VRIL COUTURE
                        </span>

                        <button
                            onClick={onClose}
                            className="text-black hover:opacity-60 transition-opacity"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="square" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-6">

                        {/* Top links */}
                        <ul className="space-y-4 pb-6 border-b border-black/10">
                            {topLinks.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={onClose}
                                        className="block text-black text-lg font-medium"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Categories */}
                        <ul className="pt-2">
                            {navigation.map((section) => {
                                const isOpenSection = openSection === section.title;

                                return (
                                    <li key={section.title} className="border-b border-black/10">
                                        <button
                                            onClick={() => toggleSection(section.title)}
                                            className="w-full flex justify-between py-4 text-left"
                                        >
                                            <span className="text-xs tracking-[0.3em] font-bold">
                                                {section.title}
                                            </span>

                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${
                                                    isOpenSection ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>

                                        {isOpenSection && (
                                            <div className="pb-4 pl-2">
                                                {section.items.map((item) => (
                                                    <Link
                                                        key={item}
                                                        to={`/category/${item.toLowerCase().replaceAll(' ', '-')}`}
                                                        onClick={onClose}
                                                        className="block text-sm py-2"
                                                    >
                                                        {item}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        {/* SHOP ALL */}
                        <Link
                            to="/shop"
                            onClick={onClose}
                            className="block py-4 text-xs uppercase tracking-[0.3em]"
                        >
                            SHOP ALL
                        </Link>

                        {/* Auth */}
                        <div className="mt-4 pt-8 border-t border-black">
                            {user ? (
                                <div className="space-y-4">
                                    <p className="text-black text-sm">
                                        Hello, {user.email}
                                    </p>

                                    <button
                                        onClick={() => {
                                            signOut();
                                            onClose();
                                        }}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link to="/login" onClick={onClose}>
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* ✅ MUSIC PLAYER ADDED HERE (BOTTOM DOCK INSIDE NAV) */}
                    <div className="border-t border-black/10 p-3 bg-white">
                        <MusicPlayer />
                    </div>

                </div>
            </div>
        </>
    );
};