"use client";

import { useMemo } from "react";
import {
  AtomicButton,
  Card,
  EmptyState,
  PriorityCard,
  TaskRow,
  TodayTemplate
} from "@praxis/ui";
import { CoreLoopRail } from "@/components/core-loop-rail";
import { usePlannerStore } from "@/lib/planner-store";

export default function TodayPage() {
  const { data, completeTask } = usePlannerStore();

  const todayTasks = useMemo(() => data.tasks.filter((task) => task.status === "today"), [data.tasks]);
  const doneCount = useMemo(() => data.tasks.filter((task) => task.status === "done").length, [data.tasks]);

  return (
    <TodayTemplate
      priorities={
        <PriorityCard
          title="Today stack"
          description="Work the committed list. Completing here closes the active execution phase."
          meta={<span>{todayTasks.length} active</span>}
          actions={
            <span className="muted">
              {doneCount} completed overall
            </span>
          }
        />
      }
      weekStrip={
        <Card as="section" title="Execution snapshot" description="Current completion pace for this session.">
          <p className="muted">
            {todayTasks.length} active today · {doneCount} completed overall
          </p>
        </Card>
      }
      taskList={
        <Card as="section" title="Committed tasks" description="Complete committed items to close the loop.">
          <div className="list">
            {todayTasks.map((task) => (
              <TaskRow
                key={task.id}
                title={<strong>{task.title}</strong>}
                description={task.notes || "No notes"}
                trailing={
                  <AtomicButton
                    type="button"
                    variant="primary"
                    density="compact"
                    data-testid="task-complete"
                    onClick={() => completeTask(task.id)}
                  >
                    Complete
                  </AtomicButton>
                }
              />
            ))}

            {todayTasks.length === 0 ? (
              <EmptyState
                title="No committed tasks yet"
                description="Pull items from Inbox to begin execution."
              />
            ) : null}
          </div>
        </Card>
      }
      overlays={<CoreLoopRail activeStage="complete" />}
    />
  );
}
