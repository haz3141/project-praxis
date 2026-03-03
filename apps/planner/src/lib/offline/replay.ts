import {
  buildIdempotencyKey,
  computePayloadFingerprint,
} from "../db/idempotency";
import { IndexedDbMutationQueue } from "./indexedDbQueue";
import type {
  EnqueueMutationInput,
  MutationPayload,
  QueuedMutation,
  SyncEventInsertInput,
} from "./types";

export interface ReplayMutationInput
  extends Omit<EnqueueMutationInput, "idempotencyKey"> {
  idempotencyKey?: string;
}

export type ReplayResultStatus =
  | "applied"
  | "duplicate"
  | "retryable_error"
  | "fatal_error";

export interface ReplayResult {
  status: ReplayResultStatus;
  error?: string;
}

export async function buildReplayMutationInput(
  input: ReplayMutationInput
): Promise<EnqueueMutationInput> {
  const idempotencyKey =
    input.idempotencyKey ??
    (await buildIdempotencyKey({
      userId: input.userId,
      entityTable: input.entityTable,
      entityId: input.entityId,
      operation: input.operation,
      payload: input.payload,
      clientTimestamp: input.clientTimestamp,
    }));

  return {
    ...input,
    idempotencyKey,
  };
}

export async function toReplayEventPayload(
  mutation: Pick<
    EnqueueMutationInput,
    | "userId"
    | "idempotencyKey"
    | "entityTable"
    | "entityId"
    | "operation"
    | "payload"
    | "clientTimestamp"
  >
): Promise<{
  syncEvent: SyncEventInsertInput;
  requestHash: string;
}> {
  const requestHash = await computePayloadFingerprint(
    mutation.payload as MutationPayload
  );

  return {
    syncEvent: {
      user_id: mutation.userId,
      idempotency_key: mutation.idempotencyKey,
      entity_table: mutation.entityTable,
      entity_id: mutation.entityId,
      operation: mutation.operation,
      payload: mutation.payload,
      client_timestamp: mutation.clientTimestamp,
    },
    requestHash,
  };
}

export async function reserveReplayBatch(
  queue: IndexedDbMutationQueue,
  userId: string,
  limit = 20
): Promise<QueuedMutation[]> {
  return queue.reserveForReplay(userId, limit);
}

export async function settleReplayResult(
  queue: IndexedDbMutationQueue,
  mutationId: number,
  result: ReplayResult
): Promise<void> {
  if (result.status === "applied" || result.status === "duplicate") {
    await queue.markSucceeded(mutationId);
    return;
  }

  const message =
    result.error ??
    (result.status === "retryable_error"
      ? "Retryable replay failure"
      : "Fatal replay failure");

  await queue.markFailed(mutationId, message);
}

export function isRetryableHttpStatus(status: number): boolean {
  if (status === 408 || status === 425 || status === 429) {
    return true;
  }
  return status >= 500;
}

export function backoffDelayMs(attemptCount: number): number {
  const clamped = Math.min(Math.max(attemptCount, 0), 8);
  return Math.pow(2, clamped) * 250;
}

