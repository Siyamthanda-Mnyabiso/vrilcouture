// src/services/supabase/orders.service.ts
import { supabase } from './client';

export interface Order {
    id: string;
    user_id: string;
    status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
    total: number;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    quantity: number;
    price: number;
}

export interface CreateOrderInput {
    user_id: string;
    status?: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
    total: number;
}

export interface CreateOrderItemInput {
    order_id: string;
    product_id?: string | null;
    product_name: string;
    quantity: number;
    price: number;
}

export const ordersService = {
    async getOrders(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Order[];
    },

    async getOrderById(id: string): Promise<Order | null> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Order;
    },

    async getOrdersByUser(userId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Order[];
    },

    async createOrder(input: CreateOrderInput): Promise<Order> {
        const { data, error } = await supabase
            .from('orders')
            .insert(input)
            .select()
            .single();

        if (error) throw error;
        return data as Order;
    },

    async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
        const { data, error } = await supabase
            .from('orders')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Order;
    },

    async deleteOrder(id: string): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async getOrderItems(orderId: string): Promise<OrderItem[]> {
        const { data, error } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

        if (error) throw error;
        return data as OrderItem[];
    },

    async createOrderItems(inputs: CreateOrderItemInput[]): Promise<OrderItem[]> {
        const { data, error } = await supabase
            .from('order_items')
            .insert(inputs)
            .select();

        if (error) throw error;
        return data as OrderItem[];
    }
};