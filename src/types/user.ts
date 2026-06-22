export interface User {
    id: string;
    email: string;

    full_name: string | null;

    phone?: string | null;

    role: 'customer' | 'admin';

    // optional address fields (your app already uses these)
    address_line1?: string | null;
    address_line2?: string | null;
    city?: string | null;
    postal_code?: string | null;
    province?: string | null;
    country?: string | null;

    created_at?: string;
    updated_at?: string;
}