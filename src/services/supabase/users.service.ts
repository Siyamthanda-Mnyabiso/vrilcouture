import { supabase } from './client';
import type { User } from '../../types/user';

export const usersService = {
    /**
     * Get all users (admin only)
     */
    async getAll(): Promise<User[]> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get a single user by ID
     */
    async getById(id: string): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) throw new Error('User not found');
        return data;
    },

    /**
     * Get a user by email
     */
    async getByEmail(email: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    },

    /**
     * Create a new user profile
     */
    async create(userData: Partial<User>): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .insert({
                id: userData.id,
                email: userData.email,
                full_name: userData.full_name,
                phone: userData.phone,
                role: userData.role || 'customer',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update a user profile
     */
    async update(id: string, userData: Partial<User>): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .update({
                full_name: userData.full_name,
                phone: userData.phone,
                role: userData.role,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update user role (admin only)
     */
    async updateRole(id: string, role: string): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .update({
                role,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a user
     */
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Get user statistics
     */
    async getStats() {
        const { count: totalUsers, error: countError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        const { count: adminUsers, error: adminError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'admin');

        if (adminError) throw adminError;

        return {
            total: totalUsers || 0,
            admins: adminUsers || 0,
            customers: (totalUsers || 0) - (adminUsers || 0),
        };
    },
};