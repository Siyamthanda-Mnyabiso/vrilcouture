import { useState } from 'react';
import { usersService } from '../services/supabase/users.service';
import type { User } from '../types/user';

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await usersService.getAll();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (id: string, role: 'customer' | 'admin') => {
        const updated = await usersService.updateRole(id, role);
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        return updated;
    };

    const deleteUser = async (id: string) => {
        await usersService.delete(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    return { users, loading, error, fetchUsers, updateUserRole, deleteUser };
}