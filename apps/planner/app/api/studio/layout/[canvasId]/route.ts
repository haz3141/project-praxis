import { NextResponse } from "next/server";
import { getStudioLayout, setStudioLayout } from "@/app/api/_store";
import {
  assertPointerOnlyLayoutItem,
  normalizePointerLayoutItem,
  type StudioLayoutPointerItem
} from "@/src/features/studio/layoutSchema";

export async function GET(
  _request: Request,
  context: { params: Promise<{ canvasId: string }> }
): Promise<NextResponse> {
  const { canvasId } = await context.params;
  return NextResponse.json({ ok: true, items: getStudioLayout(canvasId) });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ canvasId: string }> }
): Promise<NextResponse> {
  const { canvasId } = await context.params;
  const payload = (await request.json()) as { items?: unknown[] };

  if (!Array.isArray(payload.items)) {
    return NextResponse.json({ ok: false, message: "items[] is required." }, { status: 400 });
  }

  try {
    const items = payload.items.map((item) => {
      assertPointerOnlyLayoutItem(item);
      const cast = normalizePointerLayoutItem(item as StudioLayoutPointerItem);
      return { ...cast, id: cast.id ?? crypto.randomUUID(), canvasId, deletedAt: cast.deletedAt ?? null };
    });
    return NextResponse.json({ ok: true, items: setStudioLayout(canvasId, items) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid studio layout payload.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
