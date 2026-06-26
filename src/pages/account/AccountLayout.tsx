// src/pages/account/AccountLayout.tsx

import { NavLink, Outlet } from 'react-router-dom';
import { UserCog, Package, MapPin } from 'lucide-react';

const accountNav = [
    { to: '/account', label: 'Profile', icon: UserCog, end: true },
    { to: '/account/orders', label: 'Orders', icon: Package, end: false },
    { to: '/account/addresses', label: 'Addresses', icon: MapPin, end: false },
];

export function AccountLayout() {
    return (
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12">

            {/* SIDEBAR */}
            <aside>
                <h1 className="font-display text-2xl uppercase tracking-tight mb-8">
                    My Account
                </h1>

                <nav className="flex flex-col gap-1">
                    {accountNav.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 text-sm border transition-colors ${
                                    isActive
                                        ? 'bg-black text-white border-black'
                                        : 'border-transparent hover:bg-gray-100'
                                }`
                            }
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* PAGE CONTENT */}
            <section>
                <Outlet />
            </section>

        </div>
    );
}

export default AccountLayout;