// src/pages/store/Checkout.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CartSummary } from '../../components/cart/CartSummary';

export const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, isHydrated, subtotal, removeItem } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validatingItems, setValidatingItems] = useState(false);
    const [testMode, setTestMode] = useState(false);
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

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

    const shipping = subtotal >= 1000 ? 0 : 109;
    const total = subtotal + shipping;

    useEffect(() => {
        if (isHydrated && items.length === 0) {
            navigate('/cart');
        }
    }, [items, isHydrated, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateVariants = async () => {
        setValidatingItems(true);

        try {
            const variantItems = items.filter(item => item.variantId !== item.productId);
            const productOnlyItems = items.filter(item => item.variantId === item.productId);

            const variantIds = variantItems.map(item => item.variantId);
            const productOnlyIds = productOnlyItems.map(item => item.productId);

            const [variantsResult, productsResult] = await Promise.all([
                variantIds.length > 0
                    ? supabase.from('product_variants').select('id, stock').in('id', variantIds)
                    : Promise.resolve({ data: [], error: null }),
                productOnlyIds.length > 0
                    ? supabase.from('products').select('id, stock').in('id', productOnlyIds)
                    : Promise.resolve({ data: [], error: null }),
            ]);

            if (variantsResult.error) {
                console.error('Error validating variants:', variantsResult.error);
                throw new Error('Failed to validate cart items');
            }
            if (productsResult.error) {
                console.error('Error validating products:', productsResult.error);
                throw new Error('Failed to validate cart items');
            }

            const validIds = new Set<string>([
                ...((variantsResult.data ?? []).map((v: any) => v.id)),
                ...((productsResult.data ?? []).map((p: any) => p.id)),
            ]);
            const validStockMap = new Map<string, number>([
                ...((variantsResult.data ?? []).map((v: any) => [v.id, v.stock] as [string, number])),
                ...((productsResult.data ?? []).map((p: any) => [p.id, p.stock] as [string, number])),
            ]);

            const invalidItems = items.filter(item => !validIds.has(item.variantId));
            const outOfStockItems = items.filter(item => {
                const stock = validStockMap.get(item.variantId);
                return stock !== undefined && stock < item.quantity;
            });

            if (invalidItems.length > 0) {
                const invalidNames = invalidItems.map(item => item.name).join(', ');
                invalidItems.forEach(item => {
                    removeItem(item.variantId);
                });
                setError(
                    `The following items are no longer available and have been removed: ${invalidNames}`
                );
                setTimeout(() => {
                    if (items.length === 0) {
                        navigate('/cart');
                    }
                }, 3000);
                return false;
            }

            if (outOfStockItems.length > 0) {
                const outOfStockNames = outOfStockItems
                    .map(item => `${item.name} (${item.size} · ${item.color})`)
                    .join(', ');
                setError(
                    `The following items are out of stock: ${outOfStockNames}. Please adjust your quantities.`
                );
                return false;
            }

            return true;

        } catch (err) {
            console.error('Validation error:', err);
            setError('Failed to validate cart items. Please refresh and try again.');
            return false;
        } finally {
            setValidatingItems(false);
        }
    };

    // ============ NEW: Function to send confirmation email ============
    const sendConfirmationEmail = async (orderData: {
        to: string;
        toName: string;
        orderId: string;
        customerName: string;
        orderTotal: number;
        items: Array<{ name: string; quantity: number; price: number }>;
        transactionId?: string;
    }) => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();

            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-confirmation-email`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionData.session?.access_token || ''}`,
                        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                    },
                    body: JSON.stringify(orderData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                console.error('Email sending failed:', result);
                throw new Error(result.error || 'Failed to send confirmation email');
            }

            console.log('✅ Confirmation email sent:', result);
            setEmailStatus('sent');
            return result;
        } catch (error) {
            console.error('Error calling email function:', error);
            setEmailStatus('failed');
            return { success: false, error: error.message };
        }
    };
    // ==================================================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setTestMode(false);
        setDebugInfo(null);
        setEmailStatus('idle');

        if (!user) {
            setError('You must be signed in to place an order');
            return;
        }

        if (items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        const isValid = await validateVariants();
        if (!isValid) {
            return;
        }

        setIsProcessing(true);

        try {
            const { data: sessionData, error: sessionError } =
                await supabase.auth.getSession();

            if (sessionError || !sessionData.session) {
                throw new Error('Session expired. Please log in again.');
            }

            const variantItems = items.filter(item => item.variantId !== item.productId);
            const productOnlyItems = items.filter(item => item.variantId === item.productId);

            const [variantStockResult, productStockResult] = await Promise.all([
                variantItems.length > 0
                    ? supabase.from('product_variants').select('id, stock').in('id', variantItems.map(i => i.variantId))
                    : Promise.resolve({ data: [], error: null }),
                productOnlyItems.length > 0
                    ? supabase.from('products').select('id, stock').in('id', productOnlyItems.map(i => i.productId))
                    : Promise.resolve({ data: [], error: null }),
            ]);

            if (variantStockResult.error || productStockResult.error) {
                throw new Error('Failed to verify stock availability');
            }

            const stockMap = new Map<string, number>([
                ...((variantStockResult.data ?? []).map((v: any) => [v.id, v.stock] as [string, number])),
                ...((productStockResult.data ?? []).map((p: any) => [p.id, p.stock] as [string, number])),
            ]);

            const outOfStock = items.some(item => {
                const stock = stockMap.get(item.variantId);
                return stock === undefined || stock < item.quantity;
            });

            if (outOfStock) {
                setError('Some items are no longer in stock. Please refresh your cart.');
                return;
            }

            const requestBody = {
                items: items.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size || '',
                    color: item.color || '',
                    image_url: item.image_url || '',
                })),
                shippingAddress: {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                },
                returnUrl: `${window.location.origin}/order-success`,
                cancelUrl: `${window.location.origin}/cart`,
            };

            console.log('🚀 Sending to Edge Function:', JSON.stringify(requestBody, null, 2));

            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkout`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionData.session.access_token}`,
                        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            const responseText = await response.text();

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('❌ Failed to parse response as JSON:', parseError);
                throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}...`);
            }

            setDebugInfo(result);

            if (!response.ok) {
                if (response.status === 400 && result.error?.includes('not found')) {
                    await validateVariants();
                    throw new Error('Some items in your cart are no longer available. They have been removed.');
                }
                throw new Error(result.error || `Checkout failed with status ${response.status}`);
            }

            if (!result.checkoutUrl) {
                console.error('❌ No checkout URL in response. Full response:', result);
                setDebugInfo({ error: 'No checkoutUrl in response', response: result });
                throw new Error('Payment gateway did not return a checkout URL. Please try again.');
            }

            // ============ SEND CONFIRMATION EMAIL ============
            // Try to send email - don't block checkout if it fails
            setEmailStatus('sending');
            try {
                await sendConfirmationEmail({
                    to: formData.email,
                    toName: `${formData.firstName} ${formData.lastName}`,
                    orderId: result.orderId || `ORD-${Date.now()}`,
                    customerName: `${formData.firstName} ${formData.lastName}`,
                    orderTotal: total,
                    items: items.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    transactionId: result.transactionId || result.paymentIntentId || undefined,
                });
                // Success - email sent
                console.log('✅ Confirmation email sent successfully');
            } catch (emailError) {
                console.error('⚠️ Failed to send confirmation email:', emailError);
                // Don't block checkout - just log the error
                // User will still be redirected to payment
            }
            // ==================================================

            if (result.testMode) {
                setTestMode(true);
                setError(`Test mode: ${result.message || 'Redirecting to success page...'}`);

                setTimeout(() => {
                    window.location.href = result.checkoutUrl;
                }, 2000);

                setIsProcessing(false);
                return;
            }

            window.location.replace(result.checkoutUrl);

        } catch (err) {
            console.error('❌ Checkout error:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to start checkout. Please try again.'
            );
            setIsProcessing(false);
        }
    };

    if (!isHydrated) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">Loading your cart…</p>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center">
                    <h2 className="font-display uppercase tracking-tight text-3xl font-light text-black mb-3">
                        Your cart is empty
                    </h2>
                    <p className="text-black/50 mb-8 text-sm">
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <Button onClick={() => navigate('/store')}>Continue Shopping</Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <div className="border-b border-black/10">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/cart')}
                        className="text-xs uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors flex items-center gap-2"
                    >
                        <span aria-hidden="true">←</span> Cart
                    </button>
                    <div className="text-center">
                        <div className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-black">
                            Vril
                        </div>
                        <div className="text-[9px] uppercase tracking-[0.35em] text-black/40 -mt-0.5">
                            Couture Collection
                        </div>
                    </div>
                    <div className="w-12" aria-hidden="true" />
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 md:py-16">
                <div className="mb-10 pb-5 border-b border-black/10">
                    <span className="text-xs uppercase tracking-[0.15em] text-black">
                        Checkout
                    </span>
                </div>

                {error && (
                    <div
                        role="alert"
                        className={`border p-4 mb-8 text-sm tracking-wide ${
                            testMode ? 'border-black/20 bg-black/[0.03] text-black/70' : 'border-black text-black'
                        }`}
                    >
                        {error}
                    </div>
                )}

                {/* ============ NEW: Email Status Indicator ============ */}
                {emailStatus === 'sending' && (
                    <div className="border border-black/20 bg-black/[0.03] p-4 mb-8 text-sm tracking-wide text-black/70">
                        Sending confirmation email...
                    </div>
                )}
                {emailStatus === 'sent' && (
                    <div className="border border-green-500/30 bg-green-50 p-4 mb-8 text-sm tracking-wide text-green-700">
                        ✓ Confirmation email sent to {formData.email}
                    </div>
                )}
                {emailStatus === 'failed' && (
                    <div className="border border-yellow-500/30 bg-yellow-50 p-4 mb-8 text-sm tracking-wide text-yellow-700">
                        ⚠️ Could not send confirmation email. We'll email you shortly with your order details.
                    </div>
                )}
                {/* ================================================== */}

                {debugInfo && (
                    <div className="border border-black/10 p-4 mb-8 text-xs font-mono overflow-auto max-h-60">
                        <details>
                            <summary className="cursor-pointer font-medium text-black/60 uppercase tracking-wide text-[11px]">
                                Debug info
                            </summary>
                            <pre className="mt-2 whitespace-pre-wrap text-black/70">
                                {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <section className="border border-black p-6 md:p-10">
                            <h2 className="font-display uppercase tracking-[0.18em] text-xl mb-8">
                                Contact Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input
                                    type="email"
                                    name="email"
                                    label="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!!user?.email}
                                />
                                <Input
                                    type="tel"
                                    name="phone"
                                    label="Phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
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
                            </div>
                        </section>

                        <section className="border border-black p-6 md:p-10">
                            <h2 className="font-display uppercase tracking-[0.18em] text-xl mb-8">
                                Shipping Address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
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
                                    required
                                />
                                <Input
                                    name="postalCode"
                                    label="Postal Code"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        name="country"
                                        label="Country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        disabled
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <Button
                            type="submit"
                            size="lg"
                            fullWidth
                            isLoading={isProcessing || validatingItems}
                            disabled={validatingItems || items.length === 0}
                        >
                            {validatingItems
                                ? 'Validating...'
                                : isProcessing
                                    ? 'Processing...'
                                    : `Pay Securely - R ${total.toFixed(2)}`}
                        </Button>

                        <p className="text-[11px] text-black/40 text-center -mt-2">
                            You'll be redirected to our secure payment gateway to complete your purchase.
                        </p>
                    </form>

                    <aside className="border border-black p-6 lg:p-8 h-fit lg:sticky lg:top-24">
                        <h2 className="font-display uppercase tracking-[0.18em] text-xl mb-8">
                            Your Order
                        </h2>
                        <div className="space-y-5 max-h-[420px] overflow-y-auto mb-8">
                            {items.map(item => (
                                <div key={item.variantId} className="flex gap-4 border-b border-black/10 pb-5">
                                    <div className="relative w-20 h-24 flex-shrink-0">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-full h-full object-cover border border-black/10"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-black/5 border border-black/10" />
                                        )}
                                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="uppercase text-sm tracking-wide">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-black/50 mt-2">
                                            {item.size} · {item.color}
                                        </p>
                                        <p className="text-sm mt-3">
                                            {item.quantity} × R {item.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <CartSummary
                            subtotal={subtotal}
                            shipping={shipping}
                            total={total}
                        />
                    </aside>
                </div>
            </div>
        </main>
    );
};