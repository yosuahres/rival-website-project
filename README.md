This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Crowdfunding

The donation campaign lives under `/crowdfunding` and is reachable from the
site navbar. It was merged in from the standalone `rival-crowdfunding` app:

| Path | What it is |
| --- | --- |
| `/crowdfunding` | Progress bar + carousel. Reads `public.site_settings`, so it is `force-dynamic`. |
| `/crowdfunding/support` | The donation form: details, package or custom amount, then payment. |
| `/crowdfunding/payment` | Where Duitku redirects the donor back to. Polls until the callback settles the donation. |
| `/crowdfunding/admin` | Staff view of donations, with the progress-bar figures editable inline. **No authentication — see below.** |
| `/api/*` | Route handlers backing the above. |
| `supabase/schema.sql` | Tables, RLS policies, and the seed row. Run once in the Supabase SQL editor. |

`SUPABASE_SERVICE_ROLE_KEY` is required on the server for the operations that
bypass RLS — deleting a donation, reading/writing transfer proofs in Storage,
and settling a donation from the payment callback. See `.env.example`.

### Payments (Duitku)

Set `DUITKU_MERCHANT_CODE` and `DUITKU_API_KEY` and the support page switches
from the manual flow to the gateway. Leave them blank and it keeps the old
behaviour — static QRIS image plus a transfer-proof upload an admin verifies by
hand — so a checkout with no keys still works.

| Route | What it does |
| --- | --- |
| `GET /api/duitku/payment-methods?amount=` | The channels enabled on the project for that amount, with fees. Answers `{ enabled: false }` when no keys are set, which is what triggers the fallback. |
| `POST /api/duitku/transaction` | Turns a pending donation into a Duitku transaction (`v2/inquiry`) and returns the VA number / QR string / payment URL. |
| `POST /api/duitku/callback/` | Duitku's server-to-server notification. The primary way a donation is settled. |
| `POST /api/duitku/check` | Asks Duitku's `transactionStatus` directly, for when the callback never arrives. Manual and throttled — see below. |

The flow: the donor submits the form, `POST /api/donations` writes a `pending`
row with an `invoice_number`, the picker calls `/api/duitku/transaction` with
the channel they clicked, and the VA number comes back. Duitku then notifies
the callback, which flips `payment_status`, and the page — which has been
polling `/api/donations/status` all along — updates itself.

The checkout UI is split out of the page: `PaymentMethodPicker` (short list on
the card, full set grouped behind a modal), `PaymentInstructions` (virtual
account number, copy button, per-bank "Cara Membayar" steps),
`PaymentCountdown`, and `OrderSummary`. Which channels land in which group, and
how long each stays payable, are both in
`src/lib/crowdfunding/payment-methods.ts`; the per-bank instruction copy is in
`payment-instructions.ts`. Neither needs the gateway to edit.

The **amount is never taken from the browser** at the gateway step: the
transaction route reads it off the donation row that `/api/donations` already
validated against the selected package.

`invoice_number` doubles as Duitku's `merchantOrderId`, which may not be
reused. A donor who wants a different channel has to start a new donation; the
route returns 409 rather than silently failing at the gateway.

Register this in the Duitku merchant portal (**the trailing slash matters** —
`trailingSlash: true` makes Next answer the slashless path with a 308 that
Duitku's sender does not follow):

```
Callback: https://<your-domain>/api/duitku/callback/
Return:   https://<your-domain>/crowdfunding/payment/
```

Both default to `NEXT_PUBLIC_SITE_URL`, so they only need
`DUITKU_CALLBACK_URL` / `DUITKU_RETURN_URL` if the public origin differs from
what the app resolves. `DUITKU_ENV=sandbox` (the default) points at
`sandbox.duitku.com`; `production` points at `passport.duitku.com`. The two
environments have different credentials.

`/api/duitku/check` is the escape hatch for a callback that cannot reach the
site — a firewall in front of it, a host that cannot take server-to-server
POSTs, or an outage that burned Duitku's five retries. A donor triggers it from
the payment screen ("Saya sudah bayar"), and the countdown fires it once on
expiry so an abandoned donation is written off rather than left `pending`
forever.

It is deliberately **not** on the status poll. `transactionStatus` is rate
limited per merchant and blocks the caller for roughly an hour once the ceiling
is hit — which would break confirmation for every donor, not just the impatient
one. So it runs only on demand, and `donations.duitku_checked_at` enforces a
30-second cooldown per invoice, stamped *before* the call so a hung request
cannot be retried into a flood.

Both it and the callback settle through `settleDonation` in
`src/lib/crowdfunding/settle.ts`, so the guards are shared rather than
reimplemented: the amount must match the recorded donation, a settled donation
is never touched again, and `pending` is written as nothing at all.

Callbacks are authenticated with Duitku's HMAC-SHA256 signature over
`merchantCode + amount + merchantOrderId`, keyed by the API key, and the amount
is re-checked against the stored donation before anything settles. Handling is
idempotent — Duitku retries up to five times on any non-200, and a dashboard
resend lands on the same route.

There is no sign-in: the login/signup shells, the OAuth callback, and the
session-refreshing middleware were removed as unused. `/crowdfunding/admin` is
therefore **reachable by anyone who knows the URL**, and it lists every donor's
name, email, phone, and address. `DELETE /api/donations` and `PUT /api/settings`
are unauthenticated too, and both use the service-role key, so they bypass RLS.
Put an auth gate on the admin page *and* on those route handlers before this
section is exposed on a public host.

### Deployment status — read before deploying

This is now a **Next.js server app**. `next build` produces a server build, not
a static export.

`output: "export"` was what fed `dist/` for the cPanel deploy, and it is
incompatible with the crowdfunding section: a static export supports neither
middleware, nor route handlers, nor `dynamic = "force-dynamic"`. It is
therefore behind `STATIC_EXPORT=true` in `next.config.ts` and off by default —
turning it on will fail the build while `/crowdfunding` is present.

`pnpm build:static` (`scripts/build-static.mjs`) still produces `dist/` for
cPanel. It stages the server-only paths — `src/app/api` and
`src/app/crowdfunding` — out of the tree for the duration of the build, then
puts them back, so the export is the marketing site exactly as it shipped
before the merge:

```bash
NEXT_PUBLIC_SITE_URL=https://arek.its.ac.id/rival \
NEXT_PUBLIC_BASE_PATH=/rival \
pnpm build:static
```

**`/crowdfunding` is not in that export.** The script sets
`NEXT_PUBLIC_CROWDFUNDING_ENABLED=false`, which compiles the navbar tab out and
drops the two crowdfunding URLs from the sitemap, so the static site never
links at a page it does not contain. Getting the tab live means giving the
crowdfunding routes somewhere to run:

1. Host the whole site on Node (Vercel, or cPanel's "Setup Node.js App") and
   retire the `dist/` pipeline — one deploy, the tab works everywhere.
2. Keep this static export for the marketing pages, deploy the app separately
   for `/crowdfunding`, and point Apache at it with a `ProxyPass` under
   `/rival/crowdfunding` so both live on `arek.its.ac.id`.

`.github/workflows/deploy.yml` still calls plain `pnpm build`, which now
produces a server build rather than `out/`. Point it at `build:static` before
relying on CI again.
