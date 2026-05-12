"use server";

import {
  getTotalStorageUsed,
  STORAGE_LIMIT,
  EXPIRY_MS,
  saveBuild,
  generateBuildId,
  generateDeleteToken,
  incrementStorage,
  decrementStorage,
  type BuildRecord,
} from "@/lib/kv";
import type { Result } from "@/lib/errors";
import { err, ok } from "@/lib/errors";

export type RegisterState = {
  installUrl?: string;
  deleteUrl?: string;
  expiresAt?: string;
  error?: string;
};

export async function registerBuild(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const ipaBlobUrl = formData.get("ipaBlobUrl") as string;
  const iconBlobUrl = formData.get("iconBlobUrl") as string;
  const icon57BlobUrl = formData.get("icon57BlobUrl") as string | null;
  const bundleId = formData.get("bundleId") as string;
  const version = formData.get("version") as string;
  const displayName = formData.get("displayName") as string;
  const sizeIpa = Number(formData.get("sizeIpa"));
  const sizeIcon = Number(formData.get("sizeIcon"));
  const sizeIcon57 = formData.get("sizeIcon57")
    ? Number(formData.get("sizeIcon57"))
    : undefined;

  if (!ipaBlobUrl || !bundleId || !version || !displayName) {
    return { error: "Missing required fields" };
  }

  const totalSize = sizeIpa + sizeIcon + (sizeIcon57 || 0);
  const newUsed = await incrementStorage(totalSize);
  if (newUsed > STORAGE_LIMIT) {
    await decrementStorage(totalSize);
    return { error: "Storage limit exceeded. Please delete some existing builds." };
  }

  const buildId = generateBuildId();
  const deleteToken = generateDeleteToken();
  const expiresAt = new Date(Date.now() + EXPIRY_MS).toISOString();
  const createdAt = new Date().toISOString();

  const build: BuildRecord = {
    buildId,
    ipaBlobUrl,
    iconBlobUrl,
    icon57BlobUrl: icon57BlobUrl || undefined,
    bundleId,
    version,
    displayName,
    sizeIpa,
    sizeIcon,
    sizeIcon57,
    expiresAt,
    deleteToken,
    createdAt,
  };

  await saveBuild(build);

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000";
  const protocol = baseUrl.includes("localhost") ? "http" : "https";
  const installUrl = `${protocol}://${baseUrl}/dl/${buildId}`;
  const deleteUrl = `${protocol}://${baseUrl}/api/delete?token=${deleteToken}`;

  return { installUrl, deleteUrl, expiresAt };
}
