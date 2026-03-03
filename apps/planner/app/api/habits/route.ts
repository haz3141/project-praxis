import { NextResponse } from "next/server";
import { listHabits } from "@/app/api/_store";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, items: listHabits() });
}
