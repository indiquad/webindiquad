// api/contact.js
//
// Vercel serverless function (Node.js runtime).
// Receives the contact form POST, validates it, and sends two emails
// via Resend: one notification to your team, one auto-reply to the user.
//
// REQUIRED ENV VAR (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY = re_xxxxxxxxxxxxxxxx
//
// OPTIONAL ENV VARS:
//   CONTACT_TO_EMAIL   = where enquiries land, e.g. business@indiquad.com (default below)
//   CONTACT_FROM_EMAIL = verified sender, e.g. enquiries@indiquad.com
//                        MUST be on a domain you've verified in Resend.
//                        If unset, falls back to Resend's onboarding sender
//                        (onboarding@resend.dev) which only works for testing
//                        and only delivers to the Resend account owner's email.

import { Resend } from 'resend';
import { validateContactPayload } from '../utils/validate.js';
import { isRateLimited } from '../utils/rateLimit.js';
import { adminEmailHtml, adminEmailText } from '../templates/adminEmail.js';
import { customerEmailHtml, customerEmailText } from '../templates/customerEmail.js';

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'business@indiquad.com';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Indiquad <onboarding@resend.dev>';

export default async function handler(req, res) {
  // CORS / method guard
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  // Fail fast with a clear error if the API key isn't configured —
  // this is the #1 cause of "email not sending" in this kind of setup.
  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] Missing RESEND_API_KEY environment variable.');
    return res.status(500).json({
      ok: false,
      error: 'Email service is not configured on the server (missing RESEND_API_KEY).',
    });
  }

  // Basic rate limiting (best-effort, see utils/rateLimit.js)
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please try again in a minute.' });
  }

  // Vercel parses JSON bodies automatically when Content-Type is
  // application/json, but guard in case the body arrives as a string.
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid JSON body.' });
    }
  }

  // Honeypot field — if your form includes a hidden "website" input that
  // real users never fill, bots that auto-fill every field will trip it.
  if (body && body.website) {
    return res.status(200).json({ ok: true }); // pretend success, drop silently
  }

  const { data, errors } = validateContactPayload(body || {});
  if (errors.length) {
    return res.status(400).json({ ok: false, error: errors.join(' ') });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // 1. Notify the Indiquad team
    const adminResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: data.email,
      subject: `New Enquiry — ${data.company} (${data.interest})`,
      html: adminEmailHtml(data),
      text: adminEmailText(data),
    });

    if (adminResult.error) {
      console.error('[contact] Resend admin email error:', adminResult.error);
      return res.status(502).json({
        ok: false,
        error: `Email provider rejected the message: ${adminResult.error.message || 'unknown error'}`,
      });
    }

    // 2. Auto-reply to the customer (non-blocking failure — we don't
    //    fail the whole request if just the auto-reply fails)
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.email,
        subject: 'Thanks for reaching out to Indiquad',
        html: customerEmailHtml(data),
        text: customerEmailText(data),
      });
    } catch (autoReplyErr) {
      console.error('[contact] Auto-reply email failed (non-fatal):', autoReplyErr);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[contact] Unexpected error sending email:', err);
    return res.status(500).json({
      ok: false,
      error: 'Something went wrong sending your message. Please try again or email us directly.',
    });
  }
}
