// supabase/functions/test-checkout/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        console.log('Test checkout function called');

        // Return a mock checkout URL
        const mockCheckoutUrl = 'https://www.google.com';
        
        return new Response(
            JSON.stringify({
                success: true,
                checkoutUrl: mockCheckoutUrl,
                testMode: true,
                message: 'Test checkout function - redirecting to Google',
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            }
        )
    } catch (error) {
        console.error('Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            }
        )
    }
})