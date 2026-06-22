import { useEffect, useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { User } from '../../types/user';

export const Customers = () => {
    const { users, loading, fetchUsers, updateUserRole, deleteUser } = useUsers();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRoleChange = async (userId: string, role: 'customer' | 'admin') => {
        await updateUserRole(userId, role);
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await deleteUser(id);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-display text-2xl font-black uppercase">Customers</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {filteredUsers.length} {filteredUsers.length === 1 ? 'customer' : 'customers'}
                    </p>
                </div>
            </div>

            <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-sm px-4 py-2 border border-black mb-6 focus:outline-none"
            />

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="border border-black overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-black">
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Customer</th>
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Email</th>
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Role</th>
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Joined</th>
                            <th className="px-4 py-3 text-right text-xs uppercase tracking-wide">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b border-black last:border-0">
                                <td className="px-4 py-3 font-medium">{user.full_name || 'N/A'}</td>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3">
                                    <span className="text-xs uppercase tracking-wide border border-black px-2 py-1">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsModalOpen(true);
                                            }}
                                            className="hover:opacity-60 transition-opacity"
                                        >
                                            Manage
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:opacity-60 transition-opacity">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    No customers found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manage User">
                {selectedUser && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">User Information</h3>
                            <div className="space-y-1 text-sm">
                                <p>{selectedUser.full_name || 'N/A'}</p>
                                <p className="text-gray-500">{selectedUser.email}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Change Role</h3>
                            <div className="flex gap-3">
                                <Button
                                    variant={selectedUser.role === 'customer' ? 'primary' : 'outline'}
                                    onClick={() => handleRoleChange(selectedUser.id, 'customer')}
                                >
                                    Customer
                                </Button>
                                <Button
                                    variant={selectedUser.role === 'admin' ? 'primary' : 'outline'}
                                    onClick={() => handleRoleChange(selectedUser.id, 'admin')}
                                >
                                    Admin
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-black">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)} fullWidth>
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Customers;