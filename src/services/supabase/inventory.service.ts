import { supabase } from './client';

export const inventoryService = {
    /**
     * Get inventory for a specific product
     */
    async getProductInventory(productId: string): Promise<number> {
        const { data, error } = await supabase
            .from('products')
            .select('inventory_count')
            .eq('id', productId)
            .single();

        if (error) throw error;
        return data?.inventory_count || 0;
    },

    /**
     * Update inventory for a product
     */
    async updateInventory(productId: string, quantity: number): Promise<void> {
        const { error } = await supabase
            .from('products')
            .update({
                inventory_count: quantity,
                updated_at: new Date().toISOString(),
            })
            .eq('id', productId);

        if (error) throw error;
    },

    /**
     * Decrement inventory (atomic operation)
     */
    async decrementInventory(productId: string, quantity: number): Promise<void> {
        // Use RPC function for atomic decrement
        const { error } = await supabase.rpc('decrement_inventory', {
            product_id: productId,
            quantity: quantity,
        });

        if (error) throw error;
    },

    /**
     * Increment inventory (atomic operation)
     */
    async incrementInventory(productId: string, quantity: number): Promise<void> {
        // Use RPC function for atomic increment
        const { error } = await supabase.rpc('increment_inventory', {
            product_id: productId,
            quantity: quantity,
        });

        if (error) throw error;
    },

    /**
     * Check if a product is in stock
     */
    async isInStock(productId: string, quantity: number = 1): Promise<boolean> {
        const currentStock = await this.getProductInventory(productId);
        return currentStock >= quantity;
    },

    /**
     * Get low stock products
     */
    async getLowStock(threshold: number = 5): Promise<Array<{ id: string; name: string; inventory_count: number }>> {
        const { data, error } = await supabase
            .from('products')
            .select('id, name, inventory_count')
            .lte('inventory_count', threshold)
            .gt('inventory_count', 0)
            .order('inventory_count', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get out of stock products
     */
    async getOutOfStock(): Promise<Array<{ id: string; name: string; inventory_count: number }>> {
        const { data, error } = await supabase
            .from('products')
            .select('id, name, inventory_count')
            .eq('inventory_count', 0)
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    },
};