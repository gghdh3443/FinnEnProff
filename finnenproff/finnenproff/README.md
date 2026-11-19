# FinnEnProff (MVP)
Next.js 14 · TypeScript · Tailwind · Supabase.
## Run
1. `npm install` then `npm test`
2. `cp .env.example .env.local` and fill in Supabase values
3. Run `supabase/schema.sql` in the Supabase SQL editor
4. Create an admin user in Supabase Auth and set `app_metadata.role = "admin"` (SQL at bottom of schema)
5. `npm run dev`
## Deploy
Vercel: import repo, add the three env vars (service role key as server-only), deploy.
## Status
Done in v1-2: brand/logo, homepage, services, 6-step request form with validation, company registration + FAQ, about/contact/legal drafts (need legal review), API routes with zod + honeypot, DB schema with RLS, admin read-only overview behind role check.
Done in v3: email notifications and sending requests to companies (needs Resend), invoices and revenue tracking, company editing and manual add.
Not done (v3): admin login page, status/assignment/notes/approval actions, finance views, contact form backend, email notifications, matching, e2e tests, real imagery.
Untested: code was not installed, built or run in this session. Expect small fixes on first `npm run build`.
## Launch checklist
Legal review of all drafts; real contact/company info; GDPR/data-processing agreements; admin login; rate limiting; Norwegian translation; commercial terms.

## Operating at scale (100+ companies, 100,000+ users)
Design: static public pages (served from CDN), one atomic DB call per request (`submit_request`), shared Postgres rate limiting, indexed and paginated admin queries, SQL-computed finance totals.
Required infrastructure: Supabase Pro (daily backups + point-in-time recovery, connection pooling), Vercel Pro or equivalent, a monitor on `/api/health`, error tracking (e.g. Sentry), Resend with SPF/DKIM on your domain, pg_cron job for the rate_limits cleanup in schema.sql.
Before announcing: run a load test (e.g. k6) against a staging copy, with the request form at your expected peak.
Not yet built: email outbox/queue with retries, company self-service dashboard, Next 16 upgrade, end-to-end tests.

## v5: company dashboard and customer tracking
Company login: in /admin, press "Create login" on an active company (uses its email). The company then signs in at /login with an emailed one-time link.
Supabase setup: Auth > URL Configuration > add `https://your-domain/auth/callback` to redirect URLs; Auth > Providers > Email enabled; configure SMTP (Supabase's default sender is heavily rate-limited).
Company flow: admin assigns and sends -> company sees request in /dashboard -> Accept (creates invoice at their price) or Decline (returns to admin as "reviewing").
Customers get a private tracking link (/status/<token>) after submitting. No customer accounts yet.
Still not built: job-seeker/freelancer side (needs a spec), customer accounts, email retry queue, e2e tests, Next 16 upgrade.

## v6
Professionals/job seekers: /for-workers registers an individual provider (companies.kind = 'individual', no organization number). Same approval, matching, dashboard, accept/decline and invoicing as companies. There is deliberately no public job board: customers only consent to sharing with a provider you select.
Customer accounts: /login > Customer (emailed link, account created on first sign-in). /account lists their requests, links to tracking pages, and has self-service data deletion. Enable email sign-ups in Supabase Auth.
Email retry: failed sends go to `email_outbox` and are retried (5 attempts, growing delay). Set CRON_SECRET and have a scheduler (e.g. cron-job.org) call `GET /api/cron/emails` every 5 minutes with header `Authorization: Bearer <CRON_SECRET>`.
E2E tests: `npx playwright install` then `npm run e2e` (desktop + mobile smoke tests). Written but not run in the build environment.
Next/image optimizer is disabled (images.unoptimized) which neutralizes the open `npm audit` advisories about it; the audit tool still flags the version until Next 16.
