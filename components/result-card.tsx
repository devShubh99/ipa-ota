"use client";

import { useState } from "react";
import type { RegisterResponse, DisplayAppInfo } from "@/lib/types";

interface Props {
  result: RegisterResponse;
  appInfo: DisplayAppInfo;
  onReset: () => void;
}

export default function ResultCard({ result, appInfo, onReset }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">✓</div>
        <h2 className="text-xl font-semibold">Ready to Install</h2>
      </div>

      {appInfo.iconDataUrl && (
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
        onClick={onReset}
        className="w-full border border-gray-300 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
      >
        Upload Another
      </button>
    </div>
  );
}
