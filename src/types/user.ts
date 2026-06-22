export interface User {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface UserProfile {
    id: string;
    full_name: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    avatar_url?: string | null;
    role?: 'user' | 'admin';
}