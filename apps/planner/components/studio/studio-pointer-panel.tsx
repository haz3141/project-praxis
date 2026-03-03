"use client";

import { useEffect, useMemo, useState } from "react";
import { usePlannerStore } from "@/lib/planner-store";
import type { StudioLayoutPointerItem } from "@/src/features/studio/layoutSchema";

const CANVAS_ID = "default";

type ObjectOption = { id: string; type: "task" | "goal" | "habit"; label: string };

export function StudioPointerPanel() {
  const { data } = usePlannerStore();
  const [selectedId, setSelectedId] = useState<string>("");
  const [pointers, setPointers] = useState<StudioLayoutPointerItem[]>([]);
  const [status, setStatus] = useState("Not synced");

  const options = useMemo<ObjectOption[]>(() => {
    return [
      ...data.tasks.map((task) => ({ id: task.id, type: "task" as const, label: `Task: ${task.title}` })),
      ...data.goals.map((goal) => ({ id: goal.id, type: "goal" as const, label: `Goal: ${goal.title}` })),
      ...data.habits.map((habit) => ({ id: habit.id, type: "habit" as const, label: `Habit: ${habit.name}` }))
    ];
  }, [data.goals, data.habits, data.tasks]);

  useEffect(() => {
    const load = async (): Promise<void> => {
      const response = await fetch(`/api/studio/layout/${CANVAS_ID}`);
      if (!response.ok) {
        setStatus("Failed to load layout");
        return;
      }
      const payload = (await response.json()) as { items?: StudioLayoutPointerItem[] };
      setPointers(payload.items ?? []);
      setStatus("Layout loaded");
    };

    void load();
  }, []);

  const addPointer = (): void => {
    const option = options.find((item) => item.id === selectedId);
    if (!option) {
      return;
    }

    const next: StudioLayoutPointerItem = {
      id: crypto.randomUUID(),
      canvasId: CANVAS_ID,
      entityType: option.type,
      entityId: option.id,
      x: 80 + pointers.length * 12,
      y: 80 + pointers.length * 8,
      width: 260,
      height: 120,
      zIndex: pointers.length,
      collapsed: false,
      meta: {
        sourceId: option.id,
        label: option.label
      },
      deletedAt: null
    };

    setPointers((prev) => [...prev, next]);
  };

  const nudgePointer = (id: string, dx: number, dy: number): void => {
    setPointers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x: item.x + dx, y: item.y + dy } : item))
    );
  };

  const saveLayout = async (): Promise<void> => {
    const response = await fetch(`/api/studio/layout/${CANVAS_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: pointers })
    });
    if (!response.ok) {
      setStatus("Save failed");
      return;
    }
    setStatus(`Saved ${new Date().toLocaleTimeString()}`);
  };

  return (
    <section className="card" style={{ marginTop: "0.9rem" }}>
      <p className="eyebrow">Pointer Layout</p>
      <h3>Link existing objects to Studio nodes</h3>
      <p className="muted">Studio stores position metadata only. Canonical task/goal/habit content stays in planner objects.</p>

      <div className="row" style={{ alignItems: "center" }}>
        <label htmlFor="studio-object" style={{ margin: 0 }}>
          Object
        </label>
        <select id="studio-object" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          <option value="">Select object…</option>
          {options.map((option) => (
            <option key={`${option.type}-${option.id}`} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="button" className="task-btn" onClick={addPointer}>
          Add pointer
        </button>
        <button type="button" className="primary-btn" onClick={() => void saveLayout()}>
          Save layout
        </button>
      </div>

      <div className="list">
        {pointers.map((pointer) => (
          <article key={pointer.id ?? `${pointer.entityType}-${pointer.entityId}`} className="row">
            <div>
              <strong>{String(pointer.meta?.label ?? `${pointer.entityType}:${pointer.entityId}`)}</strong>
              <small>
                x:{pointer.x} y:{pointer.y} w:{pointer.width} h:{pointer.height}
              </small>
            </div>
            <div className="row-actions">
              <button type="button" className="task-btn" onClick={() => nudgePointer(pointer.id ?? "", -8, 0)}>
                Left
              </button>
              <button type="button" className="task-btn" onClick={() => nudgePointer(pointer.id ?? "", 8, 0)}>
                Right
              </button>
              <button type="button" className="task-btn" onClick={() => nudgePointer(pointer.id ?? "", 0, -8)}>
                Up
              </button>
              <button type="button" className="task-btn" onClick={() => nudgePointer(pointer.id ?? "", 0, 8)}>
                Down
              </button>
            </div>
          </article>
        ))}
        {pointers.length === 0 ? <p className="muted">No pointers yet.</p> : null}
      </div>
      <p className="muted">{status}</p>
    </section>
  );
}
