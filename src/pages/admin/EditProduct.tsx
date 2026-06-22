import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const EditProduct = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentProduct, loading, fetchProductById, updateProduct } = useProducts();
    const { categories, fetchCategories } = useCategories();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        original_price: '',
        category_id: '',
        stock: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (id) fetchProductById(id);
    }, [id]);

    useEffect(() => {
        if (currentProduct) {
            setFormData({
                name: currentProduct.name || '',
                description: currentProduct.description || '',
                price: String(currentProduct.price || ''),
                original_price: currentProduct.original_price ? String(currentProduct.original_price) : '',
                category_id: currentProduct.category_id || '',
                stock: String(currentProduct.stock || ''),
            });
        }
    }, [currentProduct]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Product name is required';
        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = 'Price must be a positive number';
        }
        if (!formData.stock) newErrors.stock = 'Stock quantity is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !id) return;

        setSubmitting(true);
        try {
            await updateProduct(id, {
                name: formData.name,
                description: formData.description || undefined,
                price: Number(formData.price),
                original_price: formData.original_price ? Number(formData.original_price) : undefined,
                category_id: formData.category_id || undefined,
                stock: Number(formData.stock),
            });
            navigate('/admin/products');
        } catch (err) {
            setErrors({ submit: 'Failed to update product. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="font-display text-2xl font-black uppercase mb-8">Edit Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input label="Product Name" name="name" value={formData.name} onChange={handleInputChange} error={errors.name} required />

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full border border-black px-3 py-2 focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Price (ZAR)" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} error={errors.price} required />
                    <Input label="Original Price (ZAR)" name="original_price" type="number" step="0.01" value={formData.original_price} onChange={handleInputChange} placeholder="For sale items" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="w-full border border-black px-3 py-2 focus:outline-none"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Input label="Stock Quantity" name="stock" type="number" value={formData.stock} onChange={handleInputChange} error={errors.stock} required />

                {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}

                <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={submitting} disabled={submitting}>
                        Update Product
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;