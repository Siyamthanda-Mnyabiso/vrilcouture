// supabase/functions/send-confirmation-email/templates/customerOrderConfirmation.ts
//
// Customer-facing order confirmation, sent via Resend once stitch-webhook
// confirms payment. Recreated in-repo as part of the SendGrid -> Resend
// migration — the previous version of this email lived only as a dynamic
// template inside the SendGrid dashboard, never in this codebase, so this
// copy is new. Review/adjust the wording as needed.

import type { OrderEmailData, RenderedEmail } from './types.ts';

export function renderCustomerOrderConfirmationEmail(data: OrderEmailData): RenderedEmail {
    const subject = `Order Confirmed — Vril Couture #${data.order_id}`;

    const itemRows = data.items
        .map(
            (item) => `
                <tr>
                  <td style="padding:10px 0; font-size:14px; color:#333333; border-bottom:1px solid #f0f0f0;">${item.name}</td>
                  <td style="padding:10px 0; font-size:14px; color:#333333; border-bottom:1px solid #f0f0f0; text-align:center;">${item.quantity}</td>
                  <td style="padding:10px 0; font-size:14px; color:#333333; border-bottom:1px solid #f0f0f0; text-align:right;">R${item.price}</td>
                </tr>`
        )
        .join('');

    const transactionRow = data.transaction_id
        ? `
                <tr>
                  <td style="padding:14px 18px; font-size:14px; color:#666666; border-bottom:1px solid #e5e5e5;">Transaction ID</td>
                  <td style="padding:14px 18px; font-size:14px; color:#111111; text-align:right; border-bottom:1px solid #e5e5e5;">${data.transaction_id}</td>
                </tr>`
        : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Order Confirmed</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#111111; padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#ffffff; font-size:13px; letter-spacing:2px; text-transform:uppercase;">
                    Vril Couture
                  </td>
                </tr>
                <tr>
                  <td style="color:#ffffff; font-size:22px; font-weight:bold; padding-top:6px;">
                    Thank you for your order
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <p style="margin:0 0 16px 0; font-size:15px; color:#333333; line-height:1.5;">
                Hi ${data.customer_name}, we've received your payment and your order is
                confirmed. Details below.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5; border-radius:6px;">
                <tr>
                  <td style="padding:14px 18px; font-size:14px; color:#666666; border-bottom:1px solid #e5e5e5;">Order ID</td>
                  <td style="padding:14px 18px; font-size:14px; color:#111111; text-align:right; border-bottom:1px solid #e5e5e5;">${data.order_id}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px; font-size:14px; color:#666666; border-bottom:1px solid #e5e5e5;">Date</td>
                  <td style="padding:14px 18px; font-size:14px; color:#111111; text-align:right; border-bottom:1px solid #e5e5e5;">${data.order_date}</td>
                </tr>${transactionRow}
                <tr>
                  <td style="padding:14px 18px; font-size:14px; color:#666666; font-weight:bold;">Order Total</td>
                  <td style="padding:14px 18px; font-size:16px; color:#111111; text-align:right; font-weight:bold;">R${data.order_total}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding:20px 32px 8px 32px;">
              <p style="margin:0 0 10px 0; font-size:13px; letter-spacing:1px; text-transform:uppercase; color:#999999;">
                Items
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0; font-size:13px; color:#999999; border-bottom:1px solid #e5e5e5;">Item</td>
                  <td style="padding:8px 0; font-size:13px; color:#999999; border-bottom:1px solid #e5e5e5; text-align:center;">Qty</td>
                  <td style="padding:8px 0; font-size:13px; color:#999999; border-bottom:1px solid #e5e5e5; text-align:right;">Price</td>
                </tr>${itemRows}
              </table>
            </td>
          </tr>

          <!-- Note -->
          <tr>
            <td style="padding:24px 32px 32px 32px;">
              <p style="margin:0; font-size:13px; color:#666666; line-height:1.6;">
                We'll be in touch once your order ships. Questions about your order or our
                return policy? Just reply to this email or reach us at
                <a href="mailto:${data.from_email}" style="color:#111111;">${data.from_email}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; background-color:#fafafa; border-top:1px solid #eeeeee;">
              <p style="margin:0; font-size:12px; color:#999999; text-align:center;">
                &copy; ${data.current_year} Vril Couture
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    return { subject, html };
}
