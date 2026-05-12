"use client";

import { useRef } from "react";

interface Props {
  onFileSelected: (file: File) => void;
}

export default function UploadArea({ onFileSelected }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
          if (f) onFileSelected(f);
        }}
      />
    </div>
  );
}
