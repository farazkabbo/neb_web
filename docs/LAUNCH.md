# Launch day on myneb.si

The app itself (sign-in, the 8 free questions, the AI) is the `mew` repo, at `app.myneb.si`. This
site is the front door. The plan and its checklists are in `mew/docs/LAUNCH_LIMITS.md`; the API
contract is [DESKTOP_API.md](DESKTOP_API.md) (the same file in both repos).

## What this repo does

- **`LAUNCH_MODE`** (`waitlist` by default, `open` on launch day; read per request, no rebuild).
  Open turns every "join the waitlist" into **Get neb**, a link to the public `/download` page:
  no account needed (people sign up the first time they open the app). The waitlist forms stay
  in the page, hidden, because `public/neb-home.js` looks them up by id.
- **`/download`**: Windows gets the installer named by `public/desktop/latest.json` (https on
  this site only); Mac and Linux get "neb is Windows-only for now. Mac is coming soon." Both have
  "Email me the link" and "Already have an account? Sign in".
- **`/api/download-link`**: "Email me the link". Keeps the address on the waitlist (source
  `download` or `download_mac`, an earlier signup unchanged), always sends the download-link
  email (Resend, 8 s timeout, one retry), 5 an hour per address (shared with the waitlist form)
  and 3 a day per email.
- **`/api/clerk-webhook`**: Clerk's `user.created` marks a waitlist email `converted`.
- **`/api/waitlist`**: 5 sign-ups an hour per address, counted in Upstash when it's set (shared by
  every instance), else per instance.

## Before launch

1. Add the two columns `/api/clerk-webhook` writes (in this site's Supabase project, SQL editor):

   ```sql
   alter table public.waitlist
     add column if not exists status text not null default 'waiting'
       check (status in ('waiting', 'converted')),
     add column if not exists converted_at timestamptz;
   ```

2. Clerk (the production instance the app uses) → Webhooks → add an endpoint
   `https://myneb.si/api/clerk-webhook` for `user.created`. Put its signing secret in Vercel as
   `CLERK_WEBHOOK_SECRET` (this endpoint's own secret, not the app's).
3. Clerk → Paths: allow `https://myneb.si/download` as a redirect after sign-up.
4. Vercel env: `NEXT_PUBLIC_APP_URL=https://app.myneb.si`, `UPSTASH_REDIS_REST_URL`,
   `UPSTASH_REDIS_REST_TOKEN`, and `LAUNCH_MODE=waitlist` until the day.
5. Upload the signed installer and `latest.json` to `public/desktop/` (desktop/README.md in
   `mew`), deploy, and check `/download` offers it.

**On the day:** set `LAUNCH_MODE=open` in Vercel. That's the only change.
