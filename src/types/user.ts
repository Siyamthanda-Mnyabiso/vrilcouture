export interface User {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    role: 'customer' | 'admin';
    address_line1?: string;
    address_line2?: string;
    city?: string;
    postal_code?: string;
    province?: string;
    country?: string;
    created_at: string;
    updated_at: string;
}