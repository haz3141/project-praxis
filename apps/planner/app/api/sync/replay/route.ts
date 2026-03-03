import { NextResponse } from "next/server";
import { isDuplicateReplayKey, readIdempotencyKey } from "@/app/api/_store";

export async function POST(request: Request): Promise<NextResponse> {
  const idempotencyKey = readIdempotencyKey(request);
  if (!idempotencyKey) {
    return NextResponse.json({ ok: false, message: "Missing Idempotency-Key header." }, { status: 400 });
  }

  const body = (await request.json()) as { entityTable?: string; entityId?: string; operation?: string };
  if (!body.entityTable || !body.entityId || !body.operation) {
    return NextResponse.json(
      {
        ok: false,
        message: "entityTable, entityId, and operation are required."
      },
      { status: 400 }
    );
  }

  if (isDuplicateReplayKey(idempotencyKey)) {
    return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
  }

  return NextResponse.json({ ok: true, duplicate: false }, { status: 200 });
}
