// Vercel serverless function: receives the contact form and emails it via Resend.
// Environment variables (set in the Vercel project settings):
//   RESEND_API_KEY  required, from resend.com
//   CONTACT_TO      optional, defaults to the studio inbox below
//   CONTACT_FROM    optional, defaults to Resend's shared test sender
const DEFAULT_TO = 'fieldstone.webagency@gmail.com';
const DEFAULT_FROM = 'Fieldstone Web Studio <onboarding@resend.dev>';

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Spam trap: real visitors never fill this in. Pretend it worked.
  if (clean(body['bot-field'], 200)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const site = clean(body.site, 300);
  const message = clean(body.message, 5000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter your name, a valid email and a message.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email sending is not set up yet.' });
  }

  const html =
    '<p><strong>Name:</strong> ' + escapeHtml(name) + '</p>' +
    '<p><strong>Email:</strong> ' + escapeHtml(email) + '</p>' +
    '<p><strong>Website:</strong> ' + escapeHtml(site || 'n/a') + '</p>' +
    '<p style="white-space:pre-wrap">' + escapeHtml(message) + '</p>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO || DEFAULT_TO],
        reply_to: email,
        subject: 'Website review request from ' + name,
        html,
      }),
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return res.status(502).json({ error: 'Could not send your message.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend request failed', err);
    return res.status(502).json({ error: 'Could not send your message.' });
  }
};
