// src/hooks/useAdminCustomers.ts
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types/user';

export function useAdminCustomers() {
    const [customers, setCustomers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });
            if (fetchError) throw fetchError;
            setCustomers((data ?? []) as User[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const updateCustomerRole = async (id: string, role: 'customer' | 'admin') => {
        const { data, error: updateError } = await supabase
            .from('users')
            .update({ role, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (updateError) throw updateError;
        setCustomers((prev) => prev.map((c) => (c.id === id ? (data as User) : c)));
        return data as User;
    };

    return {
        customers,
        loading,
        error,
        fetchCustomers,
        updateCustomerRole,
    };
}