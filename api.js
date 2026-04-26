const BASE = import.meta.env?.VITE_API_BASE?.trim() || '/api'

/** Public access key from web3forms.com (register with nbt2124@gmail.com). Sends mail without server SMTP. */
const WEB3FORMS_KEY = import.meta.env?.VITE_WEB3FORMS_ACCESS_KEY?.trim()

async function request(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Request failed')
    }
    return data
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchStats() {
  try {
    return await request('/stats')
  } catch { return null }
}

export async function submitContact(data) {
  if (WEB3FORMS_KEY) {
    const name = String(data.name || '').trim()
    const email = String(data.email || '').trim()
    const service = String(data.service || '').trim()
    const message = String(data.message || '').trim()
    const bodyText = [
      'New message from the FLUXORA website contact form.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${service || 'Not specified'}`,
      '',
      'Message:',
      message
    ].join('\n')

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `FLUXORA contact: ${name}`,
        name,
        email,
        message: bodyText
      })
    })

    const resData = await response.json().catch(() => ({}))
    if (!response.ok || resData.success !== true) {
      throw new Error(resData.message || 'Could not send message. Please try again.')
    }
    return {
      ok: true,
      message: resData.message || "Thanks — we'll be in touch within 24 hours!"
    }
  }

  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function subscribe(email) {
  return request('/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email })
  })
}

export async function ping() {
  try {
    return await request('/health')
  } catch { return null }
}
