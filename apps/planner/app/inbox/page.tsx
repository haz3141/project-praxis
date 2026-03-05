"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AtomicButton,
  AtomicInput,
  AtomicTextarea,
  Card,
  EmptyState,
  TaskRow
} from "@praxis/ui";
import { CoreLoopRail } from "@/components/core-loop-rail";
import { usePlannerStore } from "@/lib/planner-store";

export default function InboxPage() {
  const { data, captureTask, commitTask } = usePlannerStore();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  const inboxTasks = useMemo(() => data.tasks.filter((task) => task.status === "inbox"), [data.tasks]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    captureTask(title, notes);
    setTitle("");
    setNotes("");
  };

  return (
    <div className="card-grid">
      <Card
        as="section"
        title="Drop every loose task into Inbox"
        description="Keep capture fast. Clarification happens when you commit items into Today."
      >
        <form className="inline-form" onSubmit={onSubmit}>
          <AtomicInput
            id="inbox-title"
            label="Task title"
            data-testid="capture-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Write the next actionable task"
            disabled={!isHydrated}
            required
          />

          <AtomicTextarea
            id="inbox-notes"
            label="Notes (optional)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Context or constraints"
            disabled={!isHydrated}
          />

          <AtomicButton
            type="submit"
            variant="primary"
            data-testid="capture-submit"
            disabled={!isHydrated || title.trim().length === 0}
          >
            Capture to Inbox
          </AtomicButton>
        </form>

        <div className="list">
          {inboxTasks.map((task) => (
            <TaskRow
              key={task.id}
              title={<strong>{task.title}</strong>}
              description={task.notes || "No notes"}
              trailing={
                <AtomicButton
                  type="button"
                  variant="secondary"
                  density="compact"
                  data-testid="task-move-today"
                  onClick={() => commitTask(task.id)}
                >
                  Commit to Today
                </AtomicButton>
              }
            />
          ))}

          {inboxTasks.length === 0 ? (
            <EmptyState
              title="Inbox is clear"
              description="Capture something new to continue the loop."
              action={
                <AtomicButton
                  type="button"
                  variant="ghost"
                  onClick={() => document.getElementById("inbox-title")?.focus()}
                >
                  Start capture
                </AtomicButton>
              }
            />
          ) : null}
        </div>
      </Card>
      <CoreLoopRail activeStage="capture" />
    </div>
  );
}
