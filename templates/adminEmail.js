// templates/adminEmail.js
import { escapeHtml } from '../utils/validate.js';

export function adminEmailHtml({ name, email, company, phone, role, interest, message }) {
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    company: escapeHtml(company),
    phone: escapeHtml(phone || '—'),
    role: escapeHtml(role),
    interest: escapeHtml(interest),
    message: escapeHtml(message || '—').replace(/\n/g, '<br>'),
  };

  return `
  <div style="font-family: 'DM Sans', Arial, sans-serif; background:#F5F3EE; padding:32px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #DDD9D0;">
      <div style="background:#0C1D39;padding:24px 28px;">
        <span style="color:#fff;font-size:16px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">INDIQUAD</span>
        <div style="color:#D4620C;font-size:13px;margin-top:4px;">New Contact Enquiry</div>
      </div>
      <div style="padding:28px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1E2D45;">
          <tr><td style="padding:8px 0;color:#6B7280;width:130px;">Name</td><td style="padding:8px 0;font-weight:600;">${safe.name}</td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${safe.email}" style="color:#D4620C;">${safe.email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;">Company</td><td style="padding:8px 0;">${safe.company}</td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;">Phone</td><td style="padding:8px 0;">${safe.phone}</td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;">Role</td><td style="padding:8px 0;">${safe.role}</td></tr>
          <tr><td style="padding:8px 0;color:#6B7280;">Interested in</td><td style="padding:8px 0;">${safe.interest}</td></tr>
        </table>
        <div style="margin-top:18px;padding-top:18px;border-top:1px solid #ECEAE4;">
          <div style="color:#6B7280;font-size:13px;margin-bottom:6px;">Message</div>
          <div style="font-size:14px;line-height:1.6;color:#1E2D45;">${safe.message}</div>
        </div>
      </div>
      <div style="background:#F5F3EE;padding:16px 28px;font-size:12px;color:#6B7280;">
        Sent automatically from the Indiquad website contact form.
      </div>
    </div>
  </div>`;
}

export function adminEmailText({ name, email, company, phone, role, interest, message }) {
  return [
    'New Contact Enquiry — Indiquad',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    `Phone: ${phone || '—'}`,
    `Role: ${role}`,
    `Interested in: ${interest}`,
    '',
    'Message:',
    message || '—',
  ].join('\n');
}
