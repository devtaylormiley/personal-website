# Deploy to Vercel

Personal portfolio: Vite + React SPA. Build output is `dist/`.

## Build settings (Vercel)

| Setting | Value |
|---------|--------|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

[`vercel.json`](vercel.json) rewrites all routes to `index.html` so React Router deep links work.

## Environment variables (Vercel → Project → Settings → Environment Variables)

Set for **Production** (and Preview if you use branch deploys):

| Name | Notes |
|------|--------|
| `VITE_SUPABASE_URL` | From [Supabase](https://supabase.com) project settings |
| `VITE_SUPABASE_ANON_KEY` | Anon / publishable key only (never service role) |

Copy names from [`.env.example`](.env.example). The site runs without these; Blackfang sign-in, homebrew CRUD, and the contact form submission need them.

### Contact form email

The form saves to Supabase and triggers the `send-contact-email` Edge Function (Resend → `devtaylormiley@gmail.com`). Full setup: [`supabase/README.md`](supabase/README.md).

Quick checklist after cloning:

```bash
npm run supabase:link          # once, if not linked
npm run supabase:contact-db
npm run supabase:contact-webhook
npm run supabase:deploy-contact-email
```

Then set Resend secrets (see [`scripts/setup-contact-email.ps1`](scripts/setup-contact-email.ps1)). **No Resend keys go in Vercel** — only `VITE_SUPABASE_*` above.

`CONTACT_FROM_EMAIL` must use a domain verified in Resend. Until your domain is verified, use `onboarding@resend.dev` (test sender). Current production sender is configured in Supabase secrets, not in this repo.

## Local verify before deploy

```bash
npm install
npm run build
npm run preview
```

Open `/`, `/projects/ux`, and `/projects/schema-bridge` and refresh each URL.

## GitHub

1. Create a repo on GitHub (public or private).
2. From this folder (Git required):

```bash
git init
git add .
git commit -m "Initial portfolio deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USER/personal-website.git
git push -u origin main
```

**Include in git:** `public/` (images, `public/data/kt24/`, `public/data/schema-bridge/`).  
**Do not commit:** `.env`, `node_modules/`, `dist/` (already in `.gitignore`).

## Vercel

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. **Add New Project** → import this repo.
3. Confirm build settings above; add env vars; deploy.
4. Test `https://YOUR_PROJECT.vercel.app/projects/schema-bridge` (hard refresh).

## Custom domain

### 1. Buy a domain

Register at [Namecheap](https://namecheap.com) or [Porkbun](https://porkbun.com) (~$10–15/year for `.com`).

### 2. Add domain in Vercel

Project → **Settings** → **Domains** → add apex and `www`.

### 3. DNS at your registrar

Use the exact records Vercel shows. Typical setup:

| Type | Host | Value |
|------|------|--------|
| A | `@` | Vercel IP (e.g. `76.76.21.21`) |
| CNAME | `www` | `cname.vercel-dns.com` |

Wait for DNS (often &lt; 1 hour). Vercel issues HTTPS automatically.

Redirect `www` → apex (or the reverse) in Vercel Domains for one canonical URL.

## After launch

| Change | Action |
|--------|--------|
| Code / content | Push to `main` → Vercel redeploys |
| Schema Bridge JSON | `npm run migrate:schema-bridge`, commit `public/data/schema-bridge/`, push |
| KT24 data | `npm run sync:kt24`, commit, push |

## Cost

- Vercel Hobby: free
- Domain: ~$10–15/year
- Supabase free tier: free within limits
