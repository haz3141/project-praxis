export function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function canonicalId(input) {
  return `cmp-${slugify(input)}`;
}

export function normalizeTierFromPath(componentPath = "") {
  if (componentPath.includes("/atoms/")) return "atom";
  if (componentPath.includes("/molecules/")) return "molecule";
  if (componentPath.includes("/organisms/")) return "organism";
  if (componentPath.includes("/templates/")) return "template";
  return "atom";
}
