export type SyncPhase = "idle" | "offline" | "syncing" | "error";

export interface SyncIndicatorState {
  phase: SyncPhase;
  pendingCount: number;
  isOnline: boolean;
  lastSyncedAt: number | null;
  lastAttemptedAt: number | null;
  error: string | null;
}

export interface SyncIndicatorStore {
  getState: () => SyncIndicatorState;
  subscribe: (listener: (state: SyncIndicatorState) => void) => () => void;
  setOnline: (isOnline: boolean) => void;
  setPendingCount: (count: number) => void;
  startSync: () => void;
  completeSync: (pendingCount?: number) => void;
  failSync: (error: string) => void;
  resetError: () => void;
}

const DEFAULT_STATE: SyncIndicatorState = {
  phase: "idle",
  pendingCount: 0,
  isOnline: true,
  lastSyncedAt: null,
  lastAttemptedAt: null,
  error: null,
};

export function createSyncIndicatorStore(
  initialState: Partial<SyncIndicatorState> = {}
): SyncIndicatorStore {
  let state: SyncIndicatorState = { ...DEFAULT_STATE, ...initialState };
  const listeners = new Set<(next: SyncIndicatorState) => void>();

  const emit = (): void => {
    for (const listener of listeners) {
      listener(state);
    }
  };

  const setState = (patch: Partial<SyncIndicatorState>): void => {
    state = { ...state, ...patch };
    emit();
  };

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      listener(state);
      return () => {
        listeners.delete(listener);
      };
    },
    setOnline: (isOnline) => {
      if (!isOnline) {
        setState({ isOnline: false, phase: "offline" });
        return;
      }

      const phase = state.pendingCount > 0 ? "idle" : state.phase;
      setState({
        isOnline: true,
        phase: phase === "offline" ? "idle" : phase,
      });
    },
    setPendingCount: (count) => {
      const pendingCount = Math.max(0, count);
      const phase =
        state.isOnline && state.phase === "offline" ? "idle" : state.phase;
      setState({ pendingCount, phase });
    },
    startSync: () => {
      if (!state.isOnline) {
        setState({ phase: "offline" });
        return;
      }
      setState({
        phase: "syncing",
        lastAttemptedAt: Date.now(),
        error: null,
      });
    },
    completeSync: (pendingCount = 0) => {
      setState({
        pendingCount: Math.max(0, pendingCount),
        phase: state.isOnline ? "idle" : "offline",
        error: null,
        lastSyncedAt: Date.now(),
      });
    },
    failSync: (error) => {
      setState({
        error,
        lastAttemptedAt: Date.now(),
        phase: state.isOnline ? "error" : "offline",
      });
    },
    resetError: () => {
      setState({
        error: null,
        phase: state.isOnline ? "idle" : "offline",
      });
    },
  };
}

export function getSyncIndicatorLabel(state: SyncIndicatorState): string {
  if (state.phase === "offline") {
    return `Offline (${state.pendingCount} queued)`;
  }
  if (state.phase === "syncing") {
    return `Syncing ${state.pendingCount} queued`;
  }
  if (state.phase === "error") {
    return state.error
      ? `Sync error: ${state.error}`
      : `Sync error (${state.pendingCount} queued)`;
  }
  if (state.pendingCount > 0) {
    return `${state.pendingCount} pending sync`;
  }
  return "All changes synced";
}

