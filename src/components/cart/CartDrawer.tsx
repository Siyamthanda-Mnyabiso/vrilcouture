import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { items, subtotal, itemCount, clearCart } = useCart();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        onClose();
        navigate('/shop');
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/50"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#F5F1EA] shadow-xl animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#D5C9B9]">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-medium text-[#2C2420] uppercase tracking-wider">
                            Cart
                        </h2>
                        <span className="text-sm text-[#8A8378]">
              ({itemCount} items)
            </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {items.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-sm text-[#8A8378] hover:text-[#2C2420] transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-[#8A8378] hover:text-[#2C2420] transition-colors"
                            aria-label="Close cart"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="square" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <svg
                                className="h-16 w-16 text-[#8A8378] mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="square"
                                    strokeLinejoin="round"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <p className="text-[#2C2420] text-lg font-medium mb-2">
                                Your cart is empty
                            </p>
                            <p className="text-[#8A8378] text-sm mb-6">
                                Browse our collection and add items you love.
                            </p>
                            <button
                                onClick={handleContinueShopping}
                                className="px-8 py-3 bg-[#6B5D4F] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#5A4D40] transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-[#D5C9B9] p-6">
                        <CartSummary
                            subtotal={subtotal}
                            tax={subtotal * 0.15}
                            shipping={subtotal >= 2550 ? 0 : 100}
                            total={subtotal + (subtotal * 0.15) + (subtotal >= 2550 ? 0 : 100)}
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleContinueShopping}
                                className="flex-1 px-4 py-3 border border-[#D5C9B9] text-[#2C2420] text-sm font-medium uppercase tracking-wider hover:bg-[#F5F1EA] transition-colors"
                            >
                                Continue
                            </button>
                            <button
                                onClick={handleCheckout}
                                className="flex-1 px-4 py-3 bg-[#6B5D4F] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#5A4D40] transition-colors"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};