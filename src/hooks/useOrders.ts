import { useState, useEffect, useCallback } from 'react';
import { ordersService } from '../services/supabase/orders.service';
import type { Order } from '../types/order';

export const useOrders = (userId?: string) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            let data: Order[];

            if (userId) {
                data = await ordersService.getOrdersByUser(userId);
            } else {
                data = await ordersService.getOrders();
            }

            setOrders(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const fetchUserOrders = async (userId: string) => {
        try {
            setLoading(true);
            const data = await ordersService.getOrdersByUser(userId);
            setOrders(data);
            setError(null);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user orders');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getOrderById = async (orderId: string) => {
        try {
            setLoading(true);
            const order = await ordersService.getOrderById(orderId);
            setError(null);
            return order;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (orderData: Partial<Order>) => {
        try {
            setLoading(true);
            const newOrder = await ordersService.createOrderItems(orderData);
            setError(null);
            return newOrder;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create order');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            setLoading(true);
            const updated = await ordersService.updateOrderStatus(orderId, status);
            setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
            setError(null);
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update order status');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        loading,
        error,
        fetchOrders,
        fetchUserOrders,
        getOrderById,
        createOrder,
        updateOrderStatus,
    };
};