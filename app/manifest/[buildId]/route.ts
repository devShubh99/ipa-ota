import { getBuild } from "@/lib/kv";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ buildId: string }> }
) {
  const { buildId } = await params;
  const build = await getBuild(buildId);

  if (!build) {
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>items</key><array/></dict></plist>',
      {
        headers: {
          "Content-Type": "text/xml",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  const isExpired = new Date(build.expiresAt) < new Date();
  if (isExpired) {
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>items</key><array/></dict></plist>',
      {
        headers: {
          "Content-Type": "text/xml",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>${escapeXml(build.ipaBlobUrl)}</string>
        </dict>
        ${build.iconBlobUrl ? `
        <dict>
          <key>kind</key>
          <string>full-size-image</string>
          <key>url</key>
          <string>${escapeXml(build.iconBlobUrl)}</string>
        </dict>` : ""}
        ${build.icon57BlobUrl ? `
        <dict>
          <key>kind</key>
          <string>display-image</string>
          <key>url</key>
          <string>${escapeXml(build.icon57BlobUrl)}</string>
        </dict>` : ""}
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>${escapeXml(build.bundleId)}</string>
        <key>bundle-version</key>
        <string>${escapeXml(build.version)}</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>${escapeXml(build.displayName)}</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "text/xml",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}