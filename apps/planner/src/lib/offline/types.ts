export const ENTITY_TABLES = [
  "tasks",
  "habits",
  "goals",
  "notes",
  "studio_canvas_layout",
] as const;

export type QueueEntityTable = (typeof ENTITY_TABLES)[number];
export type QueueOperationType = "upsert" | "delete";
export type QueueStatus = "pending" | "processing" | "succeeded" | "failed";

export type MutationPayload = Record<string, unknown>;

export interface EnqueueMutationInput {
  userId: string;
  entityTable: QueueEntityTable;
  entityId: string;
  operation: QueueOperationType;
  payload: MutationPayload;
  idempotencyKey: string;
  clientTimestamp: string;
}

export interface QueuedMutation extends EnqueueMutationInput {
  id: number;
  status: QueueStatus;
  attemptCount: number;
  lastError: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface SyncEventInsertInput {
  user_id: string;
  idempotency_key: string;
  entity_table: QueueEntityTable;
  entity_id: string;
  operation: QueueOperationType;
  payload: MutationPayload;
  client_timestamp: string;
}

