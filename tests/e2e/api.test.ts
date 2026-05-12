// tests/e2e/api.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { kv } from "@vercel/kv";

describe("API E2E Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should verify register endpoint returns 200 and stores build", async () => {
    const { POST } = await import("@/app/api/register/route");

    const payload = {
      ipaBlobUrl: "https://blob/test.ipa",
      iconBlobUrl: "https://blob/test.png",
      bundleId: "com.test.app",
      version: "1.0.0",
      displayName: "Test App",
      sizeIpa: 1024,
      sizeIcon: 512,
    };

    const req = new Request("http://localhost/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("installUrl");
    expect(data).toHaveProperty("deleteUrl");

    // Verify KV storage was called
    expect(kv.set).toHaveBeenCalled();
  });

  it("should verify manifest generation", async () => {
    const { GET } = await import("@/app/manifest/[buildId]/route");

    // Mock kv.get to return a build record
    const mockBuild = {
      buildId: "test-123",
      ipaBlobUrl: "https://blob/test.ipa",
      iconBlobUrl: "https://blob/test.png",
      bundleId: "com.test.app",
      version: "1.0.0",
      displayName: "Test App",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };

    vi.mocked(kv.get).mockResolvedValue(mockBuild);

    const req = new Request("http://localhost/manifest/test-123");
    const res = await GET(
      req as any,
      { params: Promise.resolve({ buildId: "test-123" }) } as any,
    );

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("com.test.app");
    expect(text).toContain("https://blob/test.ipa");
    expect(text).toContain("Test App");
  });
});
