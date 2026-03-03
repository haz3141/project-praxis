"use client";

import dynamic from "next/dynamic";

const ExcalidrawBoundary = dynamic(() => import("@/components/studio/excalidraw-boundary"), {
  ssr: false,
  loading: () => <p className="muted">Preparing studio boundary...</p>
});

export function StudioCanvasClient() {
  return <ExcalidrawBoundary />;
}
