// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { usersService } from '../services/supabase/users.service';
import type { User } from '../types/user';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await usersService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (id: string, role: 'customer' | 'admin') => {
        setLoading(true);
        try {
            const data = await usersService.updateUserRole(id, role);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating user role');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        setLoading(true);
        try {
            await usersService.deleteUser(id);
            await fetchUsers(); // Refresh list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting user');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        updateUserRole,
        deleteUser,
    };
};