// supabase/functions/checkout/index.ts

import { createClient } from 'jsr:@supabase/supabase-js@2';

const TAX_RATE = 0.15;
const FREE_SHIPPING_THRESHOLD = 2550;
const SHIPPING_COST = 100;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CheckoutItem {
    variantId: string;
    quantity: number;
}

async function getStitchToken(): Promise<string> {
    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: Deno.env.get('STITCH_CLIENT_ID')!,
        client_secret: Deno.env.get('STITCH_CLIENT_SECRET')!,
        audience: 'https://secure.stitch.money/connect/token',
        scope: 'client_paymentrequest',
    });

    const response = await fetch('https://secure.stitch.money/connect/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });

    if (!response.ok) {
        throw new Error('Failed to authenticate with Stitch');
    }

    const data = await response.json();
    return data.access_token;
}

Deno.serve(async (req) => {
    // Browsers send an OPTIONS preflight before the real POST — respond to
    // it immediately with the allowed CORS headers, no auth needed here.
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

        // 1. Load real prices/stock from the DB — never trust the client for these.
        const variantIds = items.map((i) => i.variantId);
        const { data: variants, error: variantsError } = await supabaseAdmin
            .from('product_variants')
            .select('id, stock, size, color, product_id, products(id, name, price)')
            .in('id', variantIds);

        if (variantsError) throw variantsError;

        let subtotal = 0;
        const orderItemsPayload: any[] = [];

        for (const item of items) {
            const variant = variants?.find((v: any) => v.id === item.variantId);
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

        const tax = subtotal * TAX_RATE;
        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const total = subtotal + tax + shipping;

        // 2. Create the order as 'pending' — it only becomes 'paid' once the
        //    webhook confirms payment, never based on anything the client says.
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

        // 3. Create the Stitch payment request.
        const stitchToken = await getStitchToken();

        const stitchResponse = await fetch('https://api.stitch.money/v2/payment-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${stitchToken}`,
            },
            body: JSON.stringify({
                amount: {
                    currency: 'ZAR',
                    quantity: Number(total.toFixed(2)),
                },
                externalReference: order.id,
                expireAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                payer: {
                    identifier: userId,
                    email: userData.user.email,
                    fullName: `${shippingAddress?.firstName ?? ''} ${shippingAddress?.lastName ?? ''}`.trim(),
                    mobileNumber: shippingAddress?.phone,
                },
                metadata: {
                    orderId: order.id,
                },
                paymentMethods: {
                    card: { enabled: true },
                    eft: { enabled: true },
                },
            }),
        });

        const stitchData = await stitchResponse.json();

        if (!stitchResponse.ok) {
            await supabaseAdmin.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
            return new Response(
                JSON.stringify({ error: stitchData.message || 'Failed to create payment request' }),
                { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        await supabaseAdmin
            .from('orders')
            .update({ stitch_payment_id: stitchData.id })
            .eq('id', order.id);

        const redirectUri = `${Deno.env.get('SITE_URL')}/order-success?orderId=${order.id}`;
        const checkoutUrl = `${stitchData.interaction.url}?redirect_uri=${encodeURIComponent(redirectUri)}`;

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