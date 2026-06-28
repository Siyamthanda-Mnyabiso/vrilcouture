// src/pages/store/OrderSuccess.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const OrderSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { clearCart, items, totalItems } = useCart();
    const { user } = useAuth();

    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cartCleared, setCartCleared] = useState(false);
    const [orderStatus, setOrderStatus] = useState<string>('pending');
    const [orderData, setOrderData] = useState<any>(null);

    // Clear cart when order success page loads
    useEffect(() => {
        const cartClearedKey = `cart_cleared_${orderId}`;
        const alreadyCleared = sessionStorage.getItem(cartClearedKey);

        if (orderId && !cartCleared && !alreadyCleared) {
            console.log('🛒 Clearing cart...');
            clearCart();
            setCartCleared(true);
            sessionStorage.setItem(cartClearedKey, 'true');
        } else if (alreadyCleared) {
            setCartCleared(true);
        } else if (!orderId) {
            navigate('/');
        }
    }, [orderId, clearCart, cartCleared, totalItems, items, navigate]);

    // Send confirmation email
    useEffect(() => {
        if (!orderId) {
            return;
        }

        let cancelled = false;
        const emailSentKey = `email_sent_${orderId}`;

        // Check if email was already sent for this order
        if (sessionStorage.getItem(emailSentKey)) {
            setEmailSent(true);
            setLoading(false);
            return;
        }

        const sendEmail = async () => {
            try {
                setLoading(true);

                // 1. Fetch order details
                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single();

                if (orderError || !order) {
                    console.error('Error fetching order:', orderError);
                    setEmailError(true);
                    setLoading(false);
                    return;
                }

                setOrderData(order);
                setOrderStatus(order.status);

                console.log('📦 Order data:', order);
                console.log('📦 Order status:', order.status);

                // 2. Get customer email and name
                let customerEmail = user?.email || '';
                let customerName = 'Customer';

                // Try to get from order if stored
                if (order.customer_email) {
                    customerEmail = order.customer_email;
                }

                // Try to get customer name from order
                if (order.customer_name) {
                    customerName = order.customer_name;
                } else if (user?.id) {
                    // Try to get from profiles table (if it exists)
                    try {
                        const { data: profile, error: profileError } = await supabase
                            .from('profiles')
                            .select('full_name, email')
                            .eq('id', user.id)
                            .single();

                        if (!profileError && profile) {
                            customerName = profile.full_name || 'Customer';
                            if (profile.email) {
                                customerEmail = profile.email;
                            }
                        }
                    } catch (e) {
                        console.log('⚠️ Could not fetch profile, using fallback');
                        // Use email from auth as fallback
                        customerName = user.email?.split('@')[0] || 'Customer';
                    }
                }

                console.log('📧 Customer email:', customerEmail);
                console.log('📧 Customer name:', customerName);

                // 3. Fetch order items
                const { data: itemsData, error: itemsError } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', orderId);

                if (itemsError) {
                    console.error('Error fetching order items:', itemsError);
                }

                // 4. Format items
                let formattedItems = [];
                if (itemsData && itemsData.length > 0) {
                    formattedItems = itemsData.map((item: any) => ({
                        name: item.product_name || 'Product',
                        quantity: item.quantity || 1,
                        price: parseFloat(item.price) || 0,
                        size: item.size || '',
                        color: item.color || '',
                    }));
                } else {
                    // Fallback if no items found
                    console.warn('⚠️ No items found in order_items table');
                    formattedItems = [{
                        name: 'Order Items',
                        quantity: 1,
                        price: parseFloat(order.total) || 0,
                        size: '',
                        color: '',
                    }];
                }

                console.log('📦 Formatted items:', formattedItems);

                // 5. Build email payload
                const emailPayload = {
                    to: customerEmail,
                    customerName: customerName,
                    orderId: order.id,
                    orderTotal: parseFloat(order.total) || 0,
                    transactionId: order.stitch_payment_id || '',
                    items: formattedItems,
                    order_date: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                };

                console.log('📧 Sending email with payload:', JSON.stringify(emailPayload, null, 2));

                // 6. Get session for authorization
                const { data: { session } } = await supabase.auth.getSession();

                // 7. Call the Edge Function to send email
                const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-confirmation-email`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(emailPayload),
                    }
                );

                const result = await response.json();

                if (cancelled) return;

                if (result.success) {
                    console.log('✅ Confirmation email sent successfully');
                    sessionStorage.setItem(emailSentKey, 'true');
                    setEmailSent(true);
                } else {
                    console.error('❌ Failed to send email:', result.error);
                    setEmailError(true);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('❌ Error sending email:', error);
                    setEmailError(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        // Small delay to ensure order data is available
        const timer = setTimeout(() => {
            sendEmail();
        }, 1000);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [orderId, user, navigate]);

    return (
        <main className="min-h-[60vh] py-16 md:py-24">
            <div className="max-w-[1440px] mx-auto px-6">
                <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
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

                    {/* Order Status */}
                    {orderStatus && (
                        <div className="mb-4 px-4 py-2 bg-black/5 rounded-full">
                            <p className="text-xs uppercase tracking-[0.15em] text-black/60">
                                Status: {orderStatus}
                            </p>
                        </div>
                    )}

                    {cartCleared && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-green-700 text-sm">✓ Your cart has been cleared</p>
                        </div>
                    )}

                    {loading && (
                        <div className="mb-6 flex items-center gap-2 text-[#8A8378]">
                            <svg className="animate-spin h-5 w-5 text-[#6B5D4F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending confirmation email...</span>
                        </div>
                    )}

                    {emailSent && !loading && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-green-700 text-sm">Confirmation email sent successfully!</span>
                        </div>
                    )}

                    {emailError && !loading && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
                            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-amber-700 text-sm">
                                We couldn't send the confirmation email. You'll receive it shortly, or you can contact support.
                            </span>
                        </div>
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
                                    {emailSent
                                        ? "Confirmation email has been sent to your inbox."
                                        : "You'll receive an email confirmation of your order."}
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

                    {/* Debug: Show order data (only in development) */}
                    {import.meta.env.DEV && orderData && (
                        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left w-full overflow-auto">
                            <h4 className="text-sm font-bold mb-2 text-[#2C2420]">Debug: Order Data</h4>
                            <pre className="text-xs text-[#4D4D4D] max-h-40 overflow-auto">
                                {JSON.stringify(orderData, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};