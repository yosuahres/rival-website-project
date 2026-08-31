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
| `/crowdfunding/support` | The donation form: details, package or custom amount, QRIS payment, transfer-proof upload. |
| `/crowdfunding/admin` | Staff view of donations, with the progress-bar figures editable inline. **No authentication — see below.** |
| `/api/*` | Route handlers backing the above. |
| `supabase/schema.sql` | Tables, RLS policies, and the seed row. Run once in the Supabase SQL editor. |

`SUPABASE_SERVICE_ROLE_KEY` is required on the server for the operations that
bypass RLS — deleting a donation, and reading/writing transfer proofs in
Storage. See `.env.example`.

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
cPanel. It stages the server-only paths — `src/app/api`, `src/app/auth`,
`src/app/crowdfunding`, `src/middleware.ts` — out of the tree for the duration
of the build, then puts them back, so the export is the marketing site exactly
as it shipped before the merge:

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
