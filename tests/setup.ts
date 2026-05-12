// tests/setup.ts
import { vi } from "vitest";

// Mock Vercel Blob
vi.mock("@vercel/blob", () => ({
  put: vi.fn().mockResolvedValue({ url: "https://blob.example.com/test.ipa" }),
  del: vi.fn().mockResolvedValue({}),
}));

// Mock Vercel KV
const mockKv = {
  set: vi.fn().mockResolvedValue("OK"),
  get: vi.fn().mockResolvedValue(null),
  keys: vi.fn().mockResolvedValue([]),
  hset: vi.fn().mockResolvedValue(1),
  hget: vi.fn().mockResolvedValue(null),
  hgetall: vi.fn().mockResolvedValue(null),
  del: vi.fn().mockResolvedValue(1),
  hdel: vi.fn().mockResolvedValue(1),
  lpush: vi.fn().mockResolvedValue(1),
  lrange: vi.fn().mockResolvedValue([]),
  lrem: vi.fn().mockResolvedValue(1),
  hincrby: vi.fn().mockResolvedValue(1),
};

vi.mock("@vercel/kv", () => ({
  kv: mockKv,
}));
