"use client";

import { CoreLoopRail } from "@/components/core-loop-rail";
import { usePlannerStore } from "@/lib/planner-store";

export default function GoalsPage() {
  const { data, addGoalProgress } = usePlannerStore();

  return (
    <div className="card-grid">
      <section className="card">
        <p className="eyebrow">Goals</p>
        <h3>Outcome tracking</h3>
        <p className="muted">Tie today-level actions to goal momentum so progress remains visible.</p>

        <div className="list">
          {data.goals.map((goal) => {
            const percent = Math.round((goal.progress / goal.target) * 100);
            return (
              <article className="row" key={goal.id}>
                <div style={{ width: "100%" }}>
                  <strong>{goal.title}</strong>
                  <small>
                    {goal.progress} / {goal.target}
                  </small>
                  <div className="progress-track" aria-hidden="true" style={{ marginTop: "0.45rem" }}>
                    <div className="progress-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
                <div className="row-actions">
                  <button type="button" className="task-btn" onClick={() => addGoalProgress(goal.id, 1)}>
                    +1
                  </button>
                  <button type="button" className="task-btn" onClick={() => addGoalProgress(goal.id, 10)}>
                    +10
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <CoreLoopRail activeStage="commit" />
    </div>
  );
}
