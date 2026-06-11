## Supabase Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run [`schema.sql`](./schema.sql).
3. In Supabase Auth:
   - Enable Google provider.
   - Add your local/app redirect URL:
     - `http://localhost:5173/projects/blackfang-campaign/kt24-data`
4. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

After this, users can sign in with Google and CRUD only their own homebrew teams/operatives.
