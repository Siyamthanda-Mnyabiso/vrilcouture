import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: {
        size?: string;
        color?: string;
    };
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (newItem) => {
                const { items } = get();
                const existingItem = items.find((item) => item.id === newItem.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === newItem.id
                                ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                ...newItem,
                                quantity: newItem.quantity || 1,
                                image: newItem.image || '',
                            },
                        ],
                    });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);