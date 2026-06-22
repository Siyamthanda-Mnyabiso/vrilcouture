// src/context/CartContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
}

interface CartContextType {
    items: CartItem[];
    subtotal: number;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('cart');
        if (stored) setItems(JSON.parse(stored));
    }, []);

    // save to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const addToCart = (item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setItems(prev =>
            prev.map(i =>
                i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                subtotal,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};