import type {
  MutationPayload,
  QueueEntityTable,
  QueueOperationType,
} from "../offline/types";

export interface IdempotencySeed {
  userId: string;
  entityTable: QueueEntityTable;
  entityId: string;
  operation: QueueOperationType;
  payload: MutationPayload;
  clientTimestamp: string;
  namespace?: string;
}

const DEFAULT_NAMESPACE = "mvp";

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function fallbackHash(input: string): string {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function computePayloadFingerprint(
  payload: MutationPayload
): Promise<string> {
  const serialized = stableStringify(payload);

  if (
    typeof crypto === "undefined" ||
    !crypto.subtle ||
    typeof TextEncoder === "undefined"
  ) {
    return fallbackHash(serialized);
  }

  const encoded = new TextEncoder().encode(serialized);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return bytesToHex(new Uint8Array(digest));
}

export async function buildIdempotencyKey(
  seed: IdempotencySeed
): Promise<string> {
  const fingerprint = await computePayloadFingerprint(seed.payload);
  const namespace = seed.namespace ?? DEFAULT_NAMESPACE;
  const timestamp = new Date(seed.clientTimestamp).toISOString();

  return [
    namespace,
    seed.userId,
    seed.entityTable,
    seed.entityId,
    seed.operation,
    timestamp,
    fingerprint.slice(0, 24),
  ].join(":");
}

export interface IdempotencyUpsertInput {
  user_id: string;
  idempotency_key: string;
  event_id?: string;
  request_hash: string;
}

export function toIdempotencyUpsertInput(
  userId: string,
  idempotencyKey: string,
  requestHash: string,
  eventId?: string
): IdempotencyUpsertInput {
  return {
    user_id: userId,
    idempotency_key: idempotencyKey,
    event_id: eventId,
    request_hash: requestHash,
  };
}

