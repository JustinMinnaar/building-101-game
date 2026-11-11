# STORY-001: Dual-Mode Machine Framework, Multi-Mode JSON Spec & On-Demand Visual Machine Designer

- **Date**: 2026-11-10
- **Status**: In Progress (`Step 1` Complete; `Step 2` & `Step 3` Planned)
- **Related Architecture Doc**: [`docs/3d-machine-asset-pipeline.md`](file:///f:/Dev/building-101-game/docs/3d-machine-asset-pipeline.md)

---

## 1. Story Goal & Context

We have separated **Building 101** into its own standalone 3D factory web project (`f:\Dev\building-101-game`) so it evolves cleanly and independently from the `adventure1` VTT prototype.

To build dozens of unique space-themed industrial machines (with whirring parts, moving belts, pipes, cables, roads, dynamic text signs, unique belt items, visibly filling baskets, smoke plumes, and status lighting) **without** getting bogged down modeling final art prematurely, every machine will follow a **two-stage visual & simulation lifecycle**:

1. **Stage A — Simple Visual Framework Mode (`Blockout` Mode)**:
   - Reference: [`docs/images/prototype-blockout-mode.jpg`](file:///f:/Dev/building-101-game/docs/images/prototype-blockout-mode.jpg)
   - Each machine is first defined by a clean framework of simple colored boxes/cylinders, exact green/blue belt & pipe connectors, anchor points for smoke and lighting, dynamic sign slots, basket volumes, and full gameplay mechanics (`modes`, `powerMW`, `inputs`, `outputs`, `spinUpSec`, `spinDownSec`).
   - We test factory layouts, backpressure, power draw, spin-up/down inertia, and smoke/light triggers rapidly in this lightweight visual mode.

2. **Stage B — Detailed Tactile / Cutaway Model Mode (`Detailed` Mode)**:
   - Reference: [`docs/images/concept-cutaway-diorama-mode.jpg`](file:///f:/Dev/building-101-game/docs/images/concept-cutaway-diorama-mode.jpg)
   - Using an **On-Demand Visual Machine Designer Webpage** (switched into directly from the game HUD) + AI-generated procedural parts/textures in chat, we upgrade any machine's framework with beveled cutaway shells, meshed spinning gears, dangling colored cables, articulated robotic arms, siren beacons, toggle levers, clay/space-composite textures, and `.glb` export—and toggle between **Simple Framework** and **Detailed Models** at any time in-game.

---

## 2. Core Functional Requirements

### 2.1 Unified Declarative `MachineDefinition` JSON
Every machine is backed by a human-readable JSON file (`src/data/machines/<machine-id>.json`) that serves as the single source of truth for both simulation and 3D rendering:

- **Identity & Footprint**:
  - `id`, `name`, `category`, `tier`
  - `footprint`: `{ width, depth, height }` (in meters on the world grid) + placement rule (`resource-deposit`, `open-ground`, `foundation`, `any`).
- **Kinematics & Mechanical Inertia**:
  - `spinUpSec`: Seconds required for moving parts & throughput rate to accelerate from `0%` to `100%` when power & inputs become available.
  - `spinDownSec`: Seconds required for moving parts (gears, drills, wheels, fans) to coast smoothly down from `100%` to `0%` when halted, starved, or switched off.
- **Operating Modes (`modes[]`)**:
  - Each machine supports 1 or more selectable modes (e.g., *Standard Smelt*, *High-Purity Overclock*, *Strict Inspection*):
    - `id`, `label`
    - `powerMW`: Active power consumption (plus optional `idlePowerMW`)
    - `cycleSec`: Base crafting/processing cycle time at `100%` spin
    - `inputs[]`: `{ portId, itemType, count }`
    - `outputs[]`: `{ target: portId | basketId, itemType, count, probability? }`
    - `animSpeedMultiplier`: Multiplier on gear/arm/belt speed and smoke emission rate
- **Connectors & Effect Points**:
  - `ports[]`: Typed connectors (`belt-in`, `belt-out`, `pipe-in`, `pipe-out`, `power`) with local `{ x, y, z }` and outward cardinal normal.
  - `smokeSockets[]`: Local `{ x, y, z, direction, rate, color }` points where smoke/steam puffs emit while active.
  - `lightSockets[]`: Local `{ x, y, z, role: 'status' | 'work' | 'beacon', color }` points for indicator LEDs, furnace glow, or rotating beacons.
  - `signs[]`: Dynamic label boards/flags (`{ id, position, rotation, style: 'flag' | 'plaque' | 'panel', defaultText, binding? }`).
  - `baskets[]`: Open-top container sub-volumes (`{ id, position, size, capacity }`) that visibly pile up unique 3D items inside as `storedCount` grows.
- **Dual Visual Geometry Layers**:
  - `blockout`: Array of simple primitives (`box`, `cylinder`, `cone`, `slope`, `window-frame`, `arm-line`) with colors and optional `mirrorX` / `mirrorZ` flags.
  - `detailed`: Parametric sculpted parts (`cutaway-box`, `gear`, `robot-arm-2dof`, `wire-spline`, `lever`, `siren-beacon`, `roller-belt`, or external `.glb` URI) + material preset (`clay-composite`, `space-titanium`, `hazard-industrial`).

### 2.2 Global Visual Mode Toggle (`Blockout` vs. `Detailed`)
- A clean HUD toggle in the 3D Factory view switches all placed machines instantly between:
  - **Simple Framework View**: Renders `blockout` boxes, color-coded I/O port frames, and optional visible gizmo pins for `smokeSockets` and `lightSockets` to verify simulation behavior clearly.
  - **Detailed Model View**: Renders the full animated `detailed` 3D machine artwork, dynamic `CanvasTexture` signs, filling baskets, smoke plumes, and emissive status lights (falling back explicitly or highlighting if a machine only has `blockout` defined during early prototyping, per user selection).

### 2.3 On-Demand Visual Machine Designer Webpage
Switched into on demand via a top-bar **`[Machine Designer]`** button (returning to the live factory with one click):
1. **Multi-View Orthographic + 3D Workspace**:
   - **Top-Down (`XZ`)**, **Side-On (`XY`)**, and **End-On (`ZY`)** orthographic snapped grids alongside a **Live Interactive 3D Viewport**.
2. **Mirror Line Symmetry (`Mirror X` / `Mirror Z`)**:
   - Drawing, dragging, or resizing a frame plane/box, connector port, arm pivot, or smoke point on one side of the mirror axis simultaneously updates its mirrored twin on the opposite side.
3. **Component & Socket Placement Tools**:
   - Quickly position basic frame boxes, cutaway openings, cylinders, arms/pivots, belt/pipe/power connectors, signs, baskets, and smoke/light sockets.
4. **Mechanics & Live Test Bench**:
   - Edit `modes[]` (`powerMW`, `inputs`, `outputs`, `cycleSec`), `spinUpSec`, and `spinDownSec`.
   - Test state transitions live (`Power Off`, `Spinning Up`, `Running Mode 1..N`, `Starved`, `Spinning Down`) and export/copy the clean `MachineDefinition` JSON so AI in chat can enrich it with detailed cutaway parts, meshed gears, cables, and textures (plus `.glb` export).

---

## 3. Phased Delivery Plan

- **Step 1 (Completed)**: Extract standalone `building-101-game` workspace, copy & tailor `.agents/AGENTS.md` AI directives, author `STORY-001`, establish `tasks/` tracking, and verify clean `pnpm run typecheck` + `pnpm test`.
- **Step 2 (Planned — see [`plan-step-02-machine-json-schema-and-dual-visual-mode.md`](file:///f:/Dev/building-101-game/tasks/plan-step-02-machine-json-schema-and-dual-visual-mode.md))**: Implement `MachineDefinition` JSON schema, multi-mode + `spinUpSec`/`spinDownSec` simulation engine, smoke/light/sign/basket runtime systems, Simple Blockout vs. Detailed Model toggle, and first complete multi-mode cutaway showcase machine.
- **Step 3 (Planned — see [`plan-step-03-on-demand-visual-machine-designer.md`](file:///f:/Dev/building-101-game/tasks/plan-step-03-on-demand-visual-machine-designer.md))**: Build the On-Demand Visual Machine Designer webpage with Top/Side/End orthographic views, Mirror Line symmetry, interactive frame/connector/socket/mode editing, live state test bench, and `.glb` export.
