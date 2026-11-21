# Pro fake-door test

The homepage has a `neb_pro.exe` window with "upgrade to pro – $19/month". Nothing is sold or charged.

- Click → `POST /api/pro {action:"click"}` stores one anonymous row (no IP, no email). The window
  then says Pro launches next month and asks for an email.
- Email → `POST /api/pro {action:"join", email}` stores the email (one row per email) and shows
  "you've been added to early access at no charge today".
- Limits: clicks 10 an hour per IP (their own counter); joins share the waitlist form's 5 an hour.
- Disclosed in /privacy ("Pro button presses").

## setup (run once in the Supabase SQL editor)

```sql
create table public.pro_interest (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('click', 'join')),
  mode text,                -- LAUNCH_MODE at the time: waitlist | open
  email text unique         -- only for 'join'
);
alter table public.pro_interest enable row level security; -- service role only, no policies
```

## reading the results

```sql
select kind, count(*) from public.pro_interest group by kind;           -- clicks vs emails
select date_trunc('day', created_at) d, kind, count(*)
  from public.pro_interest group by 1, 2 order by 1;                     -- per day
```

Click rate = clicks ÷ homepage visitors (Vercel's request logs, since the site has no analytics).
Emails left ÷ clicks shows how serious the clicks are.

## before "next month" arrives

The copy says "launching next month". Update it in `public/neb-home.js`, or take the window
out of `app/home-markup.ts`, and email the `join` list what happens next.
