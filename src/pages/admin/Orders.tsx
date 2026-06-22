import { useEffect, useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { Modal } from '../../components/ui/Modal';

const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'fulfilled', 'cancelled'] as const;

export const Orders = () => {
    const { orders, loading, fetchOrders, updateOrderStatus } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState<typeof orders[number] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = filter === 'all' ? orders : orders.filter((order) => order.status === filter);

    const handleViewOrder = (order: typeof orders[number]) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleStatusChange = async (orderId: string, status: string) => {
        const updated = await updateOrderStatus(orderId, status);
        if (selectedOrder?.id === orderId) {
            setSelectedOrder({ ...selectedOrder, ...updated });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-display text-2xl font-black uppercase">Orders</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
                    </p>
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-black focus:outline-none"
                >
                    <option value="all">All Orders</option>
                    {statusOptions.map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="border border-black overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-black">
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Order</th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Date</th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Total</th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Status</th>
                        <th className="px-4 py-3 text-right text-xs uppercase tracking-wide">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-black last:border-0">
                            <td className="px-4 py-3 font-medium">#{order.id.slice(0, 8)}</td>
                            <td className="px-4 py-3 text-gray-500">
                                {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3 font-medium">R{(order.total || 0).toFixed(2)}</td>
                            <td className="px-4 py-3">
                                    <span className="text-xs uppercase tracking-wide border border-black px-2 py-1">
                                        {order.status || 'pending'}
                                    </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button onClick={() => handleViewOrder(order)} className="hover:opacity-60 transition-opacity">
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                No orders found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Order #${selectedOrder?.id.slice(0, 8) || ''}`}>
                {selectedOrder && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Status</h4>
                            <select
                                value={selectedOrder.status || 'pending'}
                                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                className="w-full px-3 py-2 border border-black text-sm focus:outline-none"
                            >
                                {statusOptions.map((s) => (
                                    <option key={s} value={s}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Items</h4>
                            <div className="space-y-2">
                                {selectedOrder.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between text-sm border-b border-black pb-2">
                                        <span>{item.quantity}× {item.product_name}</span>
                                        <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-black flex items-center justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>R{(selectedOrder.total || 0).toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders;