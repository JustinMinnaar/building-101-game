# Planned Step 2: Declarative `MachineDefinition` JSON, Multi-Mode Kinetics & Dual Visual Mode (`Blockout` + `Detailed`)

- **Story Reference**: [`STORY-001`](file:///f:/Dev/building-101-game/stories/story-001-machine-framework-and-visual-designer.md) & [`STORY-002`](file:///f:/Dev/building-101-game/stories/story-002-wonder-think-carnival-brain-factory.md) (*Wonder-Think!* Carnival Claymation Brain Factory Theme)
- **Status**: Planned (Ready for execution in `building-101-game`)

---

## Objective

Replace hardcoded procedural switch-statements in [`QFactoryModelBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryModelBuilder.ts) and [`QFactoryBlueprints.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryBlueprints.ts) with a **data-driven `MachineDefinition` JSON system** (`src/data/machines/*.json`) themed around ***Wonder-Think!* (Inside the Miracle Carnival Thinking Box)** that powers:
1. **Simple Visual Framework Mode (`Blockout`)**: Boxes, cylinders, colored belt/pipe connectors, and optional smoke/light socket indicators (matching [`prototype-blockout-mode.jpg`](file:///f:/Dev/building-101-game/docs/images/prototype-blockout-mode.jpg)) for rapid factory gameplay testing.
2. **Multi-Mode Mechanics & Spin Inertia**: Selectable operating `modes[]` per machine (`powerMW`, `cycleSec`, `inputs[]`, `outputs[]`) plus continuous `spinUpSec` and `spinDownSec` velocity ramping in a relaxed sandbox comedy loop.
3. **Smoke, Lights, Dynamic Toothpick Flags & Filling Baskets**: Runtime `InstancedMesh` cotton-wool steam puffs emitted from `smokeSockets`, marquee/beacon lighting on `lightSockets`, pooled `CanvasTexture` signs (`"DUMB IDEAS"`, `"REFUSALS"`, `"DOOHICKEYS"`, `"TYPOS"` flags), and open clay baskets visibly stacking output/byproduct items.
4. **Detailed Claymation Cutaway Mode (`Detailed`) + First Playable Brain Chain**: Toggle seamlessly in the HUD between **Simple Framework** and **Detailed Claymation Cutaway Models** (matching [`docs/images/wonder-think/`](file:///f:/Dev/building-101-game/docs/images/wonder-think/)), featuring our first playable production loop: **`Smooth Brain` (`Putty Vat`) → `Wrinkle-O-Matic Brain Press` → `Refusal Stamper`** alongside the **`Widget/Wocket/Ting/Bing Calliope`** and **`Query-to-Response Booth`** (plus logistics `Container`, `Splitter`, `Merger`, `Connector`, `Tower`).

---

## Sub-Tasks (Strict TDD Breakdown)

### Task 2.1 — `MachineDefinition` JSON Schema, Validator & Registry
- **Tests First (`src/tests/QFactoryMachineRegistry.test.ts`)**:
  - Assert strict fail-fast validation on missing required fields (`id`, `footprint`, `modes`, `ports`, `blockout`).
  - Assert symmetric `mirrorX` / `mirrorZ` expansion of `blockout` shapes, `ports`, and `smokeSockets`.
  - Performance test: parsing and indexing 100 machine definitions completes in `< 10ms`.
- **Implementation**:
  - Create `src/core/QFactoryMachineSchema.ts` and `src/core/QFactoryMachineRegistry.ts`.
  - Author clean JSON files in `src/data/machines/` for the *Wonder-Think!* starter chain (`putty-vat-extractor.json`, `wrinkle-press-mk1.json`, `refusal-stamper-mk1.json`, `calliope-gizmo-maker.json`, `query-response-booth.json`) plus logistics machines (`container`, `splitter`, `merger`, `connector`, `tower`).

### Task 2.2 — Multi-Mode Simulation, Power Draw & `spinUpSec` / `spinDownSec` Inertia
- **Tests First (`src/tests/QFactoryMachineModesAndSpin.test.ts`)**:
  - Assert `spinRatio` ramps linearly/smoothly from `0 → 1` over `spinUpSec` when powered with valid inputs, scaling cycle advancement rate accordingly.
  - Assert `spinRatio` coasts from `1 → 0` over `spinDownSec` when starved, output-blocked, or switched off.
  - Assert switching a machine's active `modeId` updates `powerMW`, accepted `inputs[]`, produced `outputs[]`, and byproduct basket routing cleanly.
  - Performance test: stepping 2,000 multi-mode machines takes `< 4ms`.
- **Implementation**:
  - Extend `QFactorySimManager` and `QFactoryMachineInspector` (allowing mode selection and displaying live RPM %, power draw, and spin state in the inspector).

### Task 2.3 — Simple Blockout Builder, Socket Gizmos & Global Smoke/Sign/Basket Renderers
- **Tests First (`src/tests/QFactoryDualModeBuilder.test.ts`)**:
  - Assert `Blockout` mode generates exact expected primitive boxes, port rings, and named `socket_smoke_*` / `socket_light_*` child anchors.
  - Assert basket fill calculation maps `storedCount / capacity` deterministically to visible instanced item slots.
- **Implementation**:
  - Build `QFactoryBlockoutBuilder.ts`, `QFactorySignBuilder.ts` (cached `CanvasTexture`), `QFactorySmokeSystem.ts` (single global `THREE.InstancedMesh` of rising matte cloud puffs), and open-basket item stacking.

### Task 2.4 — Detailed Tactile / Cutaway Kit (`QFactoryDetailedBuilder`) & HUD Toggle
- **Tests First (`src/tests/QFactoryDetailedKit.test.ts`)**:
  - Assert cutaway extruded shell, parametric meshed gears (`teeth` ratio), 2-joint robotic arm hierarchy, and spline wires stay within triangle budget (`< 1,800 tris` per machine) and build in `< 8ms`.
- **Implementation**:
  - Create `QFactoryClayMaterialLibrary.ts` (procedural 512×512 tactile normal/roughness map) and `QFactoryDetailedBuilder.ts`.
  - Add `[View: Simple Framework | Detailed Models]` + `[Show Socket Pins]` toggles to the top HUD in `QFactory3DView.tsx`.
