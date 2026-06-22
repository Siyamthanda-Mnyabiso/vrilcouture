// src/components/cart/Cart.tsx

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { CartItem } from './CartItem';
import { useCart } from '../../context/CartContext';

export const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity } = useCart();

    const totalPrice = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Cart
                </h3>

                <span className="text-sm text-gray-500">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    Your cart is empty
                </p>
            ) : (
                <>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))}
                    </div>

                    <div className="border-t mt-4 pt-4">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>
                                R{totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};