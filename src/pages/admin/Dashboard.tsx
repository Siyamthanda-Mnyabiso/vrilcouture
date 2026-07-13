// src/pages/admin/Dashboard.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, AlertTriangle, ArrowRight } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { Loader } from '../../components/ui/Loader';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';

const statusVariant = {
    pending: 'warning',
    paid: 'info',
    failed: 'error',
    fulfilled: 'success',
    cancelled: 'error',
} as const;

const statusLabels = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Not Paid',
    fulfilled: 'Fulfilled',
    cancelled: 'Cancelled',
} as const;

export const Dashboard = () => {
    const { stats, loading, error, fetchStats } = useDashboardStats();

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    if (!stats) return null;

    return (
        <div className="max-w-6xl">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="border border-gray-200 rounded-lg p-5 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs uppercase tracking-widest text-gray-400">
                            Total Revenue
                        </p>
                        <span className="text-sm font-semibold text-gray-400 w-4 h-4 flex items-center justify-center">
                            R
                        </span>
                    </div>
                    <p className="text-2xl font-semibold text-black">{formatCurrency(stats.totalRevenue)}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-5 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs uppercase tracking-widest text-gray-400">
                            Orders
                        </p>
                        <ShoppingBag size={16} className="text-gray-400" />
                    </div>
                    <p className="text-2xl font-semibold text-black">{stats.orderCount}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-5 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs uppercase tracking-widest text-gray-400">
                            Low Stock Items
                        </p>
                        <AlertTriangle
                            size={16}
                            className={stats.lowStockCount > 0 ? 'text-amber-500' : 'text-gray-400'}
                        />
                    </div>
                    <p className="text-2xl font-semibold text-black">
                        {stats.lowStockCount}
                        {stats.lowStockCount > 0 && (
                            <Badge variant="warning" size="sm" className="ml-2 align-middle">
                                Attention
                            </Badge>
                        )}
                    </p>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-black">Recent Orders</h2>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                    <tr>
                        <th className="p-3 text-gray-500 font-medium">Order ID</th>
                        <th className="p-3 text-gray-500 font-medium">Date</th>
                        <th className="p-3 text-gray-500 font-medium">Status</th>
                        <th className="p-3 text-gray-500 font-medium">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stats.recentOrders.map((order) => (
                        <tr key={order.id} className="border-t border-gray-200">
                            <td className="p-3 font-mono text-xs text-gray-500">
                                {order.id.slice(0, 8)}
                            </td>
                            <td className="p-3 text-black">{formatDateTime(order.created_at)}</td>
                            <td className="p-3">
                                <Badge variant={statusVariant[order.status]} size="sm">
                                    {statusLabels[order.status]}
                                </Badge>
                            </td>
                            <td className="p-3 text-black">{formatCurrency(order.total)}</td>
                        </tr>
                    ))}
                    {stats.recentOrders.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-6 text-center text-gray-400">
                                No orders yet.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6">
                <Link
                    to="/admin/products"
                    className="inline-flex items-center gap-1 text-sm text-black font-medium hover:underline"
                >
                    Manage products <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
};