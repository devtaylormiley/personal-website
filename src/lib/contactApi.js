import { supabase } from './supabaseClient'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactForm({ name, email, message }) {
  const trimmedName = name.trim()
  const trimmedEmail = email.trim()
  const trimmedMessage = message.trim()

  if (!trimmedName) {
    return { ok: false, error: 'Please enter your name.' }
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  if (trimmedMessage.length < 10) {
    return { ok: false, error: 'Please write at least a few sentences about your project.' }
  }

  return {
    ok: true,
    data: {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    },
  }
}

export async function submitContactInquiry({
  name,
  email,
  message,
  formTheme,
  colorMode,
  website = '',
}) {
  if (website.trim()) {
    return { ok: true }
  }

  const validation = validateContactForm({ name, email, message })
  if (!validation.ok) {
    return validation
  }

  if (!supabase) {
    return {
      ok: false,
      error:
        'The contact form is not connected yet. Email me directly at devtaylormiley@gmail.com.',
    }
  }

  const { error } = await supabase.from('contact_inquiries').insert(
    {
      name: validation.data.name,
      email: validation.data.email,
      message: validation.data.message,
      form_theme: formTheme ?? null,
      color_mode: colorMode ?? null,
    },
    { returning: 'minimal' },
  )

  if (error) {
    console.error('contact_inquiries insert failed', error)
    return {
      ok: false,
      error:
        'Your message could not be sent right now. Try again or email devtaylormiley@gmail.com directly.',
    }
  }

  return { ok: true }
}
