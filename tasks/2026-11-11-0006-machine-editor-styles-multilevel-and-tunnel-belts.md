# TASK-20261111-0006: Machine Cube Editor, Multi-Level Cardboard Decks & Poles, Live Art-Style Switcher & Tunnel Conveyors

- **Date / Time Reference**: `2026-11-11 00:06`
- **Status**: `Pending Commit`

## 1. Summary
Implemented the full interactive **Wonder-Machine Cube & Add-on Editor Webpage**, decoupled **Sweet-Toy** vs. **Carnival Toy-Smarts Brain** concept packs, live 4-way **Art Style Switcher** (`Clay + Cardboard`, `Anime Toon + Ink Outlines`, `Glossy Vinyl`, `Blockout`), **Multi-Level Area-Drawn Cardboard Floors & Support Poles**, **Cardboard / Clay / Metal / Coloured Goo Economy Bar**, **4 Coloured Plush Teddy-Bear Player Characters**, and **Recessed Tunnel Conveyors** where items visibly emerge out of and vanish into machine connector mouths.

## 2. Key Changes & Architectural Decisions
- **Custom Cube & Add-on Machine Editor (`QFactoryCustomMachineStore`, `QFactoryCustomMachineMeshBuilder`, `QFactoryMachineDesigner`)**:
  - Supports clicking to add/remove clay cubes, dragging to reposition & resize cubes across Top (`XZ`) and Side (`XY`) views, attaching 9 animated add-on types (`gear`, `cog`, `robot-stamper`, `wire`, `light`, `button`, `lever`, `smokestack`, `awning`), placing `belt-in`/`belt-out` holes and `wire-in`/`wire-out` lugs, marking `frontSide`, and saving directly into the live 3D Factory registry.
- **Multi-Art-Style 3D Shader & Outline Pipeline (`QFactoryStyleMaterialLibrary`)**:
  - Cached materials for Claymation (`detailed`), 4-band cel-shaded `MeshToonMaterial` + `BackSide` ink outlines (`anime`), glossy candy toy (`vinyl`), and engineering framework (`blockout`).
- **Multi-Level Cardboard Floors & Support Poles (`QFactoryFloorPoleMath`, `QFactorySimManager`, `QFactory3DScene`)**:
  - `placeFoundationRect(..., levelIndex)` elevates decks (`levelIndex * 8.5m`), generates perimeter `poles[]` down to ground, resolves `findFoundationAt` to the highest `topY`, and routes sloped 3D belts across stories.
- **Craft Resource Bar & Coloured Goo Pools (`QFactoryEconomyManager`, `QFactoryResourceNodes`)**:
  - Tracks `cardboard`, `clay`, `metal`, and `coloredGoo`, with Ruby/Honey-Gold/Berry-Blue Coloured Goo pools feeding Sugars, Star Spices, and Toy-Smarts Curiosity Brains.
- **Conveyor Tunnel Inset & Item Appear/Vanish (`QFactoryBeltMath`, `QFactory3DScene`)**:
  - `withTunnelEnds(pts, 0.85)` extends belt tracks into dark recessed connector holes while `computeTunnelItemScale(progress)` smoothly scales items emerging from (`0 → 0.12`) and vanishing into (`0.88 → 1.0`) machines.

