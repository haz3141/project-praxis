"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type { Goal, Habit, Note, PlannerData, Project, Task } from "@/lib/types";
import {
  IndexedDbMutationQueue,
  buildReplayMutationInput,
  reserveReplayBatch,
  settleReplayResult
} from "@/src/lib/offline";
import {
  createSyncIndicatorStore,
  getSyncIndicatorLabel,
  type SyncIndicatorState
} from "@/src/lib/sync";

const STORAGE_KEY = "praxis-planner-v1";
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

const isoToday = (): string => new Date().toISOString().slice(0, 10);

const createId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
};

const seedData: PlannerData = {
  tasks: [
    {
      id: "9055a676-1377-4f37-8c74-8d6e4ad8ea21",
      title: "Draft focus block for tomorrow",
      notes: "Keep it under 3 priorities.",
      status: "inbox",
      createdAt: new Date().toISOString(),
      scheduledFor: null,
      completedAt: null
    },
    {
      id: "24eaf59c-6c36-4875-8f5e-acf2abf5d429",
      title: "Review weekly goals",
      notes: "Link one action to each goal.",
      status: "today",
      createdAt: new Date().toISOString(),
      scheduledFor: isoToday(),
      completedAt: null
    }
  ],
  habits: [
    {
      id: "f55f8180-d4a8-44bb-9483-e4eb8be7f83a",
      name: "10 minute planning reset",
      cadence: "Daily",
      streak: 5,
      doneToday: false
    },
    {
      id: "63413c80-63cf-4939-8b8e-fb4131ab7307",
      name: "Evening shutdown review",
      cadence: "Weekdays",
      streak: 3,
      doneToday: false
    }
  ],
  goals: [
    {
      id: "d3d37430-e143-4999-9c34-717c1105cdf5",
      title: "Ship planner MVP shell",
      target: 100,
      progress: 30
    },
    {
      id: "68e8f507-a5b4-4245-acf5-bf9d18db7fbc",
      title: "Keep review habit for 14 days",
      target: 14,
      progress: 4
    }
  ],
  projects: [
    {
      id: "6de5f86c-a95f-4ea1-9f60-ec1fd1f8f2a8",
      title: "Planner MVP stabilization",
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      id: "cb688e17-5821-4fc9-a86d-0ef055b4fc16",
      title: "Design system adoption",
      status: "active",
      createdAt: new Date().toISOString()
    }
  ],
  notes: []
};

const restoreData = (): PlannerData | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const serialized = window.localStorage.getItem(STORAGE_KEY);
  if (!serialized) {
    return null;
  }

  try {
    const parsed = JSON.parse(serialized) as Partial<PlannerData> & {
      reviews?: Array<{ id: string; body: string; createdAt: string }>;
    };

    const migratedReviewNotes: Note[] = Array.isArray(parsed.reviews)
      ? parsed.reviews.map((review) => ({
          id: review.id,
          body: review.body,
          kind: "review",
          createdAt: review.createdAt
        }))
      : [];

    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : seedData.tasks,
      habits: Array.isArray(parsed.habits) ? parsed.habits : seedData.habits,
      goals: Array.isArray(parsed.goals) ? parsed.goals : seedData.goals,
      projects: Array.isArray(parsed.projects) ? parsed.projects : seedData.projects,
      notes: Array.isArray(parsed.notes) ? parsed.notes : migratedReviewNotes
    };
  } catch {
    return null;
  }
};

type PlannerStore = {
  data: PlannerData;
  captureTask: (title: string, notes: string) => void;
  commitTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  toggleHabit: (habitId: string) => void;
  addGoalProgress: (goalId: string, amount: number) => void;
  addProject: (title: string) => void;
  addReview: (body: string) => void;
  syncState: SyncIndicatorState;
  syncLabel: string;
  replayNow: () => Promise<void>;
};

const PlannerStoreContext = createContext<PlannerStore | null>(null);

const updateTask = (tasks: Task[], taskId: string, updater: (task: Task) => Task): Task[] =>
  tasks.map((task) => (task.id === taskId ? updater(task) : task));

const updateHabit = (habits: Habit[], habitId: string, updater: (habit: Habit) => Habit): Habit[] =>
  habits.map((habit) => (habit.id === habitId ? updater(habit) : habit));

