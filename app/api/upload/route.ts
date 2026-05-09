import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type - .ipa files are ZIPs
    if (!file.name.endsWith(".ipa") && file.type !== "application/zip" && file.type !== "application/x-ipaz-archive") {
      return NextResponse.json({ error: "Invalid file type. Expected .ipa" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const filename = file.name;
    const blob = await put(filename, buffer, {
      contentType: "application/zip",
      access: "public",
    });

    return NextResponse.json({
      url: blob.url,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}