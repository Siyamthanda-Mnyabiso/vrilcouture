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

  return {
    items,
    subtotal,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};

export type { CartItem };