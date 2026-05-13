# ipa-ota — Agent Guide

## Project

Next.js 15 App Router IPA OTA installer. Drop `.ipa`, get an auto-expiring (60min) install link. Deployed on Vercel.

## Commands

| Action | Command |
|---|---|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` (next lint) |
| Typecheck | `npx tsc --noEmit` |
| All tests | `npm test` (vitest run) |
| Single test | `npx vitest run <path>` |
| Single case | `npx vitest run <path> -- -t "case name"` |

Order: `lint -> tsc --noEmit -> test`

## Architecture

- **`lib/`** — pure logic (importable from client & server)
- **`components/`** — `"use client"` React components
- **`app/actions.ts`** — Server Action (`"use server"`)
- **`app/api/*/route.ts`** — REST handlers (dual path: both Server Action & API register builds)
- **`app/dl/[buildId]/route.ts`** — install page (raw HTML strings from `lib/templates.ts`, not React)
- **`app/manifest/[buildId]/route.ts`** — iOS manifest plist (also raw strings)

### Runtime directives

- **edge:** `register`, `storage-status`, `upload-token`
- **nodejs:** `delete`, `cron`, `dl/[buildId]`, `manifest/[buildId]`

## Testing (Vitest)

- `globals: true` — `describe`/`it`/`expect`/`vi` are global (no imports needed)
- `tests/setup.ts` auto-mocks `@vercel/blob` and `@vercel/kv` + `afterEach(vi.restoreAllMocks)`
- JSZip mocks go in individual test files (`vi.mock` at module level), not in setup
- API route tests: construct `new Request(url)` and import handler directly
- E2E tests in `tests/e2e/` depend on the mocks in setup.ts

## Conventions & Gotchas

- ID generation: `crypto.randomUUID()` (Node Web Crypto), not `nanoid`
- No auth (intentionally open)
- `/api/upload-token` route is dead (just returns info text saying use SDK directly)
- `lib/errors.ts` `Result<T>` type exists but migration to use it across all handlers is incomplete
- Client uploads go directly to Vercel Blob SDK (no server upload endpoint)
- Graphify knowledge graph in `graphify-out/` — load at session start with `graphify` skill
