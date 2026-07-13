// supabase/functions/checkout/index.ts
//
// Uses the Stitch EXPRESS API (https://express.stitch.money/api/v1/),
// NOT the Stitch Enterprise/Connect GraphQL API. These are separate
// products with separate credentials — see express.stitch.money/settings
// for the clientId/clientSecret used here.

import { createClient } from 'jsr:@supabase/supabase-js@2';


const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_COST = 100;

const STITCH_EXPRESS_BASE = 'https://express.stitch.money/api/v1';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CheckoutItem {
    variantId: string;
    productId: string;
    quantity: number;
}

async function getStitchExpressToken(): Promise<string> {
    const response = await fetch(`${STITCH_EXPRESS_BASE}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            clientId: Deno.env.get('STITCH_CLIENT_ID'),
            clientSecret: Deno.env.get('STITCH_CLIENT_SECRET'),
            scope: 'client_paymentrequest',
        }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        console.error('Stitch Express token error:', JSON.stringify(data));
        const reason = data.generalErrors?.join(', ') || data.error || JSON.stringify(data);
        throw new Error(`Failed to authenticate with Stitch Express: ${reason}`);
    }

    return data.data.accessToken;
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Missing authorization' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(
            authHeader.replace('Bearer ', '')
        );
        if (userError || !userData?.user) {
            return new Response(JSON.stringify({ error: 'Invalid session' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        const userId = userData.user.id;

        const body = await req.json();
        const items: CheckoutItem[] = body.items;
        const shippingAddress = body.shippingAddress;

        if (!Array.isArray(items) || items.length === 0) {
            return new Response(JSON.stringify({ error: 'Cart is empty' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Cart items come in two shapes:
        //   - real variant items: variantId points to a row in product_variants
        //   - variant-less product items: variantId === productId, so they
        //     must be looked up directly in products instead.
        const variantItems = items.filter((i) => i.variantId !== i.productId);
        const productOnlyItems = items.filter((i) => i.variantId === i.productId);

        const variantIds = variantItems.map((i) => i.variantId);
        const productOnlyIds = productOnlyItems.map((i) => i.productId);

        const [variantsRes, productsRes] = await Promise.all([
            variantIds.length > 0
                ? supabaseAdmin
                    .from('product_variants')
                    .select('id, stock, size, color, product_id, products(id, name, price)')
                    .in('id', variantIds)
                : Promise.resolve({ data: [], error: null }),
            productOnlyIds.length > 0
                ? supabaseAdmin
                    .from('products')
                    .select('id, name, price, stock')
                    .in('id', productOnlyIds)
                : Promise.resolve({ data: [], error: null }),
        ]);

        if (variantsRes.error) throw variantsRes.error;
        if (productsRes.error) throw productsRes.error;

        const variants = variantsRes.data ?? [];
        const productsOnly = productsRes.data ?? [];

        let subtotal = 0;
        const orderItemsPayload: any[] = [];

        for (const item of items) {
            const isVariantless = item.variantId === item.productId;

            if (isVariantless) {
                const product = productsOnly.find((p: any) => p.id === item.productId);
                if (!product) {
                    return new Response(
                        JSON.stringify({ error: `Product ${item.productId} not found` }),
                        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                    );
                }
                if (product.stock < item.quantity) {
                    return new Response(
                        JSON.stringify({ error: `"${product.name}" no longer has enough stock` }),
                        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                    );
                }

                subtotal += product.price * item.quantity;

                orderItemsPayload.push({
                    product_id: product.id,
                    product_name: product.name,
                    variant_id: null,
                    size: 'One Size',
                    color: 'Default',
                    price: product.price,
                    quantity: item.quantity,
                });
            } else {
                const variant = variants.find((v: any) => v.id === item.variantId);
                if (!variant) {
                    return new Response(
                        JSON.stringify({ error: `Variant ${item.variantId} not found` }),
                        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                    );
                }
                if (variant.stock < item.quantity) {
                    return new Response(
                        JSON.stringify({
                            error: `"${variant.products.name}" (${variant.size}, ${variant.color}) no longer has enough stock`,
                        }),
                        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                    );
                }

                const realPrice = variant.products.price;
                subtotal += realPrice * item.quantity;

                orderItemsPayload.push({
                    product_id: variant.product_id,
                    product_name: variant.products.name,
                    variant_id: variant.id,
                    size: variant.size,
                    color: variant.color,
                    price: realPrice,
                    quantity: item.quantity,
                });
            }
        }

        const shipping = subtotal >= 1000 ? 0 : 109;
        const total = subtotal + shipping;

        // Create the order as 'pending' — it only becomes 'paid' once the
        // webhook confirms payment, never based on anything the client says.
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({ user_id: userId, status: 'pending', total })
            .select()
            .single();
        if (orderError) throw orderError;

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItemsPayload.map((i) => ({ ...i, order_id: order.id })));
        if (itemsError) throw itemsError;

        // Note: stock is NOT decremented here. It's decremented only once
        // payment is confirmed via webhook, so abandoned/failed payments
        // don't lock up inventory.

        const stitchToken = await getStitchExpressToken();

        const fullName = `${shippingAddress?.firstName ?? ''} ${shippingAddress?.lastName ?? ''}`.trim();

        // Stitch Express amounts are integer South African CENTS.
        const amountInCents = Math.round(total * 100);

        const linkResponse = await fetch(`${STITCH_EXPRESS_BASE}/payment-links`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${stitchToken}`,
            },
            body: JSON.stringify({
                amount: amountInCents,
                payerName: fullName || 'Customer',
                merchantReference: order.id,
                payerEmailAddress: userData.user.email,
                payerPhoneNumber: shippingAddress?.phone,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            }),
        });

        const linkData = await linkResponse.json();

        if (!linkResponse.ok || !linkData.success) {
            await supabaseAdmin.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
            const reason = linkData.generalErrors?.join(', ') || JSON.stringify(linkData.fieldErrors) || 'Failed to create payment link';
            return new Response(
                JSON.stringify({ error: reason }),
                { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        await supabaseAdmin
            .from('orders')
            .update({ stitch_payment_id: linkData.data.payment.id })
            .eq('id', order.id);

        // Append the registered redirect URL as a query param, per Stitch
        // Express docs. SITE_URL must exactly match a URL already
        // registered via POST /api/v1/redirect-urls.
        const redirectUrl = `${Deno.env.get('SITE_URL')}/order-success?orderId=${order.id}`;
        const checkoutUrl = `${linkData.data.payment.link}?redirect_url=${encodeURIComponent(redirectUrl)}`;

        return new Response(JSON.stringify({ orderId: order.id, checkoutUrl }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : 'Checkout failed' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});