## 3. Affected Files
- [QFactoryTypes.ts](file:///f:/Dev/building-101-game/src/core/QFactoryTypes.ts)
- [QFactoryBeltMath.ts](file:///f:/Dev/building-101-game/src/core/QFactoryBeltMath.ts)
- [QFactoryFloorPoleMath.ts](file:///f:/Dev/building-101-game/src/core/QFactoryFloorPoleMath.ts)
- [QFactoryEconomyManager.ts](file:///f:/Dev/building-101-game/src/core/QFactoryEconomyManager.ts)
- [QFactoryCustomMachineStore.ts](file:///f:/Dev/building-101-game/src/core/QFactoryCustomMachineStore.ts)
- [QFactoryCustomMachineMeshBuilder.ts](file:///f:/Dev/building-101-game/src/core/QFactoryCustomMachineMeshBuilder.ts)
- [QFactoryStyleMaterialLibrary.ts](file:///f:/Dev/building-101-game/src/core/QFactoryStyleMaterialLibrary.ts)
- [QFactoryGooAndBrainItemBuilder.ts](file:///f:/Dev/building-101-game/src/core/QFactoryGooAndBrainItemBuilder.ts)
- [QFactoryToySweetItemBuilder.ts](file:///f:/Dev/building-101-game/src/core/QFactoryToySweetItemBuilder.ts)
- [QFactoryTeddyController.ts](file:///f:/Dev/building-101-game/src/core/QFactoryTeddyController.ts)
- [QFactoryTeddyBuilder.ts](file:///f:/Dev/building-101-game/src/core/QFactoryTeddyBuilder.ts)
- [QFactoryDioramaEnvironment.ts](file:///f:/Dev/building-101-game/src/core/QFactoryDioramaEnvironment.ts)
- [QFactoryDualModeBuilder.ts](file:///f:/Dev/building-101-game/src/core/QFactoryDualModeBuilder.ts)
- [QFactoryModelBuilder.ts](file:///f:/Dev/building-101-game/src/core/QFactoryModelBuilder.ts)
- [QFactory3DScene.ts](file:///f:/Dev/building-101-game/src/core/QFactory3DScene.ts)
- [QFactorySimManager.ts](file:///f:/Dev/building-101-game/src/core/QFactorySimManager.ts)
- [QFactoryStarterLineBuilder.ts](file:///f:/Dev/building-101-game/src/core/QFactoryStarterLineBuilder.ts)
- [QFactoryPlacementValidator.ts](file:///f:/Dev/building-101-game/src/core/QFactoryPlacementValidator.ts)
- [QFactoryPlacementHelper.ts](file:///f:/Dev/building-101-game/src/core/QFactoryPlacementHelper.ts)
- [useQFactoryInteraction.ts](file:///f:/Dev/building-101-game/src/hooks/useQFactoryInteraction.ts)
- [QFactoryMachineDesigner.tsx](file:///f:/Dev/building-101-game/src/components/QFactoryMachineDesigner.tsx)
- [QFactoryDesignerOrthoCanvas.tsx](file:///f:/Dev/building-101-game/src/components/QFactoryDesignerOrthoCanvas.tsx)
- [QFactoryDesignerPreview3D.tsx](file:///f:/Dev/building-101-game/src/components/QFactoryDesignerPreview3D.tsx)
- [QFactoryDesignerSidebar.tsx](file:///f:/Dev/building-101-game/src/components/QFactoryDesignerSidebar.tsx)
- [QFactoryTopResourceBar.tsx](file:///f:/Dev/building-101-game/src/components/QFactoryTopResourceBar.tsx)
- [QFactoryWorkshopPalette.tsx](file:///f:/Dev/building-101-game/src/components/QFactoryWorkshopPalette.tsx)
- [QFactory3DView.tsx](file:///f:/Dev/building-101-game/src/components/QFactory3DView.tsx)
- [QFactoryEditorLevelsAndStyles.test.ts](file:///f:/Dev/building-101-game/src/tests/QFactoryEditorLevelsAndStyles.test.ts)
- [QFactoryArtStylesAndCustomMesh.test.ts](file:///f:/Dev/building-101-game/src/tests/QFactoryArtStylesAndCustomMesh.test.ts)

## 4. Validation & Verification
- `pnpm run typecheck`: Passed (`0` errors).
- `pnpm test`: Passed (`6/6` test suites, `45/45` unit + performance tests passing).
- `pnpm build`: Passed (`dist/` built cleanly).

## 5. Commit Message Line
`- [2026-11-11 00:06] Machine Cube Editor, Multi-Level Cardboard Decks & Live Art Styles: add interactive cube/addon/connector machine designer, 2nd/3rd-level pole-supported cardboard floors, Clay/Anime/Vinyl/Blockout style switch, Coloured Goo economy, 4 coloured teddy bears, and tunnel conveyors`
