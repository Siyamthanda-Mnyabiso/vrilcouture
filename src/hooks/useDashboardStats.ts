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
            // Revenue/order count must only reflect orders actually confirmed
            // paid — checkout always creates orders as 'pending', and many
            // never resolve (Stitch sends no webhook for an abandoned
            // payment), so counting anything but paid/fulfilled overstates
            // both numbers with money that was never received.
            const [ordersRes, productsRes, variantsRes, recentRes] = await Promise.all([
                supabase.from('orders').select('total, status').in('status', ['paid', 'fulfilled']),
                supabase.from('products').select('id, stock'),
                supabase.from('product_variants').select('product_id, stock'),
                supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5),
            ]);

            if (ordersRes.error) throw ordersRes.error;
            if (productsRes.error) throw productsRes.error;
            if (variantsRes.error) throw variantsRes.error;
            if (recentRes.error) throw recentRes.error;

            const totalRevenue = (ordersRes.data ?? [])
                .reduce((sum, o) => sum + (o.total ?? 0), 0);

            // products.stock only applies to products with no size/color
            // variants (see AdminProductForm) — for variant-bearing products,
            // real stock lives per-row in product_variants, so a product is
            // "low stock" if any of its variants are, not its unused
            // top-level stock field (which is often left at 0).
            const variantStocksByProduct = new Map<string, number[]>();
            for (const v of variantsRes.data ?? []) {
                const list = variantStocksByProduct.get(v.product_id) ?? [];
                list.push(v.stock);
                variantStocksByProduct.set(v.product_id, list);
            }

            const lowStockCount = (productsRes.data ?? []).filter((p) => {
                const variantStocks = variantStocksByProduct.get(p.id);
                if (variantStocks && variantStocks.length > 0) {
                    return variantStocks.some((s) => s < LOW_STOCK_THRESHOLD);
                }
                return p.stock < LOW_STOCK_THRESHOLD;
            }).length;

            setStats({
                totalRevenue,
                orderCount: ordersRes.data?.length ?? 0,
                lowStockCount,
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