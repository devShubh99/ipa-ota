import JSZip from "jszip";

export interface AppInfo {
  bundleId: string;
  version: string;
  displayName: string;
  iconData?: Uint8Array;
}

export async function parseIpa(buffer: ArrayBuffer): Promise<AppInfo> {
  const info: AppInfo = {
    bundleId: "unknown",
    version: "1.0",
    displayName: "App",
  };

  const zip = await JSZip.loadAsync(buffer);
  const files = Object.keys(zip.files);
  const appDir = files.find((f) => f.endsWith(".app/"));

  if (!appDir) {
    throw new Error("No .app bundle found in IPA");
  }

  const appPath = appDir.replace(/\/$/, "");
  const infoPlistPath = `${appPath}/Info.plist`;

  if (!zip.files[infoPlistPath]) {
    throw new Error("Info.plist not found");
  }

  const plistContent = await zip.files[infoPlistPath].async("text");
  const parsed = parsePlist(plistContent);

  if (parsed.CFBundleIdentifier)
    info.bundleId = String(parsed.CFBundleIdentifier);
  if (parsed.CFBundleShortVersionString)
    info.version = String(parsed.CFBundleShortVersionString);
  if (parsed.CFBundleDisplayName)
    info.displayName = String(parsed.CFBundleDisplayName);
  else if (parsed.CFBundleName) info.displayName = String(parsed.CFBundleName);

  const iconData = await extractIcon(zip, appPath);
  if (iconData) info.iconData = iconData;

  return info;
}

function parsePlist(xml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  const patterns = [
    /<key>(CFBundleIdentifier)<\/key>\s*<string>([^<]+)<\/string>/,
    /<key>(CFBundleShortVersionString)<\/key>\s*<string>([^<]+)<\/string>/,
    /<key>(CFBundleDisplayName)<\/key>\s*<string>([^<]+)<\/string>/,
    /<key>(CFBundleName)<\/key>\s*<string>([^<]+)<\/string>/,
  ];

  const keys = [
    "CFBundleIdentifier",
    "CFBundleShortVersionString",
    "CFBundleDisplayName",
    "CFBundleName",
  ];

  for (let i = 0; i < patterns.length; i++) {
    const match = xml.match(patterns[i]);
    if (match) {
      result[keys[i]] = match[2];
    }
  }

  return result;
}

async function extractIcon(
  zip: JSZip,
  appPath: string,
): Promise<Uint8Array | null> {
  const iconNames = [
    "AppIcon60x60@2x.png",
    "AppIcon60x60@3x.png",
    "AppIcon76x76@2x.png",
    "Icon-60@2x.png",
    "Icon-60@3x.png",
  ];

  for (const name of iconNames) {
    const path = `${appPath}/${name}`;
    if (zip.files[path]) {
      return await zip.files[path].async("uint8array");
    }
  }

  const iconSetPath = `${appPath}/AppIcon.appiconset/`;
  for (const name of ["AppIcon60x60@2x.png", "Icon-60@2x.png"]) {
    const path = iconSetPath + name;
    if (zip.files[path]) {
      return await zip.files[path].async("uint8array");
    }
  }

  return null;
}

export function encodeIcon(data?: Uint8Array): string | undefined {
  if (!data) return undefined;
  const base64 = Buffer.from(data).toString("base64");
  return `data:image/png;base64,${base64}`;
}
