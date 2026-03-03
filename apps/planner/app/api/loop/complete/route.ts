import { NextResponse } from "next/server";
import { completeTask } from "@/app/api/_store";

export async function POST(request: Request): Promise<NextResponse> {
  const payload = (await request.json()) as { taskId?: string };
  if (!payload.taskId) {
    return NextResponse.json({ ok: false, stage: "complete", message: "taskId is required." }, { status: 400 });
  }

  const task = completeTask(payload.taskId);
  if (!task) {
    return NextResponse.json({ ok: false, stage: "complete", message: "Task not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, stage: "complete", task });
}
