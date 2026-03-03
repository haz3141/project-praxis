import { NextResponse } from "next/server";
import { createTask, listTasks } from "@/app/api/_store";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, items: listTasks("inbox") });
}

export async function POST(request: Request): Promise<NextResponse> {
  const payload = (await request.json()) as { title?: string; notes?: string };
  if (!payload.title?.trim()) {
    return NextResponse.json({ ok: false, message: "Title is required." }, { status: 400 });
  }

  const task = createTask({ title: payload.title.trim(), notes: payload.notes?.trim() ?? "" });
  return NextResponse.json({ ok: true, task }, { status: 201 });
}
