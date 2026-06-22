import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Shirt, FolderOpen, Package, Users } from 'lucide-react';

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const AdminSidebar = ({ isOpen = true, onClose }: AdminSidebarProps) => {
    const navItems = [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Products', path: '/admin/products', icon: Shirt },
        { label: 'Categories', path: '/admin/categories', icon: FolderOpen },
        { label: 'Orders', path: '/admin/orders', icon: Package },
        { label: 'Customers', path: '/admin/customers', icon: Users },
    ];

    const sidebarContent = (
        <nav className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-white/20">
                <h2 className="font-display text-white text-xl font-black uppercase tracking-wider">
                    Admin
                </h2>
                <p className="text-gray-400 text-sm mt-1">Manage your store</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 text-sm font-medium uppercase tracking-wide transition-colors
                                ${isActive
                                ? 'bg-white text-black'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {isOpen && <span>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </div>

            {/* Footer */}
            {isOpen && (
                <div className="p-6 border-t border-white/20">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                        Vril Couture v1.0
                    </p>
                </div>
            )}
        </nav>
    );

    // Mobile version (slide-in)
    if (!isOpen) {
        return (
            <>
                <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
                <div className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-black shadow-xl animate-in slide-in-from-left duration-300">
                    {sidebarContent}
                </div>
            </>
        );
    }

    // Desktop version
    return (
        <aside className="w-64 min-h-screen bg-black border-r border-white/20 sticky top-0">
            {sidebarContent}
        </aside>
    );
};