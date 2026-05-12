"use client";

import type { StorageStatus } from "@/lib/types";

interface Props {
  storage: StorageStatus;
}

export default function StorageBar({ storage }: Props) {
  return (
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
  );
}
