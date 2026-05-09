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

function buildPageHtml(data: {
  displayName: string;
  bundleId: string;
  version: string;
  iconBlobUrl?: string;
  expiresAt: string;
  isExpired: boolean;
  installUrl: string;
}) {
  const iconImg = data.iconBlobUrl 
    ? `<img src="${data.iconBlobUrl}" alt="${data.displayName}" style="width:96px;height:96px;border-radius:20px;margin-bottom:16px" />`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${data.displayName}</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#f5f5f5}
    .c{background:white;border-radius:16px;padding:32px;text-align:center;max-width:400px;width:100%}
    h1{font-size:24px;margin-bottom:4px}
    .p{color:#666;font-size:14px;margin-bottom:4px}
    .p2{color:#999;font-size:12px;margin-bottom:24px}
    .btn{display:inline-block;background:#007AFF;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:17px;font-weight:600}
    .btnx{background:#999;cursor:not-allowed}
    .box{margin-top:24px;padding:16px;background:#f5f5f5;border-radius:12px;text-align:left}
    h3{font-size:14px;font-weight:600;margin-bottom:8px}
    p{font-size:13px;color:#666;margin-bottom:8px}
    ol{font-size:13px;color:#666;padding-left:20px}
    a{font-size:13px;color:#007AFF;margin-top:8px;display:inline-block}
  </style>
</head>
<body>
  <div class="c">
    ${iconImg}
    <h1>${data.displayName}</h1>
    <p class="p">${data.bundleId} v${data.version}</p>
    <p class="p2">Expires: ${new Date(data.expiresAt).toLocaleString()}</p>
    ${data.isExpired 
      ? '<div class="btn btnx">Expired</div>'
      : `<a href="${data.installUrl}" class="btn">Install App</a>
        <div class="box">
          <h3>Enterprise Certificate Trust</h3>
          <p>If the app crashes after installation, you need to trust the enterprise certificate:</p>
          <ol>
            <li>Open Settings → General → VPN & Device Management</li>
            <li>Find your company/enterprise certificate</li>
            <li>Tap "Trust" or "Verify"</li>
          </ol>
          <a href="App-prefs:root=General&path=ManagedConfigurationList">Open Device Management Settings</a>
        </div>
        <p style="margin-top:24px;font-size:13px;color:#999">Open this link on your iPhone or iPad to install.</p>`
    }
  </div>
</body>
</html>`;
}

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Build Not Found</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#f5f5f5}
    .c{background:white;border-radius:16px;padding:32px;text-align:center;max-width:400px;width:100%}
    h1{font-size:24px;margin-bottom:16px}
    p{color:#666;margin-bottom:24px}
    a{background:#007AFF;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:17px;font-weight:600}
  </style>
</head>
<body>
  <div class="c">
    <h1>Build Not Found</h1>
    <p>This build has expired or been deleted.</p>
    <a href="/">Upload New App</a>
  </div>
</body>
</html>`;