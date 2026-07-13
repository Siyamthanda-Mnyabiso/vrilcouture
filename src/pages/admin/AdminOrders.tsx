// src/pages/admin/AdminOrders.tsx
import { useEffect, useState } from 'react';
import { useAdminOrders, type OrderStatus } from '../../hooks/useAdminOrders';
import { Loader } from '../../components/ui/Loader';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';

const statusVariant: Record<OrderStatus, 'warning' | 'info' | 'success' | 'error'> = {
    pending: 'warning',
    paid: 'info',
    failed: 'error',
    fulfilled: 'success',
    cancelled: 'error',
};

const statusLabels: Record<OrderStatus, string> = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Not Paid',
    fulfilled: 'Fulfilled',
    cancelled: 'Cancelled',
};

// Payment status (pending/paid/failed) is set exclusively by the
// stitch-webhook function based on real payment confirmation — an admin
// manually selecting "Paid" here would let the DB claim a payment happened
// when it didn't. Only fulfillment-lifecycle transitions are admin-settable.
const updatableStatusOptions: OrderStatus[] = ['fulfilled', 'cancelled'];

export const AdminOrders = () => {
    const { orders, loading, error, fetchOrders, updateOrderStatus } = useAdminOrders();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id: string, status: OrderStatus) => {
        setUpdatingId(id);
        try {
            await updateOrderStatus(id, status);
        } catch (err) {
            console.error('Failed to update order status:', err);
        } finally {
            setUpdatingId(null);
        }
    };

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
                        <th className="p-3 text-gray-500 font-medium">Update Status</th>
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
                            <td className="p-3">
                                <select
                                    value={updatableStatusOptions.includes(order.status) ? order.status : ''}
                                    disabled={updatingId === order.id}
                                    onChange={(e) =>
                                        handleStatusChange(order.id, e.target.value as OrderStatus)
                                    }
                                    className="border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
                                >
                                    {!updatableStatusOptions.includes(order.status) && (
                                        <option value="" disabled>
                                            {statusLabels[order.status]}
                                        </option>
                                    )}
                                    {updatableStatusOptions.map((s) => (
                                        <option key={s} value={s}>
                                            {statusLabels[s]}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-6 text-center text-gray-400">
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