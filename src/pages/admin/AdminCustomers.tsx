// src/pages/admin/AdminCustomers.tsx
import { useEffect, useState } from 'react';
import { useAdminCustomers } from '../../hooks/useAdminCustomers';
import { Loader } from '../../components/ui/Loader';
import { Badge } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/dates';

export const AdminCustomers = () => {
    const { customers, loading, error, fetchCustomers, updateCustomerRole } = useAdminCustomers();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleRoleToggle = async (id: string, currentRole: 'customer' | 'admin') => {
        const nextRole = currentRole === 'admin' ? 'customer' : 'admin';
        if (!confirm(`Change this user's role to "${nextRole}"?`)) return;
        setUpdatingId(id);
        try {
            await updateCustomerRole(id, nextRole);
        } catch (err) {
            console.error('Failed to update role:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl">
            <h1 className="text-2xl font-semibold mb-6 text-black">Customers</h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                    <tr>
                        <th className="p-3 text-gray-500 font-medium">Name</th>
                        <th className="p-3 text-gray-500 font-medium">Email</th>
                        <th className="p-3 text-gray-500 font-medium">Role</th>
                        <th className="p-3 text-gray-500 font-medium">Joined</th>
                        <th className="p-3 text-gray-500 font-medium" />
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((c) => (
                        <tr key={c.id} className="border-t border-gray-200">
                            <td className="p-3 text-black">{c.full_name ?? '—'}</td>
                            <td className="p-3 text-gray-500">{c.email}</td>
                            <td className="p-3">
                                <Badge variant={c.role === 'admin' ? 'info' : 'default'} size="sm">
                                    {c.role}
                                </Badge>
                            </td>
                            <td className="p-3 text-black">
                                {c.created_at ? formatDateTime(c.created_at) : '—'}
                            </td>
                            <td className="p-3 text-right">
                                <button
                                    onClick={() => handleRoleToggle(c.id, c.role)}
                                    disabled={updatingId === c.id}
                                    className="text-sm text-black hover:underline disabled:opacity-50"
                                >
                                    {c.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {customers.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-6 text-center text-gray-400">
                                No customers yet.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};