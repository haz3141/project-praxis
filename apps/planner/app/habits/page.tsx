"use client";

import { CoreLoopRail } from "@/components/core-loop-rail";
import { usePlannerStore } from "@/lib/planner-store";

export default function HabitsPage() {
  const { data, toggleHabit } = usePlannerStore();

  return (
    <div className="card-grid">
      <section className="card">
        <p className="eyebrow">Habits</p>
        <h3>Repeatable anchors</h3>
        <p className="muted">Keep habits small so they support task execution, not compete with it.</p>

        <div className="list">
          {data.habits.map((habit) => (
            <article className="row" key={habit.id}>
              <div>
                <strong>{habit.name}</strong>
                <small>
                  {habit.cadence} · Streak {habit.streak} day{habit.streak === 1 ? "" : "s"}
                </small>
              </div>
              <div className="row-actions">
                <button type="button" className={habit.doneToday ? "primary-btn" : "task-btn"} onClick={() => toggleHabit(habit.id)}>
                  {habit.doneToday ? "Marked done" : "Mark done"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CoreLoopRail activeStage="complete" />
    </div>
  );
}
