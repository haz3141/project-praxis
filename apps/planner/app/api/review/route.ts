import { NextResponse } from "next/server";
import { addReview, listReviews } from "@/app/api/_store";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, items: listReviews() });
}

export async function POST(request: Request): Promise<NextResponse> {
  const payload = (await request.json()) as { body?: string };
  if (!payload.body?.trim()) {
    return NextResponse.json({ ok: false, message: "Review body is required." }, { status: 400 });
  }

  const review = addReview(payload.body.trim());
  return NextResponse.json({ ok: true, review }, { status: 201 });
}
