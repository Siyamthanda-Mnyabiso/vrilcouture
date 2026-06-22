import { useEffect } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/ui/Loader';

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    paid: 'Paid',
    processing: 'Processing',
    shipped: 'Shipped',
    fulfilled: 'Fulfilled',
    cancelled: 'Cancelled',
};

export default function AccountOrders() {
    const { user } = useAuth();
    const { orders, loading, error, fetchUserOrders } = useOrders();

    useEffect(() => {
        if (user?.id) {
            fetchUserOrders(user.id);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Loader size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <main className="max-w-3xl mx-auto py-16 px-6">
                <p className="text-red-600 text-sm">{error}</p>
            </main>
        );
    }

    return (
        <main className="max-w-3xl mx-auto py-16 px-6">
            <h1 className="font-display text-2xl font-black uppercase mb-8">Orders</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="border border-black p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium">
                                    Order #{order.id.slice(0, 8)}
                                </p>
                                <span className="text-xs uppercase tracking-wide border border-black px-2 py-1">
                                    {statusLabels[order.status || 'pending'] || order.status}
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 mb-3">
                                {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                            </p>

                            {order.items && order.items.length > 0 && (
                                <ul className="text-sm space-y-1 mb-3">
                                    {order.items.map((item: any) => (
                                        <li key={item.id} className="flex justify-between">
                                            <span>{item.product_name} × {item.quantity}</span>
                                            <span>R{(item.price || 0).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <p className="text-sm font-bold text-right">
                                Total: R{(order.total || 0).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}