import { useState } from 'react';
import { ordersService } from '../services/supabase/orders.service';
import type { Order } from '../types/order';

interface CreateOrderInput {
    user_id: string;
    total: number;
    items: { product_id: string; product_name: string; quantity: number; price: number }[];
}

interface UseOrdersReturn {
    orders: Order[];
    currentOrder: Order | null;
    loading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    fetchOrderById: (id: string) => Promise<void>;
    fetchUserOrders: (userId: string) => Promise<void>;
    createOrder: (data: CreateOrderInput) => Promise<Order>;
    updateOrderStatus: (id: string, status: Order['status']) => Promise<Order>;
    cancelOrder: (id: string) => Promise<void>;
}

export const useOrders = (): UseOrdersReturn => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ordersService.getAll();
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderById = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await ordersService.getById(id);
            setCurrentOrder(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserOrders = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await ordersService.getUserOrders(userId);
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user orders');
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (data: CreateOrderInput) => {
        setError(null);
        try {
            const newOrder = await ordersService.create(data);
            setOrders((prev) => [newOrder, ...prev]);
            return newOrder;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create order');
            throw err;
        }
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        setError(null);
        try {
            const updated = await ordersService.updateStatus(id, status);
            setOrders((prev) =>
                prev.map((order) => (order.id === id ? { ...order, ...updated } : order))
            );
            if (currentOrder?.id === id) {
                setCurrentOrder({ ...currentOrder, ...updated });
            }
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update order status');
            throw err;
        }
    };

    const cancelOrder = async (id: string) => {
        setError(null);
        try {
            await ordersService.cancel(id);
            setOrders((prev) =>
                prev.map((order) => (order.id === id ? { ...order, status: 'cancelled' } : order))
            );
            if (currentOrder?.id === id) {
                setCurrentOrder({ ...currentOrder, status: 'cancelled' });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel order');
            throw err;
        }
    };

    return {
        orders,
        currentOrder,
        loading,
        error,
        fetchOrders,
        fetchOrderById,
        fetchUserOrders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
    };
};