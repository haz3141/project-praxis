"use client";

import { FormEvent, useMemo, useState } from "react";
import { CoreLoopRail } from "@/components/core-loop-rail";
import { usePlannerStore } from "@/lib/planner-store";

export default function ReviewPage() {
  const { data, addReview } = usePlannerStore();
  const [note, setNote] = useState("");

  const completedTasks = useMemo(() => data.tasks.filter((task) => task.status === "done"), [data.tasks]);
  const reviewNotes = useMemo(() => data.notes.filter((entry) => entry.kind === "review"), [data.notes]);

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    addReview(note);
    setNote("");
  };

  return (
    <div className="card-grid">
      <section className="card">
        <p className="eyebrow">Review</p>
        <h3>Complete the loop with reflection</h3>
        <p className="muted">Capture what worked and what should change before tomorrow starts.</p>

        <form className="inline-form" onSubmit={onSubmit}>
          <div>
            <label htmlFor="review-note">Daily note</label>
            <textarea
              id="review-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Example: What helped me complete important work today?"
              required
            />
          </div>
          <button type="submit" className="primary-btn">
            Save review note
          </button>
        </form>

        <div className="list">
          <article className="row">
            <div>
              <strong>Completed tasks</strong>
              <small>
                {completedTasks.length} item{completedTasks.length === 1 ? "" : "s"} done
              </small>
            </div>
          </article>

          {completedTasks.map((task) => (
            <article className="row" key={task.id}>
              <div>
                <strong>{task.title}</strong>
                <small>{task.completedAt ? new Date(task.completedAt).toLocaleString() : "Completed"}</small>
              </div>
            </article>
          ))}

          {reviewNotes.map((reviewNote) => (
            <article className="row" key={reviewNote.id}>
              <div>
                <strong>{new Date(reviewNote.createdAt).toLocaleString()}</strong>
                <small>{reviewNote.body}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CoreLoopRail activeStage="review" />
    </div>
  );
}
