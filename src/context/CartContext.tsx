// src/context/CartContext.tsx

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    image_url?: string;
}

interface CartContextType {
    items: CartItem[];
    totalPrice: number;

    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {

    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });


    useEffect(() => {
        localStorage.setItem(
            'cart',
            JSON.stringify(items)
        );
    }, [items]);


    const totalPrice = items.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );


    const addToCart = (item: CartItem) => {

        setItems(prev => {

            const existing = prev.find(
                x => x.id === item.id
            );

            if (existing) {
                return prev.map(x =>
                    x.id === item.id
                        ? {
                            ...x,
                            quantity:
                                x.quantity + item.quantity
                        }
                        : x
                );
            }

            return [...prev, item];
        });
    };


    const removeFromCart = (id:string) => {
        setItems(prev =>
            prev.filter(item => item.id !== id)
        );
    };


    const updateQuantity = (
        id:string,
        quantity:number
    ) => {

        setItems(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantity
                    }
                    : item
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
                totalPrice,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};



export const useCart = () => {

    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            'useCart must be used inside CartProvider'
        );
    }

    return context;
};