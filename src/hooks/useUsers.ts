import { supabase } from '../supabase/client';
import type { User } from '../../types/user';

export const usersService = {
    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()
            .returns<User | null>();

        if (error) throw error;
        return data;
    },

    async getAllUsers(): Promise<User[]> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .returns<User[]>();

        if (error) throw error;
        return data || [];
    },

    async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()
            .returns<User>();

        if (error) throw error;
        return data;
    },

    async updateUserRole(userId: string, role: 'customer' | 'admin'): Promise<User> {
        return this.updateUserProfile(userId, { role });
    },

    async getUserById(userId: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()
            .returns<User | null>();

        if (error) throw error;
        return data;
    },

    async deleteUser(userId: string): Promise<void> {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) throw error;
    },
};