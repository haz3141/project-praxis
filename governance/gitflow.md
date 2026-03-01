# Gitflow

## Version 1.0
## Status: Foundational
## Last Updated: 2026-03-01

## Branch Model

- `main` is protected and represents releasable state.
- Feature work is performed on short-lived branches prefixed by `feat/`, `fix/`, `docs/`, `chore/`.

## Merge Policy

- All changes are merged through pull requests.
- Commits must use Conventional Commit prefixes.
- Commits must be signed.

## Required Checks

- `npm run lint:md`
- `npm run validate`

## Release Policy

- Merge to `main` only after required checks pass.
- Constitutional changes require ADR reference in PR description.
