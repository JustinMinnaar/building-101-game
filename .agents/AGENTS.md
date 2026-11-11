# Workspace Rules & Core Architecture Directives for Building-101-Game

This file defines the mandatory core invariants for human developers and AI assistants working on **Building-101-Game** (*Teddy's Sweetshop & Wonder-Toy Factory* — 3D Automation, Multi-Level Cardboard Diorama & Visual Machine Builder). Domain-specific workflows and details MUST be inspected on demand from [`README.md`](file:///f:/Dev/building-101-game/README.md), [`stories/`](file:///f:/Dev/building-101-game/stories/), [`docs/`](file:///f:/Dev/building-101-game/docs/), and [`tasks/tasks.md`](file:///f:/Dev/building-101-game/tasks/tasks.md).

---

## 1. Pre-Flight Domain Specification Routing Table

BEFORE writing or modifying code, AI assistants MUST inspect the relevant domain specification:

| Task / Domain Area | Primary Specification & Files | Core Focus |
|---|---|---|
| Master Catalog & System Index | [`README.md`](file:///f:/Dev/building-101-game/README.md) | Central repository documentation map, quickstart, and architecture overview. |
| Stories & Concept Specifications | [`stories/README.md`](file:///f:/Dev/building-101-game/stories/README.md), [`stories/`](file:///f:/Dev/building-101-game/stories/) | Product stories (`STORY-001` framework, `STORY-002` Toy-Smarts Carnival Brains, `STORY-003` Teddy Sweet & Toy Factory). |
| 3D Asset, Style & Machine Pipeline | [`docs/3d-machine-asset-pipeline.md`](file:///f:/Dev/building-101-game/docs/3d-machine-asset-pipeline.md) | Clay Diorama, Anime Cel-Toon, Glossy Vinyl & Simple Blockout modes, `.glb` compatibility (Three.js & Godot 4), signs, baskets, and VFX sockets. |
| 3D Factory Viewport, HUD & Designer | `src/components/QFactory*.tsx`, `src/hooks/useQFactory*.ts` | 60 FPS Three.js viewport, resource bar, multi-level deck controls, hotbar, machine inspector, and full-page Cube & Add-on Machine Designer. |
| Core Simulation, Math & 3D Builders | `src/core/QFactory*.ts`, `src/data/machines/*.json` | Deterministic factory simulation, multi-mode machine kinetics (`spinUpSec`/`spinDownSec`), tunnel belt routing, economy, and mesh builders. |
| Known Issues Master Catalog | [`docs/issues.md`](file:///f:/Dev/building-101-game/docs/issues.md) | Registry of discovered and resolved simulation, spatial, and 3D rendering bugs. |
| Completed Tasks, Batch `'commit'` & Push Protocol | [`tasks/tasks.md`](file:///f:/Dev/building-101-game/tasks/tasks.md), [`tasks/`](file:///f:/Dev/building-101-game/tasks/) | End-of-conversation task logging, timestamp reference, parallel task tracking, and `'commit'` test, commit & `git push` protocol. |

---

## 2. Inviolable Core Invariants

### 1. Strict Zero-Fallback, Single-Action Determinism & Zero Unprompted Alternatives
- **Inviolable Single-Action Mandate (ABSOLUTE & UNCONDITIONAL)**: Fallbacks are **STRICTLY PROHIBITED UNDER ANY AND ALL CONDITIONS** without explicit, direct, written instruction from the lead developer. The AI assistant and all codebase components MUST NEVER invent, implement, execute, or suggest a fallback, alternative failover, speculative reroute, heuristic guess, or synthetic recovery.
- **Fail Fast & Prompt on Failure**: Every requested operation MUST attempt only the single specified action against the single designated target. If the single instruction cannot be satisfied (e.g., invalid `MachineDefinition` JSON, invalid placement rule, missing target port, or unreachable git remote), the operation MUST FAIL FAST IMMEDIATELY with a visible, descriptive error (`throw new Error(...)`). Stop immediately, inform the user why it could not be followed, and ask if an alternative should be considered.
- **Prohibited Fallback Patterns**:
  - **Zero Chained Data Fallbacks**: Never cascade attributes (`val || sampleVal || defaultVal`) to mask missing required schema properties or inject synthetic placeholder game data.
  - **Zero Silent Empty Success**: Never treat invalid placements, missing ports, or failed external operations as silent successes.
  - **Zero Hardcoded English Heuristics**: Data matching and machine/recipe lookups MUST bind strictly to canonical IDs (`id`, `modeId`, `itemType`), never unanchored English string guessing, keeping the codebase multi-language ready.

### 2. Golden Invariant: Strict Test-First Development (TDD)
- **Zero Untested Logic**: Under NO circumstances shall any simulation logic, machine state transition, belt/tunnel calculation, JSON schema loader, floor/pole spatial math, or 3D geometry builder be implemented without existing failing unit or functional tests.
- **Red-Green-Refactor Cycle**:
  1. Write unit/functional + performance test first in `src/tests/` asserting expected behavior and timing contract.
  2. Run `pnpm test` to confirm test failure (or compile error for missing signature).
  3. Implement minimum required logic.
  4. Run `pnpm test` and `pnpm run typecheck` to confirm all tests and strict TypeScript checks pass.
  5. Refactor while keeping all tests green.
- **Continuous Validation**: Run `pnpm test` and `pnpm run typecheck` whenever new functionality or logic is introduced.

### 3. Component Naming, Layer Standards & Future Backend Scoping (The 'Q' Rule)
- **Component & Module Prefix**: Core factory components, managers, builders, and hooks use the **`QFactory`** / **`Q`** prefix (e.g., `QFactory3DView`, `QFactorySimManager`, `QFactoryModelBuilder`, `QFactoryMachineDesigner`, `useQFactoryInteraction`). Do NOT use `Bob` prefix.
- **Single Naming Standard**:
  - TypeScript classes & React components: `PascalCase`
  - Private / protected class fields: `_camelCase`
  - JSON contracts, variables & hooks: `camelCase` (`useQFactory...`)
  - Future C# backend / SQL database schemas (when added): `PascalCase` C# public members, `_camelCase` private fields, `snake_case` database tables/columns, mandatory multi-tenant `accountId` constructor scoping, explicit B-tree indexes (zero `Seq Scan`, zero `SELECT *`, mandatory `limit()` bounds), and WebSocket push over polling (zero HTTP `refetchInterval`).

### 4. 4-Layer Modular Architecture, Dialog Minimization & Clean UI Governance
- **File Lengths**: Page orchestrators max 200–250 lines; component and class files max 150–250 lines. Dedicated file per class/component. No inline sub-components.
- **Function Lengths**: Max 25–40 lines per function/method. Extract complex branching, input handling, and spatial helpers into dedicated classes or custom hooks (`useQFactory*.ts`).
- **Dialog Minimization Standard (Strict 1–2 Field Rule)**:
  - Never use cramped modal dialogs for multi-field machine editors, recipe builders, or 3D inspection studios.
  - Multi-field creators and editors (such as `QFactoryMachineDesigner`) MUST be built as dedicated full-viewport views/pages with side-by-side structured panels (`Ortho Canvas | Live 3D Viewport | Controls Sidebar`).
  - Field captions, resource pills, and toolbar labels MUST NEVER wrap awkwardly or overflow (`whiteSpace: 'nowrap'`, `textOverflow: 'ellipsis'`, `overflow: 'hidden'`).
- **Zero Developer Notes & Tech Stack Jargon in UI**: Never insert implementation details, developer notes, or underlying tech stack jargon (e.g., Three.js buffer geometries, JSON schemas, WebGL uniforms) into user-facing labels, buttons, or tooltips. Focus strictly on playful, thematic game & workshop actions.

### 5. Multi-Mode Machine Architecture, Cube Designer & Multi-Art-Style Contract
- **Decoupled Machine Spec & Theme Flavor**: Machine frame geometry (`frameCubes[]`, `addons[]`, `connectors[]`, `frontSide`), footprint, spin-up/down inertia (`spinUpSec`, `spinDownSec`), and throughput balance are decoupled from thematic item packs (`sweet-toy` vs. `smart-brain-toys`) and visual rendering styles.
- **Multi-Style 3D Rendering**: Support live switching across `detailed` (Claymation + Corrugated Cardboard), `anime` (Cel-shaded Toon + dark ink outlines), `vinyl` (Glossy Candy Vinyl), and `blockout` (Simple engineering primitives + socket pins), maintaining `.glb` rigid-pivot compatibility for Three.js and Godot 4.
- **Recessed Tunnel Conveyors & Multi-Level Pole Decks**: Conveyors enter and exit dark recessed connector holes on machines (`withTunnelEnds`), scaling belt items smoothly as they emerge from and vanish into machine tunnels (`computeTunnelItemScale`), and climb seamlessly across elevated pole-supported cardboard floor levels (`levelIndex >= 1`).

### 6. Architectural Efficiency, 60 FPS Frame SLAs & Mandatory Performance Testing
- **Most Efficient Method by Design**: Always select $O(1)$ or $O(\log N)$ lookups (`Map`/`Set`), cached geometries/materials (`QFactoryClayMaterialLibrary`, `QFactoryStyleMaterialLibrary`), `THREE.InstancedMesh` batching for smoke puffs/repeated elements, and rigid pivot animations (never CPU skeletal skinning for machines). Avoid unthrottled React state churn or per-frame heap allocations inside `requestAnimationFrame`.
- **Mandatory Performance Unit Tests**: Every simulation loop, belt/tunnel math module, custom machine builder, or style pass MUST include explicit performance assertions in `src/tests/` (e.g., `expect(elapsedMs).toBeLessThan(60)`) to guarantee 60 FPS (`<= 16.6ms` frame budget).

### 7. Continuous Issue Tracking
- Review [`docs/issues.md`](file:///f:/Dev/building-101-game/docs/issues.md) before debugging and document all discovered and resolved bugs upon completion with root cause, fix, and regression test link.

### 8. End-of-Conversation Task Logging & `'commit'` (Commit + Push) Command Protocol
- **End-of-Conversation / Work-Section Task Output**:
  - At the end of every conversation or completed work section in which code, configuration, or documentation tasks were completed, the AI assistant MUST:
    1. Create a detailed task report markdown file in [`tasks/`](file:///f:/Dev/building-101-game/tasks/) named with the local date/time reference: `YYYY-MM-DD-HHmm-<task-slug>.md`.
       - The task file MUST contain:
         - **Header**: `# TASK-<YYYYMMDD-HHmm>: <Task Title>`
         - **Date / Time Reference**: Full local date/time (e.g., `2026-11-11 11:58:00`).
         - **Status**: Initially `Pending Commit` (transitions to `Committed` upon git commit and push).
         - **Summary**: Concise overview of the problem, request, or feature.
         - **Key Changes & Decisions**: Rationale, technical design, bug fixes, or architecture adjustments.
         - **Affected Files**: Clickable `file:///` markdown links to all created, modified, or deleted files.
         - **Validation & Verification**: Results of `pnpm run typecheck`, `pnpm test`, and `pnpm build`.
         - **Commit Message Line**: A single concise bullet formatted for the batch commit message: `- [YYYY-MM-DD HH:mm] <Task Title>: <summary>`.
    2. Register the task in the master ledger [`tasks/tasks.md`](file:///f:/Dev/building-101-game/tasks/tasks.md) under the `Completed Task Registry` table with `Status = Pending Commit` and `Commit / Notes = Pending 'commit' command`.
- **Parallel & Post-Section Batch Support**:
  - Multiple work sections or parallel tasks each record their own isolated task file in `tasks/` under `Pending Commit` in [`tasks/tasks.md`](file:///f:/Dev/building-101-game/tasks/tasks.md), ready to be committed and pushed cleanly using the completed tasks list after each work section or whenever `commit` is requested.
- **The `'commit'` Command Protocol (Commit & Push Using Tasks Done)**:
  - After a work section when requested by the developer, or whenever the user explicitly issues the command `commit`:
    1. **Identify Pending Tasks**: Inspect [`tasks/tasks.md`](file:///f:/Dev/building-101-game/tasks/tasks.md) and identify all completed tasks with status `Pending Commit` since the last git commit.
    2. **Execute Full Typecheck, Unit & Performance Tests**:
       - Run full workspace typechecking: `pnpm run typecheck`.
       - Run the complete unit & performance test suite: `pnpm test` (plus `dotnet test` if any C# projects exist).
       - Run production build verification: `pnpm build`.
       - **Fail-Fast Barrier**: If any check or test fails, STOP immediately. Do NOT stage, commit, or push. Report the failure details and resolve them before proceeding.
    3. **Prepare Multi-Task Commit Message**:
       - Formulate a single-line summary header describing the batch of completed tasks.
       - Leave a blank line.
       - Append the single bullet line for each pending task referencing its date/time and description:
         `- [YYYY-MM-DD HH:mm] <Task Name>: <Concise summary of changes>`
    4. **Stage, Commit & Push to Remote**:
       - Stage modified and created files (`git add .`).
       - Commit with the prepared multi-task message (`git commit -m "..."`).
       - Push commits to the remote git repository (`git push`, or `git push -u origin main` when pushing a newly initialized branch). **Fail-Fast Check**: Verify a remote `origin` is configured and reachable; if pushing fails (e.g., remote repository not yet created or network offline), fail fast and report the exact git error to the developer while preserving the clean local commit.
    5. **Update Task Ledger Status to `Committed`**:
       - Update [`tasks/tasks.md`](file:///f:/Dev/building-101-game/tasks/tasks.md) and each committed task file in [`tasks/`](file:///f:/Dev/building-101-game/tasks/) from `Pending Commit` to `Committed` (recording the commit hash and timestamp).
       - Commit and push the updated ledger: `git commit -am "docs(tasks): update task ledger and records with commit <hash>" && git push`.
    6. **Commit Completion Summary**:
       - Provide a concise, consolidated commit report:
         - Typecheck, unit/performance test, and build validation results.
         - Git commit hash, commit message, and remote push confirmation.
         - Summary table of committed tasks linking to their task files in `tasks/`.

### 9. Daily End-to-End Code Review & `'review'` Command Protocol
- **Trigger**: When the user explicitly issues the command `review` (or `review all` / `review full`):
  1. Inspect git modified/staged files (or all `src/` files on `review all`).
  2. Audit against the 5 Core Invariants: **Fail-Fast Error Propagation** (no empty `catch {}`), **Strict Zero-Fallback** (no `val || defaultVal` masking), **Canonical `QFactory` Naming**, **File & Function Size Limits** (max 150–250 lines per file, 25–40 lines per function, zero inline sub-components), and **Zero Tech Jargon in UI**.
  3. Split any oversized files/functions into dedicated sub-components, helpers, or hooks while keeping `pnpm run typecheck` and `pnpm test` 100% green.
  4. Report a concise summary with clickable `file:///` links.

### 10. 60 FPS Frame & Simulation Audit (`'check performance'` Command Protocol)
- **Trigger**: When the user explicitly issues the command `check performance`:
  1. Run `pnpm test` performance benchmarks and inspect mesh triangle counts, material/geometry cache hit rates, `InstancedMesh` usage, and simulation tick durations across `src/core/QFactory*.ts`.
  2. Diagnose any frame-loop allocations, excessive draw calls, high-segment curves, or $O(N^2)$ spatial lookups exceeding the `16.6ms` 60 FPS frame budget.
  3. Apply targeted optimizations with before/after benchmark assertions in `src/tests/` and report the measured speedup.
