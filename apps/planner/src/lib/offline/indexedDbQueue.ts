import type {
  EnqueueMutationInput,
  QueueStatus,
  QueuedMutation,
} from "./types";

export interface OfflineQueueOptions {
  dbName?: string;
  dbVersion?: number;
  storeName?: string;
}

const DEFAULT_DB_NAME = "praxis-offline";
const DEFAULT_DB_VERSION = 1;
const DEFAULT_STORE_NAME = "mutation_queue";

function ensureIndexedDb(): IDBFactory {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is not available in this environment.");
  }
  return indexedDB;
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(tx.error ?? new Error("IndexedDB transaction failed."));
    tx.onabort = () =>
      reject(tx.error ?? new Error("IndexedDB transaction aborted."));
  });
}

function collectCursorValues<T>(
  request: IDBRequest<IDBCursorWithValue | null>,
  limit: number
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    const results: T[] = [];

    request.onerror = () =>
      reject(request.error ?? new Error("IndexedDB cursor failed."));

    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor || results.length >= limit) {
        resolve(results);
        return;
      }

      results.push(cursor.value as T);
      cursor.continue();
    };
  });
}

function isConstraintError(error: unknown): boolean {
  return (
    typeof DOMException !== "undefined" &&
    error instanceof DOMException &&
    error.name === "ConstraintError"
  );
}

export class IndexedDbMutationQueue {
  private readonly dbPromise: Promise<IDBDatabase>;

  private readonly storeName: string;

  public constructor(options: OfflineQueueOptions = {}) {
    const dbName = options.dbName ?? DEFAULT_DB_NAME;
    const dbVersion = options.dbVersion ?? DEFAULT_DB_VERSION;
    this.storeName = options.storeName ?? DEFAULT_STORE_NAME;
    this.dbPromise = this.open(dbName, dbVersion, this.storeName);
  }

  public async enqueue(input: EnqueueMutationInput): Promise<QueuedMutation> {
    const now = Date.now();
    const record: Omit<QueuedMutation, "id"> = {
      ...input,
      status: "pending",
      attemptCount: 0,
      lastError: null,
      createdAt: now,
      updatedAt: now,
    };

    try {
      return await this.withStore("readwrite", async (store) => {
        const id = await requestToPromise(store.add(record));
        return { ...record, id: Number(id) };
      });
    } catch (error) {
      if (!isConstraintError(error)) {
        throw error;
      }

      const existing = await this.getByIdempotencyKey(
        input.userId,
        input.idempotencyKey
      );
      if (existing) {
        return existing;
      }
      throw error;
    }
  }

  public async getById(id: number): Promise<QueuedMutation | null> {
    return this.withStore("readonly", async (store) => {
      const result = await requestToPromise(store.get(id));
      return (result as QueuedMutation | undefined) ?? null;
    });
  }

  public async getByIdempotencyKey(
    userId: string,
    idempotencyKey: string
  ): Promise<QueuedMutation | null> {
    return this.withStore("readonly", async (store) => {
      const index = store.index("by_user_idempotency");
      const result = await requestToPromise(
        index.get([userId, idempotencyKey] as IDBValidKey)
      );
      return (result as QueuedMutation | undefined) ?? null;
    });
  }

  public async listByStatuses(
    userId: string,
    statuses: QueueStatus[],
    limit = 50
  ): Promise<QueuedMutation[]> {
    const all: QueuedMutation[] = [];

    for (const status of statuses) {
      if (all.length >= limit) {
        break;
      }

      const next = await this.listByStatus(userId, status, limit - all.length);
      all.push(...next);
    }

    return all.sort((a, b) => a.createdAt - b.createdAt).slice(0, limit);
  }

  public async reserveForReplay(
    userId: string,
    limit = 20
  ): Promise<QueuedMutation[]> {
    const candidates = await this.listByStatuses(
      userId,
      ["pending", "failed"],
      limit
    );

    const reserved: QueuedMutation[] = [];
    for (const candidate of candidates) {
      const updated = await this.transition(candidate.id, {
        status: "processing",
      });
      if (updated) {
        reserved.push(updated);
      }
    }

    return reserved;
  }

