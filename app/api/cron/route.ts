import { NextRequest, NextResponse } from "next/server";
import { listBuilds, getBuild, decrementStorage, deleteBuild } from "@/lib/kv";
import { deleteBlob } from "@/lib/blob";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const now = new Date();
  let deletedCount = 0;
  let errorCount = 0;

  try {
    const buildIds = await listBuilds();

    for (const buildId of buildIds) {
      try {
        const build = await getBuild(buildId);
        if (!build) continue;

        const expiresAt = new Date(build.expiresAt);

        if (expiresAt < now) {
          if (build.ipaBlobUrl) await deleteBlob(build.ipaBlobUrl);
          if (build.iconBlobUrl) await deleteBlob(build.iconBlobUrl);
          if (build.icon57BlobUrl) await deleteBlob(build.icon57BlobUrl);

          const totalSize = build.sizeIpa + build.sizeIcon + (build.sizeIcon57 || 0);
          await decrementStorage(totalSize);
          await deleteBuild(buildId);

          deletedCount++;
        }
      } catch (e) {
        console.error(`Failed to process build ${buildId}:`, e);
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
