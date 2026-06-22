import React from 'react';
import { Minus, Plus, X } from 'lucide-react';

interface CartItemProps {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
                                                      id,
                                                      name,
                                                      price,
                                                      quantity,
                                                      image,
                                                      onUpdateQuantity,
                                                      onRemove,
                                                  }) => {
    return (
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 py-4 border-b border-gray-100">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                {image && (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="flex-1 min-w-[120px]">
                <h4 className="text-sm font-medium text-gray-900 truncate">{name}</h4>
                <p className="text-sm font-semibold text-primary-600 mt-1">
                    R{price.toFixed(2)}
                </p>
            </div>

            <div className="flex items-center gap-2 order-3 sm:order-none ml-[76px] sm:ml-0">
                <button
                    onClick={() => onUpdateQuantity(id, quantity - 1)}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                >
                    <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-gray-900">
          {quantity}
        </span>
                <button
                    onClick={() => onUpdateQuantity(id, quantity + 1)}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                >
                    <Plus className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            <button
                onClick={() => onRemove(id)}
                className="p-1 rounded-md hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600"
                aria-label="Remove item"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};