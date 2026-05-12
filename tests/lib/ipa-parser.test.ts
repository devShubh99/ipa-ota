import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseIpa, encodeIcon } from "@/lib/ipa-parser";
import JSZip from "jszip";

vi.mock("jszip", () => {
  return {
    default: {
      loadAsync: vi.fn(),
    },
  };
});

describe("IPA Parser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should extract bundle ID, version, and display name from mock plist", async () => {
    const mockPlist = `
      <plist>
        <dict>
          <key>CFBundleIdentifier</key>
          <string>com.example.app</string>
          <key>CFBundleShortVersionString</key>
          <string>1.2.3</string>
          <key>CFBundleDisplayName</key>
          <string>Test App</string>
        </dict>
      </plist>
    `;

    const mockZip = {
      files: {
        "Payload/Test.app/": {},
        "Payload/Test.app/Info.plist": {
          async: vi.fn().mockResolvedValue(mockPlist),
        },
      },
    };

    (JSZip.loadAsync as any).mockResolvedValue(mockZip);

    const dummyBuffer = Uint8Array.from(Buffer.from("dummy zip")).buffer;
    const result = await parseIpa(dummyBuffer);

    expect(result.bundleId).toBe("com.example.app");
    expect(result.version).toBe("1.2.3");
    expect(result.displayName).toBe("Test App");
  });

  it("should fallback to CFBundleName if CFBundleDisplayName is missing", async () => {
    const mockPlist = `
      <plist>
        <dict>
          <key>CFBundleIdentifier</key>
          <string>com.example.app</string>
          <key>CFBundleShortVersionString</key>
          <string>1.2.3</string>
          <key>CFBundleName</key>
          <string>Fallback Name</string>
        </dict>
      </plist>
    `;

    const mockZip = {
      files: {
        "Payload/Test.app/": {},
        "Payload/Test.app/Info.plist": {
          async: vi.fn().mockResolvedValue(mockPlist),
        },
      },
    };

    (JSZip.loadAsync as any).mockResolvedValue(mockZip);

    const result = await parseIpa(
      Uint8Array.from(Buffer.from("dummy zip")).buffer,
    );
    expect(result.displayName).toBe("Fallback Name");
  });

  it("should throw error if no .app bundle found", async () => {
    const mockZip = {
      files: {},
    };

    (JSZip.loadAsync as any).mockResolvedValue(mockZip);

    await expect(
      parseIpa(Uint8Array.from(Buffer.from("dummy zip")).buffer),
    ).rejects.toThrow("No .app bundle found in IPA");
  });

  it("should encode icon data correctly", () => {
    const data = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const encoded = encodeIcon(data);
    expect(encoded).toBe("data:image/png;base64,SGVsbG8=");
  });

  it("should return undefined when encoding undefined icon data", () => {
    expect(encodeIcon(undefined)).toBeUndefined();
  });
});
