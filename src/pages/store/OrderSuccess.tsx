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
    const [debugInfo, setDebugInfo] = useState<string[]>([]);

    const addDebug = (message: string) => {
        console.log('🔍', message);
        setDebugInfo(prev => [...prev, message]);
    };

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
            addDebug('No orderId, skipping');
            return;
        }

        let cancelled = false;
        const emailSentKey = `email_sent_${orderId}`;

        const sendConfirmationEmail = async () => {
            try {
                addDebug(`Starting for order ${orderId}`);
                setLoading(true);

                // Check if email already sent
                if (sessionStorage.getItem(emailSentKey)) {
                    addDebug('Email already sent (session storage)');
                    setEmailSent(true);
                    setLoading(false);
                    return;
                }

                // Fetch the order
                addDebug(`Fetching order ${orderId}`);
                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single();

                if (orderError || !order) {
                    addDebug(`Error fetching order: ${orderError?.message}`);
                    console.error('Error fetching order:', orderError);
                    setEmailError(true);
                    setLoading(false);
                    return;
                }

                addDebug(`Order found: ${order.id}, status: ${order.status}`);

                // Get user email
                let resolvedEmail = user?.email || '';
                let userName = 'Customer';
                addDebug(`User email: ${resolvedEmail}`);

                if (user?.id) {
                    addDebug(`Fetching user data for ${user.id}`);
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
                        addDebug(`Found user: ${userName}, email: ${resolvedEmail}`);
                    }
                }

                // If no email found, try to get from order if it has user_id
                if (!resolvedEmail && order.user_id) {
                    addDebug(`Fetching user from order user_id: ${order.user_id}`);
                    const { data: userData, error: userError } = await supabase
                        .from('users')
                        .select('email, full_name')
                        .eq('id', order.user_id)
                        .single();

                    if (!userError && userData) {
                        resolvedEmail = userData.email || '';
                        userName = userData.full_name || 'Customer';
                        addDebug(`Found user from order: ${userName}, email: ${resolvedEmail}`);
                    }
                }

                if (!resolvedEmail) {
                    addDebug('❌ No email address found!');
                    setEmailError(true);
                    setLoading(false);
                    return;
                }

                // Fetch order items
                addDebug(`Fetching order items for ${orderId}`);
                const { data: itemsData, error: itemsError } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', orderId);

                if (itemsError) {
                    addDebug(`Error fetching items: ${itemsError.message}`);
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

                addDebug(`Email payload: ${JSON.stringify(emailPayload)}`);

                // Get authentication
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                addDebug(`Supabase URL: ${supabaseUrl}`);

                // Try to get session token
                addDebug('Getting session...');
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    addDebug(`Session error: ${sessionError.message}`);
                }

                let token = sessionData?.session?.access_token;
                addDebug(`Session token exists: ${!!token}`);

                // If no session, try using service role key
                if (!token) {
                    const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
                    addDebug(`Service role key exists: ${!!serviceKey}`);
                    if (serviceKey) {
                        addDebug('⚠️ No session token, using service role key');
                        token = serviceKey;
                    } else {
                        addDebug('❌ No authentication available');
                        setEmailError(true);
                        setLoading(false);
                        return;
                    }
                }

                if (!token) {
                    addDebug('❌ Token is undefined');
                    setEmailError(true);
                    setLoading(false);
                    return;
                }

                const functionUrl = `${supabaseUrl}/functions/v1/send-confirmation-email`;
                addDebug(`Calling function: ${functionUrl}`);

                const response = await fetch(functionUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(emailPayload),
                });

                const result = await response.json();
                addDebug(`Response status: ${response.status}`);
                addDebug(`Response body: ${JSON.stringify(result)}`);

                if (cancelled) return;

                if (response.ok && result.success) {
                    sessionStorage.setItem(emailSentKey, 'true');
                    setEmailSent(true);
                    addDebug('✅ Email sent successfully!');
                } else {
                    addDebug(`❌ Failed to send email: ${JSON.stringify(result)}`);
                    setEmailError(true);
                }
            } catch (error) {
                if (!cancelled) {
                    const errorMsg = error instanceof Error ? error.message : String(error);
                    addDebug(`❌ Error: ${errorMsg}`);
                    console.error('❌ Error sending email:', error);
                    setEmailError(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        // Send email immediately - no status checking
        sendConfirmationEmail();

        return () => {
            cancelled = true;
        };
    }, [orderId, user, navigate]);

    // Manual retry function if email fails
    const retrySendEmail = async () => {
        try {
            addDebug('🔄 Retrying email send...');
            setLoading(true);
            setEmailError(false);

            // Clear the session storage flag so it can resend
            const emailSentKey = `email_sent_${orderId}`;
            sessionStorage.removeItem(emailSentKey);

            // Re-run the email sending logic by triggering the useEffect
            // We'll just call the function directly
            const sendEmail = async () => {
                if (!orderId) return;

                // Fetch the order
                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single();

                if (orderError || !order) {
                    addDebug(`Error fetching order: ${orderError?.message}`);
                    setEmailError(true);
                    setLoading(false);
                    return;
                }

                // Get user email
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
                    addDebug('❌ No email address found!');
                    setEmailError(true);
                    setLoading(false);
                    return;
                }

                // Fetch order items
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
                    addDebug('✅ Email sent successfully on retry!');
                } else {
                    addDebug(`❌ Retry failed: ${JSON.stringify(result)}`);
                    setEmailError(true);
                }
            };

            await sendEmail();
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            addDebug(`❌ Retry error: ${errorMsg}`);
            setEmailError(true);
        } finally {
            setLoading(false);
        }
    };

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
                                We couldn't send the confirmation email. Click the button below to retry.
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

                    {/* Retry button - only shown if email failed */}
                    {emailError && !loading && (
                        <div className="mt-4">
                            <button
                                onClick={retrySendEmail}
                                className="px-8 py-3 bg-blue-600 text-white text-sm font-medium uppercase tracking-wider hover:bg-blue-700 transition-colors"
                            >
                                🔄 Retry Sending Email
                            </button>
                        </div>
                    )}

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

                    {/* Debug info - remove after testing */}
                    {debugInfo.length > 0 && (
                        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left w-full max-h-60 overflow-auto">
                            <h4 className="text-sm font-bold mb-2">Debug Info:</h4>
                            {debugInfo.map((msg, i) => (
                                <div key={i} className="text-xs font-mono text-gray-700 py-0.5">
                                    {msg}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};