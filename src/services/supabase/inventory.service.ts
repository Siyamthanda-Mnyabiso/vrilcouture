// src/services/supabase/inventory.service.ts
import { supabase } from './client';

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    original_price: number | null;
    image_url: string | null;
    category_id: string | null;
    brand: string | null;
    sku: string | null;
    stock: number;
    created_at: string;
    updated_at: string;
}

export const inventoryService = {
    async updateStock(productId: string, quantity: number): Promise<Product> {
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', productId)
            .single();

        if (fetchError) throw fetchError;

        const newStock = (product?.stock || 0) + quantity;

        const { data, error } = await supabase
            .from('products')
            .update({
                stock: newStock,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId)
            .select()
            .single();

        if (error) throw error;
        return data as Product;
    },

    async checkStock(productId: string): Promise<number> {
        const { data, error } = await supabase
            .from('products')
            .select('stock')
            .eq('id', productId)
            .single();

        if (error) throw error;
        return data?.stock || 0;
    },

    async reserveStock(productId: string, quantity: number): Promise<boolean> {
        const currentStock = await inventoryService.checkStock(productId);

        if (currentStock < quantity) {
            return false;
        }

        await inventoryService.updateStock(productId, -quantity);
        return true;
    }
};