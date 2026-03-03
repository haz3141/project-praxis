import { StudioPointerPanel } from "@/components/studio/studio-pointer-panel";
import { StudioCanvasClient } from "@/components/studio/studio-canvas-client";

export default function StudioPage() {
  return (
    <section className="card">
      <p className="eyebrow">Studio</p>
      <h3>Freeform workspace</h3>
      <p className="muted">
        This route isolates the canvas bundle behind a dynamic import boundary so planner screens stay lightweight.
      </p>
      <StudioCanvasClient />
      <StudioPointerPanel />
    </section>
  );
}
