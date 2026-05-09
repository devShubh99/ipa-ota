"use client";

import { useState, useRef, useEffect } from "react";
import JSZip from "jszip";
import { put } from "@vercel/blob";

interface AppInfo {
  bundleId: string;
  version: string;
  displayName: string;
  iconDataUrl?: string;
}

interface StorageStatus {
  usedBytes: number;
  limitBytes: number;
  usedMB: number;
  limitMB: number;
}

interface RegisterResponse {
  installUrl: string;
  deleteUrl: string;
  expiresAt: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<RegisterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storage, setStorage] = useState<StorageStatus | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStorageStatus();
  }, []);

  async function fetchStorageStatus() {
    try {
      const res = await fetch("/api/storage-status");
      const data = await res.json();
      setStorage(data);
    } catch (e) {
      console.error("Failed to fetch storage:", e);
    }
  }

  async function extractIpaInfo(zip: JSZip): Promise<AppInfo> {
    const info: AppInfo = {
      bundleId: "unknown",
      version: "1.0",
      displayName: "App",
    };

    const files = Object.keys(zip.files);
    const appDir = files.find((f) => f.endsWith(".app/"));
    
    if (!appDir) {
      throw new Error("No .app bundle found in IPA");
    }

    const appPath = appDir.replace("/", "");
    const infoPlistPath = `${appPath}/Info.plist`;

    if (zip.files[infoPlistPath]) {
      const plistContent = await zip.files[infoPlistPath].async("text");
      const parsed = parsePlist(plistContent);
      
      if (parsed.CFBundleIdentifier) info.bundleId = String(parsed.CFBundleIdentifier);
      if (parsed.CFBundleShortVersionString) info.version = String(parsed.CFBundleShortVersionString);
      if (parsed.CFBundleDisplayName) info.displayName = String(parsed.CFBundleDisplayName);
      else if (parsed.CFBundleName) info.displayName = String(parsed.CFBundleName);
    }

    const iconData = await extractIcon(zip, appPath);
    if (iconData) {
      info.iconDataUrl = iconData;
    }

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

    const keys = ["CFBundleIdentifier", "CFBundleShortVersionString", "CFBundleDisplayName", "CFBundleName"];
    
    for (let i = 0; i < patterns.length; i++) {
      const match = xml.match(patterns[i]);
      if (match) {
        result[keys[i]] = match[2];
      }
    }

    return result;
  }

  async function extractIcon(zip: JSZip, appPath: string): Promise<string | null> {
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
        const data = await zip.files[path].async("base64");
        return `data:image/png;base64,${data}`;
      }
    }

    const iconSetPath = `${appPath}/AppIcon.appiconset/`;
    for (const name of ["AppIcon60x60@2x.png", "Icon-60@2x.png"]) {
      const path = iconSetPath + name;
      if (zip.files[path]) {
        const data = await zip.files[path].async("base64");
        return `data:image/png;base64,${data}`;
      }
    }

    return null;
  }

  async function handleFile(file: File) {
    if (!file.name.endsWith(".ipa")) {
      setError("Please select a .ipa file");
      return;
    }

    setFile(file);
    setError(null);
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      const info = await extractIpaInfo(zip);
      setAppInfo(info);
    } catch (e) {
      setError("Failed to read IPA. Make sure it's a valid .ipa file.");
      console.error(e);
    }
  }

  async function handleUpload() {
    if (!file || !appInfo) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      setProgress(10);
      const ipaBlob = await put(file.name, file, {
        contentType: "application/zip",
        access: "public",
      });
      setProgress(50);

      let iconBlobUrl = "";
      if (appInfo.iconDataUrl) {
        const response = await fetch(appInfo.iconDataUrl);
        const blob = await response.blob();
        const iconFileName = `icon-${Date.now()}.png`;
        iconBlobUrl = (await put(iconFileName, blob, {
          contentType: "image/png",
          access: "public",
        })).url;
      }
      setProgress(80);

      const payload = {
        ipaBlobUrl: ipaBlob.url,
        iconBlobUrl: iconBlobUrl,
        bundleId: appInfo.bundleId,
        version: appInfo.version,
        displayName: appInfo.displayName,
        sizeIpa: file.size,
        sizeIcon: iconBlobUrl ? 1 : 0,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }

      const data: RegisterResponse = await res.json();
      setProgress(100);
      setResult(data);
      fetchStorageStatus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-2">IPA OTA Installer</h1>
        <p className="text-gray-600 text-center mb-8">Drop .ipa, get install link. Black box.</p>

        {storage && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 text-sm">
            <div className="flex justify-between mb-2">
              <span>Storage Used</span>
              <span>{storage.usedMB} / {storage.limitMB} MB</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${(storage.usedBytes / storage.limitBytes) * 100}%` }}
              />
            </div>
          </div>
        )}

        {!result ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {!file ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500"
                onClick={() => fileInputRef.current?.click()}
              >
                <p className="text-gray-500 mb-2">Drop .ipa file here</p>
                <p className="text-gray-400 text-sm">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ipa"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  {appInfo?.iconDataUrl && (
                    <img src={appInfo.iconDataUrl} alt="App Icon" className="w-16 h-16 rounded-lg" />
                  )}
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{appInfo?.displayName}</h2>
                    <p className="text-gray-500 text-sm">
                      {appInfo?.bundleId} v{appInfo?.version}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setAppInfo(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  {uploading ? `Uploading... ${progress}%` : "Upload & Generate Links"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">✓</div>
              <h2 className="text-xl font-semibold">Ready to Install</h2>
            </div>

            {appInfo?.iconDataUrl && (
              <div className="flex justify-center mb-4">
                <img src={appInfo.iconDataUrl} alt="App" className="w-24 h-24 rounded-xl" />
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Install Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={result.installUrl}
                    className="flex-1 border rounded px-3 py-2 text-sm bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(result.installUrl, "install")}
                    className="px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
                  >
                    {copied === "install" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">Delete Link (keep safe!)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={result.deleteUrl}
                    className="flex-1 border rounded px-3 py-2 text-sm bg-gray-50 font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(result.deleteUrl, "delete")}
                    className="px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
                  >
                    {copied === "delete" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Expires: {new Date(result.expiresAt).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setAppInfo(null);
                setResult(null);
              }}
              className="w-full border border-gray-300 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Upload Another
            </button>
          </div>
        )}
      </div>
    </main>
  );
}