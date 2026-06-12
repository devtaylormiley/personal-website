import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const RESEND_API_URL = 'https://api.resend.com/emails'

interface ContactInquiryRecord {
  id: string
  name: string
  email: string
  message: string
  form_theme?: string | null
  color_mode?: string | null
  created_at?: string
}

interface DatabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  schema: string
  record: ContactInquiryRecord
  old_record: ContactInquiryRecord | null
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const toEmail = Deno.env.get('CONTACT_TO_EMAIL') ?? 'devtaylormiley@gmail.com'
  const fromEmail = Deno.env.get('CONTACT_FROM_EMAIL')

  if (!resendApiKey || !fromEmail) {
    console.error('Missing RESEND_API_KEY or CONTACT_FROM_EMAIL')
    return jsonResponse({ error: 'Email service not configured' }, 500)
  }

  let payload: DatabaseWebhookPayload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  if (payload.table !== 'contact_inquiries' || payload.type !== 'INSERT' || !payload.record) {
    return jsonResponse({ ok: true, skipped: true })
  }

  const { name, email, message, form_theme, color_mode } = payload.record
  const themeNote = [form_theme, color_mode].filter(Boolean).join(' / ')
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br>')

  const html = `
    <h2>New portfolio contact message</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    ${themeNote ? `<p><strong>Form style:</strong> ${escapeHtml(themeNote)}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${safeMessage}</p>
  `.trim()

  const text = [
    'New portfolio contact message',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    themeNote ? `Form style: ${themeNote}` : '',
    '',
    message,
  ]
    .filter((line) => line !== '')
    .join('\n')

  const resendResponse = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Portfolio contact: ${name}`,
      html,
      text,
    }),
  })

  if (!resendResponse.ok) {
    const errorBody = await resendResponse.text()
    console.error('Resend API error', resendResponse.status, errorBody)
    let resendError: unknown = errorBody
    try {
      resendError = JSON.parse(errorBody)
    } catch {
      // keep raw text
    }
    return jsonResponse(
      {
        error: 'Failed to send email',
        resendStatus: resendResponse.status,
        resendError,
      },
      500,
    )
  }

  return jsonResponse({ ok: true })
})
