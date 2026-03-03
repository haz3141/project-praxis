import { NextResponse } from "next/server";
import { moveTaskToToday } from "@/app/api/_store";

export async function POST(request: Request): Promise<NextResponse> {
  const payload = (await request.json()) as { taskId?: string };
  if (!payload.taskId) {
    return NextResponse.json({ ok: false, stage: "commit", message: "taskId is required." }, { status: 400 });
  }

  const task = moveTaskToToday(payload.taskId);
  if (!task) {
    return NextResponse.json({ ok: false, stage: "commit", message: "Task not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, stage: "commit", task });
}
