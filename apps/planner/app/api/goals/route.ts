import { NextResponse } from "next/server";
import { listGoals } from "@/app/api/_store";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, items: listGoals() });
}
