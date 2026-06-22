import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItem } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import { Button } from '../../components/ui/Button';

export const Cart = () => {
    const navigate = useNavigate();
    const { items, subtotal, itemCount, clearCart, updateQuantity, removeFromCart } = useCart();

    const tax = subtotal * 0.15;
    const shipping = subtotal >= 2550 ? 0 : 100;
    const total = subtotal + tax + shipping;

    if (items.length === 0) {
        return (
            <main className="min-h-[60vh] py-16 md:py-24">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#2C2420] tracking-wide mb-4">
                            Your Cart
                        </h1>
                        <div className="w-12 h-0.5 bg-[#6B5D4F] mb-8" />

                        <svg
                            className="h-24 w-24 text-[#8A8378] mb-6"
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

                        <p className="text-[#8A8378] text-lg mb-6">
                            Your cart is empty
                        </p>
                        <Button onClick={() => navigate('/shop')}>
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="py-8 md:py-12">
            <div className="max-w-[1440px] mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-[#2C2420] tracking-wide mb-4">
                    Your Cart
                </h1>
                <div className="w-12 h-0.5 bg-[#6B5D4F] mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D5C9B9]">
                            <span className="text-sm text-[#8A8378]">
                                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </span>
                            <button
                                onClick={clearCart}
                                className="text-sm text-[#8A8378] hover:text-[#2C2420] transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>
                        <div className="divide-y divide-[#D5C9B9]">
                            {items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    price={item.price}
                                    quantity={item.quantity}
                                    image={item.image_url}
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeFromCart}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#F5F1EA] p-6">
                            <h3 className="text-lg font-medium text-[#2C2420] uppercase tracking-wider mb-4">
                                Order Summary
                            </h3>
                            <CartSummary
                                subtotal={subtotal}
                                tax={tax}
                                shipping={shipping}
                                total={total}
                            />
                            <Button
                                onClick={() => navigate('/checkout')}
                                fullWidth
                                size="lg"
                                className="mt-6"
                            >
                                Proceed to Checkout
                            </Button>
                            <button
                                onClick={() => navigate('/shop')}
                                className="w-full mt-3 text-center text-sm text-[#8A8378] hover:text-[#2C2420] transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};