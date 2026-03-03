import { NextResponse } from "next/server";
import { listTasks } from "@/app/api/_store";

export async function GET(): Promise<NextResponse> {
  const today = new Date();
  const horizon = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() + index);
    const date = day.toISOString().slice(0, 10);
    const items = listTasks().filter(
      (task) => task.status !== "done" && (task.scheduledFor === date || (!task.scheduledFor && index === 0))
    );
    return { date, items };
  });

  return NextResponse.json({ ok: true, horizon });
}
