// src/components/layout/Navbar.tsx

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, ChevronDown, X, ImageOff } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useCategories } from '../../hooks/useCategories';
import { useSearch } from '../../hooks/useSearch';
import { AccountDropdown } from './AccountDropdown';
import { MobileNav } from './MobileNav';
import MusicPlayer from '../layout/MusicPlayer';


const navigation = [
    {
        title: "MEN",
        items: [
            "T Shirts",
            "Hoodies & Sweaters",
            "Shirts",
            "Jackets",
            "Bottoms",
        ]
    },
    {
        title: "WOMEN",
        items: [
            "Dresses",
            "Tops",
            "Sweaters & Knits",
            "Jackets",
            "Bottoms",
        ]
    },
    {
        title: "ACCESSORIES",
        items: [
            "Caps",
            "Socks",
            "Tote Bags",
            "Gift Cards",
        ]
    },
    {
        title: "UNISEX",
        items: []
    }
];


export function Navbar() {

    const { itemCount } = useCart();

    const { categories, fetchCategories } = useCategories();

    const navigate = useNavigate();

    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchWrapperRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const {
        products: searchProducts,
        categories: searchCategories,
        loading: searchLoading,
        search,
    } = useSearch();


    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (searchOpen) {
            searchInputRef.current?.focus();
        }
    }, [searchOpen]);

    // debounced live search as user types
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const trimmed = searchQuery.trim();
        if (!trimmed) return;

        debounceRef.current = setTimeout(() => {
            search(trimmed);
        }, 250);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchQuery]);

    // close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showDropdown = searchOpen && searchQuery.trim().length > 0;

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed) return;

        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        setSearchOpen(false);
        setSearchQuery('');
    };

    const handleSuggestionClick = () => {
        setSearchOpen(false);
        setSearchQuery('');
    };

    const handleSearchClose = () => {
        setSearchOpen(false);
        setSearchQuery('');
    };



    return (
        <>
            <nav className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-10 lg:px-14 bg-white">


                {/* LEFT */}
                <div className="flex items-center gap-3">

                    <button
                        className="md:hidden"
                        onClick={() => setMobileNavOpen(true)}
                    >
                        <Menu className="w-6 h-6"/>
                    </button>


                    <Link
                        to="/"
                        className="
                        font-display
                        text-sm
                        sm:text-base
                        font-black
                        uppercase
                        tracking-tight
                        "
                    >
                        Vril<br/>Couture.
                    </Link>

                </div>




                {/* CENTER */}
                <div className="hidden md:flex items-center gap-8">


                    <Link
                        to="/"
                        className="text-sm hover:opacity-50"
                    >
                        Home
                    </Link>


                    <Link
                        to="/about"
                        className="text-sm hover:opacity-50"
                    >
                        About
                    </Link>




                    {/* SHOP */}
                    <div
                        className="relative"
                        onMouseEnter={()=>setShopOpen(true)}
                        onMouseLeave={()=>setShopOpen(false)}
                    >


                        <button className="
                            flex items-center gap-2
                            text-sm
                            uppercase
                            tracking-widest
                        ">
                            Shop

                            <ChevronDown
                                className={`
                                w-4 h-4 transition
                                ${shopOpen ? "rotate-180":""}
                                `}
                            />

                        </button>



                        {shopOpen && (

                            <div
                                className="
                            absolute
                            left-1/2
                            -translate-x-1/2
                            top-full
                            pt-8
                            z-50
                            "
                            >


                                <div
                                    className="
                                w-[1000px]
                                rounded-3xl
                                bg-white
                                border
                                shadow-2xl
                                overflow-hidden
                                "
                                >


                                    <div className="
                                    grid
                                    grid-cols-4
                                    gap-10
                                    p-12
                                    ">



                                        {navigation.map(section=>(


                                            <div key={section.title}>


                                                <h3
                                                    className="
                                            text-xs
                                            tracking-[0.3em]
                                            font-bold
                                            mb-6
                                            "
                                                >
                                                    {section.title}
                                                </h3>



                                                {section.items.length > 0 ? (

                                                    section.items.map(item=>(

                                                        <Link
                                                            key={item}
                                                            to={`/category/${item.toLowerCase().replaceAll(" ","-")}`}
                                                            className="
                                                    block
                                                    text-sm
                                                    mb-4
                                                    hover:translate-x-2
                                                    transition
                                                    "
                                                        >

                                                            {item}

                                                        </Link>

                                                    ))

                                                ):(


                                                    <Link
                                                        to="/shop"
                                                        className="
                                                text-sm
                                                hover:opacity-50
                                                "
                                                    >
                                                        SHOP ALL
                                                    </Link>

                                                )}



                                            </div>

                                        ))}



                                        {/* DATABASE CATEGORIES */}

                                        <div>

                                            <h3
                                                className="
                                        text-xs
                                        tracking-[0.3em]
                                        font-bold
                                        mb-6
                                        "
                                            >
                                                COLLECTIONS
                                            </h3>



                                            {categories.slice(0,5).map(cat=>(

                                                <Link
                                                    key={cat.id}
                                                    to={`/category/${cat.slug}`}
                                                    className="
                                            block
                                            text-sm
                                            mb-4
                                            hover:translate-x-2
                                            transition
                                            "
                                                >
                                                    {cat.name}
                                                </Link>

                                            ))}


                                        </div>



                                    </div>




                                    {/* BOTTOM */}
                                    <div
                                        className="
                                    border-t
                                    px-12
                                    py-6
                                    flex
                                    justify-between
                                    "
                                    >

                                        <Link
                                            to="/shop"
                                            className="
                                        uppercase
                                        text-xs
                                        tracking-[0.3em]
                                        "
                                        >
                                            SHOP ALL
                                        </Link>





                                    </div>


                                </div>


                            </div>

                        )}

                    </div>




                    <Link
                        to="/contact"
                        className="text-sm hover:opacity-50"
                    >
                        Contact
                    </Link>


                </div>





                {/* RIGHT */}
                <div className="flex items-center gap-4">


                    <div className="hidden lg:flex items-center w-[260px]">
                        <MusicPlayer />
                    </div>



                    {/* SEARCH */}
                    <div className="relative" ref={searchWrapperRef}>

                        {searchOpen ? (
                            <form
                                onSubmit={handleSearchSubmit}
                                className="
                                flex items-center gap-2
                                border-b border-black
                                pb-1
                                w-[160px] sm:w-[220px]
                                transition-all
                                "
                            >
                                <Search className="w-4 h-4 shrink-0"/>

                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search"
                                    className="
                                    w-full
                                    text-sm
                                    bg-transparent
                                    focus:outline-none
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={handleSearchClose}
                                    aria-label="Close search"
                                >
                                    <X className="w-4 h-4 text-black/40 hover:text-black"/>
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setSearchOpen(true)}
                                aria-label="Open search"
                            >
                                <Search className="w-5 h-5"/>
                            </button>
                        )}


                        {/* LIVE DROPDOWN */}
                        {showDropdown && (
                            <div
                                className="
                                absolute
                                right-0
                                mt-3
                                w-[320px] sm:w-[380px]
                                bg-white
                                border border-black
                                shadow-2xl
                                z-50
                                max-h-[480px]
                                overflow-y-auto
                                "
                            >

                                {searchLoading ? (
                                    <div className="px-4 py-6 text-center text-xs text-black/40 uppercase tracking-[0.3em]">
                                        Searching...
                                    </div>
                                ) : searchProducts.length === 0 && searchCategories.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-xs text-black/40 uppercase tracking-[0.3em]">
                                        No results
                                    </div>
                                ) : (
                                    <>
                                        {searchCategories.length > 0 && (
                                            <div className="border-b border-black/10">
                                                <p className="px-4 pt-4 pb-2 text-[10px] uppercase tracking-[0.3em] text-black/40">
                                                    Categories
                                                </p>

                                                {searchCategories.slice(0, 3).map((cat) => (
                                                    <Link
                                                        key={cat.id}
                                                        to={`/category/${cat.slug}`}
                                                        onClick={handleSuggestionClick}
                                                        className="block px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {searchProducts.length > 0 && (
                                            <div>
                                                <p className="px-4 pt-4 pb-2 text-[10px] uppercase tracking-[0.3em] text-black/40">
                                                    Products
                                                </p>

                                                {searchProducts.slice(0, 5).map((product) => (
                                                    <Link
                                                        key={product.id}
                                                        to={`/product/${product.id}`}
                                                        onClick={handleSuggestionClick}
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <div className="w-10 h-12 bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                            {product.image_url ? (
                                                                <img
                                                                    src={product.image_url}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <ImageOff className="w-4 h-4 text-gray-400" />
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm truncate">{product.name}</p>
                                                            <p className="text-xs text-black/50">R{product.price}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleSearchSubmit}
                                            className="
                                            w-full
                                            text-center
                                            text-xs
                                            uppercase
                                            tracking-[0.3em]
                                            px-4 py-4
                                            border-t border-black
                                            hover:bg-black hover:text-white
                                            transition-colors
                                            "
                                        >
                                            View all results
                                        </button>
                                    </>
                                )}

                            </div>
                        )}

                    </div>



                    <AccountDropdown />



                    <Link
                        to="/cart"
                        className="relative"
                    >

                        <ShoppingBag className="w-5 h-5"/>


                        {itemCount > 0 && (

                            <span
                                className="
                            absolute
                            -top-2
                            -right-2
                            bg-black
                            text-white
                            text-[10px]
                            w-4
                            h-4
                            rounded-full
                            flex
                            items-center
                            justify-center
                            "
                            >

                                {itemCount}

                            </span>

                        )}

                    </Link>


                </div>


            </nav>



            <MobileNav
                isOpen={mobileNavOpen}
                onClose={()=>setMobileNavOpen(false)}
                navigation={navigation}
                categories={categories}
            />

        </>
    );
}


export default Navbar;