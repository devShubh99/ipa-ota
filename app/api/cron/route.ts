import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { del } from "@vercel/blob";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const now = new Date();
  let deletedCount = 0;
  let errorCount = 0;

  try {
    const keys = await kv.keys("build:*");
    
    for (const key of keys) {
      try {
        const buildId = key.replace("build:", "");
        const buildJson = await kv.get(key, "json");
        
        if (!buildJson) continue;
        
        const build = buildJson as {
          expiresAt: string;
          ipaBlobUrl: string;
          iconBlobUrl: string;
          icon57BlobUrl?: string;
          sizeIpa: number;
          sizeIcon: number;
          sizeIcon57?: number;
          deleteToken: string;
        };
        
        const expiresAt = new Date(build.expiresAt);
        
        if (expiresAt < now) {
          // Delete blobs
          try {
            if (build.ipaBlobUrl) await del(build.ipaBlobUrl);
            if (build.iconBlobUrl) await del(build.iconBlobUrl);
            if (build.icon57BlobUrl) await del(build.icon57BlobUrl);
          } catch (e) {
            console.error(`Failed to delete blobs for ${buildId}:`, e);
          }

          // Decrement storage
          const totalSize = build.sizeIpa + build.sizeIcon + (build.sizeIcon57 || 0);
          const currentUsed = await kv.get<number>("totalStorageUsed") || 0;
          await kv.set("totalStorageUsed", Math.max(0, currentUsed - totalSize));

          // Delete KV keys
          await kv.del(key);
          if (build.deleteToken) {
            await kv.del(`delete:${build.deleteToken}`);
          }

          deletedCount++;
        }
      } catch (e) {
        console.error(`Failed to process ${key}:`, e);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      errors: errorCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}