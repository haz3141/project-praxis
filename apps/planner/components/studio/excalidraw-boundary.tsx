"use client";

import { useEffect, useState } from "react";

type ExcalidrawModule = {
  Excalidraw?: React.ComponentType<Record<string, unknown>>;
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; Canvas: React.ComponentType<Record<string, unknown>> }
  | { status: "missing" };

const importExcalidraw = async (): Promise<ExcalidrawModule> => {
  const dynamicImport = new Function("return import('@excalidraw/excalidraw')") as () => Promise<ExcalidrawModule>;
  return dynamicImport();
};

export default function ExcalidrawBoundary() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<void> => {
      try {
        const mod = await importExcalidraw();
        if (!cancelled && mod.Excalidraw) {
          setState({ status: "ready", Canvas: mod.Excalidraw });
          return;
        }
      } catch {
        // Keep fallback UI when the package is unavailable.
      }

      if (!cancelled) {
        setState({ status: "missing" });
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return <p className="muted">Loading studio surface...</p>;
  }

  if (state.status === "ready") {
    const Canvas = state.Canvas;
    return (
      <div style={{ height: "70vh", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--line)" }}>
        <Canvas />
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: "0.8rem" }}>
      <h3 style={{ marginTop: 0 }}>Studio Placeholder</h3>
      <p className="muted">
        Excalidraw package is not installed. Install <code>@excalidraw/excalidraw</code> to enable the canvas surface.
      </p>
    </div>
  );
}
