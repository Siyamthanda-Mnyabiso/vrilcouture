// src/hooks/useDashboardStats.ts
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Order } from '../features/orders/order.types';

export interface DashboardStats {
    totalRevenue: number;
    orderCount: number;
    lowStockCount: number;
    recentOrders: Order[];
}

const LOW_STOCK_THRESHOLD = 5;

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const [ordersRes, lowStockRes, recentRes] = await Promise.all([
                supabase.from('orders').select('total, status'),
                supabase
                    .from('products')
                    .select('id', { count: 'exact', head: true })
                    .lt('stock', LOW_STOCK_THRESHOLD),
                supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5),
            ]);

            if (ordersRes.error) throw ordersRes.error;
            if (lowStockRes.error) throw lowStockRes.error;
            if (recentRes.error) throw recentRes.error;

            const totalRevenue = (ordersRes.data ?? [])
                .filter((o) => o.status !== 'cancelled')
                .reduce((sum, o) => sum + (o.total ?? 0), 0);

            setStats({
                totalRevenue,
                orderCount: ordersRes.data?.length ?? 0,
                lowStockCount: lowStockRes.count ?? 0,
                recentOrders: (recentRes.data ?? []) as Order[],
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    return { stats, loading, error, fetchStats };
}