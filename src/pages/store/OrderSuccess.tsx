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

    useEffect(() => {
        const cartClearedKey = `cart_cleared_${orderId}`;
        const alreadyCleared = sessionStorage.getItem(cartClearedKey);

        if (orderId && !cartCleared && !alreadyCleared) {
            clearCart();
            setCartCleared(true);
            sessionStorage.setItem(cartClearedKey, 'true');
        } else if (alreadyCleared) {
            setCartCleared(true);
        } else if (!orderId) {
            navigate('/');
        }
    }, [orderId, clearCart, cartCleared, totalItems, items, navigate]);

    useEffect(() => {
        if (!orderId) {
            return;
        }

        let cancelled = false;
        const emailSentKey = `email_sent_${orderId}`;

        const sendConfirmationEmail = async () => {
            try {
                setLoading(true);

                if (sessionStorage.getItem(emailSentKey)) {
                    setEmailSent(true);
                    setLoading(false);
                    return;
                }

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

                let resolvedEmail = user?.email || '';
                let userName = 'Customer';

                if (user?.id) {
                    const { data: userRow, error: userError } = await supabase
                        .from('users')
                        .select('full_name, email')
                        .eq('id', user.id)
                        .single();

                    if (!userError && userRow) {
                        userName = userRow.full_name || 'Customer';
                        if (userRow.email) {
                            resolvedEmail = userRow.email;
                        }
                    }
                }

                if (!resolvedEmail && order.user_id) {
                    const { data: userData, error: userError } = await supabase
                        .from('users')
                        .select('email, full_name')
                        .eq('id', order.user_id)
                        .single();

                    if (!userError && userData) {
                        resolvedEmail = userData.email || '';
                        userName = userData.full_name || 'Customer';
                    }
                }

                if (!resolvedEmail) {
                    setEmailError(true);
                    setLoading(false);
                    return;
                }

                const { data: itemsData, error: itemsError } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', orderId);

                if (itemsError) {
                    console.error('Error fetching order items:', itemsError);
                }

                const formattedItems = (itemsData && itemsData.length > 0)
                    ? itemsData.map((item) => ({
                        name: item.product_name,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                    : [{
                        name: 'Order Items',
                        quantity: 1,
                        price: order.total,
                    }];

                const emailPayload = {
                    to: resolvedEmail,
                    customerName: userName,
                    orderId: order.id,
                    orderTotal: order.total,
                    transactionId: (order as any).stitch_payment_id || '',
                    items: formattedItems,
                };

                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                const { data: sessionData } = await supabase.auth.getSession();
                let token = sessionData?.session?.access_token;

                if (!token) {
                    const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
                    if (serviceKey) {
                        token = serviceKey;
                    } else {
                        setEmailError(true);
                        setLoading(false);
                        return;
                    }
                }

                const response = await fetch(
                    `${supabaseUrl}/functions/v1/send-confirmation-email`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(emailPayload),
                    }
                );

                const result = await response.json();

                if (cancelled) return;

                if (response.ok && result.success) {
                    sessionStorage.setItem(emailSentKey, 'true');
                    setEmailSent(true);
                } else {
                    console.error('Failed to send email:', result);
                    setEmailError(true);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Error sending email:', error);
                    setEmailError(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        sendConfirmationEmail();

        return () => {
            cancelled = true;
        };
    }, [orderId, user, navigate]);

    const retrySendEmail = async () => {
        try {
            setLoading(true);
            setEmailError(false);

            const emailSentKey = `email_sent_${orderId}`;
            sessionStorage.removeItem(emailSentKey);

            const sendEmail = async () => {
                if (!orderId) return;

                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single();

                if (orderError || !order) {
                    setEmailError(true);
                    setLoading(false);
                    return;
                }

                let resolvedEmail = user?.email || '';
                let userName = 'Customer';

                if (user?.id) {
                    const { data: userRow, error: userError } = await supabase
                        .from('users')
                        .select('full_name, email')
                        .eq('id', user.id)
                        .single();

                    if (!userError && userRow) {
                        userName = userRow.full_name || 'Customer';
                        if (userRow.email) {
                            resolvedEmail = userRow.email;
                        }
                    }
                }

                if (!resolvedEmail && order.user_id) {
                    const { data: userData } = await supabase
                        .from('users')
                        .select('email, full_name')
                        .eq('id', order.user_id)
                        .single();

                    if (userData) {
                        resolvedEmail = userData.email || '';
                        userName = userData.full_name || 'Customer';
                    }
                }

                if (!resolvedEmail) {
                    setEmailError(true);
                    setLoading(false);
                    return;
                }

                const { data: itemsData } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', orderId);

                const formattedItems = (itemsData && itemsData.length > 0)
                    ? itemsData.map((item) => ({
                        name: item.product_name,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                    : [{
                        name: 'Order Items',
                        quantity: 1,
                        price: order.total,
                    }];

                const emailPayload = {
                    to: resolvedEmail,
                    customerName: userName,
                    orderId: order.id,
                    orderTotal: order.total,
                    transactionId: (order as any).stitch_payment_id || '',
                    items: formattedItems,
                };

                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                const { data: sessionData } = await supabase.auth.getSession();
                let token = sessionData?.session?.access_token;

                if (!token) {
                    const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
                    if (serviceKey) {
                        token = serviceKey;
                    } else {
                        setEmailError(true);
                        setLoading(false);
                        return;
                    }
                }

                const response = await fetch(
                    `${supabaseUrl}/functions/v1/send-confirmation-email`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(emailPayload),
                    }
                );

                const result = await response.json();

                if (response.ok && result.success) {
                    sessionStorage.setItem(`email_sent_${orderId}`, 'true');
                    setEmailSent(true);
                } else {
                    console.error('Retry failed:', result);
                    setEmailError(true);
                }
            };

            await sendEmail();
        } catch (error) {
            console.error('Retry error:', error);
            setEmailError(true);
        } finally {
            setLoading(false);
        }
    };

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

                    {cartCleared && (
                        <div className="mb-4 p-3 bg-white border border-black flex items-center gap-2">
                            <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-black text-sm">Your cart has been cleared</p>
                        </div>
                    )}

                    {loading && (
                        <div className="mb-6 flex items-center gap-2 text-black/50">
                            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending confirmation email...</span>
                        </div>
                    )}

                    {emailSent && !loading && (
                        <div className="mb-6 p-4 bg-white border border-black flex items-center gap-3">
                            <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-black text-sm">Confirmation email sent successfully!</span>
                        </div>
                    )}

                    {emailError && !loading && (
                        <div className="mb-6 p-4 bg-white border border-black flex items-center gap-3">
                            <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-black text-sm">
                                We couldn't send the confirmation email. Click the button below to retry.
                            </span>
                        </div>
                    )}

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

                    {emailError && !loading && (
                        <div className="mt-4">
                            <button
                                onClick={retrySendEmail}
                                className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.3em] hover:bg-black/80 transition-colors"
                            >
                                Retry Sending Email
                            </button>
                        </div>
                    )}

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
                                    {emailSent
                                        ? "Confirmation email has been sent to your inbox."
                                        : "You'll receive an email confirmation of your order."}
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