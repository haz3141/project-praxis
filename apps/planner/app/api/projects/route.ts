import { NextResponse } from "next/server";
import { listProjects } from "@/app/api/_store";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, items: listProjects() });
}
