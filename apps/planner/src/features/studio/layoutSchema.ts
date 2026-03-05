export const STUDIO_ENTITY_TYPES = ["task", "habit", "goal", "project", "note"] as const;
export type StudioEntityType = (typeof STUDIO_ENTITY_TYPES)[number];

export interface StudioPointerMeta extends Record<string, unknown> {
  color?: string;
  locked?: boolean;
  tag?: string;
  label?: string;
  sourceId?: string;
}

export interface StudioLayoutPointerItem {
  id?: string;
  canvasId: string;
  entityType: StudioEntityType;
  entityId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  collapsed: boolean;
  meta?: StudioPointerMeta;
  deletedAt?: string | null;
}

export type NormalizedStudioLayoutPointerItem = Omit<StudioLayoutPointerItem, "meta"> & {
  meta: Record<string, unknown>;
};

const FORBIDDEN_KEYS = new Set([
  "title",
  "content",
  "description",
  "body",
  "text",
  "payload",
  "snapshot",
]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function assertNoForbiddenKeys(
  record: Record<string, unknown>,
  context: string
): void {
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_KEYS.has(key)) {
      throw new Error(`${context} must stay pointer-only. Forbidden key: ${key}`);
    }
  }
}

export function isStudioEntityType(value: unknown): value is StudioEntityType {
  return (
    typeof value === "string" &&
    (STUDIO_ENTITY_TYPES as readonly string[]).includes(value)
  );
}

export function assertPointerOnlyMeta(meta: unknown): asserts meta is StudioPointerMeta {
  if (meta === undefined) {
    return;
  }
  if (!isRecord(meta)) {
    throw new Error("Studio layout meta must be an object when provided.");
  }

  assertNoForbiddenKeys(meta, "Studio layout meta");

  for (const value of Object.values(meta)) {
    const valueType = typeof value;
    const isPrimitive =
      value === null ||
      valueType === "string" ||
      valueType === "number" ||
      valueType === "boolean";
    if (!isPrimitive) {
      throw new Error("Studio layout meta values must be primitive.");
    }
  }
}

export function assertPointerOnlyLayoutItem(
  item: unknown
): asserts item is StudioLayoutPointerItem {
  if (!isRecord(item)) {
    throw new Error("Studio layout item must be an object.");
  }

  assertNoForbiddenKeys(item, "Studio layout item");

  if (typeof item.canvasId !== "string" || item.canvasId.trim() === "") {
    throw new Error("Studio layout item canvasId is required.");
  }

  if (!isStudioEntityType(item.entityType)) {
    throw new Error("Studio layout item entityType is invalid.");
  }

  if (typeof item.entityId !== "string" || !UUID_PATTERN.test(item.entityId)) {
    throw new Error("Studio layout item entityId must be a UUID.");
  }

  if (!isFiniteNumber(item.x) || !isFiniteNumber(item.y)) {
    throw new Error("Studio layout item coordinates must be finite numbers.");
  }

  if (!isFiniteNumber(item.width) || item.width <= 0) {
    throw new Error("Studio layout item width must be greater than zero.");
  }

  if (!isFiniteNumber(item.height) || item.height <= 0) {
    throw new Error("Studio layout item height must be greater than zero.");
  }

  if (!Number.isInteger(item.zIndex)) {
    throw new Error("Studio layout item zIndex must be an integer.");
  }

  if (typeof item.collapsed !== "boolean") {
    throw new Error("Studio layout item collapsed must be a boolean.");
  }

  assertPointerOnlyMeta(item.meta);
}

export function normalizePointerLayoutItem(
  item: StudioLayoutPointerItem
): NormalizedStudioLayoutPointerItem {
  assertPointerOnlyLayoutItem(item);

  return {
    ...item,
    canvasId: item.canvasId.trim(),
    zIndex: Math.trunc(item.zIndex),
    meta: item.meta ?? {},
  };
}
