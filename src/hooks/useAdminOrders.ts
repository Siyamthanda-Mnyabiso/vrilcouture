// src/hooks/useAdminOrders.ts
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Order } from '../features/orders/order.types';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'fulfilled' | 'cancelled';

export function useAdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });
            if (fetchError) throw fetchError;
            setOrders((data ?? []) as Order[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderItems = async (orderId: string) => {
        const { data, error: fetchError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);
        if (fetchError) throw fetchError;
        return data ?? [];
    };

    const updateOrderStatus = async (id: string, status: OrderStatus) => {
        const { data, error: updateError } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (updateError) throw updateError;
        setOrders((prev) => prev.map((o) => (o.id === id ? (data as Order) : o)));
        return data as Order;
    };

    return {
        orders,
        loading,
        error,
        fetchOrders,
        fetchOrderItems,
        updateOrderStatus,
    };
}