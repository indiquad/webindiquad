// utils/validate.js
// Basic server-side validation & sanitization for the contact form.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function validateContactPayload(body = {}) {
  const errors = [];
  const data = {
    name: (body.name || '').toString().trim(),
    email: (body.email || '').toString().trim(),
    company: (body.company || '').toString().trim(),
    phone: (body.phone || '').toString().trim(),
    role: (body.role || '').toString().trim(),
    interest: (body.interest || '').toString().trim(),
    message: (body.message || '').toString().trim(),
  };

  if (!data.name) errors.push('Name is required.');
  if (!data.email || !EMAIL_RE.test(data.email)) errors.push('A valid email is required.');
  if (!data.company) errors.push('Company is required.');
  if (!data.role) errors.push('Role is required.');
  if (!data.interest) errors.push('Interest area is required.');

  // Length guards to keep emails sane and block abuse
  if (data.name.length > 200) errors.push('Name is too long.');
  if (data.company.length > 200) errors.push('Company is too long.');
  if (data.message.length > 5000) errors.push('Message is too long.');

  return { data, errors };
}
