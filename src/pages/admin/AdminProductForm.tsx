// src/pages/admin/AdminProductForm.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useAdminProductVariants } from '../../hooks/useAdminProductVariants';
import { uploadProductFile } from '../../lib/uploadProductMedia';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { ProductMedia } from '../../features/products/product.types';

interface DraftVariant {
    size: string;
    color: string;
    stock: number;
}

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
    const {
        variants,
        fetchVariants,
        addVariant,
        updateVariant,
        deleteVariant,
    } = useAdminProductVariants();

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

    const [draftVariants, setDraftVariants] = useState<DraftVariant[]>([]);
    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');
    const [newStock, setNewStock] = useState('0');
    const [variantError, setVariantError] = useState<string | null>(null);
    const [addingVariant, setAddingVariant] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (isEditing && id) fetchProductById(id);
    }, [id]);

    useEffect(() => {
        if (isEditing && id) fetchVariants(id);
    }, [id, isEditing]);

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

    const validateNewVariant = (existingPairs: { size: string; color: string }[]) => {
        if (!newSize.trim() || !newColor.trim()) {
            setVariantError('Size and color are both required.');
            return false;
        }
        const duplicate = existingPairs.some(
            (v) => v.size.toLowerCase() === newSize.trim().toLowerCase()
                && v.color.toLowerCase() === newColor.trim().toLowerCase()
        );
        if (duplicate) {
            setVariantError(`"${newSize.trim()} / ${newColor.trim()}" is already added.`);
            return false;
        }
        return true;
    };

    const handleAddVariant = async () => {
        setVariantError(null);

        if (isEditing && id) {
            if (!validateNewVariant(variants)) return;
            setAddingVariant(true);
            try {
                await addVariant(id, {
                    size: newSize.trim(),
                    color: newColor.trim(),
                    stock: parseInt(newStock, 10) || 0,
                });
                setNewSize('');
                setNewColor('');
                setNewStock('0');
            } catch (err) {
                setVariantError(err instanceof Error ? err.message : 'Failed to add variant');
            } finally {
                setAddingVariant(false);
            }
        } else {
            if (!validateNewVariant(draftVariants)) return;
            setDraftVariants((prev) => [
                ...prev,
                { size: newSize.trim(), color: newColor.trim(), stock: parseInt(newStock, 10) || 0 },
            ]);
            setNewSize('');
            setNewColor('');
            setNewStock('0');
        }
    };

    const handleRemoveDraftVariant = (index: number) => {
        setDraftVariants((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateVariantStock = async (variantId: string, newStockValue: number) => {
        try {
            await updateVariant(variantId, { stock: newStockValue });
        } catch (err) {
            console.error('Failed to update variant stock:', err);
        }
    };

    const handleDeleteVariant = async (variantId: string, label: string) => {
        if (!confirm(`Remove the "${label}" variant? This cannot be undone.`)) return;
        try {
            await deleteVariant(variantId);
        } catch (err) {
            console.error('Failed to delete variant:', err);
        }
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

                const firstImage = inserted.find((m) => m.media_type === 'image');
                if (firstImage && !isEditing) {
                    await updateProduct(productId, { image_url: firstImage.url });
                }
            }

            if (!isEditing && draftVariants.length > 0 && productId) {
                for (const dv of draftVariants) {
                    await addVariant(productId, dv);
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

    const variantRows = isEditing ? variants : draftVariants;

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
                        <p className="text-xs text-gray-400 mt-1">
                            Used only if this product has no sizes/colors below.
                        </p>
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

                <div>
                    <label className="block text-sm font-medium mb-2">Sizes & Colors</label>

                    {variantError && <p className="text-sm text-red-600 mb-2">{variantError}</p>}

                    {variantRows.length > 0 && (
                        <div className="border rounded-md divide-y mb-3">
                            {isEditing
                                ? variants.map((v) => (
                                    <div key={v.id} className="flex items-center gap-3 p-3">
                                        <span className="text-sm font-medium w-16">{v.size}</span>
                                        <span className="text-sm text-gray-600 flex-1">{v.color}</span>
                                        <input
                                            type="number"
                                            min={0}
                                            value={v.stock}
                                            onChange={(e) =>
                                                handleUpdateVariantStock(v.id, parseInt(e.target.value, 10) || 0)
                                            }
                                            className="w-20 border rounded px-2 py-1 text-sm"
                                        />
                                        <span className="text-xs text-gray-400">in stock</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteVariant(v.id, `${v.size} / ${v.color}`)}
                                            className="text-red-600 text-sm hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))
                                : draftVariants.map((v, i) => (
                                    <div key={`${v.size}-${v.color}-${i}`} className="flex items-center gap-3 p-3">
                                        <span className="text-sm font-medium w-16">{v.size}</span>
                                        <span className="text-sm text-gray-600 flex-1">{v.color}</span>
                                        <span className="text-sm text-gray-600 w-20">{v.stock} stock</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDraftVariant(i)}
                                            className="text-red-600 text-sm hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}

                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Size</label>
                            <Input value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="M" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Color</label>
                            <Input value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="Charcoal" />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs text-gray-500 mb-1">Stock</label>
                            <Input
                                type="number"
                                min={0}
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                            />
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleAddVariant}
                            isLoading={addingVariant}
                        >
                            Add
                        </Button>
                    </div>

                    {!isEditing && draftVariants.length > 0 && (
                        <p className="text-xs text-gray-400 mt-2">
                            These will be saved when you create the product below.
                        </p>
                    )}
                </div>

                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
                </Button>
            </form>
        </div>
    );
};