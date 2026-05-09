import { NextRequest, NextResponse } from "next/server";
import { getBuildIdByDeleteToken, getBuild, decrementStorage, deleteBuild } from "@/lib/kv";
import { del } from "@vercel/blob";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  return handleDelete(token);
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;
    return handleDelete(token);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

async function handleDelete(token: string | null) {
  if (!token) {
    return NextResponse.json({ error: "Missing delete token" }, { status: 400 });
  }

  const buildId = await getBuildIdByDeleteToken(token);
  
  if (!buildId) {
    return NextResponse.json({ error: "Invalid delete token or build already deleted" }, { status: 404 });
  }

  const build = await getBuild(buildId);
  
  if (!build) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  try {
    if (build.ipaBlobUrl) await del(build.ipaBlobUrl);
    if (build.iconBlobUrl) await del(build.iconBlobUrl);
    if (build.icon57BlobUrl) await del(build.icon57BlobUrl);
  } catch (err) {
    console.error("Blob delete error:", err);
  }

  const totalSize = build.sizeIpa + build.sizeIcon + (build.sizeIcon57 || 0);
  await decrementStorage(totalSize);
  await deleteBuild(buildId);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Build Deleted</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
    .success { color: #22c55e; font-size: 48px; margin-bottom: 20px; }
    p { color: #666; margin-bottom: 20px; }
    a { display: inline-block; background: #007AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="success">✓</div>
  <h1>Build Deleted</h1>
  <p>The app build has been permanently deleted.</p>
  <a href="/">Upload Another App</a>
</body>
</html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}