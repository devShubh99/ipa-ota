import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  saveBuild,
  getBuild,
  deleteBuild,
  incrementStorage,
  decrementStorage,
  listBuilds,
  getBuildIdByDeleteToken,
  generateBuildId,
  generateDeleteToken,
  BuildRecord,
} from "@/lib/kv";
import { kv } from "@vercel/kv";

describe("KV Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBuild: BuildRecord = {
    buildId: "test-id",
    ipaBlobUrl: "https://blob.com/ipa",
    iconBlobUrl: "https://blob.com/icon",
    bundleId: "com.test",
    version: "1.0.0",
    displayName: "Test App",
    sizeIpa: 1000,
    sizeIcon: 100,
    expiresAt: new Date().toISOString(),
    deleteToken: "delete-token",
    createdAt: new Date().toISOString(),
  };

  it("should save build metadata", async () => {
    await saveBuild(mockBuild);
    expect(kv.set).toHaveBeenCalledWith(
      `build:${mockBuild.buildId}`,
      JSON.stringify(mockBuild),
    );
    expect(kv.set).toHaveBeenCalledWith(
      `delete:${mockBuild.deleteToken}`,
      mockBuild.buildId,
    );
  });

  it("should get build metadata", async () => {
    (kv.get as any).mockResolvedValue(mockBuild);
    const result = await getBuild("test-id");
    expect(kv.get).toHaveBeenCalledWith("build:test-id");
    expect(result).toEqual(mockBuild);
  });

  it("should delete build metadata", async () => {
    (kv.get as any).mockResolvedValue(mockBuild);
    await deleteBuild("test-id");
    expect(kv.del).toHaveBeenCalledWith("build:test-id");
    expect(kv.del).toHaveBeenCalledWith(`delete:${mockBuild.deleteToken}`);
  });

  it("should increment storage", async () => {
    await incrementStorage(50);
    expect(kv.incrby).toHaveBeenCalledWith("totalStorageUsed", 50);
  });

  it("should decrement storage", async () => {
    await decrementStorage(50);
    expect(kv.incrby).toHaveBeenCalledWith("totalStorageUsed", -50);
  });

  it("should list builds", async () => {
    (kv.keys as any).mockResolvedValue(["build:id1", "build:id2"]);
    const result = await listBuilds();
    expect(kv.keys).toHaveBeenCalledWith("build:*");
    expect(result).toEqual(["id1", "id2"]);
  });

  it("should get build ID by delete token", async () => {
    (kv.get as any).mockResolvedValue("test-id");
    const result = await getBuildIdByDeleteToken("delete-token");
    expect(kv.get).toHaveBeenCalledWith("delete:delete-token");
    expect(result).toBe("test-id");
  });

  it("should generate build ID", async () => {
    const id1 = generateBuildId();
    const id2 = generateBuildId();
    expect(id1).toHaveLength(10);
    expect(id2).toHaveLength(10);
    expect(id1).not.toBe(id2);
  });

  it("should generate delete token", async () => {
    const token1 = generateDeleteToken();
    const token2 = generateDeleteToken();
    expect(token1).toHaveLength(16);
    expect(token2).toHaveLength(16);
    expect(token1).not.toBe(token2);
  });
});
