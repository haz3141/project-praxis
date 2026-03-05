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

  it("accepts project pointer entity type", () => {
    const projectPointer = {
      canvasId: "default",
      entityType: "project" as const,
      entityId: "3be691a6-e4b8-4810-b8c4-2924f3c37abc",
      x: 8,
      y: 12,
      width: 220,
      height: 120,
      zIndex: 2,
      collapsed: true
    };

    expect(() => assertPointerOnlyLayoutItem(projectPointer)).not.toThrow();
    expect(normalizePointerLayoutItem(projectPointer).entityType).toBe("project");
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
