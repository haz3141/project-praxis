export type TaskStatus = "inbox" | "today" | "done";

export type LoopStage = "capture" | "commit" | "complete" | "review";

export type Task = {
  id: string;
  title: string;
  notes: string;
  status: TaskStatus;
  createdAt: string;
  scheduledFor: string | null;
  completedAt: string | null;
};

export type Habit = {
  id: string;
  name: string;
  cadence: string;
  streak: number;
  doneToday: boolean;
};

export type Goal = {
  id: string;
  title: string;
  target: number;
  progress: number;
};

export type ProjectStatus = "active" | "paused" | "done";

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  createdAt: string;
};

export type NoteKind = "review" | "general";

export type Note = {
  id: string;
  body: string;
  kind: NoteKind;
  taskId?: string | null;
  goalId?: string | null;
  projectId?: string | null;
  createdAt: string;
};

export type PlannerData = {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  projects: Project[];
  notes: Note[];
};
