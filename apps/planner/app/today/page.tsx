"use client";

import { useMemo } from "react";
import { CoreLoopRail } from "@/components/core-loop-rail";
import { usePlannerStore } from "@/lib/planner-store";

export default function TodayPage() {
  const { data, completeTask } = usePlannerStore();

  const todayTasks = useMemo(() => data.tasks.filter((task) => task.status === "today"), [data.tasks]);
  const doneCount = useMemo(() => data.tasks.filter((task) => task.status === "done").length, [data.tasks]);

  return (
    <div className="card-grid">
      <section className="card">
        <p className="eyebrow">Commit + Complete</p>
        <h3>Today stack</h3>
        <p className="muted">Work the committed list. Completing here closes the active execution phase.</p>

        <div className="row" style={{ marginTop: "0.8rem" }}>
          <div>
            <strong>{todayTasks.length} active today</strong>
            <small>{doneCount} completed overall</small>
          </div>
        </div>

        <div className="list">
          {todayTasks.map((task) => (
            <article className="row" key={task.id}>
              <div>
                <strong>{task.title}</strong>
                <small>{task.notes || "No notes"}</small>
              </div>
              <div className="row-actions">
                <button
                  type="button"
                  className="primary-btn"
                  data-testid="task-complete"
                  onClick={() => completeTask(task.id)}
                >
                  Complete
                </button>
              </div>
            </article>
          ))}
          {todayTasks.length === 0 ? <p className="muted">No committed tasks yet. Pull items from Inbox.</p> : null}
        </div>
      </section>
      <CoreLoopRail activeStage="complete" />
    </div>
  );
}
