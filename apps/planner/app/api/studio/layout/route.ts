import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    message: "Use /api/studio/layout/{canvasId} for pointer-only layout operations."
  });
}
