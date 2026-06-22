import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Button } from '../../components/ui/Button';

export const Products = () => {
    const { products, loading, fetchProducts, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-display text-2xl font-black uppercase">Products</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    </p>
                </div>
                <Link to="/admin/products/create">
                    <Button>Add Product</Button>
                </Link>
            </div>

            <input
                type="text"
                placeholder="Search products..."
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
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Product</th>
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Price</th>
                            <th className="px-4 py-3 text-left text-xs uppercase tracking-wide">Stock</th>
                            <th className="px-4 py-3 text-right text-xs uppercase tracking-wide">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b border-black last:border-0">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-14 bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageOff className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                        <p className="font-medium">{product.name}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3">R{product.price}</td>
                                <td className="px-4 py-3">{product.stock}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            to={`/admin/products/edit/${product.id}`}
                                            className="hover:opacity-60 transition-opacity"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:opacity-60 transition-opacity"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Products;