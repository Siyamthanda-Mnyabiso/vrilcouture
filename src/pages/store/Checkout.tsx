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
        // Don't redirect until the persisted cart has actually finished
        // loading from localStorage — otherwise the brief initial "empty"
        // state (before hydration) bounces every visit straight to /cart.
        if (isHydrated && items.length === 0) {
            navigate('/cart');
        }
    }, [items, isHydrated, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Validate all variants exist before proceeding.
    // Cart items come in two shapes:
    //   - real variant items: variantId points to a row in product_variants
    //   - variant-less product items: variantId === productId (see ProductDetails'
    //     fallback path), so they must be validated against the products table.
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

            // Check for invalid variants
            const invalidVariants = items.filter(
                item => !validIds.has(item.variantId)
            );

            // Check for out of stock variants
            const outOfStockVariants = items.filter(
                item => {
                    const stock = validStockMap.get(item.variantId);
                    return stock !== undefined && stock < item.quantity;
                }
            );

            // Handle invalid variants
            if (invalidVariants.length > 0) {
                const invalidNames = invalidVariants.map(item => item.name).join(', ');

                // Remove invalid items from cart
                invalidVariants.forEach(item => {
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

            // Handle out of stock variants
            if (outOfStockVariants.length > 0) {
                const outOfStockNames = outOfStockVariants
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setTestMode(false);
        setDebugInfo(null);

        if (!user) {
            setError('You must be signed in to place an order');
            return;
        }

        if (items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        // Validate all variants exist and are in stock
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

            // Get fresh stock data — same split as validateVariants, since
            // cart items can be backed by either product_variants or products.
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

            // Double-check stock before sending to edge function
            const outOfStock = items.some(item => {
                const stock = stockMap.get(item.variantId);
                return stock === undefined || stock < item.quantity;
            });

            if (outOfStock) {
                setError('Some items are no longer in stock. Please refresh your cart.');
                return;
            }

            // Prepare request payload
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

            console.log('📡 Response Status:', response.status, response.statusText);
            console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));

            const responseText = await response.text();
            console.log('📄 Raw Response Text:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('❌ Failed to parse response as JSON:', parseError);
                throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}...`);
            }

            console.log('📦 Parsed Response:', result);
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

            console.log('✅ Checkout URL received:', result.checkoutUrl);

            if (result.testMode) {
                setTestMode(true);
                console.warn('⚠️ Test mode active:', result.message);

                setError(`⚠️ Test Mode: ${result.message || 'Redirecting to success page...'}`);

                setTimeout(() => {
                    console.log('🔄 Redirecting to test URL:', result.checkoutUrl);
                    window.location.href = result.checkoutUrl;
                }, 2000);

                setIsProcessing(false);
                return;
            }

            console.log('🔄 Redirecting to Stitch:', result.checkoutUrl);
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
            <main className="py-8 md:py-12 bg-[#FAFAF8]">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
                    <div className="text-center py-12">
                        <p className="text-black/60">Loading your cart...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="py-8 md:py-12 bg-[#FAFAF8]">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-display uppercase tracking-tight font-light text-black">
                            Your cart is empty
                        </h2>
                        <p className="mt-4 text-black/60">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Button
                            className="mt-6"
                            onClick={() => navigate('/store')}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="py-8 md:py-12 bg-[#FAFAF8] min-h-screen">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* FORM */}
                    <div className="lg:col-span-2">

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight font-light text-black mb-4">
                            Checkout
                        </h1>

                        <div className="w-12 h-0.5 bg-black mb-8" />

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {error && (
                                <div className={`px-4 py-3 rounded ${
                                    testMode
                                        ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                                        : 'bg-red-50 border border-red-200 text-red-600'
                                }`}>
                                    {error}
                                </div>
                            )}

                            {debugInfo && (
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded text-xs font-mono overflow-auto max-h-60">
                                    <details>
                                        <summary className="cursor-pointer font-medium text-gray-700">
                                            🔍 Debug Info (Click to expand)
                                        </summary>
                                        <pre className="mt-2 whitespace-pre-wrap">
                                            {JSON.stringify(debugInfo, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            )}

                            {validatingItems && (
                                <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded">
                                    Validating cart items...
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-medium uppercase mb-4 text-black">
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

                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium uppercase mb-4 text-black">
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
                                        required
                                    />

                                    <Input
                                        name="postalCode"
                                        label="Postal Code"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                    />

                                    <div className="col-span-1 sm:col-span-2">
                                        <Input
                                            name="country"
                                            label="Country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                            disabled
                                        />
                                    </div>

                                </div>
                            </div>

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
                                        : `Pay Securely - R ${total.toFixed(2)}`
                                }
                            </Button>

                            {testMode && (
                                <p className="text-xs text-yellow-600 text-center">
                                    ⚠️ Test mode active - No payment will be processed
                                </p>
                            )}

                            <p className="text-xs text-black/40 text-center">
                                You will be redirected to our secure payment gateway to complete your purchase.
                            </p>

                        </form>
                    </div>

                    {/* SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-black p-6 lg:sticky lg:top-24">

                            <h3 className="text-lg font-medium uppercase mb-4 text-black">
                                Order Summary
                            </h3>

                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">

                                {items.map(item => (
                                    <div
                                        key={item.variantId}
                                        className="flex items-center gap-3 text-sm text-black"
                                    >
                                        <span className="font-medium">{item.quantity}x</span>

                                        <div className="flex-1">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="block text-xs text-black/50">
                                                {item.size} · {item.color}
                                            </span>
                                        </div>

                                        <span className="font-medium">
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