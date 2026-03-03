import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

type AxeViolation = {
  id: string;
  impact: string | null;
  description: string;
  nodes: Array<{ target: string[] }>;
};

export async function runAxe(
  page: Page,
  includedImpacts: Array<string> = ["critical", "serious"]
): Promise<AxeViolation[]> {
  const result = await new AxeBuilder({ page }).analyze();
  const impactSet = new Set(includedImpacts);
  return result.violations.filter(
    (violation) => !violation.impact || impactSet.has(violation.impact)
  ) as AxeViolation[];
}

export function formatViolations(violations: AxeViolation[]): string {
  return violations
    .map((violation) => {
      const firstNode = violation.nodes[0];
      const target = firstNode?.target?.join(" > ") ?? "unknown";
      return `${violation.id} (${violation.impact ?? "unknown"}): ${violation.description} @ ${target}`;
    })
    .join("\n");
}
