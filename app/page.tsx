"use client";

import { useState, useEffect, useActionState } from "react";
import { put } from "@vercel/blob";
import { parseIpa, encodeIcon, type AppInfo } from "@/lib/ipa-parser";
import type { StorageStatus, DisplayAppInfo } from "@/lib/types";
import { registerBuild, type RegisterState } from "@/app/actions";
import StorageBar from "@/components/storage-bar";
import UploadArea from "@/components/upload-area";
import AppInfoCard from "@/components/app-info-card";
import ResultCard from "@/components/result-card";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [appInfo, setAppInfo] = useState<DisplayAppInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storage, setStorage] = useState<StorageStatus | null>(null);
  const [progress, setProgress] = useState(0);

  const [regState, formAction, isPending] = useActionState<RegisterState, FormData>(
    registerBuild,
    {},
  );

  useEffect(() => {
    fetchStorageStatus();
  }, []);

  useEffect(() => {
    if (regState.error) {
      setError(regState.error);
    }
  }, [regState.error]);

  async function fetchStorageStatus() {
    try {
      const res = await fetch("/api/storage-status");
      const data = await res.json();
      setStorage(data);
    } catch (e) {
      console.error("Failed to fetch storage:", e);
    }
  }

  async function handleFile(file: File) {
    if (!file.name.endsWith(".ipa")) {
      setError("Please select a .ipa file");
      return;
    }

    setFile(file);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const info: AppInfo = await parseIpa(arrayBuffer);
      setAppInfo({
        bundleId: info.bundleId,
        version: info.version,
        displayName: info.displayName,
        iconDataUrl: encodeIcon(info.iconData),
      });
    } catch (e) {
      setError("Failed to read IPA. Make sure it's a valid .ipa file.");
      console.error(e);
    }
  }

  async function handleUpload() {
    if (!file || !appInfo) return;

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

      const formData = new FormData();
      formData.append("ipaBlobUrl", ipaBlob.url);
      formData.append("iconBlobUrl", iconBlobUrl);
      formData.append("bundleId", appInfo.bundleId);
      formData.append("version", appInfo.version);
      formData.append("displayName", appInfo.displayName);
      formData.append("sizeIpa", String(file.size));
      formData.append("sizeIcon", iconBlobUrl ? "1" : "0");

      formAction(formData);
      setProgress(100);
      fetchStorageStatus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      console.error(e);
    }
  }

  function handleClear() {
    setFile(null);
    setAppInfo(null);
    setError(null);
  }

  function handleReset() {
    setFile(null);
    setAppInfo(null);
    setError(null);
    setProgress(0);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-2">IPA OTA Installer</h1>
        <p className="text-gray-600 text-center mb-8">Drop .ipa, get install link. Black box.</p>

        {storage && <StorageBar storage={storage} />}

        {!regState.installUrl ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {!file ? (
              <UploadArea onFileSelected={handleFile} />
            ) : appInfo ? (
              <AppInfoCard
                file={file}
                appInfo={appInfo}
                error={error}
                isPending={isPending}
                onUpload={handleUpload}
                onClear={handleClear}
              />
            ) : null}
          </div>
        ) : (
          <ResultCard
            result={{
              installUrl: regState.installUrl,
              deleteUrl: regState.deleteUrl!,
              expiresAt: regState.expiresAt!,
            }}
            appInfo={appInfo!}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
