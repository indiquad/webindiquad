// templates/customerEmail.js
import { escapeHtml } from '../utils/validate.js';

export function customerEmailHtml({ name }) {
  const safeName = escapeHtml(name).split(' ')[0] || 'there';

  return `
  <div style="font-family: 'DM Sans', Arial, sans-serif; background:#F5F3EE; padding:32px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #DDD9D0;">
      <div style="background:#0C1D39;padding:24px 28px;">
        <span style="color:#fff;font-size:16px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">INDIQUAD</span>
      </div>
      <div style="padding:28px;">
        <p style="font-size:15px;color:#1E2D45;line-height:1.7;">Hi ${safeName},</p>
        <p style="font-size:15px;color:#1E2D45;line-height:1.7;">
          Thanks for reaching out to Indiquad. We've received your enquiry and our team
          will get back to you within one business day.
        </p>
        <p style="font-size:15px;color:#1E2D45;line-height:1.7;">
          In the meantime, feel free to reply to this email if you'd like to add anything.
        </p>
        <p style="font-size:15px;color:#1E2D45;line-height:1.7;margin-top:24px;">
          — Team Indiquad
        </p>
      </div>
      <div style="background:#F5F3EE;padding:16px 28px;font-size:12px;color:#6B7280;">
        Indiquad Technologies Pvt. Ltd. · New Delhi, India
      </div>
    </div>
  </div>`;
}

export function customerEmailText({ name }) {
  const safeName = (name || '').split(' ')[0] || 'there';
  return [
    `Hi ${safeName},`,
    '',
    "Thanks for reaching out to Indiquad. We've received your enquiry and our team will get back to you within one business day.",
    '',
    '— Team Indiquad',
  ].join('\n');
}
