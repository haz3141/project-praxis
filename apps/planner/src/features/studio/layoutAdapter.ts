import {
  assertPointerOnlyLayoutItem,
  normalizePointerLayoutItem,
  type StudioEntityType,
  type StudioLayoutPointerItem,
  type StudioPointerMeta,
} from "./layoutSchema";

export interface StudioCanvasLayoutRow {
  id: string;
  user_id: string;
  canvas_id: string;
  entity_type: StudioEntityType;
  entity_id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z_index: number;
  collapsed: boolean;
  meta: StudioPointerMeta | null;
  created_at?: string;
  updated_at?: string;
  deleted_at: string | null;
}

export interface StudioCanvasLayoutUpsertInput {
  id?: string;
  user_id: string;
  canvas_id: string;
  entity_type: StudioEntityType;
  entity_id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z_index: number;
  collapsed: boolean;
  meta: StudioPointerMeta;
  deleted_at?: string | null;
}

export function fromStudioLayoutRow(
  row: StudioCanvasLayoutRow
): StudioLayoutPointerItem {
  return normalizePointerLayoutItem({
    id: row.id,
    canvasId: row.canvas_id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    x: row.x,
    y: row.y,
    width: row.width,
    height: row.height,
    zIndex: row.z_index,
    collapsed: row.collapsed,
    meta: row.meta ?? {},
    deletedAt: row.deleted_at,
  });
}

export function fromStudioLayoutRows(
  rows: StudioCanvasLayoutRow[]
): StudioLayoutPointerItem[] {
  return rows
    .map((row) => fromStudioLayoutRow(row))
    .sort((left, right) => left.zIndex - right.zIndex);
}

export function toStudioLayoutUpsertInput(
  userId: string,
  item: StudioLayoutPointerItem
): StudioCanvasLayoutUpsertInput {
  assertPointerOnlyLayoutItem(item);

  return {
    id: item.id,
    user_id: userId,
    canvas_id: item.canvasId,
    entity_type: item.entityType,
    entity_id: item.entityId,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    z_index: item.zIndex,
    collapsed: item.collapsed,
    meta: item.meta ?? {},
    deleted_at: item.deletedAt ?? null,
  };
}

export function toStudioLayoutUpsertInputs(
  userId: string,
  items: StudioLayoutPointerItem[]
): StudioCanvasLayoutUpsertInput[] {
  return items.map((item) => toStudioLayoutUpsertInput(userId, item));
}

