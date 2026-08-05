// src/pages/store/OrderSuccess.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { supabase } from '../../lib/supabase';

// Stitch redirects here regardless of whether the payment actually succeeded,
// so this page has to check the order's real status before claiming anything
// was placed. The order only becomes 'paid' via the stitch-webhook function
// (server-confirmed), which is also the only place that sends the
// confirmation email — this page never triggers one itself.
type PageState = 'loading' | 'paid' | 'not_placed' | 'not_found';

const POLL_INTERVAL_MS = 2000;
// Stitch sends no webhook at all for an abandoned/cancelled payment — every
// real successful payment in testing has webhooked back within ~1s, so if
// nothing has landed after this many attempts, treat it as not placed rather
// than leaving the customer on an ambiguous "still waiting" screen.
const MAX_POLL_ATTEMPTS = 15; // ~30s

export const OrderSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { clearCart } = useCart();

    const [pageState, setPageState] = useState<PageState>('loading');

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }

        let cancelled = false;
        let attempts = 0;
        let timer: ReturnType<typeof setTimeout>;

        const checkOrder = async () => {
            const { data: order, error } = await supabase
                .from('orders')
                .select('status')
                .eq('id', orderId)
                .single();

            if (cancelled) return;

            if (error || !order) {
                setPageState('not_found');
                return;
            }

            if (order.status === 'paid') {
                setPageState('paid');
                return;
            }

            if (order.status === 'failed' || order.status === 'cancelled') {
                setPageState('not_placed');
                return;
            }

            attempts += 1;
            if (attempts >= MAX_POLL_ATTEMPTS) {
                setPageState('not_placed');
                return;
            }
            timer = setTimeout(checkOrder, POLL_INTERVAL_MS);
        };

        checkOrder();

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [orderId, navigate]);

    useEffect(() => {
        if (pageState !== 'paid' || !orderId) return;

        const cartClearedKey = `cart_cleared_${orderId}`;
        if (!sessionStorage.getItem(cartClearedKey)) {
            clearCart();
            sessionStorage.setItem(cartClearedKey, 'true');
        }
    }, [pageState, orderId, clearCart]);

    if (pageState === 'loading') {
        return (
            <main className="min-h-[60vh] py-16 md:py-24 flex items-center justify-center">
                <div className="flex items-center gap-3 text-black/50">
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Checking your order...</span>
                </div>
            </main>
        );
    }

    if (pageState === 'not_found') {
        return (
            <main className="min-h-[60vh] py-16 md:py-24">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-black mb-4">
                            Order Not Found
                        </h1>
                        <div className="w-12 h-0.5 bg-black mb-6" />
                        <p className="text-black/50 text-lg mb-8">
                            We couldn't find an order matching that link.
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.3em] hover:bg-black/80 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (pageState === 'not_placed') {
        return (
            <main className="min-h-[60vh] py-16 md:py-24">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-8">
                            <svg
                                className="h-12 w-12 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-black mb-4">
                            Order Not Placed
                        </h1>
                        <div className="w-12 h-0.5 bg-black mb-6" />

                        <p className="text-black/50 text-lg mb-2">
                            Your payment didn't go through, so this order hasn't been placed.
                        </p>
                        {orderId && (
                            <p className="text-black/40 text-sm mb-6">
                                Order #{orderId}
                            </p>
                        )}
                        <p className="text-black/50 mb-8">
                            Nothing has been charged and your cart is still intact — you can try again whenever you're ready.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/cart')}
                                className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.3em] hover:bg-black/80 transition-colors"
                            >
                                Return to Cart
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-8 py-3 border border-black text-black text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors"
                            >
                                Return Home
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // pageState === 'paid'
    return (
        <main className="min-h-[60vh] py-16 md:py-24">
            <div className="max-w-[1440px] mx-auto px-6">
                <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                    <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-8">
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

                    <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-black mb-4">
                        Order Confirmed
                    </h1>
                    <div className="w-12 h-0.5 bg-black mb-6" />

                    <p className="text-black/50 text-lg mb-2">
                        Thank you for your order!
                    </p>

                    {orderId && (
                        <p className="text-black/40 text-sm mb-6">
                            Order #{orderId}
                        </p>
                    )}

                    <div className="mb-4 p-3 bg-white border border-black flex items-center gap-2">
                        <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-black text-sm">Your cart has been cleared</p>
                    </div>

                    <p className="text-black/50 mb-8">
                        You will receive a confirmation email shortly with your order details.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.3em] hover:bg-black/80 transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 border border-black text-black text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors"
                        >
                            Return Home
                        </button>
                    </div>

                    <div className="mt-12 pt-8 border-t border-black/20 w-full">
                        <h3 className="text-xs font-medium text-black uppercase tracking-[0.3em] mb-4">
                            What Happens Next?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            <div>
                                <div className="w-8 h-0.5 bg-black mb-2" />
                                <h4 className="text-sm font-medium text-black mb-1">
                                    Order Confirmation
                                </h4>
                                <p className="text-sm text-black/50">
                                    You'll receive an email confirmation of your order.
                                </p>
                            </div>
                            <div>
                                <div className="w-8 h-0.5 bg-black mb-2" />
                                <h4 className="text-sm font-medium text-black mb-1">
                                    Processing
                                </h4>
                                <p className="text-sm text-black/50">
                                    We'll process your order within 1-2 business days.
                                </p>
                            </div>
                            <div>
                                <div className="w-8 h-0.5 bg-black mb-2" />
                                <h4 className="text-sm font-medium text-black mb-1">
                                    Shipping
                                </h4>
                                <p className="text-sm text-black/50">
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
