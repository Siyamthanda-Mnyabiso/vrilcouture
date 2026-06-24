// src/pages/admin/AdminCategories.tsx
import { useEffect, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const AdminCategories = () => {
    const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } =
        useCategories();
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setSubmitting(true);
        try {
            await createCategory({ name: newName.trim() });
            setNewName('');
        } catch (err) {
            console.error('Failed to create category:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (id: string, name: string) => {
        setEditingId(id);
        setEditingName(name);
    };

    const handleUpdate = async () => {
        if (!editingId || !editingName.trim()) return;
        setSubmitting(true);
        try {
            await updateCategory(editingId, { name: editingName.trim() });
            setEditingId(null);
        } catch (err) {
            console.error('Failed to update category:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        await deleteCategory(id);
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-semibold mb-6 text-black">Categories</h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="flex gap-2 mb-6">
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New category name"
                    className="flex-1"
                />
                <Button onClick={handleCreate} isLoading={submitting} disabled={!newName.trim()}>
                    Add
                </Button>
            </div>

            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3">
                        {editingId === cat.id ? (
                            <div className="flex flex-1 gap-2">
                                <Input
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="flex-1"
                                />
                                <Button size="sm" onClick={handleUpdate} isLoading={submitting}>
                                    Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <p className="text-black font-medium">{cat.name}</p>
                                    <p className="text-xs text-gray-400">{cat.slug}</p>
                                </div>
                                <div className="space-x-3">
                                    <button
                                        onClick={() => startEdit(cat.id, cat.name)}
                                        className="text-sm text-black hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id, cat.name)}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {categories.length === 0 && (
                    <p className="p-6 text-center text-gray-400">No categories yet.</p>
                )}
            </div>
        </div>
    );
};