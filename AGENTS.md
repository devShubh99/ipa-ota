# IPA OTA Installer

Next.js app for enterprise iOS IPA distribution via Vercel.

## Commands

```bash
npm run dev    # Local dev at localhost:3000
npm run build # Production build
npm run start # Run production binary
npm run lint  # Lint
```

## Architecture

- **Upload** (`app/page.tsx`): Client reads IPA via JSZip, extracts bundle ID/version/icon, uploads directly to Vercel Blob
- **Register** (`app/api/register`): Stores metadata in KV with 60-min expiry
- **Install** (`app/dl/[buildId]`): HTML page with `itms-services://` link
- **Manifest** (`app/manifest/[buildId]`): XML plist for iOS OTA
- **Cron** (`app/api/cron`): Cleanup expired builds every minute

## Vercel Deployment

1. Link Blob + KV stores in Vercel dashboard after deploy
2. Add cron job: `/api/cron` schedule `* * * * *`

## Local Dev

API routes need Vercel env vars (Blob/KV). Without them, uploads fail locally - this is expected.

## Testing

Drop any `.ipa` file to test UI. Upload flow requires Vercel; will fail without env vars.