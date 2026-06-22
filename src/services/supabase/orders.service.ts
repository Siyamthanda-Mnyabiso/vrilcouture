import { supabase } from './client';
import type { Order } from '../../types/order';

export const ordersService = {
    /**
     * Get all orders (admin only)
     */
    async getAll(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*, items:order_items(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get a single order by ID
     */
    async getById(id: string): Promise<Order> {
        const { data, error } = await supabase
            .from('orders')
            .select('*, items:order_items(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) throw new Error('Order not found');
        return data;
    },

    /**
     * Get orders for a specific user
     */
    async getUserOrders(userId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*, items:order_items(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Create a new order
     */
    async create(orderData: {
        user_id: string;
        total: number;
        items: { product_id: string; product_name: string; quantity: number; price: number }[];
    }): Promise<Order> {
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: orderData.user_id,
                status: 'pending',
                total: orderData.total,
            })
            .select()
            .single();

        if (orderError) throw orderError;

        const orderItems = orderData.items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return this.getById(order.id);
    },

    /**
     * Update order status
     */
    async updateStatus(id: string, status: Order['status']): Promise<Order> {
        const { data, error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Cancel an order
     */
    async cancel(id: string): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'cancelled', updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },
};