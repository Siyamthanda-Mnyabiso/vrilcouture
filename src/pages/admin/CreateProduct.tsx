import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { storageService } from '../../services/supabase/storage.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function CreateProduct() {
    const navigate = useNavigate();
    const { createProduct } = useProducts();
    const { categories, loading: categoriesLoading, fetchCategories } = useCategories();

    useEffect(() => {
        fetchCategories();
    }, []);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [stock, setStock] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            let imageUrl: string | undefined;

            if (imageFile) {
                imageUrl = await storageService.uploadProductImage(imageFile);
            }

            await createProduct({
                name,
                description: description || undefined,
                price: parseFloat(price),
                original_price: originalPrice ? parseFloat(originalPrice) : undefined,
                stock: parseInt(stock, 10),
                category_id: categoryId || undefined,
                image_url: imageUrl,
            });

            navigate('/admin/products');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <h1 className="font-display text-2xl font-black uppercase mb-8">Create Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input type="text" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full border border-black px-3 py-2 focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input type="number" step="0.01" label="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    <Input type="number" step="0.01" label="Original Price (optional)" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
                </div>

                <Input type="number" label="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />

                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        disabled={categoriesLoading}
                        className="w-full border border-black px-3 py-2 focus:outline-none"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Product Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-3 w-32 h-32 object-cover border border-black" />
                    )}
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <Button type="submit" isLoading={submitting} disabled={submitting} fullWidth>
                    Create Product
                </Button>
            </form>
        </div>
    );
}