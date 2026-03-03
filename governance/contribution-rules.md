# Contribution Rules

## Version 1.0
## Status: Foundational
## Last Updated: 2026-03-01

## General Rules

- Preserve source immutability under `_import_from_drive`.
- Do not introduce product redesign through documentation-only changes.
- Keep constitutional tone declarative and non-conversational.
- Use `pnpm` only for installs and scripts.
- Local quickstart commands:
  - `pnpm install`
  - `pnpm dev`
  - `pnpm test:e2e`
  - `pnpm lint`

## Constitution Rules

- Preserve the required 0-10 section skeleton in `docs/constitution/00-05.md`.
- Missing sections must be marked `Not Applicable.` when source content is absent.
- Do not add external links, citations, or tool artifacts to constitutional docs.

## Commit Rules

- Use Conventional Commit messages.
- Keep commits atomic.
- Sign commits.

## Pull Request Rules

- Include scope, files changed, validation output, and governance impact.
- Include ADR references for constitutional meaning changes.
