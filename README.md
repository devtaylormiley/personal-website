# Taylor Miley — Personal portfolio

React + Vite portfolio site (hero, projects, UX case studies, Schema Bridge, Blackfang Campaign).

## Local development

```bash
npm install
npm run dev
```

## Deploy to Vercel

See **[DEPLOY.md](DEPLOY.md)** for domain purchase, GitHub push, Vercel import, env vars, and DNS.

Quick prep already in repo:

- [`vercel.json`](vercel.json) — SPA rewrites for React Router
- `.env` is gitignored; copy [`.env.example`](.env.example) locally for Supabase

After GitHub login, push with:

```powershell
.\scripts\push-to-github.ps1
```

