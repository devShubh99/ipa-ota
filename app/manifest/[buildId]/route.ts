import { getBuild } from "@/lib/kv";
import { NextRequest, NextResponse } from "next/server";
import { plistXml, EMPTY_PLIST } from "@/lib/templates";

export const runtime = "nodejs";

const CACHE_HEADERS = {
  "Content-Type": "text/xml",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ buildId: string }> }
) {
  const { buildId } = await params;
  const build = await getBuild(buildId);

  if (!build) {
    return new NextResponse(EMPTY_PLIST, { headers: CACHE_HEADERS });
  }

  if (new Date(build.expiresAt) < new Date()) {
    return new NextResponse(EMPTY_PLIST, { headers: CACHE_HEADERS });
  }

  const xml = plistXml(build);

  return new NextResponse(xml, { headers: CACHE_HEADERS });
}
