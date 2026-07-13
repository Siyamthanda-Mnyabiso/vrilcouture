// supabase/functions/stitch-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Webhook } from 'npm:svix@1.96.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Stitch delivers webhooks via Svix. This endpoint is called by Stitch,
    // not by a logged-in Supabase user, so it can't rely on a Supabase JWT —
    // verify_jwt is disabled for this function (see supabase/config.toml) and
    // the Svix signature below is the real authentication. Without this check,
    // anyone who discovers the URL could POST a fake "payment successful"
    // event and mark any order as paid for free.
    const webhookSecret = Deno.env.get('STITCH_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('❌ STITCH_WEBHOOK_SECRET is not configured')
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Signature verification needs the exact raw bytes Stitch signed, so read
    // the body as text before any JSON parsing.
    const rawBody = await req.text()
    const svixHeaders = {
      'svix-id': req.headers.get('svix-id') ?? '',
      'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
      'svix-signature': req.headers.get('svix-signature') ?? '',
    }

    try {
      new Webhook(webhookSecret).verify(rawBody, svixHeaders)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody)
    console.log('📨 Webhook received:', JSON.stringify(payload, null, 2))

    // Stitch Express "LINK" webhook events carry no orderId/order_id/reference
    // field at all — confirmed from live payloads, e.g.:
    //   { "id": "2E9AEbFmxhgLL1G2aRskkk", "linkId": "2E9AEbFmxhgLL1G2aRskkk",
    //     "status": "PAID", "type": "LINK", "amount": 96800, ... }
    // `id`/`linkId` is Stitch's own payment-link id, which checkout/index.ts
    // already saves as orders.stitch_payment_id when the link is created —
    // that's the join key, not orders.id. `status` also comes back uppercase
    // ("PAID"), so comparisons must be case-insensitive.
    const stitchPaymentId = payload.linkId || payload.id
    const paymentStatus = String(payload.status || payload.paymentStatus || '').toUpperCase()
    const paymentId = payload.id || payload.paymentId || payload.transactionId

    console.log(`📦 Stitch Payment ID: ${stitchPaymentId}, Status: ${paymentStatus}`)

    // Only "PAID" has been observed in production so far. SUCCESSFUL/COMPLETED
    // are kept as a defensive fallback in case other Stitch event shapes use
    // different wording — not confirmed against a real payload.
    if (paymentStatus === 'PAID' || paymentStatus === 'SUCCESSFUL' || paymentStatus === 'COMPLETED') {
      // Initialize Supabase client with service role key for admin access
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
      )

      // Update order status to paid
      const { data, error } = await supabaseClient
        .from('orders')
        .update({
          status: 'paid',
          stitch_payment_id: paymentId,
          updated_at: new Date().toISOString()
        })
        .eq('stitch_payment_id', stitchPaymentId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating order:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to update order', details: error }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const orderId = data.id
      console.log(`✅ Order ${orderId} updated to paid`)

      // Send the confirmation email as a background task via waitUntil,
      // rather than awaiting it inline. Supabase's Edge Runtime can silently
      // kill an isolate mid-await ("wall clock shutdown" / "EarlyDrop" — see
      // https://supabase.com/docs/guides/troubleshooting/edge-functions-worker-timeouts-and-websocket-drops)
      // with no exception thrown at all, which is exactly what was
      // swallowing this email send: the order update landed, but nothing
      // after it — not even the catch block — ever ran or logged.
      // waitUntil keeps the isolate alive for this specific task without
      // making Stitch's webhook wait on it.
      const sendConfirmationEmail = async () => {
        try {
          if (!data.user_id) return

          const { data: userData } = await supabaseClient
            .from('users')
            .select('email, full_name')
            .eq('id', data.user_id)
            .single()

          if (!userData?.email) {
            console.log(`⚠️ No users row/email for user_id ${data.user_id}, skipping confirmation email`)
            return
          }

          const { data: itemsData } = await supabaseClient
            .from('order_items')
            .select('*')
            .eq('order_id', orderId)

          const emailPayload = {
            to: userData.email,
            customerName: userData.full_name || 'Customer',
            orderId: orderId,
            orderTotal: data.total,
            transactionId: paymentId,
            items: itemsData?.map(item => ({
              name: item.product_name,
              quantity: item.quantity,
              price: item.price
            })) || []
          }

          // Call the send-confirmation-email function
          const emailResponse = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-confirmation-email`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(emailPayload),
            }
          )

          if (emailResponse.ok) {
            console.log(`📧 Confirmation email sent to ${userData.email}`)
          } else {
            console.error('❌ Failed to send confirmation email:', await emailResponse.text())
          }
        } catch (emailError) {
          console.error('❌ Error sending confirmation email:', emailError)
          // Don't fail the webhook if email fails
        }
      }

      // @ts-ignore -- EdgeRuntime is a Supabase/Deno Deploy global, not in lib.deno.d.ts
      EdgeRuntime.waitUntil(sendConfirmationEmail())

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Order updated to paid',
          orderId
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Payment failed or other status
      console.log(`⚠️ Payment status: ${paymentStatus} - not updating order`)

      // Optionally update order status to 'failed'. These status values are
      // inferred (uppercase, matching the confirmed "PAID" case) — not yet
      // observed against a real failed/cancelled Stitch Express payload.
      if (['FAILED', 'CANCELLED', 'CANCELED', 'EXPIRED', 'DECLINED'].includes(paymentStatus)) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') || '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        )

        await supabaseClient
          .from('orders')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('stitch_payment_id', stitchPaymentId)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Payment status: ${paymentStatus}` 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})