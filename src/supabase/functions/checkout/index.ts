import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SERVICE_ROLE_KEY")!
        );

        const authHeader = req.headers.get("Authorization")!;
        const token = authHeader.replace("Bearer ", "");

        const { data: userData, error: userError } =
            await supabase.auth.getUser(token);

        if (userError || !userData.user) {
            throw new Error("Unauthorized");
        }

        const user = userData.user;

        const { items } = await req.json();

        // 1. Calculate total
        const total = items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );

        // 2. Create order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: user.id,
                total,
                status: "pending",
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. Create order items
        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.productId ?? null,
            variant_id: item.variantId ?? null,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size ?? null,
            color: item.color ?? null,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // 4. Call Stitch Express
        const stitchRes = await fetch("https://api.stitch.money/v2/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Deno.env.get("STITCH_SECRET_KEY")}`,
            },
            body: JSON.stringify({
                amount: Math.round(total * 100),
                currency: "ZAR",
                reference: order.id,
                redirectUrl: `${Deno.env.get("SITE_URL")}/order-success/${order.id}`,
                metadata: {
                    orderId: order.id,
                    userId: user.id,
                },
            }),
        });

        const stitchData = await stitchRes.json();

        if (!stitchRes.ok) {
            throw new Error(stitchData.message || "Stitch error");
        }

        return new Response(
            JSON.stringify({
                checkoutUrl: stitchData.checkoutUrl,
            }),
            {
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (err) {
        return new Response(
            JSON.stringify({
                error: err instanceof Error ? err.message : "Server error",
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }
});