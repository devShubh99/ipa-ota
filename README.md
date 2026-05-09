# IPA OTA Installer

Black-box IPA installer for Vercel. Drop .ipa → get install link. Auto-expires in 60 minutes.

## Quick Deploy

```bash
# 1. Clone & install
npm install

# 2. Deploy to Vercel
npx vercel deploy --prod
```

## Manual Setup (Required)

### 1. Link Vercel Storage

After first deploy:

1. Go to Vercel Dashboard → Your Project → Storage
2. **Create a Blob store** if none exists
3. **Create a KV database** (free tier)
4. Note: `BLOB_READ_WRITE_TOKEN` is auto-provided

### 2. Set Up Cron Job

The free tier allows 1 cron job (every 1 minute minimum):

1. Go to Vercel Dashboard → Your Project → Settings → Cron Jobs
2. Add cron job:
   - **Path**: `/api/cron`
   - **Schedule**: `* * * * *` (every minute)
3. Save

Or add to `vercel.json` and redeploy.

## Usage

1. Open your Vercel app URL
2. Drag & drop a pre-signed .ipa file
3. Get install link + delete link
4. Share install link with testers

### Install on iOS

1. Open install link on iPhone/iPad
2. Tap "Install App"
3. If prompted, go to: **Settings → General → VPN & Device Management** → Trust your enterprise certificate
4. App will appear on home screen

## How It Works

1. **Upload**: Client reads IPA metadata (bundle ID, version, icon) via JSZip
2. **Storage**: IPA + icon uploaded to Vercel Blob
3. **Register**: API stores metadata in KV with 60-min expiry
4. **Install**: Install page triggers `itms-services://` protocol
5. **Manifest**: XML plist points to Blob URLs
6. **Cleanup**: Cron runs every minute, deletes expired builds

## Constraints (Free Tier)

- **Blob**: 5 GB total (hard cap at 4.9 GB)
- **KV**: 1 GB
- **Function**: 4.5 MB request body, 10s timeout
- **Cron**: 1 job, minimum 1 minute interval
- **Bandwidth**: 100 GB/month (expires = safe for small use)

## Files

```
/
├── app/
│   ├── page.tsx           # Upload page
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Tailwind
│   ├── api/
│   │   ├── upload-token/   # Get upload config (unused, blob SDK client-side)
│   │   ├── upload/        # Direct upload endpoint
│   │   ├── register/      # Store build metadata
│   │   ├── storage-status/# Check storage usage
│   │   ├── delete/       # Delete build by token
│   │   └── cron/         # Cleanup expired builds
│   ├── dl/[buildId]/    # Install page
│   └── manifest/[buildId]/ # iOS manifest plist
├── lib/
│   ├── kv.ts           # KV helpers
│   └── blob.ts         # Blob helpers
├── package.json
├── vercel.json         # Cron config
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## Security Notes

- Build IDs: 10-char random (alphanumeric)
- Delete tokens: 16-char random
- No auth required for upload (intentional for simplicity)
- Delete link = secret; share carefully

## Troubleshooting

**"Build Not Found" on install link**
- Likely expired (60 min). Upload fresh .ipa.

**App crashes after install**
- Trust enterprise cert: Settings → General → VPN & Device Management

**Upload fails**
- Check Blob store is linked in project settings
- Verify file is .ipa (not .zip renamed)