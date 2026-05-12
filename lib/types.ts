export interface StorageStatus {
  usedBytes: number;
  limitBytes: number;
  usedMB: number;
  limitMB: number;
}

export interface RegisterResponse {
  installUrl: string;
  deleteUrl: string;
  expiresAt: string;
}

export interface DisplayAppInfo {
  bundleId: string;
  version: string;
  displayName: string;
  iconDataUrl?: string;
}
