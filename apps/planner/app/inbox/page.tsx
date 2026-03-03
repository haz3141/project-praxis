"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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
      <section className="card">
        <p className="eyebrow">Capture</p>
        <h3>Drop every loose task into Inbox</h3>
        <p className="muted">Keep capture fast. Clarification happens when you commit items into Today.</p>

        <form className="inline-form" onSubmit={onSubmit}>
          <div>
            <label htmlFor="inbox-title">Task title</label>
            <input
              id="inbox-title"
              data-testid="capture-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Write the next actionable task"
              disabled={!isHydrated}
              required
            />
          </div>
          <div>
            <label htmlFor="inbox-notes">Notes (optional)</label>
            <textarea
              id="inbox-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Context or constraints"
              disabled={!isHydrated}
            />
          </div>
          <button
            type="submit"
            className="primary-btn"
            data-testid="capture-submit"
            disabled={!isHydrated || title.trim().length === 0}
          >
            Capture to Inbox
          </button>
        </form>

        <div className="list">
          {inboxTasks.map((task) => (
            <article className="row" key={task.id}>
              <div>
                <strong>{task.title}</strong>
                <small>{task.notes || "No notes"}</small>
              </div>
              <div className="row-actions">
                <button
                  type="button"
                  className="task-btn"
                  data-testid="task-move-today"
                  onClick={() => commitTask(task.id)}
                >
                  Commit to Today
                </button>
              </div>
            </article>
          ))}
          {inboxTasks.length === 0 ? <p className="muted">Inbox is clear. Capture something new to continue the loop.</p> : null}
        </div>
      </section>
      <CoreLoopRail activeStage="capture" />
    </div>
  );
}
