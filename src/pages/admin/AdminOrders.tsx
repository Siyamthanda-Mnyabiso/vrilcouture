// src/pages/admin/AdminOrders.tsx
import { useEffect } from 'react';
import { useAdminOrders, type OrderStatus } from '../../hooks/useAdminOrders';
import { Loader } from '../../components/ui/Loader';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';

// A 'pending' order that never got a webhook confirmation is, from the
// customer's perspective, indistinguishable from one that failed — no money
// was received either way — so both display as "Not Paid".
const statusVariant: Record<OrderStatus, 'warning' | 'info' | 'success' | 'error'> = {
    pending: 'error',
    paid: 'info',
    failed: 'error',
    fulfilled: 'success',
    cancelled: 'error',
};

const statusLabels: Record<OrderStatus, string> = {
    pending: 'Not Paid',
    paid: 'Paid',
    failed: 'Not Paid',
    fulfilled: 'Fulfilled',
    cancelled: 'Cancelled',
};

export const AdminOrders = () => {
    const { orders, loading, error, fetchOrders } = useAdminOrders();

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl">
            <h1 className="text-2xl font-semibold mb-6 text-black">Orders</h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
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
                    {orders.map((order) => (
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
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-6 text-center text-gray-400">
                                No orders yet.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};