// src/components/cart/CartItem.tsx
import type { CartItem as CartItemType } from '../../hooks/useCart';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

export const CartItem = ({
                             item,
                             onUpdateQuantity,
                             onRemove,
                         }: CartItemProps) => {
    return (
        <div className="flex items-center gap-4 py-4 border-b border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            <div className="flex-1">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                    R {item.price}
                </p>

                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() =>
                            onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="px-2 py-1 border rounded"
                    >
                        -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                        onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 border rounded"
                    >
                        +
                    </button>

                    <button
                        onClick={() => onRemove(item.id)}
                        className="ml-auto text-red-500 text-sm"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};