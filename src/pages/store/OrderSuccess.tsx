import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const OrderSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (!orderId) {
            navigate('/');
        }
    }, [orderId, navigate]);

    return (
        <main className="min-h-[60vh] py-16 md:py-24">
            <div className="max-w-[1440px] mx-auto px-6">
                <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-[#6B5D4F] rounded-full flex items-center justify-center mb-8">
                        <svg
                            className="h-12 w-12 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="square"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-[#2C2420] tracking-wide mb-4">
                        Order Confirmed
                    </h1>
                    <div className="w-12 h-0.5 bg-[#6B5D4F] mb-6" />

                    <p className="text-[#8A8378] text-lg mb-2">
                        Thank you for your order!
                    </p>

                    {orderId && (
                        <p className="text-[#8A8378] text-sm mb-6">
                            Order #{orderId}
                        </p>
                    )}

                    <p className="text-[#8A8378] mb-8">
                        You will receive a confirmation email shortly with your order details.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 py-3 bg-[#6B5D4F] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#5A4D40] transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 border border-[#6B5D4F] text-[#6B5D4F] text-sm font-medium uppercase tracking-wider hover:bg-[#F5F1EA] transition-colors"
                        >
                            Return Home
                        </button>
                    </div>

                    {/* Order Details Summary */}
                    <div className="mt-12 pt-8 border-t border-[#D5C9B9] w-full">
                        <h3 className="text-sm font-medium text-[#2C2420] uppercase tracking-wider mb-4">
                            What Happens Next?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            <div>
                                <div className="w-8 h-0.5 bg-[#6B5D4F] mb-2" />
                                <h4 className="text-sm font-medium text-[#2C2420] mb-1">
                                    Order Confirmation
                                </h4>
                                <p className="text-sm text-[#8A8378]">
                                    You'll receive an email confirmation of your order.
                                </p>
                            </div>
                            <div>
                                <div className="w-8 h-0.5 bg-[#6B5D4F] mb-2" />
                                <h4 className="text-sm font-medium text-[#2C2420] mb-1">
                                    Processing
                                </h4>
                                <p className="text-sm text-[#8A8378]">
                                    We'll process your order within 1-2 business days.
                                </p>
                            </div>
                            <div>
                                <div className="w-8 h-0.5 bg-[#6B5D4F] mb-2" />
                                <h4 className="text-sm font-medium text-[#2C2420] mb-1">
                                    Shipping
                                </h4>
                                <p className="text-sm text-[#8A8378]">
                                    You'll receive tracking information once your order ships.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};