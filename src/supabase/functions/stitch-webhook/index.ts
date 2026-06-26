import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
);

serve(async (req) => {

    const payload = await req.json();

    const orderId = payload?.metadata?.orderId;

    if (!orderId) {
        return new Response("No orderId", { status: 400 });
    }

    if (payload.type === "payment.success") {

        await supabase
            .from("orders")
            .update({
                status: "paid",
                stitch_payment_id: payload.id,
            })
            .eq("id", orderId);
    }

    return new Response("ok");
});