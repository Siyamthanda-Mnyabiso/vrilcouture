import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CartSummary } from '../../components/cart/CartSummary';

export const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, subtotal, clearCart } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'South Africa',
    });

    const tax = subtotal * 0.15;
    const shipping = subtotal >= 2550 ? 0 : 100;
    const total = subtotal + tax + shipping;

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);

        try {
            if (!formData.email || !formData.firstName || !formData.lastName || !formData.address) {
                throw new Error('Please fill in all required fields');
            }

            // TEMP ORDER FLOW (NO PAYMENT GATEWAY)
            await new Promise((resolve) => setTimeout(resolve, 1000));

            clearCart();
            navigate('/order-success');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <main className="py-8 md:py-12">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C2420] tracking-wide mb-4">
                            Checkout
                        </h1>
                        <div className="w-12 h-0.5 bg-[#6B5D4F] mb-8" />

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3">
                                    {error}
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-medium uppercase mb-4">
                                    Contact Information
                                </h3>

                                <div className="space-y-4">
                                    <Input
                                        type="email"
                                        name="email"
                                        label="Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />

                                    <Input
                                        type="tel"
                                        name="phone"
                                        label="Phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium uppercase mb-4">
                                    Shipping Address
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        name="firstName"
                                        label="First Name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />

                                    <Input
                                        name="lastName"
                                        label="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />

                                    <div className="col-span-1 sm:col-span-2">
                                        <Input
                                            name="address"
                                            label="Street Address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <Input
                                        name="city"
                                        label="City"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                    />

                                    <Input
                                        name="postalCode"
                                        label="Postal Code"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                fullWidth
                                isLoading={isProcessing}
                            >
                                Place Order {total > 0 && `- R ${total.toFixed(2)}`}
                            </Button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#F5F1EA] p-6 lg:sticky lg:top-24">

                            <h3 className="text-lg font-medium uppercase mb-4">
                                Order Summary
                            </h3>

                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 text-sm">
                                        <span>{item.quantity}x</span>
                                        <span className="flex-1">{item.name}</span>
                                        <span>
                                            R {(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <CartSummary
                                subtotal={subtotal}
                                tax={tax}
                                shipping={shipping}
                                total={total}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
};