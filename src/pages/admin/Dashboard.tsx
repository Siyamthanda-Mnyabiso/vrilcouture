import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import { useUsers } from '../../hooks/useUsers';

export const Dashboard = () => {
    const { user } = useAuth();
    const { orders, fetchOrders } = useOrders();
    const { products, fetchProducts } = useProducts();
    const { fetchUsers } = useUsers();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchOrders(), fetchProducts(), fetchUsers()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const lowStockProducts = products.filter((p) => p.stock <= 5).length;

    const stats = [
        {
            label: 'Total Revenue',
            value: new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(totalRevenue),
        },
        { label: 'Total Orders', value: orders.length },
        { label: 'Pending Orders', value: pendingOrders },
        { label: 'Low Stock Items', value: lowStockProducts },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="font-display text-2xl font-black uppercase">Dashboard</h1>
                <p className="text-gray-500 mt-1 text-sm">Welcome back, {user?.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="border border-black p-5">
                        <p className="text-xs uppercase tracking-wide text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link to="/admin/products/create" className="border border-black p-5 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium mb-1">Add New Product</h3>
                    <p className="text-sm text-gray-500">Create a new product listing</p>
                </Link>
                <Link to="/admin/orders" className="border border-black p-5 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium mb-1">View Orders</h3>
                    <p className="text-sm text-gray-500">Manage customer orders</p>
                </Link>
                <Link to="/admin/categories" className="border border-black p-5 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium mb-1">Manage Categories</h3>
                    <p className="text-sm text-gray-500">Update store categories</p>
                </Link>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-lg font-black uppercase">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-sm hover:opacity-60 transition-opacity">
                        View All →
                    </Link>
                </div>
                <div className="border border-black overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-black">
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Order</th>
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Total</th>
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="border-b border-black last:border-0">
                                <td className="px-4 py-3">#{order.id.slice(0, 8)}</td>
                                <td className="px-4 py-3 font-medium">
                                    {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(order.total)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-xs uppercase tracking-wide border border-black px-2 py-1">
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                    No orders yet
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;