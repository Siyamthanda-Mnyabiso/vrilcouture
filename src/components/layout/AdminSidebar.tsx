// src/components/layout/AdminSidebar.tsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag } from 'lucide-react';

const navItems = [
    { to: '/admin', label: 'Dashboard', end: true, icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/categories', label: 'Categories', icon: Tag },
];

export const AdminSidebar = () => {
    return (
        <aside className="w-56 shrink-0 border-r border-gray-200 bg-white min-h-[calc(100vh-1px)] py-6">
            <div className="px-6 mb-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Admin
                </span>
            </div>
            <nav className="flex flex-col">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
                                    isActive
                                        ? 'bg-black text-white'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                                }`
                            }
                        >
                            <Icon size={16} strokeWidth={2} />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};