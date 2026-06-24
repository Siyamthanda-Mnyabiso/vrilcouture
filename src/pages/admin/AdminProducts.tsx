// src/pages/admin/AdminProducts.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { formatCurrency } from '../../utils/currency';

export const AdminProducts = () => {
    const { products, loading, error, fetchProducts, deleteProduct } = useProducts();

    useEffect(() => {
        fetchProducts({ sortBy: 'newest' });
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        await deleteProduct(id);
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Products</h1>
                <Link to="/admin/products/new">
                    <Button>Add Product</Button>
                </Link>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                    <tr>
                        <th className="p-3">Image</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3" />
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="border-t">
                            <td className="p-3">
                                {p.image_url ? (
                                    <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-100 rounded" />
                                )}
                            </td>
                            <td className="p-3">{p.name}</td>
                            <td className="p-3 text-gray-500">{p.sku ?? '—'}</td>
                            <td className="p-3">{formatCurrency(p.price)}</td>
                            <td className="p-3">{p.stock}</td>
                            <td className="p-3 text-right space-x-2">
                                <Link to={`/admin/products/${p.id}/edit`} className="text-blue-600 hover:underline">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(p.id, p.name)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-6 text-center text-gray-500">
                                No products yet.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};