  public async markSucceeded(id: number): Promise<QueuedMutation | null> {
    return this.transition(id, { status: "succeeded", lastError: null });
  }

  public async markFailed(
    id: number,
    errorMessage: string
  ): Promise<QueuedMutation | null> {
    return this.transition(id, (current) => ({
      status: "failed",
      attemptCount: current.attemptCount + 1,
      lastError: errorMessage,
    }));
  }

  public async markPending(id: number): Promise<QueuedMutation | null> {
    return this.transition(id, { status: "pending" });
  }

  public async remove(id: number): Promise<void> {
    await this.withStore("readwrite", async (store) => {
      await requestToPromise(store.delete(id));
    });
  }

  public async countOutstanding(userId: string): Promise<number> {
    const [pending, processing, failed] = await Promise.all([
      this.countByStatus(userId, "pending"),
      this.countByStatus(userId, "processing"),
      this.countByStatus(userId, "failed"),
    ]);
    return pending + processing + failed;
  }

  private async countByStatus(
    userId: string,
    status: QueueStatus
  ): Promise<number> {
    return this.withStore("readonly", async (store) => {
      const index = store.index("by_user_status_created_at");
      const range = IDBKeyRange.bound(
        [userId, status, 0] as IDBValidKey,
        [userId, status, Number.MAX_SAFE_INTEGER] as IDBValidKey
      );
      return requestToPromise(index.count(range));
    });
  }

  private async listByStatus(
    userId: string,
    status: QueueStatus,
    limit: number
  ): Promise<QueuedMutation[]> {
    return this.withStore("readonly", async (store) => {
      const index = store.index("by_user_status_created_at");
      const range = IDBKeyRange.bound(
        [userId, status, 0] as IDBValidKey,
        [userId, status, Number.MAX_SAFE_INTEGER] as IDBValidKey
      );
      const request = index.openCursor(range, "next");
      return collectCursorValues<QueuedMutation>(request, limit);
    });
  }

  private async transition(
    id: number,
    patch:
      | Partial<Omit<QueuedMutation, "id">>
      | ((current: QueuedMutation) => Partial<Omit<QueuedMutation, "id">>)
  ): Promise<QueuedMutation | null> {
    return this.withStore("readwrite", async (store) => {
      const current = (await requestToPromise(store.get(id))) as
        | QueuedMutation
        | undefined;
      if (!current) {
        return null;
      }

      const nextPatch = typeof patch === "function" ? patch(current) : patch;
      const next: QueuedMutation = {
        ...current,
        ...nextPatch,
        updatedAt: Date.now(),
      };
      await requestToPromise(store.put(next));
      return next;
    });
  }

  private async withStore<T>(
    mode: IDBTransactionMode,
    run: (store: IDBObjectStore, tx: IDBTransaction) => Promise<T> | T
  ): Promise<T> {
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, mode);
    const store = tx.objectStore(this.storeName);
    const result = await run(store, tx);
    await transactionDone(tx);
    return result;
  }

  private open(
    dbName: string,
    dbVersion: number,
    storeName: string
  ): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = ensureIndexedDb().open(dbName, dbVersion);

      request.onerror = () =>
        reject(request.error ?? new Error("Unable to open IndexedDB."));

      request.onupgradeneeded = () => {
        const db = request.result;
        if (db.objectStoreNames.contains(storeName)) {
          return;
        }

        const store = db.createObjectStore(storeName, {
          keyPath: "id",
          autoIncrement: true,
        });

        store.createIndex("by_status", "status", { unique: false });
        store.createIndex(
          "by_user_status_created_at",
          ["userId", "status", "createdAt"],
          { unique: false }
        );
        store.createIndex(
          "by_user_idempotency",
          ["userId", "idempotencyKey"],
          { unique: true }
        );
      };

      request.onsuccess = () => resolve(request.result);
    });
  }
}

