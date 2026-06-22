export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    user_id: string;
    status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
    total: number;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
}