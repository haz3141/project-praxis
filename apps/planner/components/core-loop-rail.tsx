import type { LoopStage } from "@/lib/types";

const loopStages: Array<{ key: LoopStage; label: string; helper: string }> = [
  { key: "capture", label: "Capture", helper: "Collect quickly in Inbox" },
  { key: "commit", label: "Commit", helper: "Pick what moves to Today" },
  { key: "complete", label: "Complete", helper: "Finish and close the loop" },
  { key: "review", label: "Review", helper: "Reflect and reset" }
];

export function CoreLoopRail({ activeStage }: { activeStage: LoopStage }) {
  return (
    <section className="card loop-card" aria-label="Core loop">
      <p className="eyebrow">Core Loop</p>
      <ol className="loop-list">
        {loopStages.map((stage) => {
          const isActive = stage.key === activeStage;
          return (
            <li key={stage.key} className={isActive ? "loop-item active" : "loop-item"}>
              <span className="loop-title">{stage.label}</span>
              <span className="loop-helper">{stage.helper}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