const updateGoal = (goals: Goal[], goalId: string, updater: (goal: Goal) => Goal): Goal[] =>
  goals.map((goal) => (goal.id === goalId ? updater(goal) : goal));

const mergeById = <T extends { id: string }>(preferred: T[], fallback: T[]): T[] => {
  const byId = new Map<string, T>();
  for (const item of preferred) {
    byId.set(item.id, item);
  }
  for (const item of fallback) {
    if (!byId.has(item.id)) {
      byId.set(item.id, item);
    }
  }
  return Array.from(byId.values());
};

export function PlannerStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PlannerData>(seedData);
  const [syncState, setSyncState] = useState<SyncIndicatorState>({
    phase: "idle",
    pendingCount: 0,
    isOnline: true,
    lastSyncedAt: null,
    lastAttemptedAt: null,
    error: null
  });
  const hasLoadedRef = useRef(false);
  const queueRef = useRef<IndexedDbMutationQueue | null>(null);
  const syncStoreRef = useRef(createSyncIndicatorStore());

  useEffect(() => {
    const unsubscribe = syncStoreRef.current.subscribe(setSyncState);
    return unsubscribe;
  }, []);

  const refreshPendingCount = useCallback(async () => {
    const queue = queueRef.current;
    if (!queue) {
      return;
    }
    const pendingCount = await queue.countOutstanding(DEMO_USER_ID);
    syncStoreRef.current.setPendingCount(pendingCount);
  }, []);

  const enqueueMutation = useCallback(
    async (
      entityTable: "tasks" | "habits" | "goals" | "projects" | "notes" | "studio_canvas_layout",
      entityId: string,
      payload: Record<string, unknown>,
      operation: "upsert" | "delete" = "upsert"
    ) => {
      const queue = queueRef.current;
      if (!queue) {
        return;
      }

      const mutation = await buildReplayMutationInput({
        userId: DEMO_USER_ID,
        entityTable,
        entityId,
        operation,
        payload,
        clientTimestamp: new Date().toISOString()
      });

      await queue.enqueue(mutation);
      await refreshPendingCount();
    },
    [refreshPendingCount]
  );

  const replayNow = useCallback(async () => {
    const queue = queueRef.current;
    if (!queue || typeof window === "undefined" || !window.navigator.onLine) {
      syncStoreRef.current.setOnline(false);
      return;
    }

    syncStoreRef.current.setOnline(true);
    syncStoreRef.current.startSync();

    try {
      const batch = await reserveReplayBatch(queue, DEMO_USER_ID, 25);
      for (const mutation of batch) {
        const response = await fetch("/api/sync/replay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": mutation.idempotencyKey
          },
          body: JSON.stringify(mutation)
        });

        if (response.ok) {
          await settleReplayResult(queue, mutation.id, { status: "applied" });
          continue;
        }

        if (response.status >= 500 || response.status === 429) {
          await settleReplayResult(queue, mutation.id, {
            status: "retryable_error",
            error: `HTTP ${response.status}`
          });
          continue;
        }

        await settleReplayResult(queue, mutation.id, {
          status: "fatal_error",
          error: `HTTP ${response.status}`
        });
      }

      const pendingCount = await queue.countOutstanding(DEMO_USER_ID);
      syncStoreRef.current.completeSync(pendingCount);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown sync error";
      syncStoreRef.current.failSync(message);
      await refreshPendingCount();
    }
  }, [refreshPendingCount]);

  useEffect(() => {
    const restored = restoreData();
    if (restored) {
      setData((previous) => ({
        tasks: mergeById(restored.tasks, previous.tasks),
        habits: mergeById(restored.habits, previous.habits),
        goals: mergeById(restored.goals, previous.goals),
        projects: mergeById(restored.projects, previous.projects),
        notes: mergeById(restored.notes, previous.notes)
      }));
    }
    hasLoadedRef.current = true;
  }, []);

  useEffect(() => {
    queueRef.current = new IndexedDbMutationQueue();
    void refreshPendingCount();

    const onOnline = (): void => {
      syncStoreRef.current.setOnline(true);
      void replayNow();
    };

    const onOffline = (): void => {
      syncStoreRef.current.setOnline(false);
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    if (!window.navigator.onLine) {
      syncStoreRef.current.setOnline(false);
    } else {
      void replayNow();
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [refreshPendingCount, replayNow]);

  useEffect(() => {
    if (!hasLoadedRef.current || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const captureTask = useCallback(
    (title: string, notes: string) => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return;
      }

      const task = {
        id: createId(),
        title: trimmedTitle,
        notes: notes.trim(),
        status: "inbox" as const,
        createdAt: new Date().toISOString(),
        scheduledFor: null,
        completedAt: null
      };

      setData((prev) => ({
        ...prev,
        tasks: [task, ...prev.tasks]
      }));

      void enqueueMutation("tasks", task.id, { task });
    },
    [enqueueMutation]
  );

  const commitTask = useCallback(
    (taskId: string) => {
      setData((prev) => ({
        ...prev,
        tasks: updateTask(prev.tasks, taskId, (task) => ({
          ...task,
          status: "today",
          scheduledFor: isoToday()
        }))
      }));
      void enqueueMutation("tasks", taskId, { status: "today", scheduledFor: isoToday() });
    },
    [enqueueMutation]
  );

  const completeTask = useCallback(
    (taskId: string) => {
      const completedAt = new Date().toISOString();
      setData((prev) => ({
        ...prev,
        tasks: updateTask(prev.tasks, taskId, (task) => ({
          ...task,
          status: "done",
          completedAt
        }))
      }));
      void enqueueMutation("tasks", taskId, { status: "done", completedAt });
    },
    [enqueueMutation]
  );

  const toggleHabit = useCallback(
    (habitId: string) => {
      setData((prev) => ({
        ...prev,
        habits: updateHabit(prev.habits, habitId, (habit) => {
          const doneToday = !habit.doneToday;
          const streakDelta = doneToday ? 1 : -1;
          return {
            ...habit,
            doneToday,
            streak: Math.max(0, habit.streak + streakDelta)
          };
        })
      }));
      void enqueueMutation("habits", habitId, { toggledAt: new Date().toISOString() });
    },
    [enqueueMutation]
  );

  const addGoalProgress = useCallback(
    (goalId: string, amount: number) => {
      setData((prev) => ({
        ...prev,
        goals: updateGoal(prev.goals, goalId, (goal) => ({
          ...goal,
          progress: Math.max(0, Math.min(goal.target, goal.progress + amount))
        }))
      }));
      void enqueueMutation("goals", goalId, { progressDelta: amount });
    },
    [enqueueMutation]
  );

  const addProject = useCallback(
    (title: string) => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return;
      }

      const project: Project = {
        id: createId(),
        title: trimmedTitle,
        status: "active",
        createdAt: new Date().toISOString()
      };

      setData((prev) => ({
        ...prev,
        projects: [project, ...prev.projects]
      }));

      void enqueueMutation("projects", project.id, { project });
    },
    [enqueueMutation]
  );

  const addReview = useCallback(
    (body: string) => {
      const trimmedBody = body.trim();
      if (!trimmedBody) {
        return;
      }

      const newNote: Note = {
        id: createId(),
        body: trimmedBody,
        kind: "review",
        createdAt: new Date().toISOString()
      };

      setData((prev) => ({
        ...prev,
        notes: [newNote, ...prev.notes]
      }));
      void enqueueMutation("notes", newNote.id, { note: newNote });
    },
    [enqueueMutation]
  );

  const syncLabel = useMemo(() => getSyncIndicatorLabel(syncState), [syncState]);

  const value = useMemo<PlannerStore>(
    () => ({
      data,
      captureTask,
      commitTask,
      completeTask,
      toggleHabit,
      addGoalProgress,
      addProject,
      addReview,
      syncState,
      syncLabel,
      replayNow
    }),
    [
      addGoalProgress,
      addProject,
      addReview,
      captureTask,
      commitTask,
      completeTask,
      data,
      replayNow,
      syncLabel,
      syncState,
      toggleHabit
    ]
  );

  return <PlannerStoreContext.Provider value={value}>{children}</PlannerStoreContext.Provider>;
}

export const usePlannerStore = (): PlannerStore => {
  const context = useContext(PlannerStoreContext);
  if (!context) {
    throw new Error("usePlannerStore must be used within PlannerStoreProvider");
  }
  return context;
};
