// src/store/cart.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    variantId: string;   // unique key for this cart line (product_variants.id)
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
    stock: number;        // stock of this specific variant
    size: string;
    color: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                set((state) => {
                    const existingItem = state.items.find((i) => i.variantId === item.variantId);

                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.variantId === item.variantId
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }

                    return {
                        items: [...state.items, item],
                    };
                });
            },

            removeItem: (variantId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.variantId !== variantId),
                }));
            },

            updateQuantity: (variantId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(variantId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.variantId === variantId ? { ...item, quantity } : item
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [] });
            },

            getItemCount: () => {
                const state = get();
                return state.items.reduce((sum, item) => sum + item.quantity, 0);
            },

            getSubtotal: () => {
                const state = get();
                return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
            version: 2, // bump from implicit v1 — old persisted carts (keyed by product id) are incompatible
            migrate: () => ({ items: [] }), // safest option: old shape can't be mapped to variants, so clear it
        }
    )
);