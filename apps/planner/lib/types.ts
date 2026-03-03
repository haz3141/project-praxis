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

export type ReviewNote = {
  id: string;
  body: string;
  createdAt: string;
};

export type PlannerData = {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  reviews: ReviewNote[];
};
