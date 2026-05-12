import { getBuild } from "@/lib/kv";
import { NextRequest, NextResponse } from "next/server";
import { buildPageHtml, NOT_FOUND_HTML } from "@/lib/templates";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ buildId: string }> }
) {
  const { buildId } = await params;
  const build = await getBuild(buildId);

  if (!build) {
    return new NextResponse(NOT_FOUND_HTML, {
      headers: { "Content-Type": "text/html" },
    });
  }

  const isExpired = new Date(build.expiresAt) < new Date();
  const manifestUrl = `/manifest/${buildId}`;
  const installUrl = `itms-services://?action=download-manifest&url=${encodeURIComponent(manifestUrl)}`;

  const html = buildPageHtml({
    displayName: build.displayName,
    bundleId: build.bundleId,
    version: build.version,
    iconBlobUrl: build.iconBlobUrl,
    expiresAt: build.expiresAt,
    isExpired,
    installUrl,
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
