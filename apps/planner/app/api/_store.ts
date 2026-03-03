type TaskStatus = "inbox" | "today" | "done";

type Task = {
  id: string;
  title: string;
  notes: string;
  status: TaskStatus;
  createdAt: string;
  scheduledFor: string | null;
  completedAt: string | null;
};

type Goal = {
  id: string;
  title: string;
  target: number;
  progress: number;
};

type Habit = {
  id: string;
  name: string;
  cadence: string;
  streak: number;
  doneToday: boolean;
};

type Review = {
  id: string;
  body: string;
  createdAt: string;
};

type StudioLayoutPointer = {
  id: string;
  canvasId: string;
  entityType: "task" | "habit" | "goal" | "note";
  entityId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  collapsed: boolean;
  meta: Record<string, unknown>;
  deletedAt: string | null;
};

type MemoryDb = {
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  reviews: Review[];
  studioLayouts: Record<string, StudioLayoutPointer[]>;
  replayKeys: Set<string>;
};

declare global {
  var __praxisMemoryDb__: MemoryDb | undefined;
}

const nowIso = (): string => new Date().toISOString();

const createDb = (): MemoryDb => ({
  tasks: [],
  goals: [
    { id: "d3d37430-e143-4999-9c34-717c1105cdf5", title: "Ship planner MVP shell", target: 100, progress: 30 },
    { id: "68e8f507-a5b4-4245-acf5-bf9d18db7fbc", title: "Keep review habit for 14 days", target: 14, progress: 4 }
  ],
  habits: [
    { id: "f55f8180-d4a8-44bb-9483-e4eb8be7f83a", name: "10 minute planning reset", cadence: "Daily", streak: 5, doneToday: false },
    { id: "63413c80-63cf-4939-8b8e-fb4131ab7307", name: "Evening shutdown review", cadence: "Weekdays", streak: 3, doneToday: false }
  ],
  reviews: [],
  studioLayouts: {},
  replayKeys: new Set<string>()
});

export const memoryDb: MemoryDb = globalThis.__praxisMemoryDb__ ?? createDb();
if (!globalThis.__praxisMemoryDb__) {
  globalThis.__praxisMemoryDb__ = memoryDb;
}

export function listTasks(status?: TaskStatus): Task[] {
  if (!status) {
    return memoryDb.tasks;
  }
  return memoryDb.tasks.filter((task) => task.status === status);
}

export function createTask(input: Pick<Task, "title" | "notes">): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title,
    notes: input.notes,
    status: "inbox",
    createdAt: nowIso(),
    scheduledFor: null,
    completedAt: null
  };
  memoryDb.tasks.unshift(task);
  return task;
}

export function moveTaskToToday(taskId: string): Task | null {
  const found = memoryDb.tasks.find((task) => task.id === taskId);
  if (!found) {
    return null;
  }
  found.status = "today";
  found.scheduledFor = nowIso().slice(0, 10);
  return found;
}

export function completeTask(taskId: string): Task | null {
  const found = memoryDb.tasks.find((task) => task.id === taskId);
  if (!found) {
    return null;
  }
  found.status = "done";
  found.completedAt = nowIso();
  return found;
}

export function addReview(body: string): Review {
  const review: Review = {
    id: crypto.randomUUID(),
    body,
    createdAt: nowIso()
  };
  memoryDb.reviews.unshift(review);
  return review;
}

export function listGoals(): Goal[] {
  return memoryDb.goals;
}

export function listHabits(): Habit[] {
  return memoryDb.habits;
}

export function listReviews(): Review[] {
  return memoryDb.reviews;
}

export function isDuplicateReplayKey(key: string): boolean {
  if (memoryDb.replayKeys.has(key)) {
    return true;
  }
  memoryDb.replayKeys.add(key);
  return false;
}

export function readIdempotencyKey(request: Request): string | null {
  const value = request.headers.get("idempotency-key");
  return value && value.trim() ? value : null;
}

export function getStudioLayout(canvasId: string): StudioLayoutPointer[] {
  return memoryDb.studioLayouts[canvasId] ?? [];
}

export function setStudioLayout(canvasId: string, layout: StudioLayoutPointer[]): StudioLayoutPointer[] {
  memoryDb.studioLayouts[canvasId] = layout;
  return layout;
}
