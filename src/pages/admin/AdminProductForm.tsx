// src/pages/admin/AdminProductForm.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { uploadProductFile } from '../../lib/uploadProductMedia';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { ProductMedia } from '../../features/products/product.types';

export const AdminProductForm = () => {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const {
        currentProduct,
        fetchProductById,
        createProduct,
        updateProduct,
        addProductMedia,
        deleteProductMedia,
    } = useProducts();
    const { categories, fetchCategories } = useCategories();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [sku, setSku] = useState('');
    const [brand, setBrand] = useState('');
    const [stock, setStock] = useState('0');
    const [categoryId, setCategoryId] = useState('');
    const [existingMedia, setExistingMedia] = useState<ProductMedia[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
        if (isEditing && id) fetchProductById(id);
    }, [id]);

    useEffect(() => {
        if (isEditing && currentProduct) {
            setName(currentProduct.name);
            setDescription(currentProduct.description ?? '');
            setPrice(String(currentProduct.price));
            setOriginalPrice(currentProduct.original_price ? String(currentProduct.original_price) : '');
            setSku(currentProduct.sku ?? '');
            setBrand(currentProduct.brand ?? '');
            setStock(String(currentProduct.stock));
            setCategoryId(currentProduct.category_id ?? '');
            setExistingMedia(currentProduct.media ?? []);
        }
    }, [currentProduct, isEditing]);

    const handleFilesSelected = (files: FileList | null) => {
        if (!files) return;
        setNewFiles((prev) => [...prev, ...Array.from(files)]);
    };

    const handleRemoveExistingMedia = async (mediaId: string) => {
        await deleteProductMedia(mediaId);
        setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);



        try {
            const input = {
                name,
                description: description || undefined,
                price: parseFloat(price),
                original_price: originalPrice ? parseFloat(originalPrice) : undefined,
                sku: sku || undefined,
                brand: brand || undefined,
                stock: parseInt(stock, 10) || 0,
                category_id: categoryId || undefined,
            };

            let productId = id;

            if (isEditing && productId) {
                await updateProduct(productId, input);
            } else {
                const created = await createProduct(input);
                productId = created.id;
            }

            // Upload any newly added files and attach them as product media
            if (newFiles.length > 0 && productId) {
                const uploaded = await Promise.all(
                    newFiles.map((file) => uploadProductFile(file, productId!))
                );

                const mediaRows = uploaded.map((u, i) => ({
                    media_type: u.type,
                    url: u.url,
                    sort_order: existingMedia.length + i,
                }));

                const inserted = await addProductMedia(productId, mediaRows);

                // Use the first image as the product's main image_url if not editing
                const firstImage = inserted.find((m) => m.media_type === 'image');
                if (firstImage && !isEditing) {
                    await updateProduct(productId, { image_url: firstImage.url });
                }
            }

            navigate('/admin/products');
        } catch (err) {
            console.error('Product save failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">
                {isEditing ? 'Edit Product' : 'Add Product'}
            </h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        className="w-full border rounded-md p-2 text-sm"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Original Price (optional)</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">SKU</label>
                        <Input value={sku} onChange={(e) => setSku(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Brand</label>
                        <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            className="w-full border rounded-md p-2 text-sm"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">No category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Images & Video</label>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) => handleFilesSelected(e.target.files)}
                    />

                    {existingMedia.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {existingMedia.map((m) => (
                                <div key={m.id} className="relative w-20 h-20">
                                    {m.media_type === 'image' ? (
                                        <img src={m.url} className="w-20 h-20 object-cover rounded" />
                                    ) : (
                                        <video src={m.url} className="w-20 h-20 object-cover rounded" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingMedia(m.id)}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {newFiles.length > 0 && (
                        <p className="text-sm text-gray-500 mt-2">{newFiles.length} new file(s) ready to upload</p>
                    )}
                </div>

                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
                </Button>
            </form>
        </div>
    );
};