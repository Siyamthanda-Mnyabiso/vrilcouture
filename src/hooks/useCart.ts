// src/hooks/useCart.ts
import { useCartStore } from '../store/cart.store';
import type { CartItem } from '../store/cart.store';

export const useCart = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
  } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  // Enhanced addToCart that can accept different formats
  const addToCart = (product: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    image_url?: string | null;
    stock?: number;
  }) => {
    // Create a properly formatted CartItem with all required fields
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
      image_url: product.image_url || '', // Convert null to empty string
      stock: product.stock || 0
    };

    addItem(cartItem);
  };

  return {
    items,
    subtotal,
    itemCount,
    addToCart,    // Flexible function for components
    addItem,      // Original function for advanced use
    removeItem,
    updateQuantity,
    clearCart,
  };
};

export type { CartItem };