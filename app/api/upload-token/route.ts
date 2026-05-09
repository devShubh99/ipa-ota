import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    note: "Use Vercel Blob client SDK for direct uploads",
    maxFileSize: 100 * 1024 * 1024, // 100MB
  });
}