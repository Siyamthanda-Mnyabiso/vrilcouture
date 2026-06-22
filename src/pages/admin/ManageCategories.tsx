import { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export const ManageCategories = () => {
    const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (category: { id: string; name: string }) => {
        setEditingCategory(category);
        setName(category.name);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            await deleteCategory(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name) {
            setError('Category name is required');
            return;
        }

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, { name });
            } else {
                await createCategory({ name });
            }
            setIsModalOpen(false);
            setEditingCategory(null);
            setName('');
        } catch (err) {
            setError('Failed to save category');
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-display text-2xl font-black uppercase">Categories</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingCategory(null);
                        setName('');
                        setIsModalOpen(true);
                    }}
                >
                    Add Category
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="border border-black overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-black">
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Category</th>
                            <th className="px-4 py-3 text-right text-xs uppercase tracking-wide">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-b border-black last:border-0">
                                <td className="px-4 py-3 font-medium">{category.name}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button onClick={() => handleEdit(category)} className="hover:opacity-60 transition-opacity">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:opacity-60 transition-opacity">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                                    No categories found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Create Category'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Category Name" value={name} onChange={(e) => setName(e.target.value)} required />

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{editingCategory ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageCategories;