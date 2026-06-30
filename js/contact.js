// js/contact.js
// Wires up #contactForm to POST /api/contact, which sends the email via Resend.

(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit');
  const originalLabel = submitBtn ? submitBtn.textContent : '';

  // Status message element (created once, inserted after the button)
  let statusEl = form.querySelector('.form-status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.className = 'form-status';
    submitBtn.insertAdjacentElement('afterend', statusEl);
  }

  function showStatus(type, message) {
    statusEl.textContent = message;
    statusEl.className = 'form-status visible ' + type;
  }

  function clearFieldErrors() {
    form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('is-loading', isLoading);
    submitBtn.classList.remove('is-success', 'is-error');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearFieldErrors();
    statusEl.classList.remove('visible', 'success', 'error');

    // Basic client-side required-field check (mirrors server-side rules)
    const requiredFields = form.querySelectorAll('[required]');
    let firstInvalid = null;
    requiredFields.forEach((field) => {
      const empty =
        field.type === 'checkbox' ? !field.checked : !String(field.value || '').trim();
      if (empty) {
        field.classList.add('invalid');
        if (!firstInvalid) firstInvalid = field;
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
      showStatus('error', 'Please fill in all required fields.');
      return;
    }

    const payload = {
      name: form.elements['name']?.value || '',
      email: form.elements['email']?.value || '',
      company: form.elements['company']?.value || '',
      phone: form.elements['phone']?.value || '',
      role: form.elements['role']?.value || '',
      interest: form.elements['interest']?.value || '',
      message: form.elements['message']?.value || '',
      website: form.elements['website']?.value || '', // honeypot, normally empty
    };

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result = {};
      try {
        result = await res.json();
      } catch {
        // non-JSON response (e.g. a Vercel error page) — fall through to generic error
      }

      if (!res.ok || !result.ok) {
        throw new Error(result.error || `Request failed (HTTP ${res.status}).`);
      }

      setLoading(false);
      submitBtn.classList.add('is-success');
      submitBtn.textContent = "Thank you — we'll be in touch shortly ✓";
      showStatus('success', "Your enquiry has been sent. We'll respond within one business day.");
      form.reset();
    } catch (err) {
      setLoading(false);
      submitBtn.classList.add('is-error');
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
      showStatus(
        'error',
        err.message ||
          'Something went wrong sending your message. Please try again or email us directly at business@indiquad.com.'
      );
      console.error('[contact] submission failed:', err);
    }
  });
})();
