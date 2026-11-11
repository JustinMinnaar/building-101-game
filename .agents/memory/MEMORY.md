# Building-101-Game Agent Memory Index

This directory stores concise architectural memory notes for **Building-101-Game**, following the `.agents/` workspace customization structure.

## Key Architectural Notes
- **Core Prefix**: All simulation managers, 3D builders, React components, and hooks use the `QFactory` / `Q` prefix (`QFactorySimManager`, `QFactory3DView`, `QFactoryMachineDesigner`, `QFactoryCustomMachineStore`).
- **Legacy Hotbar & Belt Path Compatibility**:
  - Keep `QFACTORY_HOTBAR_SLOTS` keys `'1'..'0'` intact for `QFactorySim.test.ts` backward compatibility; expose workshop booths, floor/pole tools, and custom machines via `QFactoryWorkshopPalette.tsx`.
  - Keep `QFactorySimManager.connectBelt` raw `pathPoints` exact (`length === 2` on `'straight'`), and apply `QFactoryBeltMath.withTunnelEnds(pts, 0.85)` + `computeTunnelItemScale(progress)` inside `QFactory3DScene` for visual conveyor tunnel entry/exit.
- **Triangle & Frame Budget**: Keep `ExtrudeGeometry` `curveSegments <= 4` and `bevelSegments <= 1` on detailed clay cutaway shells so per-machine geometry stays `< 3,500` triangles.
- **Task & Commit Workflow**: Every work section logs `tasks/YYYY-MM-DD-HHmm-<slug>.md` + registers in `tasks/tasks.md` (`Pending Commit`); the `commit` command runs `pnpm run typecheck`, `pnpm test`, and `pnpm build`, commits using the completed tasks list, pushes to `origin`, and updates the task ledger to `Committed`.
