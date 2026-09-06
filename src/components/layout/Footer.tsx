import { Link } from 'react-router-dom';
import {
    Truck,
    CreditCard as PaymentCard,
    RotateCcw,
    MapPin,
    Phone,
    Mail,
} from 'lucide-react';

const FEATURES = [
    {
        icon: Truck,
        title: 'Free Delivery',
        description:
            'Get your orders delivered to your doorstep for free. Shop with us and enjoy hassle-free shipping on every purchase.',
    },
    {
        icon: PaymentCard,
        title: 'Online Payment',
        description:
            'Experience hassle-free online payments with secure and convenient options. Pay quickly and effortlessly with your method.',
    },
    {
        icon: RotateCcw,
        title: 'Easy Return',
        description:
            'Request a return within 14 days of delivery. Exchanges are subject to stock availability for a smooth refund or swap.',
    },
];

const ACCOUNT_LINKS = [
    { label: 'My Profile', to: '/account' },
    { label: 'Order History', to: '/account/orders' },
    { label: 'Order Tracking', to: '/account/orders' },
    { label: 'Shopping Cart', to: '/cart' },
];
const SHOP_LINKS = [{ label: 'New In', to: '/shop' }];

const PAYMENT_METHODS = [
    { label: 'Visa', logo: '/payments/visa.webp' },
    { label: 'Mastercard', logo: '/payments/mastercard.png' },
    { label: 'Apple Pay', logo: '/payments/apple-pay.png' },
    { label: 'Capitec Pay', logo: '/payments/capitec.webp' },
    { label: 'Pay Later', logo: '/payments/paylater.png' },
];

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white">

            {/* Feature strip */}
            <div className="border-b border-white/10">
                <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {FEATURES.map(({ icon: Icon, title, description }) => (
                            <div key={title} className="flex gap-5">
                                <Icon size={28} strokeWidth={1} className="text-white/70 mt-1" />
                                <div>
                                    <h4 className="text-sm uppercase tracking-[0.3em] mb-3">
                                        {title}
                                    </h4>
                                    <p className="text-sm text-white/50">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN FOOTER WRAPPER */}
            <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-24">

                {/* GRID SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h3 className="text-3xl uppercase tracking-[0.6em] font-light mb-2">
                            VRIL
                        </h3>

                        <p className="text-white/40 uppercase text-[10px] tracking-[0.8em] mb-8">
                            Couture
                        </p>

                        <ul className="space-y-4 text-white/50 text-sm">
                            <li className="flex gap-3 items-start">
                                <MapPin size={16} className="text-white/40 mt-1" />

                                <span>
        145 Sir Lowry rd,
        <br />
        The Palms,
        <br />
        Cape Town
    </span>
                            </li>
                            <li className="flex gap-3">
                                <Phone size={16} className="text-white/40" />
                                +27 21 211 0063
                            </li>
                            <li className="flex gap-3">
                                <Mail size={16} className="text-white/40" />
                                admin@vrilcouture.co.za
                            </li>
                        </ul>
                    </div>

                    {/* My Account */}
                    <div>
                        <h4 className="text-white/70 text-[10px] uppercase mb-6 tracking-[0.6em]">
                            My Account
                        </h4>

                        <ul className="space-y-3">
                            {ACCOUNT_LINKS.map(({ label, to }) => (
                                <li key={label}>
                                    <Link to={to} className="text-white/50 hover:text-white text-sm">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-white/70 text-[10px] uppercase mb-6 tracking-[0.6em]">
                            Shop
                        </h4>

                        <ul className="space-y-3">
                            {SHOP_LINKS.map(({ label, to }) => (
                                <li key={label}>
                                    <Link to={to} className="text-white/50 hover:text-white text-sm">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* PAYMENT SECTION (FIXED POSITION) */}
                <div className="border-t border-white/10 pt-16 mb-16 text-center">
                    <h4 className="text-white/70 text-[10px] uppercase tracking-[0.6em] mb-6">
                        Secure Payment
                    </h4>

                    <ul className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                        {PAYMENT_METHODS.map(({ label, logo }) => (
                            <li
                                key={label}
                                title={label}
                                className="border border-white/10 px-4 py-3 rounded-md hover:border-white/30 transition"
                            >
                                <img
                                    src={logo}
                                    alt={label}
                                    className="h-5 w-auto opacity-70 hover:opacity-100 transition"
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* BOTTOM SECTION */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-white/30 text-xs tracking-[0.3em] uppercase">
                        © {currentYear} Vril Couture. Made with care.
                    </p>

                    <div className="flex gap-8 text-xs tracking-[0.3em] uppercase text-white/30">
                        <Link to="#" className="hover:text-white">Instagram</Link>
                        <Link to="/terms" className="hover:text-white">Terms</Link>
                        <Link to="/returns" className="hover:text-white">Returns</Link>
                    </div>

                </div>

            </div>
        </footer>
    );
};