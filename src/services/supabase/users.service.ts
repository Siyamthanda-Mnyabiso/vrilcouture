// src/services/supabase/users.service.ts
import { supabase } from './client';

export interface User {
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
}

export interface UpdateUserInput {
    full_name?: string | null;
    phone?: string | null;
    role?: 'customer' | 'admin';
    address_line1?: string | null;
    address_line2?: string | null;
    city?: string | null;
    postal_code?: string | null;
    province?: string | null;
    country?: string | null;
}

export const usersService = {
    async getAllUsers(): Promise<User[]> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as User[];
    },

    async getUserById(id: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as User;
    },

    async updateUser(id: string, input: UpdateUserInput): Promise<User> {
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (input.full_name !== undefined) updateData.full_name = input.full_name;
        if (input.phone !== undefined) updateData.phone = input.phone;
        if (input.role !== undefined) updateData.role = input.role;
        if (input.address_line1 !== undefined) updateData.address_line1 = input.address_line1;
        if (input.address_line2 !== undefined) updateData.address_line2 = input.address_line2;
        if (input.city !== undefined) updateData.city = input.city;
        if (input.postal_code !== undefined) updateData.postal_code = input.postal_code;
        if (input.province !== undefined) updateData.province = input.province;
        if (input.country !== undefined) updateData.country = input.country;

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as User;
    },

    async deleteUser(id: string): Promise<void> {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async updateUserRole(id: string, role: 'customer' | 'admin'): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .update({
                role,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as User;
    }
};