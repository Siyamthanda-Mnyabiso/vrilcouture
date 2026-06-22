// src/data/mockOrders.ts
import type { Order } from '../features/orders/order.types.tsx';

const now = new Date().toISOString();

export const mockOrders: Order[] = [
    {
        id: 'ord-00000001',
        user_id: 'demo-user',
        status: 'fulfilled',
        total: 2948,
        created_at: now,
        updated_at: now,
        items: [
            { id: 'item-1', order_id: 'ord-00000001', product_id: '1', product_name: 'Classic Leather Jacket', quantity: 1, price: 2499 },
            { id: 'item-2', order_id: 'ord-00000001', product_id: '3', product_name: 'Cotton Crew Tee', quantity: 1, price: 449 },
        ],
    },
    {
        id: 'ord-00000002',
        user_id: 'demo-user',
        status: 'pending',
        total: 1299,
        created_at: now,
        updated_at: now,
        items: [
            { id: 'item-3', order_id: 'ord-00000002', product_id: '5', product_name: 'Merino Wool Sweater', quantity: 1, price: 1299 },
        ],
    },
];