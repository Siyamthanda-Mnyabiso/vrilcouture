import { supabase } from '../supabase/client';
import type { Order } from '../../types/order';

export const ordersService = {
    async getOrders(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .returns<Order[]>();

        if (error) throw error;
        return data || [];
    },

    async getOrderById(orderId: string): Promise<Order | null> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()
            .returns<Order | null>();

        if (error) throw error;
        return data;
    },

    async getOrdersByUser(userId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .returns<Order[]>();

        if (error) throw error;
        return data || [];
    },

    async createOrderItems(orderData: Partial<Order>): Promise<Order> {
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select()
            .single()
            .returns<Order>();

        if (error) throw error;
        return data;
    },

    async updateOrderStatus(orderId: string, status: string): Promise<Order> {
        const { data, error } = await supabase
            .from('orders')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId)
            .select()
            .single()
            .returns<Order>();

        if (error) throw error;
        return data;
    },
};