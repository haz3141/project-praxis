# Documentation Governance

## Version 1.0
## Status: Foundational
## Last Updated: 2026-03-01

## Purpose

This governance defines binding and non-binding documentation classes and amendment rules.

## Binding Hierarchy

- `docs/constitution` is binding.
- Changes to constitutional meaning require an ADR.
- `docs/adrs` records constitutional amendments and architecture decisions.
- `docs/research` and `docs/experiments` are non-binding.

## Amendment Rule

- Any constitutional change must reference an ADR ID.
- Constitutional edits without ADR linkage are invalid.
- Structural refactors that preserve meaning must be documented in the stabilization report when applicable.

## Quality Gates

- Markdown lint must pass with zero errors.
- Structural validation for constitution 00-05 must pass.
- No external links or citation tokens are allowed in constitutional documents.

## Ownership

- Repository maintainers enforce governance.
- Pull requests affecting constitution files require explicit governance review.
