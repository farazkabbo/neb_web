# neb — waitlist site (`neb.exe`)

A retro-desktop waitlist page for neb. Next.js (App Router) + TypeScript + Tailwind + 98.css (font overridden with Pixelify Sans), Supabase for storage, Resend for email, hosted on Vercel.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

Create the table in the Supabase SQL editor:

```sql
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text,
  source text,
  created_at timestamptz default now()
);
alter table waitlist enable row level security;   -- no public policies
```

In Resend: verify your sending domain, create an Audience, copy its ID.

## Env vars

| Var | What |
|---|---|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_AUDIENCE_ID` | Audience that signups are added to |
| `RESEND_FROM` | e.g. `neb <hello@yourdomain.com>` (verified domain) |
| `NEXT_PUBLIC_LAUNCH_VIDEO_URL` | Empty until launch day |

## Media: `scripts/prep-media.sh`

Put the source files in `assets-in/` (`neb-logo/*`, `neb-the-nudge-real.mp4`, optional `founder.jpg`), install ffmpeg, then:

```bash
npm run prep-media
```

It copies brand files to `public/brand/` (and the app icon to `app/icon.svg`), downloads the four Higgsfield videos once into `assets-in/higgsfield/`, and writes to `public/media/`: H.264 `.mp4` (CRF 23, faststart, ≤1080p) + `.webm` + 2 s poster `.jpg` for every video, plus the muted ≤2 Mbps loops `clip-notice`, `clip-ask`, `clip-prove` and `clip-full` (with sound). Commit `public/media/`.

Until it runs, the site uses placeholder brand SVGs and empty video frames. Generated Higgsfield images (wallpaper, pixel icons, OG) live raw in `assets-in/higgsfield/raw/`; `node scripts/prep-images.mjs` writes `public/media/wallpaper.webp`, the 64 px nearest-neighbour `icon-*.png`, and the 1200×630 `app/opengraph-image.png`.

## Waitlist

`POST /api/waitlist` → zod validation, honeypot (`company`), 5 req / IP / 10 min (in-memory), upsert into Supabase, add to the Resend Audience, send "You're on the list." Signups via "send it to me" (mobile) get a link to open the site on a computer. Duplicates get the same success message and no second email.

## Launch day

1. Set `NEXT_PUBLIC_LAUNCH_VIDEO_URL` in Vercel and redeploy. The `launch_film.mp4` window appears and takes focus.
2. In Resend → Broadcasts, create a broadcast to the waitlist Audience and send it.

> **Launch-day checklist:** set `NEXT_PUBLIC_LAUNCH_VIDEO_URL` in Vercel, redeploy (the tablet switches from "coming soon" to the launch film), then send the Resend Broadcast to the waitlist Audience.

## Launch day (11:47 page)

1. Set `NEXT_PUBLIC_LAUNCH_VIDEO_URL` to the film URL.
2. Redeploy. The tablet dialog becomes "it's here" with "▶ play the launch film".
3. Send the Resend Broadcast to `RESEND_AUDIENCE_ID`.

## Going live on myneb.si

Contact inbox: **mynebsi@gmail.com** (replies to waitlist emails land here via `RESEND_REPLY_TO`).

1. **Supabase**: sign in with mynebsi@gmail.com, create a project, run the `waitlist` SQL above. Copy *Project URL* → `SUPABASE_URL` and *service_role key* (Settings → API) → `SUPABASE_SERVICE_ROLE_KEY`.
2. **Resend**: sign up with mynebsi@gmail.com → Domains → add `myneb.si`. Resend shows DNS records (MX + TXT for SPF on `send`, TXT for DKIM `resend._domainkey`). In **Wix → Domains → myneb.si → Manage DNS records**, add each one exactly. Wait until Resend says *Verified*. Then create an API key → `RESEND_API_KEY`, and an Audience → `RESEND_AUDIENCE_ID`.
3. **GitHub**: push this repo.
4. **Vercel**: sign in, *Add New → Project*, import the repo. Add all env vars from `.env.example` (filled in). Deploy.
5. **Domain**: Vercel → Project → Settings → Domains → add `myneb.si` and `www.myneb.si`. Vercel shows the records; in Wix DNS set:
   - `A` record, host `@` → `76.76.21.21`
   - `CNAME` record, host `www` → `cname.vercel-dns.com`
   (Delete Wix's existing `A`/`CNAME` for `@`/`www` first.) SSL is automatic once DNS resolves.
6. Test: submit your own email on https://myneb.si → row in Supabase, contact in the Audience, confirmation email in the inbox.
