// supabase/functions/contact-form/index.ts
//
// Receives the website contact form and emails the enquiry to the store's
// inbox through Resend (the same RESEND_* secrets the order emails use).
//
// Optional secret:
//   CONTACT_TO_EMAIL  where enquiries are delivered (default admin@vrilcouture.co.za)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ALLOWED_ORIGINS = [
  'https://www.vrilcouture.co.za',
  'https://vrilcouture.co.za',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

const MAX = { name: 100, email: 254, subject: 150, message: 5000 }

// Best-effort limit per visitor (an edge instance's memory, so it resets when
// the instance recycles). Stops casual form flooding.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function corsFor(req: Request) {
  const origin = req.headers.get('Origin') ?? ''
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsFor(req), 'Content-Type': 'application/json' },
  })
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Single-line fields: no line breaks (blocks header injection) or control characters.
function oneLine(value: unknown, max: number) {
  // eslint-disable-next-line no-control-regex -- stripping control characters is the point
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max)
}

function rateLimited(key: string) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent)
    return true
  }
  recent.push(now)
  hits.set(key, recent)
  return false
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsFor(req) })
  }

  if (req.method !== 'POST') {
    return json(req, { error: 'Method not allowed' }, 405)
  }

  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return json(req, { error: 'Invalid request' }, 400)
  }

  // Hidden "website" field: real visitors never fill it in, bots usually do.
  // Pretend it worked so the bot learns nothing.
  if (String(payload.website ?? '').trim() !== '') {
    return json(req, { success: true })
  }

  const name = oneLine(payload.name, MAX.name)
  const email = oneLine(payload.email, MAX.email)
  const subject = oneLine(payload.subject, MAX.subject)
  // eslint-disable-next-line no-control-regex -- strip NUL characters
  const message = String(payload.message ?? '').replace(/\u0000/g, '').trim().slice(0, MAX.message)

  if (!name) return json(req, { error: 'Please enter your name.' }, 400)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(req, { error: 'Please enter a valid email address.' }, 400)
  }
  if (!message) return json(req, { error: 'Please enter a message.' }, 400)

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  if (rateLimited(ip)) {
    return json(req, { error: 'Too many messages. Please try again in a few minutes.' }, 429)
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  const FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'admin@vrilcouture.co.za'
  const FROM_NAME = Deno.env.get('RESEND_FROM_NAME') || 'Vril Couture Collection'
  const TO_EMAIL = Deno.env.get('CONTACT_TO_EMAIL') || 'admin@vrilcouture.co.za'

  if (!RESEND_API_KEY) {
    console.error('contact-form: RESEND_API_KEY not configured')
    return json(req, { error: 'Message could not be sent right now. Please try again later.' }, 500)
  }

  const received = new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
      <h2 style="margin: 0 0 16px;">New website enquiry</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; width: 90px; color: #666;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Email</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Subject</td><td>${escapeHtml(subject || '(none)')}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Received</td><td>${escapeHtml(received)}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
      <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${escapeHtml(message)}</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
      <p style="font-size: 12px; color: #888;">Sent from the contact form on vrilcouture.co.za. Replying to this email goes to ${escapeHtml(name)}.</p>
    </div>`

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      reply_to: email,
      subject: `Website enquiry: ${subject || 'New message'} (from ${name})`,
      html,
    }),
  })

  if (!resendResponse.ok) {
    console.error('contact-form: Resend error', resendResponse.status, await resendResponse.text())
    return json(req, { error: 'Message could not be sent right now. Please try again later.' }, 502)
  }

  return json(req, { success: true })
})
