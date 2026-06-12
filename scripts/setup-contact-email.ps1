# Configure Resend secrets for the send-contact-email Edge Function.
# Run from repo root after creating a Resend API key and verifying a sending domain.
#
# Usage:
#   $env:RESEND_API_KEY = "re_..."
#   $env:CONTACT_FROM_EMAIL = "Contact <contact@yourdomain.com>"
#   .\scripts\setup-contact-email.ps1

param(
  [string]$ResendApiKey = $env:RESEND_API_KEY,
  [string]$FromEmail = $env:CONTACT_FROM_EMAIL,
  [string]$ToEmail = "devtaylormiley@gmail.com"
)

$ErrorActionPreference = "Stop"

if (-not $ResendApiKey) {
  Write-Error "Set RESEND_API_KEY (Resend dashboard → API Keys)."
}

if (-not $FromEmail) {
  Write-Error "Set CONTACT_FROM_EMAIL (verified sender in Resend, e.g. 'Portfolio <contact@yourdomain.com>')."
}

Write-Host "Setting Supabase secrets..."
npx supabase secrets set "RESEND_API_KEY=$ResendApiKey" "CONTACT_FROM_EMAIL=$FromEmail" "CONTACT_TO_EMAIL=$ToEmail"

Write-Host "Redeploying send-contact-email..."
npx supabase functions deploy send-contact-email --no-verify-jwt

Write-Host "Done. Submit a test message on the contact form and check Gmail."
