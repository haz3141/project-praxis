import { NextResponse } from "next/server";
import { createTask } from "@/app/api/_store";

export async function POST(request: Request): Promise<NextResponse> {
  const payload = (await request.json()) as { title?: string; notes?: string };
  if (!payload.title?.trim()) {
    return NextResponse.json({ ok: false, stage: "capture", message: "Title is required." }, { status: 400 });
  }

  const task = createTask({ title: payload.title.trim(), notes: payload.notes?.trim() ?? "" });
  return NextResponse.json({ ok: true, stage: "capture", task }, { status: 201 });
}
