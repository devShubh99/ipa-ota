import { kv } from "@vercel/kv";

export interface BuildRecord {
  buildId: string;
  ipaBlobUrl: string;
  iconBlobUrl: string;
  icon57BlobUrl?: string;
  bundleId: string;
  version: string;
  displayName: string;
  sizeIpa: number;
  sizeIcon: number;
  sizeIcon57?: number;
  expiresAt: string;
  deleteToken: string;
  createdAt: string;
}

export const STORAGE_LIMIT = 4.9 * 1024 * 1024 * 1024; // 4.9 GB
export const EXPIRY_MS = 60 * 60 * 1000; // 60 minutes

export async function getBuild(buildId: string): Promise<BuildRecord | null> {
  return (await kv.get(`build:${buildId}`)) as BuildRecord | null;
}

export async function saveBuild(build: BuildRecord): Promise<void> {
  await kv.set(`build:${build.buildId}`, JSON.stringify(build));
  await kv.set(`delete:${build.deleteToken}`, build.buildId);
}

export async function deleteBuild(buildId: string): Promise<void> {
  const build = await getBuild(buildId);
  if (!build) return;

  await kv.del(`build:${buildId}`);
  await kv.del(`delete:${build.deleteToken}`);
}

export async function getBuildIdByDeleteToken(
  deleteToken: string,
): Promise<string | null> {
  return (await kv.get(`delete:${deleteToken}`)) as string | null;
}

export async function getTotalStorageUsed(): Promise<number> {
  const used = await kv.get("totalStorageUsed");
  return (used as number) || 0;
}

export async function incrementStorage(bytes: number): Promise<number> {
  return await kv.incrby("totalStorageUsed", bytes);
}

export async function decrementStorage(bytes: number): Promise<number> {
  return await kv.incrby("totalStorageUsed", -bytes);
}

export async function listBuilds(): Promise<string[]> {
  const keys = await kv.keys("build:*");
  return keys.map((key) => key.replace("build:", ""));
}

export function generateBuildId(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function generateDeleteToken(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
