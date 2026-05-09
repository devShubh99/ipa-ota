import { getBuild } from "@/lib/kv";

export const runtime = "nodejs";

export default async function InstallPage({
  params,
}: {
  params: Promise<{ buildId: string }>;
}) {
  const { buildId } = await params;
  const build = await getBuild(buildId);

  if (!build) {
    return (
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Build Not Found</title>
        </head>
        <body style={bodyStyle}>
          <div style={containerStyle}>
            <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Build Not Found</h1>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              This build has expired or been deleted.
            </p>
            <a href="/" style={buttonStyle}>Upload New App</a>
          </div>
        </body>
      </html>
    );
  }

  const isExpired = new Date(build.expiresAt) < new Date();
  const manifestUrl = `/manifest/${buildId}`;
  const installUrl = `itms-services://?action=download-manifest&url=${encodeURIComponent(manifestUrl)}`;

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{build.displayName}</title>
      </head>
      <body style={bodyStyle}>
        <div style={containerStyle}>
          {build.iconBlobUrl && (
            <img 
              src={build.iconBlobUrl} 
              alt={build.displayName} 
              style={{ width: "96px", height: "96px", borderRadius: "20px", marginBottom: "16px" }}
            />
          )}
          
          <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "4px" }}>
            {build.displayName}
          </h1>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
            {build.bundleId} v{build.version}
          </p>
          <p style={{ color: "#999", fontSize: "12px", marginBottom: "24px" }}>
            Expires: {new Date(build.expiresAt).toLocaleString()}
          </p>

          {isExpired ? (
            <div style={{ ...buttonStyle, backgroundColor: "#999", cursor: "not-allowed" }}>
              Expired
            </div>
          ) : (
            <>
              <a href={installUrl} style={buttonStyle}>
                Install App
              </a>
              
              <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "12px", textAlign: "left" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                  Enterprise Certificate Trust
                </h3>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
                  If the app crashes after installation, you need to trust the enterprise certificate:
                </p>
                <ol style={{ fontSize: "13px", color: "#666", paddingLeft: "20px" }}>
                  <li>Open Settings → General → VPN & Device Management</li>
                  <li>Find your company/enterprise certificate</li>
                  <li>Tap "Trust" or "Verify"</li>
                </ol>
                <a 
                  href="App-prefs:root=General&path=ManagedConfigurationList"
                  style={{ fontSize: "13px", color: "#007AFF", marginTop: "8px", display: "inline-block" }}
                >
                  Open Device Management Settings
                </a>
              </div>

              <p style={{ marginTop: "24px", fontSize: "13px", color: "#999" }}>
                Open this link on your iPhone or iPad to install.
              </p>
            </>
          )}
        </div>
      </body>
    </html>
  );
}

const bodyStyle = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  backgroundColor: "#f5f5f5",
};

const containerStyle = {
  backgroundColor: "white",
  borderRadius: "16px",
  padding: "32px",
  textAlign: "center",
  maxWidth: "400px",
  width: "100%",
};

const buttonStyle = {
  display: "inline-block",
  backgroundColor: "#007AFF",
  color: "white",
  padding: "14px 28px",
  borderRadius: "12px",
  textDecoration: "none",
  fontSize: "17px",
  fontWeight: "600",
};