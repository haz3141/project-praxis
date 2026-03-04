# Praxis Stitch Audit (MCP vs Skills)

Updated: 2026-03-04

## Scope

This audit normalizes Stitch usage for Praxis UI Kit work across the four core
canonical Stitch projects (plus optional separate kits such as Liquid Neon) and
two historical usage paths:

- Direct Stitch MCP client configuration
- Stitch skills workflow wrappers

Decision: **use direct Stitch MCP as the canonical path**. Keep skills as
optional helpers that depend on MCP.

## Inventory: Core Four Praxis UI Kit Stitch Projects

Live source of truth: Stitch MCP `list_projects` + `list_screens` on
2026-03-03.

| Name | Project ID | Evidence path/source | What it outputs | Generation path | Current status |
|---|---|---|---|---|---|
| Praxis UI Kit — Calm | `13394915692903823935` | Stitch MCP `projects/13394915692903823935`; snapshot in `docs/design-system/stitch/exports.md` | Stitch screens with `screenshot` and `htmlCode` payloads for canonical slots `00`-`05` plus additional variants | MCP direct and MCP-via-skills | live total=23, canonical coverage=6/6, duplicates=16, extras=1 (`SMOKE TEST SINGLE`) |
| Praxis UI Kit — Executive | `5764765102702214376` | Stitch MCP `projects/5764765102702214376`; cross-variant refs in `docs/pattern-library/registry.json` and `docs/pattern-library/README.md` | Canonical slot participant in cross-variant matrix consumed by pattern-library scaffolds | MCP direct and MCP-via-skills | live total=7, canonical coverage=6/6, duplicates=1 |
| Praxis UI Kit — Minimal | `7285948406539466076` | Stitch MCP `projects/7285948406539466076`; snapshot in `docs/design-system/stitch/exports.md` | Variant screens (`UI Kit` titles) with `screenshot` and `htmlCode` payloads | MCP direct and MCP-via-skills | live total=7, canonical coverage=6/6, duplicates=1 |
| Praxis UI Kit — Desktop | `5252820721296843802` | Stitch MCP `projects/5252820721296843802`; details in `/tmp/praxis_stitch_audit.md` | Desktop-oriented variant set with canonical slots plus variants | MCP direct and MCP-via-skills | live total=10, canonical coverage=6/6, duplicates=4 |

Detailed per-screen inventory and comparisons across the core canonical
projects are
published in:

- `docs/design-system/stitch/screens-catalog.md` (human-readable table + matrix)
- `docs/design-system/stitch/screens-catalog.csv` (machine-readable)

## Separate Kit: Liquid Neon

Liquid Neon is tracked as a separate Stitch kit and excluded from canonical
representative selection for the core four projects.

| Name | Project ID | Current status |
|---|---|---|
| Praxis UI Kit — Liquid Neon | `970655054511238677` | seeded canonical slots `00`-`05` (6 screens) |

Regenerate these artifacts with:

- `pnpm run stitch:catalog`

## Two Ways Praxis Has Used Stitch

## 1) Direct Stitch MCP (Way #1)

Evidence:

- User-level Codex MCP config with Stitch server and header-based auth:
  `~/.codex/config.toml`
- User-level Gemini MCP config with Stitch server and header-based auth:
  `~/.gemini/antigravity/mcp_config.json`
- Runtime Stitch MCP tools available and callable:
  `mcp__stitch__list_projects`, `mcp__stitch__list_screens`, `mcp__stitch__get_screen`
- Repo docs reference MCP-derived snapshots:
  `docs/design-system/stitch/README.md`, `docs/design-system/stitch/exports.md`

## 2) Stitch Skills Wrappers (Way #2)

Evidence:

- Repo `skills/` entries are symlinks to global skill installs:
  `skills/design-md`, `skills/stitch-loop`, `skills/react-components`,
  `skills/remotion`
- Skill docs explicitly require Stitch MCP tools (`stitch*:*`) and namespace
  discovery:
  `skills/design-md/SKILL.md`, `skills/stitch-loop/SKILL.md`,
  `skills/react-components/SKILL.md`, `skills/remotion/SKILL.md`
- Skill workflows add local artifacts/scripts:
  `skills/stitch-loop/SKILL.md` (`stitch.json`, `queue/`),
  `skills/react-components/scripts/fetch-stitch.sh`

## MCP vs Skills Summary

