# bkht.library

`bkht.library` is a public book archive built with Next.js, Vercel Postgres, Vercel Blob, and Better Auth.

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local` and fill in the required values.
3. Run `pnpm db:migrate:books` to create the `books` table from [lib/db/schema.sql](/Users/thebkht/Projects/library/lib/db/schema.sql).
4. Run `pnpm db:migrate:auth` to create Better Auth tables. This uses the Better Auth CLI via `pnpm dlx auth@latest migrate`.
5. Run `pnpm seed:books`.
6. Run `pnpm seed:admin`.
7. Start the app with `pnpm dev`.

## Environment variables

- `NEXT_PUBLIC_SITE_URL`
- `POSTGRES_URL`
- `BLOB_READ_WRITE_TOKEN`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_RATE_LIMIT_STORAGE` optional, set to `database` only after Better Auth rate limit tables exist
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`
- `VERCEL_DEPLOY_HOOK_URL` optional

## Notes

- Cover uploads are resized with `sharp` and stored in Vercel Blob.
- If original local cover files are unavailable during seeding, the script falls back to `/placeholder-cover.svg`.
- `/browse` redirects to `/`.
- Legacy `/book/[slug]` links redirect into `/?book={id}` modal URLs.
- Better Auth rate limiting defaults to in-memory storage. Opt into `BETTER_AUTH_RATE_LIMIT_STORAGE=database` only after running `pnpm db:migrate:auth` against the target database.
