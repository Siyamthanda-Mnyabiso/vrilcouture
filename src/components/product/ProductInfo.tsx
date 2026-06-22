// src/components/product/ProductInfo.tsx
import { useCart } from '../../hooks/useCart';
import type { Product } from '../../features/products/product.types';

interface ProductInfoProps {
    product: Product;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url || '',
            stock: product.stock
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <button
                onClick={handleAddToCart}
                className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
            >
                Add to Cart
            </button>
        </div>
    );
};