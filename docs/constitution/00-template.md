# Project Praxis — [Document Title]

## Version X.X
## Status: [Foundational | Draft | Experimental]
## Last Updated: YYYY-MM-DD

## 0. Purpose

Define the purpose of this document.
State the architectural layer it governs.

## 1. Inherited Constraints

This document inherits constraints from:

- 01-core.md
- 02-product.md (if applicable)

All constraints are binding.

## 2. Thesis / Scope

Define what this layer is responsible for.
Define what it explicitly does not govern.

## 3. Architecture / Structure

Define the structural model.
Define systems, modules, primitives, and relationships relevant to this layer.

## 4. Operational Rules

Define invariants.
Define enforcement posture.
Define allowed variation boundaries.

## 5. Scope Boundaries

Define what is explicitly out-of-scope.
Prevent layer creep.

## 6. Metrics (If Applicable)

Define measurable criteria influenced by this layer.
Define evaluation signals.

## 7. Failure Modes

List structural breakdown risks.
List drift risks.
List integration breakdown risks.

## 8. Anti-Features

List prohibited patterns.
List architectural temptations.
List forbidden expansions.

## 9. Alignment Contracts

Define interaction contracts with:

- Core
- Product
- Adjacent layers

Define integration invariants.

## 10. Governance

All structural revisions require ADR reference.
Major version increments require cross-layer review.
Foundational documents cannot drift independently.
