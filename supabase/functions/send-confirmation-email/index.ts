// supabase/functions/send-confirmation-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { renderCustomerOrderConfirmationEmail } from './templates/customerOrderConfirmation.ts'
import { renderAdminOrderAlertEmail } from './templates/adminOrderAlert.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface EmailRequest {
  to: string
  toName?: string
  orderId: string
  customerName: string
  orderTotal: number
  items?: Array<{
    name: string
    quantity: number
    price: number
  }>
  transactionId?: string
  // 'customer' (default) renders customerOrderConfirmation.ts; 'admin'
  // renders adminOrderAlert.ts, a separate store-facing "new order" email.
  emailType?: 'customer' | 'admin'
}

serve(async (req) => {
  console.log('🚀 Function invoked at:', new Date().toISOString());
  console.log('📋 Method:', req.method);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
      status: 200
    })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('🔑 Auth header present:', !!authHeader);

    if (!authHeader) {
      console.error('❌ No authorization header');
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    let body: EmailRequest
    try {
      body = await req.json()
      console.log('📧 Request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON payload',
          details: 'Request body must be valid JSON'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validation
    if (!body.to) {
      return new Response(
        JSON.stringify({ error: 'Recipient email (to) is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!body.orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Resend configuration from environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'admin@vrilcouture.co.za'
    const FROM_NAME = Deno.env.get('RESEND_FROM_NAME') || 'Vril Couture Collection'
    // Where replies to these emails land. Defaults to FROM_EMAIL, but kept
    // separate in case the sending address and the monitored inbox ever
    // diverge (e.g. a dedicated orders@ sender replying to admin@).
    const REPLY_TO_EMAIL = Deno.env.get('RESEND_REPLY_TO_EMAIL') || FROM_EMAIL
    const emailType = body.emailType === 'admin' ? 'admin' : 'customer'

    console.log('📧 Environment check:');
    console.log('  RESEND_API_KEY:', RESEND_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('  FROM_EMAIL:', FROM_EMAIL);

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured - missing API key' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`📧 Sending ${emailType} email to ${body.to} for order ${body.orderId}`)

    // Format items
    const formattedItems = (body.items || []).map(item => ({
      name: String(item.name || 'Item'),
      quantity: Number(item.quantity) || 1,
      price: Number(item.price).toFixed(2)
    }))

    const templateData = {
      customer_name: body.customerName.trim(),
      order_id: body.orderId.trim(),
      order_total: Number(body.orderTotal).toFixed(2),
      transaction_id: (body.transactionId || '').trim(),
      items: formattedItems,
      order_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      from_email: FROM_EMAIL,
      current_year: new Date().getFullYear().toString()
    }

    const { subject, html } = emailType === 'admin'
      ? renderAdminOrderAlertEmail(templateData)
      : renderCustomerOrderConfirmationEmail(templateData)

    // Prepare Resend payload
    const resendPayload = {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [body.toName ? `${body.toName.trim()} <${body.to.trim()}>` : body.to.trim()],
      reply_to: REPLY_TO_EMAIL,
      subject,
      html,
    }

    console.log('📤 Sending to Resend API...');

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resendPayload),
    })

    const responseText = await resendResponse.text()

    console.log(`📬 Resend response status: ${resendResponse.status}`);

    if (!resendResponse.ok) {
      console.error('❌ Resend error:', responseText);
      return new Response(
        JSON.stringify({
          error: 'Failed to send email',
          details: responseText
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`✅ Email sent successfully to ${body.to}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Confirmation email sent successfully',
        orderId: body.orderId,
        recipient: body.to,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Unexpected error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