| Dimension | Direct MCP | Skills wrappers |
|---|---|---|
| Auth and endpoint | Defined in MCP client config | Inherits MCP client auth |
| Invocation | Direct MCP tools (`list_projects`, `list_screens`, `get_screen`, `generate_screen_from_text`) | Prompt-triggered skill workflows that call Stitch MCP under the hood |
| Reproducibility | High, explicit, tool-level | Medium, depends on global skill install/symlink state |
| Repo coupling | Low | Higher (skill docs can drift, local artifacts can appear) |
| Recommended role | **Canonical** | Optional productivity layer on top of canonical MCP |

## Canonical Standard (Praxis)

Use **direct Stitch MCP** as the single canonical integration path.

Keep skills optional for specific workflows (design synthesis, react conversion,
baton loops), but require that skills:

- rely on Stitch MCP (not alternate direct network/auth paths),
- follow repo standards (`pnpm`-only commands),
- and do not define a separate auth/config source of truth.

Rationale:

- Single secure auth surface and fewer conflicting config points
- Deterministic, tool-level operations for audits and automation
- Easier drift detection and safer handoffs

## Safe Canonical Runbook (No Secrets)

1. Set local secret env vars (shell profile, password manager CLI, or CI secret
   store; do not commit values):
   - `STITCH_API_KEY` (API key mode), or
   - `STITCH_OAUTH_ACCESS_TOKEN` (OAuth mode)
   - Optional: `STITCH_MCP_URL` (defaults to `https://stitch.googleapis.com/mcp`)
2. Configure your MCP client to point at Stitch MCP with header names only:
   - Endpoint: `https://stitch.googleapis.com/mcp`
   - Header (API key mode): `X-Goog-Api-Key`
   - Header (OAuth mode): `Authorization: Bearer <token>`
   - Keep config in user-local files (for example `~/.codex/config.toml`),
     never in committed repo files.
3. Validate local configuration without making network token calls:
   - `pnpm run stitch:validate`
4. Use Stitch via direct MCP tool sequence:
   - `list_projects` -> `list_screens` -> `get_screen`
   - Use `generate_screen_from_text` only after canonical slot and variant
     representative are
     confirmed.
5. Sync repo artifacts after approved updates:
   - Refresh `docs/design-system/stitch/exports.md`
   - Refresh `docs/pattern-library/registry.json` only if canonical matrix
     changes
   - Never commit `/tmp` audit files or raw secret-bearing configs

## Troubleshooting

## MCP tools unavailable in runtime

- Verify your MCP client has Stitch server configured.
- Validate local setup with `pnpm run stitch:validate`.
- If tools are still unavailable, use existing snapshot docs and do not claim
  live Stitch results.

## `401` or `403` from Stitch MCP

- Confirm only one auth mode is active at a time.
- Verify header name is correct for your mode (`X-Goog-Api-Key` or
  `Authorization`).
- Revoke/regenerate the affected credential if compromise is suspected.

## Snapshot drift vs live projects

- Re-run live `list_projects`/`list_screens`.
- Compare with `docs/design-system/stitch/exports.md`.
- Update canonical docs only after drift is confirmed.

## Skill instructions conflict with repo standards

- Praxis is `pnpm`-only. If a skill recommends `npm`, translate to `pnpm` in
  local usage docs/scripts.
- Keep skills as wrappers, not as a separate system of record.

## Drift Findings Recorded in This Audit

- Repo snapshot docs list three UI Kit projects while live inventory contains
  four (`Desktop` missing from snapshot index).
- Repo snapshot counts are stale relative to live projects (new duplicates and
  extras exist in live inventory).
- `skills-lock.json` does not represent the currently linked Stitch skill set.
- Some skill docs use `npm` commands, conflicting with repo `pnpm` policy.
- Prior to this audit, there was no dedicated non-network Stitch config
  validator command in repo scripts.

## Evidence References

- `docs/design-system/stitch/exports.md`
- `docs/design-system/stitch/README.md`
- `docs/pattern-library/README.md`
- `docs/pattern-library/registry.json`
- `skills/design-md/SKILL.md`
- `skills/stitch-loop/SKILL.md`
- `skills/react-components/SKILL.md`
- `skills/react-components/scripts/fetch-stitch.sh`
- `skills/remotion/SKILL.md`
- `skills-lock.json`
- `/tmp/praxis_stitch_audit.md`
- `~/.codex/config.toml`
- `~/.gemini/antigravity/mcp_config.json`
