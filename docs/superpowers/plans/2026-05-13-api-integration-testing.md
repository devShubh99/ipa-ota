# API Integration Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement E2E API tests for the IPA registration and manifest generation flow.

**Architecture:** Use Vitest to test Next.js route handlers by importing them and invoking them with mocked Request objects.

**Tech Stack:** Vitest, Next.js (App Router)

---

### Task 1: API E2E Flow Test

**Files:**
- Create: `tests/e2e/api.test.ts`

- [ ] **Step 1: Create the e2e directory**

Run: `mkdir -p tests/e2e`

- [ ] **Step 2: Write the failing E2E test for registration and manifest**

```typescript
// tests/e2e/api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { kv } from '@vercel/kv';

describe('API E2E Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should verify register endpoint returns 200 and stores build', async () => {
    const { POST } = await import('@/app/api/register/route');
    
    const payload = {
      ipaBlobUrl: 'https://blob/test.ipa',
      iconBlobUrl: 'https://blob/test.png',
      bundleId: 'com.test.app',
      version: '1.0.0',
      displayName: 'Test App',
      sizeIpa: 1024,
      sizeIcon: 512,
    };

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('installUrl');
    expect(data).toHaveProperty('deleteUrl');
    
    // Verify KV storage was called (indirectly via hset mock)
    expect(kv.hset).toHaveBeenCalled();
  });

  it('should verify manifest generation', async () => {
    const { GET } = await import('@/app/manifest/[buildId]/route');
    
    // Mock kv.hget to return a build record
    const mockBuild = {
      buildId: 'test-123',
      ipaBlobUrl: 'https://blob/test.ipa',
      iconBlobUrl: 'https://blob/test.png',
      bundleId: 'com.test.app',
      version: '1.0.0',
      displayName: 'Test App',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };
    
    vi.mocked(kv.hget).mockResolvedValue(mockBuild);

    const req = new Request('http://localhost/manifest/test-123');
    const res = await GET(req as any, { params: Promise.resolve({ buildId: 'test-123' }) } as any);
    
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('com.test.app');
    expect(text).toContain('https://blob/test.ipa');
    expect(text).toContain('Test App');
  });
});
```

- [ ] **Step 3: Run the tests to verify they pass**

Run: `npm test tests/e2e/api.test.ts`
Expected: PASS

- [ ] **Step 4: Run all tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/api.test.ts
git commit -m "test: add E2E API integration tests"
```
