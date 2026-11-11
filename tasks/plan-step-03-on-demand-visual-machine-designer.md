# Planned Step 3: On-Demand Visual Machine Designer Webpage & AI Artwork Workflow

- **Story Reference**: [`STORY-001`](file:///f:/Dev/building-101-game/stories/story-001-machine-framework-and-visual-designer.md)
- **Depends On**: [Step 2 (`plan-step-02-machine-json-schema-and-dual-visual-mode.md`)](file:///f:/Dev/building-101-game/tasks/plan-step-02-machine-json-schema-and-dual-visual-mode.md)
- **Status**: Planned

---

## Objective

Create an **on-demand Visual Machine Designer webpage/workspace** inside `building-101-game` (switched into instantly via a **`[Machine Designer]`** button in the top bar without losing factory state) so the developer can rapidly sketch a new machine's 3D framework, mirror symmetry, connectors, animations, smoke/light points, and `modes[]` mechanics—save/export the `MachineDefinition` JSON—and collaborate with AI in chat to generate rich procedural 3D artwork and `.glb` exports.

---

## Sub-Tasks (Strict TDD Breakdown)

### Task 3.1 — Top-Level Mode Switcher & 4-Viewport Designer Layout (Top / Side / End Ortho + 3D)
- **Tests First (`src/tests/QFactoryDesignerProjection.test.ts`)**:
  - Assert coordinate snapping (`0.25m` / `0.5m` / `1.0m` grid) and bidirectional projection between Top (`XZ`), Side (`XY`), and End (`ZY`) orthographic views and 3D space.
- **Implementation**:
  - Add view switcher in `App.tsx` / `QFactory3DView.tsx` (`Factory World` ↔ `Machine Designer`).
  - Create `QFactoryMachineDesigner.tsx` featuring synchronized **Top-Down**, **Side-On**, and **End-On** orthographic panels plus a **Live 3D Orbit Preview**.

### Task 3.2 — Mirror Symmetry Line (`Mirror X` / `Mirror Z`) & Framework / Socket Placement Tools
- **Tests First (`src/tests/QFactoryDesignerMirrorAndTools.test.ts`)**:
  - Assert placing, moving, or resizing a frame plane/box, cutaway opening, cylinder, arm pivot, connector port, sign, basket, or smoke/light point with `mirrorX` or `mirrorZ` active creates/updates its symmetric counterpart deterministically, including port normal reflection.
  - Performance test: 500 interactive drag updates with mirror recalculation complete in `< 5ms`.
- **Implementation**:
  - Build tool palette in the Designer for placing/stretching:
    1. **Frame Shapes**: Box, Cylinder, Slope, Cutaway Window, Arm/Axle Segment.
    2. **Connectors**: Belt In, Belt Out, Pipe In, Pipe Out, Power Hook.
    3. **Effects & Props**: Smoke Point, Light/Beacon Point, Dynamic Sign, Item Basket.
  - Render clear dashed **Mirror Axis lines** on the Top/Side/End views with one-click symmetry toggles.

### Task 3.3 — Mechanics & Modes Inspector + Live Spin-Up/Down Test Bench
- **Tests First (`src/tests/QFactoryDesignerSerialization.test.ts`)**:
  - Assert round-trip lossless serialization (`Designer State → MachineDefinition JSON → Designer State`).
- **Implementation**:
  - Build right-hand **Machine Properties & Modes Editor** to add/edit `modes[]` (`powerMW`, `inputs`, `outputs`, `cycleSec`), `spinUpSec`, `spinDownSec`, and footprint size.
  - Add a **Live Test Bench bar** inside the 3D preview (`Off`, `Spin Up`, `Run Mode 1..N`, `Jammed`, `Spin Down`, `Toggle Simple/Detailed`) to preview animations, smoke puffs, dynamic signs, and basket filling immediately.

### Task 3.4 — JSON Import/Export & One-Click `.glb` Exporter (Godot 4 Ready)
- **Tests First (`src/tests/QFactoryGltfExportContract.test.ts`)**:
  - Assert exported scene hierarchy preserves standardized node names (`Hull_Static`, `Anim_*`, `VFX_Smoke_*`, `Light_*`, `Port_*`) required by Three.js and Godot 4.
- **Implementation**:
  - Add **`Copy / Download JSON`** and **`Load Machine JSON`** buttons so any blockout built visually can be handed straight to AI in chat to generate custom cutaway mechanisms, gears, wires, and clay/space textures.
  - Wire Three.js `GLTFExporter` to **`Export .glb`** for standalone asset archiving and Godot 4 compatibility.
