// supabase/functions/send-confirmation-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    // Get SendGrid configuration from environment variables
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@vrilcouture.co.za'
    const FROM_NAME = Deno.env.get('SENDGRID_FROM_NAME') || 'Vril Couture Collection'
    const TEMPLATE_ID = Deno.env.get('SENDGRID_TEMPLATE_ID')

    console.log('📧 Environment check:');
    console.log('  SENDGRID_API_KEY:', SENDGRID_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('  TEMPLATE_ID:', TEMPLATE_ID ? '✅ Set' : '❌ Missing');
    console.log('  FROM_EMAIL:', FROM_EMAIL);

    if (!SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured - missing API key' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!TEMPLATE_ID) {
      console.error('❌ SENDGRID_TEMPLATE_ID not configured');
      return new Response(
        JSON.stringify({ error: 'Email template not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`📧 Sending confirmation email to ${body.to} for order ${body.orderId}`)

    // Format items
    const formattedItems = (body.items || []).map(item => ({
      name: String(item.name || 'Item'),
      quantity: Number(item.quantity) || 1,
      price: Number(item.price).toFixed(2)
    }))

    // Prepare SendGrid payload
    const sendgridPayload = {
      personalizations: [
        {
          to: [
            {
              email: body.to.trim(),
              name: (body.toName || body.customerName).trim(),
            }
          ],
          dynamic_template_data: {
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
          },
        },
      ],
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      reply_to: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      template_id: TEMPLATE_ID,
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true },
      },
    }

    console.log('📤 Sending to SendGrid API...');

    // Send email via SendGrid
    const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendgridPayload),
    })

    const responseText = await sendgridResponse.text()
    
    console.log(`📬 SendGrid response status: ${sendgridResponse.status}`);
    
    if (!sendgridResponse.ok) {
      console.error('❌ SendGrid error:', responseText);
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
        message: error.message || 'Unknown error occurred',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})