import { put, del } from "@vercel/blob";

export async function uploadToBlob(
  data: ArrayBuffer,
  filename: string,
  contentType: string
): Promise<string> {
  const blob = await put(filename, data, {
    contentType,
    access: "public",
  });
  return blob.url;
}

export async function deleteBlob(url: string): Promise<void> {
  if (!url) return;
  try {
    await del(url);
  } catch (error) {
    console.error("Failed to delete blob:", url, error);
  }
}

export function getBlobPath(path: string): string {
  return `uploads/${path}`;
}