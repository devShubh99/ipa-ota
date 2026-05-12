export function buildPageHtml(data: {
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

export const NOT_FOUND_HTML = `<!DOCTYPE html>
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

export function plistXml(build: {
  ipaBlobUrl: string;
  iconBlobUrl?: string;
  icon57BlobUrl?: string;
  bundleId: string;
  version: string;
  displayName: string;
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
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
}

export const EMPTY_PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict><key>items</key><array/></dict></plist>`;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
