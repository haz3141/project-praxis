"use client";

import { useMemo } from "react";
import { CoreLoopRail } from "@/components/core-loop-rail";
import { usePlannerStore } from "@/lib/planner-store";

const labelFor = (date: Date): string =>
  date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

export default function WeekPage() {
  const { data } = usePlannerStore();

  const nextSevenDays = useMemo(() => {
    const start = new Date();
    return Array.from({ length: 7 }, (_, offset) => {
      const current = new Date(start);
      current.setDate(start.getDate() + offset);
      return current.toISOString().slice(0, 10);
    });
  }, []);

  const todayAndInbox = useMemo(
    () => data.tasks.filter((task) => task.status === "today" || task.status === "inbox"),
    [data.tasks]
  );

  return (
    <div className="card-grid">
      <section className="card">
        <p className="eyebrow">Planning Horizon</p>
        <h3>Week outlook</h3>
        <p className="muted">Use this view to spread commitments without overloading one day.</p>

        <div className="list">
          {nextSevenDays.map((isoDay) => {
            const date = new Date(`${isoDay}T00:00:00`);
            const dayTasks = todayAndInbox.filter((task) => (task.scheduledFor ?? isoDay) === isoDay);

            return (
              <article key={isoDay} className="row">
                <div>
                  <strong>{labelFor(date)}</strong>
                  <small>
                    {dayTasks.length > 0
                      ? `${dayTasks.length} item${dayTasks.length === 1 ? "" : "s"} queued`
                      : "No queued items"}
                  </small>
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
