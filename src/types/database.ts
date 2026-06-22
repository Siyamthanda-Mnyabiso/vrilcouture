export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
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
                };
                Insert: Partial<Database['public']['Tables']['products']['Row']>;
                Update: Partial<Database['public']['Tables']['products']['Row']>;
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    created_at: string;
                };
                Insert: Partial<Database['public']['Tables']['categories']['Row']>;
                Update: Partial<Database['public']['Tables']['categories']['Row']>;
            };
            users: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    phone: string | null;
                    role: 'customer' | 'admin';
                    address_line1: string | null;
                    address_line2: string | null;
                    city: string | null;
                    postal_code: string | null;
                    province: string | null;
                    country: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Partial<Database['public']['Tables']['users']['Row']>;
                Update: Partial<Database['public']['Tables']['users']['Row']>;
            };
            orders: {
                Row: {
                    id: string;
                    user_id: string;
                    status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
                    total: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Partial<Database['public']['Tables']['orders']['Row']>;
                Update: Partial<Database['public']['Tables']['orders']['Row']>;
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    product_id: string | null;
                    product_name: string;
                    quantity: number;
                    price: number;
                };
                Insert: Partial<Database['public']['Tables']['order_items']['Row']>;
                Update: Partial<Database['public']['Tables']['order_items']['Row']>;
            };
        };
    };
}

export interface SupabaseResponse<T> {
    data: T | null;
    error?: any;
}