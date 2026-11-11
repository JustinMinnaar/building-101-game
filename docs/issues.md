# Building 101 — Known & Resolved Issues Catalog

This catalog tracks discovered and resolved bugs across simulation, spatial validation, and 3D rendering in **Building 101**. Always review before debugging and log new resolutions here per [`.agents/AGENTS.md`](file:///f:/Dev/building-101-game/.agents/AGENTS.md).

---

## Resolved Issues

### ISS-001: Detailed Cutaway Extruded Shell Exceeded 3,500-Triangle Budget (`5,634` tris)
- **Domain**: 3D Mesh Builders ([`QFactoryCutawayShellBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryCutawayShellBuilder.ts), [`QFactoryCutawayInteriorBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryCutawayInteriorBuilder.ts))
- **Root Cause**: Default Three.js `ExtrudeGeometry` `curveSegments: 12` and `bevelSegments: 3` on rounded window holes and gear teeth multiplied vertex counts unnecessarily.
- **Resolution**: Set `curveSegments: 4` and `bevelSegments: 1` with cached `ExtrudeGeometry` instances, reducing full cutaway machine triangle counts to `~2,100` (`< 3,500` budget).
- **Regression Test**: [`QFactoryClayDioramaBuilder.test.ts`](file:///f:/Dev/building-101-game/src/tests/QFactoryClayDioramaBuilder.test.ts)

### ISS-002: Single-Pass `MapIterator` Exhaustion in `QFactoryPlacementValidator.validate`
- **Domain**: Spatial Placement & Multi-Level Foundations ([`QFactoryPlacementValidator.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryPlacementValidator.ts))
- **Root Cause**: Passing `this._foundationFloors.values()` (a single-pass JS `MapIterator`) and consuming it once to check elevated decks (`levelIndex > 0`) left the iterator empty during the subsequent `requireFoundation` bounds check.
- **Resolution**: Materialized `const floorList = foundationFloors ? Array.from(foundationFloors) : [];` once at entry so both elevated-deck and footprint-containment checks iterate over the full floor set.
- **Regression Tests**: [`QFactorySelectionAndFoundations.test.ts`](file:///f:/Dev/building-101-game/src/tests/QFactorySelectionAndFoundations.test.ts), [`QFactoryEditorLevelsAndStyles.test.ts`](file:///f:/Dev/building-101-game/src/tests/QFactoryEditorLevelsAndStyles.test.ts)
