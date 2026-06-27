// src/hooks/useCart.ts
import { useCartStore } from '../store/cart.store';
import type { CartItem } from '../store/cart.store';

export const useCart = () => {
  const {
    items,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    updateStock,
    clearCart,
    getItemCount,
    getSubtotal,
    getTotalItems,
    isEmpty,
    getItem,
    getItemsByProduct,
  } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const totalItems = getTotalItems();
  const isCartEmpty = isEmpty();

  const addToCart = (variant: {
    variantId: string;
    productId: string;
    name: string;
    price: number;
    quantity?: number;
    image_url?: string | null;
    stock: number;
    size: string;
    color: string;
  }) => {
    const cartItem: CartItem = {
      variantId: variant.variantId,
      productId: variant.productId,
      name: variant.name,
      price: variant.price,
      quantity: variant.quantity || 1,
      image_url: variant.image_url || '',
      stock: variant.stock,
      size: variant.size,
      color: variant.color,
    };

    addItem(cartItem);
  };

  return {
    items,
    isHydrated,
    subtotal,
    itemCount,
    totalItems,
    isCartEmpty,
    addToCart,
    addItem,
    removeItem,
    updateQuantity,
    updateStock,
    clearCart,
    getItem,
    getItemsByProduct,
  };
};

export type { CartItem };