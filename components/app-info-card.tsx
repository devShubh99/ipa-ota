"use client";

import type { DisplayAppInfo } from "@/lib/types";

interface Props {
  file: File;
  appInfo: DisplayAppInfo;
  error: string | null;
  isPending: boolean;
  onUpload: () => void;
  onClear: () => void;
}

export default function AppInfoCard({ file, appInfo, error, isPending, onUpload, onClear }: Props) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        {appInfo.iconDataUrl && (
          <img src={appInfo.iconDataUrl} alt="App Icon" className="w-16 h-16 rounded-lg" />
        )}
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{appInfo.displayName}</h2>
          <p className="text-gray-500 text-sm">
            {appInfo.bundleId} v{appInfo.version}
          </p>
          <p className="text-gray-400 text-sm">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <button
        onClick={onUpload}
        disabled={isPending}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {isPending ? "Uploading..." : "Upload & Generate Links"}
      </button>
    </div>
  );
}
