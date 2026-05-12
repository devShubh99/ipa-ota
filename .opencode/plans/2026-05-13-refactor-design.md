# IPA OTA Refactor Design

**Date:** 2026-05-13
**Goal:** Modernize codebase with Next.js 15 / React 19 patterns, improve code organization, and strengthen error handling/typing/testing.

## Scope (Approach B)

Four areas of improvement, no behavioral changes to the OTA install flow.

---

## 1. Component Split — `page.tsx`

Break the monolithic client component into:

### `components/storage-bar.tsx`
- Props: `{ usedBytes: number; limitBytes: number; usedMB: number; limitMB: number }`
- Renders the storage usage bar (extracted from lines 149-162)

### `components/upload-area.tsx`
- Props: `{ onFileSelected: (file: File) => void }`
- File dropzone + click-to-browse (extracted from lines 167-183)

### `components/app-info-card.tsx`
- Props: `{ file: File; appInfo: DisplayAppInfo; error: string | null; uploading: boolean; progress: number; onUpload: () => void; onClear: () => void }`
- Shows parsed IPA metadata, icon preview, error state, upload button (extracted from lines 184-222)

### `components/result-card.tsx`
- Props: `{ result: RegisterResponse; appInfo: DisplayAppInfo; onReset: () => void }`
- Shows install link, delete link, expiry (extracted from lines 224-289)

### `app/page.tsx` (after split)
- Thin orchestrator — holds `file`, `appInfo`, `result`, `error`, `uploading`, `progress`, `copied` state
- Wires sub-components together

---

## 2. Server Actions + React 19 Patterns

### `app/actions.ts`
- `"use server"` — `registerBuild(formData: FormData)` Server Action
- Receives blob URLs + metadata (IPA and icon already uploaded client-side to Vercel Blob)
- Registers build in KV, returns `Result<{ installUrl: string; deleteUrl: string; expiresAt: string }>`
- **Blob upload stays client-side** (direct client-to-storage, no server hop)

### Client component changes
- Flow: parse IPA client-side → upload to Blob via SDK (with progress) → call Server Action `registerBuild` with blob URLs
- Use `next/form` with `useActionState` for the registration step, replacing manual `fetch` to `/api/register`
- `isPending` replaces manual `uploading` state for the registration step; upload progress still tracked via Blob SDK callbacks

### Keep `/api/register` for external callers
- Route handler still exists for non-browser clients / API consumers
- Server Action is the primary path for the UI

### `lib/errors.ts`
```ts
type Result<T> = { success: true; data: T } | { success: false; error: string }
```
Used by both Server Action and route handlers for consistent error return.

---

## 3. Code Organization

### `lib/templates.ts`
Extract inline HTML builders from:

- **`/dl/[buildId]`** → `buildPageHtml(data)` + `NOT_FOUND_HTML` constant
- **`/manifest/[buildId]`** → `plistXml(data)` + `EMPTY_PLIST` constant
- Routes become thin wrappers that call template functions

### Dead code removal
- Delete `app/api/upload/route.ts` — unused (client uses `@vercel/blob` SDK directly)
- Remove `qrcode` from `package.json` — unused

### `lib/kv.ts` — ID generation
- Replace `generateBuildId()` / `generateDeleteToken()` manual char-loop with `crypto.randomUUID()`
- Simpler, built-in, cryptographically secure

### `app/api/cron/route.ts` — consolidate with lib
- Replace direct `kv.get`/`kv.set` with `getBuild()`/`decrementStorage()`/`deleteBuild()` from `lib/kv.ts`
- Remove `as` casts by using `BuildRecord` type

---

## 4. Error Handling, Typing & Testing

### `lib/errors.ts` (shared above)
Typed `Result<T>` union used across all routes and actions.

### Test setup (`tests/setup.ts`)
```ts
afterEach(() => vi.restoreAllMocks())
```
Add mock lifecycle management. Already has `beforeEach(vi.clearAllMocks)`? Check and align.

### Route handler consistency
- All routes return `Result<T>` shape on error responses for consistency
- Remove ad-hoc error string returns

---

## Files Changed / Created

| File | Action |
|------|--------|
| `components/storage-bar.tsx` | **Create** |
| `components/upload-area.tsx` | **Create** |
| `components/app-info-card.tsx` | **Create** |
| `components/result-card.tsx` | **Create** |
| `app/actions.ts` | **Create** |
| `lib/errors.ts` | **Create** |
| `lib/templates.ts` | **Create** |
| `app/page.tsx` | **Modify** — thin orchestrator |
| `app/api/register/route.ts` | **Modify** — use `Result<T>` type |
| `app/api/delete/route.ts` | **Modify** — use `Result<T>` type |
| `app/api/cron/route.ts` | **Modify** — consolidate with lib/kv |
| `app/api/storage-status/route.ts` | **Modify** — use `Result<T>` type |
| `app/dl/[buildId]/route.ts` | **Modify** — use templates lib |
| `app/manifest/[buildId]/route.ts` | **Modify** — use templates lib |
| `lib/kv.ts` | **Modify** — use `crypto.randomUUID()` |
| `tests/setup.ts` | **Modify** — add mock restore |
| `app/api/upload/route.ts` | **Delete** — unused |
| `package.json` | **Modify** — remove `qrcode` |
