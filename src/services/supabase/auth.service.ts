// src/services/supabase/auth.service.ts
import { supabase } from './client';
import type { User } from '../../types/user';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface UserProfile {
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

interface SignUpMetadata {
    full_name?: string;
}

export const authService = {
    async signUp(email: string, password: string, metadata?: SignUpMetadata) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });

        if (error) throw error;
        return data;
    },

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) return null;

            let profile: UserProfile | null = null;
            try {
                const { data: profileData, error: profileError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userData.user.id)
                    .single();

                if (!profileError) {
                    profile = profileData as UserProfile;
                } else if (profileError.code !== 'PGRST116') {
                    console.error('Error fetching user profile:', profileError);
                }
            } catch (profileError) {
                console.debug('Profile fetch error (may be expected):', profileError);
            }

            const email = userData.user.email || '';

            return {
                id: userData.user.id,
                email: email,
                full_name:
                    userData.user.user_metadata?.full_name ||
                    profile?.full_name ||
                    (email ? email.split('@')[0] : '') ||
                    '',
                phone: profile?.phone || '',
                role: (profile?.role as 'customer' | 'admin') || 'customer',
                created_at: profile?.created_at ||
                    (userData.user as any).created_at ||
                    new Date().toISOString(),
                updated_at: profile?.updated_at ||
                    new Date().toISOString(),
            };
        } catch (error) {
            console.error('Error in getCurrentUser:', error);
            return null;
        }
    },

    async updateUser(data: Partial<User>) {
        try {
            const currentUser = await authService.getCurrentUser();
            if (!currentUser) {
                throw new Error('No user logged in');
            }

            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: data.full_name,
                },
            });

            if (authError) throw authError;

            const updateData: {
                full_name?: string | null;
                phone?: string | null;
                role?: 'customer' | 'admin';
                updated_at?: string;
            } = {
                updated_at: new Date().toISOString(),
            };

            if (data.full_name !== undefined) updateData.full_name = data.full_name;
            if (data.phone !== undefined) updateData.phone = data.phone;
            if (data.role !== undefined) updateData.role = data.role;

            const { error: profileError } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', currentUser.id);

            if (profileError) {
                if (profileError.code === '42P01') {
                    console.warn('Users table not found, creating profile...');
                    const insertData: {
                        id: string;
                        email: string;
                        full_name?: string | null;
                        phone?: string | null;
                        role?: 'customer' | 'admin';
                        created_at?: string;
                        updated_at?: string;
                    } = {
                        id: currentUser.id,
                        email: currentUser.email,
                        full_name: data.full_name || currentUser.full_name,
                        phone: data.phone || currentUser.phone,
                        role: data.role || currentUser.role,
                        created_at: currentUser.created_at,
                        updated_at: new Date().toISOString(),
                    };

                    const { error: insertError } = await supabase
                        .from('users')
                        .insert(insertData);

                    if (insertError) {
                        console.error('Error creating user profile:', insertError);
                        throw insertError;
                    }
                } else {
                    console.error('Error updating user profile:', profileError);
                    throw profileError;
                }
            }

            return authService.getCurrentUser();
        } catch (error) {
            console.error('Error in updateUser:', error);
            throw error;
        }
    },

    async resetPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
    },

    async updatePassword(password: string) {
        const { error } = await supabase.auth.updateUser({
            password,
        });

        if (error) throw error;
    },

    onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });

        return {
            unsubscribe: () => {
                data?.subscription?.unsubscribe();
            }
        };
    },
};