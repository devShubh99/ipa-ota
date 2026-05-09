import { NextRequest, NextResponse } from "next/server";
import { getBuild, getTotalStorageUsed, STORAGE_LIMIT, EXPIRY_MS, BuildRecord, saveBuild, incrementStorage } from "@/lib/kv";

export const runtime = "edge";

interface RegisterPayload {
  ipaBlobUrl: string;
  iconBlobUrl: string;
  icon57BlobUrl?: string;
  bundleId: string;
  version: string;
  displayName: string;
  sizeIpa: number;
  sizeIcon: number;
  sizeIcon57?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterPayload = await request.json();
    
    const {
      ipaBlobUrl,
      iconBlobUrl,
      icon57BlobUrl,
      bundleId,
      version,
      displayName,
      sizeIpa,
      sizeIcon,
      sizeIcon57,
    } = body;

    // Validate required fields
    if (!ipaBlobUrl || !bundleId || !version || !displayName) {
      return NextResponse.json(
        { error: "Missing required fields: ipaBlobUrl, bundleId, version, displayName" },
        { status: 400 }
      );
    }

    const totalSize = sizeIpa + sizeIcon + (sizeIcon57 || 0);
    const currentUsed = await getTotalStorageUsed();
    
    if (currentUsed + totalSize > STORAGE_LIMIT) {
      return NextResponse.json(
        { error: "Storage limit exceeded. Please delete some existing builds." },
        { status: 413 }
      );
    }

    const buildId = generateBuildId();
    const deleteToken = generateDeleteToken();
    const expiresAt = new Date(Date.now() + EXPIRY_MS).toISOString();
    const createdAt = new Date().toISOString();
    
    const build: BuildRecord = {
      buildId,
      ipaBlobUrl,
      iconBlobUrl,
      icon57BlobUrl,
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
    await incrementStorage(totalSize);

    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000";
    const protocol = baseUrl.includes("localhost") ? "http" : "https";
    const installUrl = `${protocol}://${baseUrl}/dl/${buildId}`;
    const deleteUrl = `${protocol}://${baseUrl}/api/delete?token=${deleteToken}`;

    return NextResponse.json({
      installUrl,
      deleteUrl,
      expiresAt,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}