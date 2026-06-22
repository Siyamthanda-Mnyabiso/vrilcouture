import { useState, useEffect } from 'react';
import { ordersService } from '../services/supabase/orders.service';
import type { Order } from '../types/order';

export const useOrders = (userId?: string) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
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
        };

        fetchOrders();
    }, [userId]);

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

    return {
        orders,
        loading,
        error,
        getOrderById,
        createOrder,
    };
};