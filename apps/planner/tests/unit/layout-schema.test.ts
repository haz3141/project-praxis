import { describe, expect, it } from "vitest";
import {
  assertPointerOnlyLayoutItem,
  normalizePointerLayoutItem
} from "@/src/features/studio/layoutSchema";

describe("studio pointer-only layout schema", () => {
  it("accepts valid pointer layout item", () => {
    const item = {
      canvasId: "default",
      entityType: "task" as const,
      entityId: "f2723ad8-30fb-45fb-b4de-3238f587f97f",
      x: 24,
      y: 16,
      width: 280,
      height: 160,
      zIndex: 1,
      collapsed: false,
      meta: { tag: "priority" }
    };

    expect(() => assertPointerOnlyLayoutItem(item)).not.toThrow();
    expect(normalizePointerLayoutItem(item)).toMatchObject(item);
  });

  it("rejects content payload keys", () => {
    const item = {
      canvasId: "default",
      entityType: "task" as const,
      entityId: "f2723ad8-30fb-45fb-b4de-3238f587f97f",
      x: 24,
      y: 16,
      width: 280,
      height: 160,
      zIndex: 1,
      collapsed: false,
      title: "Should not exist"
    };

    expect(() => assertPointerOnlyLayoutItem(item)).toThrow(/pointer-only/i);
  });
});
