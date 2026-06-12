export const BLACKFANG_ALLOWED_SIGNIN_EMAIL = 'devtaylormiley@gmail.com'

export function isBlackfangSignInAllowed(email) {
  if (!email) return false
  return email.toLowerCase() === BLACKFANG_ALLOWED_SIGNIN_EMAIL.toLowerCase()
}

/** Sign-in UI is hidden unless this env flag is set or ?signin=1 is in the URL. */
export function isBlackfangSignInVisible(search = '') {
  if (import.meta.env.VITE_BF_SIGNIN_VISIBLE === 'true') return true
  if (!search) return false
  return new URLSearchParams(search).get('signin') === '1'
}
