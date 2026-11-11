# TASK-20261110-2145: Standalone Building-101 Bootstrap, AI Directives, Story 001 & Steps 2–3 Plan

- **Date / Time Reference**: `2026-11-10 21:45:00`
- **Status**: `Committed` (`2a32213` on `2026-11-11 12:00`)

## Summary

Bootstrapped the standalone **Building 101** project (`f:\Dev\building-101-game`) separated cleanly from the `adventure1` VTT prototype. Extracted all 24 standalone `QFactory*` simulation, 3D rendering, UI, hook, and Vitest test files, configured root Vite/TypeScript/Vitest tooling, adapted the workspace AI architecture rules (`.agents/AGENTS.md`), documented the complete dual-mode machine & visual designer architecture in `stories/story-001-machine-framework-and-visual-designer.md`, and created detailed TDD execution plans for **Step 2** and **Step 3** in `tasks/`.

## Key Changes & Decisions

- **Zero-VTT Standalone Extraction**: Copied the 24 self-contained `QFactory*` modules from `adventure1` into `src/` with a clean full-screen `src/App.tsx` entry (`port: 3001`), leaving `adventure1` untouched.
- **Tailored AI Directives (`.agents/AGENTS.md`)**: Preserved core TDD, zero-fallback determinism, file/function size limits, performance testing invariants, and `'commit'` task-ledger rules while adding **Invariant 5 (Dual-Mode Machine Architecture & Data-Driven JSON Contract)**.
- **Story 001 & Reference Imagery**: Saved both the running simple-box prototype screenshot (`docs/images/prototype-blockout-mode.jpg`) and the tactile cutaway machine reference (`docs/images/concept-cutaway-diorama-mode.jpg`), documenting the two-stage workflow (**Simple Blockout Mode** for rapid mechanics/connector/smoke testing → **Detailed Model Mode** via the On-Demand Visual Machine Designer + AI procedural artwork & `.glb` export).
- **Step 2 & Step 3 TDD Plans**: Authored `tasks/plan-step-02-machine-json-schema-and-dual-visual-mode.md` and `tasks/plan-step-03-on-demand-visual-machine-designer.md` so a new conversation opened directly in `f:\Dev\building-101-game` has full context and immediate execution steps.

## Affected Files

- [`.agents/AGENTS.md`](file:///f:/Dev/building-101-game/.agents/AGENTS.md)
- [`README.md`](file:///f:/Dev/building-101-game/README.md)
- [`package.json`](file:///f:/Dev/building-101-game/package.json)
- [`tsconfig.json`](file:///f:/Dev/building-101-game/tsconfig.json)
- [`vite.config.ts`](file:///f:/Dev/building-101-game/vite.config.ts)
- [`index.html`](file:///f:/Dev/building-101-game/index.html)
- [`src/App.tsx`](file:///f:/Dev/building-101-game/src/App.tsx)
- [`src/main.tsx`](file:///f:/Dev/building-101-game/src/main.tsx)
- [`docs/3d-machine-asset-pipeline.md`](file:///f:/Dev/building-101-game/docs/3d-machine-asset-pipeline.md)
- [`docs/images/prototype-blockout-mode.jpg`](file:///f:/Dev/building-101-game/docs/images/prototype-blockout-mode.jpg)
- [`docs/images/concept-cutaway-diorama-mode.jpg`](file:///f:/Dev/building-101-game/docs/images/concept-cutaway-diorama-mode.jpg)
- [`stories/README.md`](file:///f:/Dev/building-101-game/stories/README.md)
- [`stories/story-001-machine-framework-and-visual-designer.md`](file:///f:/Dev/building-101-game/stories/story-001-machine-framework-and-visual-designer.md)
- [`tasks/tasks.md`](file:///f:/Dev/building-101-game/tasks/tasks.md)
- [`tasks/plan-step-02-machine-json-schema-and-dual-visual-mode.md`](file:///f:/Dev/building-101-game/tasks/plan-step-02-machine-json-schema-and-dual-visual-mode.md)
- [`tasks/plan-step-03-on-demand-visual-machine-designer.md`](file:///f:/Dev/building-101-game/tasks/plan-step-03-on-demand-visual-machine-designer.md)

## Validation & Verification

- `pnpm install`: Completed cleanly (`106` packages installed).
- `pnpm run typecheck` (`tsc --noEmit`): Passed with `0` errors and `0` warnings.
- `pnpm test` (`vitest run`): Passed `2/2` test suites (`22/22` unit tests in `35ms`).

## Commit Message Line

`- [2026-11-10 21:45] Standalone Building-101 Bootstrap & Story 001: Extract standalone 3D factory app, add tailored AGENTS.md directives, Story 001 spec, and Steps 2-3 TDD task plans`
