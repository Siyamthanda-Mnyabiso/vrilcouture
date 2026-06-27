// src/store/cart.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
    isHydrated: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    updateStock: (variantId: string, stock: number) => void; // New method to update stock
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
    getTotalItems: () => number;
    isEmpty: () => boolean;
    getItem: (variantId: string) => CartItem | undefined;
    getItemsByProduct: (productId: string) => CartItem[];
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isHydrated: false,

            addItem: (item) => {
                // Validate stock before adding
                if (item.quantity > item.stock) {
                    console.warn(`Cannot add ${item.quantity} of ${item.name}. Only ${item.stock} available.`);
                    return;
                }

                set((state) => {
                    const existingItem = state.items.find((i) => i.variantId === item.variantId);

                    if (existingItem) {
                        const newQuantity = existingItem.quantity + item.quantity;

                        // Check if new quantity exceeds stock
                        if (newQuantity > existingItem.stock) {
                            console.warn(`Cannot add ${item.quantity} of ${item.name}. Only ${existingItem.stock} available, you already have ${existingItem.quantity}.`);
                            return state;
                        }

                        return {
                            items: state.items.map((i) =>
                                i.variantId === item.variantId
                                    ? { ...i, quantity: newQuantity }
                                    : i
                            ),
                        };
                    }

                    return {
                        items: [...state.items, { ...item, quantity: item.quantity || 1 }],
                    };
                });
            },

            removeItem: (variantId) => {
                console.trace('🟠 removeItem called for', variantId);
                set((state) => ({
                    items: state.items.filter((item) => item.variantId !== variantId),
                }));
            },

            updateQuantity: (variantId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(variantId);
                    return;
                }

                set((state) => {
                    const item = state.items.find((i) => i.variantId === variantId);

                    // Check if requested quantity exceeds stock
                    if (item && quantity > item.stock) {
                        console.warn(`Cannot set quantity to ${quantity} for ${item.name}. Only ${item.stock} available.`);
                        return state;
                    }

                    return {
                        items: state.items.map((item) =>
                            item.variantId === variantId ? { ...item, quantity } : item
                        ),
                    };
                });
            },

            updateStock: (variantId, stock) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.variantId === variantId
                            ? { ...item, stock }
                            : item
                    ),
                }));
            },

            clearCart: () => {
                console.trace('🔴 clearCart called');
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

            getTotalItems: () => {
                return get().items.length;
            },

            isEmpty: () => {
                return get().items.length === 0;
            },

            getItem: (variantId) => {
                return get().items.find((item) => item.variantId === variantId);
            },

            getItemsByProduct: (productId) => {
                return get().items.filter((item) => item.productId === productId);
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            version: 2,
            migrate: (persistedState: any, version: number) => {
                console.log('🟡 migrate called, stored version:', version, 'persisted state:', persistedState);
                // Version 2: Cart items now keyed by variantId instead of productId
                if (version < 2) {
                    console.warn('🔴 migrate is WIPING cart because version', version, '< 2');
                    return { items: [] };
                }
                return persistedState as CartStore;
            },
            onRehydrateStorage: () => (state) => {
                console.log('🟢 onRehydrateStorage fired, state.items:', state?.items);
                // Fires once localStorage has actually been read (or failed to
                // read). Until this happens, `items` is just the in-memory
                // default ([]) — pages must not treat that as "cart is empty".
                if (state) {
                    state.isHydrated = true;
                }
            },
            // Optional: Partialize to exclude certain fields from persistence
            // partialize: (state) => ({ items: state.items }),
        }
    )
);