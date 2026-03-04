# Gitflow

## Version 1.0
## Status: Foundational
## Last Updated: 2026-03-01

## Branch Model

- `main` is protected and represents releasable state.
- `dev` is the integration baseline for active implementation work.
- Feature work is performed on short-lived branches prefixed by `feat/`, `fix/`, `docs/`, `chore/` and merged into `dev`.

## Merge Policy

- All changes are merged through pull requests.
- Pull requests must target `dev` as the base branch.
- Commits must use Conventional Commit prefixes.
- Commits must be signed.

## Required Checks

- `pnpm lint:md`
- `pnpm validate`
- CI branch policy gate (`ci:branch-policy`)

## Release Policy

- Merge to `main` only after required checks pass.
- Constitutional changes require ADR reference in PR description.
