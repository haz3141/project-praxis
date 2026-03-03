# React Conversion Validation Checklist

- [ ] No hardcoded hex/rgb color literals in component source.
- [ ] Spacing values come from token ladder only.
- [ ] Component padding declarations are token-backed (`var(--ds-*)`) with no raw unit literals.
- [ ] Typography uses canonical type tokens only.
- [ ] Comfortable/Compact density mappings implemented for planner-critical components.
- [ ] Interactive states include hover/focus/active/disabled/loading.
- [ ] Focus ring is visible in all variants and themes.
- [ ] Sync/offline indicators expose textual state and use live-region semantics when status changes.
- [ ] Overlays enforce escape-to-close and focus management.
- [ ] Planner remains primary when overlays are present.
