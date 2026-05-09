import { NextRequest, NextResponse } from "next/server";
import { getTotalStorageUsed, STORAGE_LIMIT } from "@/lib/kv";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const usedBytes = await getTotalStorageUsed();
    
    return NextResponse.json({
      usedBytes,
      limitBytes: STORAGE_LIMIT,
      usedMB: Math.round(usedBytes / (1024 * 1024)),
      limitMB: Math.round(STORAGE_LIMIT / (1024 * 1024)),
    });
  } catch (error) {
    console.error("Storage status error:", error);
    return NextResponse.json({ error: "Failed to get storage status" }, { status: 500 });
  }
}