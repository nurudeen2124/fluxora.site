import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
const PORT = 3001

/** Inbound address for contact form notifications (override with CONTACT_TO). */
const CONTACT_TO = (process.env.CONTACT_TO || 'nbt2124@gmail.com').toLowerCase()

app.use(cors())
app.use(express.json())

// ── In-memory store ──────────────────────────────────────
const contacts = []
const subscribers = []
const stats = { visitors: 1247, projects: 50, uptime: 99.9 }
const recentRequests = new Map()

function clean(value = '') {
  return String(value).trim().replace(/\s+/g, ' ')
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function hitRateLimit(ip, key, maxRequests, windowMs) {
  const now = Date.now()
  const bucketKey = `${ip}:${key}`
  const existing = recentRequests.get(bucketKey) || []
  const active = existing.filter(ts => now - ts < windowMs)
  active.push(now)
  recentRequests.set(bucketKey, active)
  return active.length > maxRequests
}

function contactEmailBody({ name, email, service, message }) {
  const svc = service || 'Not specified'
  const text = [
    `New message from the FLUXORA website contact form.`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Service: ${svc}`,
    ``,
    `Message:`,
    message
  ].join('\n')

  const html = `
    <p>New message from the FLUXORA website contact form.</p>
    <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
    <strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a><br/>
    <strong>Service:</strong> ${escapeHtml(svc)}</p>
    <p><strong>Message</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `.trim()

  return { text, html }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Gmail-friendly defaults: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER + SMTP_PASS (app password). */
async function sendContactViaSmtp({ name, email, service, message }) {
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  if (!user || !pass) return { ok: false, skipped: true }

  const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 587)
  const { text, html } = contactEmailBody({ name, email, service, message })

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    })

    await transporter.sendMail({
      from: `"FLUXORA Website" <${user}>`,
      to: CONTACT_TO,
      replyTo: email,
      subject: `FLUXORA contact: ${name}`,
      text,
      html
    })
  } catch (err) {
    console.error('[contact] SMTP error:', err.message)
    return { ok: false, skipped: false }
  }

  return { ok: true, skipped: false }
}

async function deliverContactEmail(payload) {
  const smtp = await sendContactViaSmtp(payload)
  if (smtp.ok) return { ok: true }
  if (!smtp.skipped) return { ok: false, error: 'Could not send email (SMTP).' }

  console.warn(
    '[contact] SMTP not configured. Set SMTP_USER + SMTP_PASS (Gmail: use an App Password). ' +
      `Contact mail should go to ${CONTACT_TO}. Or set VITE_WEB3FORMS_ACCESS_KEY in .env for browser-side delivery (see api.js).`
  )
  return { ok: false, error: 'not_configured' }
}

// ── Routes ───────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  stats.visitors++
  res.json({ ok: true, timestamp: new Date().toISOString() })
})

// Get live stats
app.get('/api/stats', (req, res) => {
  res.json(stats)
})

// Contact form submission
app.post('/api/contact', async (req, res) => {
  const ip = req.ip || 'unknown'
  if (hitRateLimit(ip, 'contact', 4, 60_000)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' })
  }

  const name = clean(req.body.name)
  const email = clean(req.body.email).toLowerCase()
  const service = clean(req.body.service)
  const message = clean(req.body.message)

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' })
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' })
  }
  if (message.length < 12) {
    return res.status(400).json({ error: 'Please share a bit more detail (at least 12 characters).' })
  }

  const entry = { id: Date.now(), name, email, service, message, createdAt: new Date().toISOString() }
  contacts.push(entry)
  console.log(`New contact from ${name} <${email}>`)

  const delivered = await deliverContactEmail({ name, email, service, message })
  if (!delivered.ok) {
    if (delivered.error === 'not_configured') {
      return res.status(503).json({
        error:
          'The contact form cannot send email yet because the server is not configured. Please write to nbt2124@gmail.com directly for now.'
      })
    }
    return res.status(502).json({
      error:
        delivered.error ||
        'Your message was received but email delivery failed. Please try again or email nbt2124@gmail.com directly.'
    })
  }

  res.json({ ok: true, message: `Thanks ${name}, we'll be in touch within 24 hours!` })
})

// Newsletter subscribe
app.post('/api/subscribe', (req, res) => {
  const ip = req.ip || 'unknown'
  if (hitRateLimit(ip, 'subscribe', 8, 60_000)) {
    return res.status(429).json({ error: 'Too many requests. Please wait and try again.' })
  }

  const email = clean(req.body.email).toLowerCase()
  if (!email) return res.status(400).json({ error: 'Email is required.' })
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Please provide a valid email address.' })
  if (subscribers.find(s => s.email === email)) {
    return res.json({ ok: true, message: 'You\'re already subscribed!' })
  }
  subscribers.push({ email, createdAt: new Date().toISOString() })
  console.log(`New subscriber: ${email}`)
  res.json({ ok: true, message: 'You\'re on the list!' })
})

// Get all contacts (admin)
app.get('/api/admin/contacts', (req, res) => {
  res.json({ contacts, total: contacts.length })
})

app.listen(PORT, () => {
  console.log(`FLUXORA API running at http://localhost:${PORT}`)
  const hasSmtp = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
  if (!hasSmtp) {
    console.warn(
      `[contact] SMTP not set — API /contact will not email until SMTP_USER + SMTP_PASS are configured (inbox: ${CONTACT_TO}).`
    )
  }
})
