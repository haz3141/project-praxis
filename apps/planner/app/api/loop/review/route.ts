import { NextResponse } from "next/server";
import { addReview } from "@/app/api/_store";

export async function POST(request: Request): Promise<NextResponse> {
  const payload = (await request.json()) as { body?: string };
  if (!payload.body?.trim()) {
    return NextResponse.json({ ok: false, stage: "review", message: "Review text is required." }, { status: 400 });
  }

  const review = addReview(payload.body.trim());
  return NextResponse.json({ ok: true, stage: "review", review }, { status: 201 });
}
