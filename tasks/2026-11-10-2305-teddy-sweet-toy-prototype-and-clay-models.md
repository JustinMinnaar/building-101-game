# TASK-20261110-2305: Teddy's Sweetshop & Wonder-Toy Factory Playable Prototype & Claymation 3D Diorama Pipeline

- **Date / Time Reference**: 2026-11-10 23:05:00 (+02:00)
- **Status**: `Committed` (`2a32213` on `2026-11-11 12:00`)
- **Related Stories**: [`STORY-003`](file:///f:/Dev/building-101-game/stories/story-003-teddy-sweetshop-and-wonder-toy-factory.md), [`STORY-001`](file:///f:/Dev/building-101-game/stories/story-001-machine-framework-and-visual-designer.md)

---

## Summary

Implemented the first playable 3D prototype of **Teddy's Sweetshop & Wonder-Toy Factory** using strict Test-First Development (TDD): harvesting Sugar Crystals, siphoning Rainbow Dye from the Color River, milling Toy Wheels, Clockwork Cogs, and Star Widgets, assembling Toy Trains/Spinning Tops/Rockets, and wrapping them into Ribbon Gift Boxes—complete with a playable `WASD` Fluffy Plush Teddy-Bear character and a live `[Clay Diorama ↔ Blockout]` dual-mode 3D model builder matching the stop-motion claymation cutaway artwork.

---

## Key Changes & Decisions

1. **Data-Driven `MachineDefinition` JSON System & Multi-Ingredient Simulation**:
   - Created fail-fast validator & O(1) registry ([`QFactoryMachineSchema.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryMachineSchema.ts), [`QFactoryMachineRegistry.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryMachineRegistry.ts)) and 6 machine JSON specs (`sugar-harvester`, `color-extractor`, `sweet-maker`, `part-lathe`, `toy-assembler`, `gift-wrapper`).
   - Built [`QFactoryWorkshopStep.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryWorkshopStep.ts) supporting continuous `spinUpSec`/`spinDownSec` velocity ramping, multi-ingredient recipes, byproduct basket filling (`EXTRA SPRINKLES`, `SPARE PARTS`, `RIBBON BOWS`), and Gift-Box tallying.
2. **Playable Fluffy Plush Teddy-Bear Avatar**:
   - Built [`QFactoryTeddyController.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryTeddyController.ts) and [`QFactoryTeddyBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryTeddyBuilder.ts) for `WASD` tabletop walking, `[E]` basket scooping, and inspector hand-feeding (zero block/starburst mascots).
3. **3D Claymation Cutaway Model Pipeline (`< 3,500 tris` per machine)**:
   - Built [`QFactoryClayMaterialLibrary.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryClayMaterialLibrary.ts) (cached procedural thumbprint-clay & fuzzy plush fur bump textures), [`QFactoryCutawayShellBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryCutawayShellBuilder.ts) (beveled `ExtrudeGeometry` open-window housings, striped marquee awnings, bunting & brass stacks), [`QFactoryCutawayInteriorBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryCutawayInteriorBuilder.ts) (meshed cog gears, spline wires, 2-joint robotic arms), [`QFactoryBasketAndSignBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryBasketAndSignBuilder.ts) (filling baskets, pooled `CanvasTexture` toothpick flags, side-roller belts), [`QFactorySmokeSystem.ts`](file:///f:/Dev/building-101-game/src/core/QFactorySmokeSystem.ts) (instanced cotton-wool steam puffs), and [`QFactoryDioramaEnvironment.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryDioramaEnvironment.ts) (warm butterscotch studio, Rainbow Color River, cardboard decks).
4. **Thematic Workshop UI**:
   - Added [`QFactoryWorkshopPalette.tsx`](file:///f:/Dev/building-101-game/src/components/QFactoryWorkshopPalette.tsx) and upgraded [`QFactoryMachineInspector.tsx`](file:///f:/Dev/building-101-game/src/components/QFactoryMachineInspector.tsx) and [`QFactory3DView.tsx`](file:///f:/Dev/building-101-game/src/components/QFactory3DView.tsx) with recipe switching, basket scooping, Teddy hand-feeding, and `[Style: Clay Diorama | Blockout]` live switching.

---

## Affected Files

- [`src/core/QFactoryMachineSchema.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryMachineSchema.ts) (Created)
- [`src/core/QFactoryMachineRegistry.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryMachineRegistry.ts) (Created)
- [`src/core/QFactoryWorkshopStep.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryWorkshopStep.ts) (Created)
- [`src/core/QFactoryTeddyController.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryTeddyController.ts) (Created)
- [`src/core/QFactoryClayMaterialLibrary.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryClayMaterialLibrary.ts) (Created)
- [`src/core/QFactoryCutawayShellBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryCutawayShellBuilder.ts) (Created)
- [`src/core/QFactoryCutawayInteriorBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryCutawayInteriorBuilder.ts) (Created)
- [`src/core/QFactoryBasketAndSignBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryBasketAndSignBuilder.ts) (Created)
- [`src/core/QFactoryTeddyBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryTeddyBuilder.ts) (Created)
- [`src/core/QFactoryToySweetItemBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryToySweetItemBuilder.ts) (Created)
- [`src/core/QFactoryDualModeBuilder.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryDualModeBuilder.ts) (Created)
- [`src/core/QFactorySmokeSystem.ts`](file:///f:/Dev/building-101-game/src/core/QFactorySmokeSystem.ts) (Created)
- [`src/core/QFactoryDioramaEnvironment.ts`](file:///f:/Dev/building-101-game/src/core/QFactoryDioramaEnvironment.ts) (Created)
- [`src/data/machines/sugar-harvester.json`](file:///f:/Dev/building-101-game/src/data/machines/sugar-harvester.json) (Created)
- [`src/data/machines/color-extractor.json`](file:///f:/Dev/building-101-game/src/data/machines/color-extractor.json) (Created)
- [`src/data/machines/sweet-maker.json`](file:///f:/Dev/building-101-game/src/data/machines/sweet-maker.json) (Created)
- [`src/data/machines/part-lathe.json`](file:///f:/Dev/building-101-game/src/data/machines/part-lathe.json) (Created)
- [`src/data/machines/toy-assembler.json`](file:///f:/Dev/building-101-game/src/data/machines/toy-assembler.json) (Created)
- [`src/data/machines/gift-wrapper.json`](file:///f:/Dev/building-101-game/src/data/machines/gift-wrapper.json) (Created)
- [`src/components/QFactoryWorkshopPalette.tsx`](file:///f:/Dev/building-101-game/src/components/QFactoryWorkshopPalette.tsx) (Created)
- [`src/components/QFactoryMachineInspector.tsx`](file:///f:/Dev/building-101-game/src/components/QFactoryMachineInspector.tsx) (Updated)
- [`src/components/QFactory3DView.tsx`](file:///f:/Dev/building-101-game/src/components/QFactory3DView.tsx) (Updated)
- [`src/core/QFactory3DScene.ts`](file:///f:/Dev/building-101-game/src/core/QFactory3DScene.ts) (Updated)
- [`src/tests/QFactoryToySweetSim.test.ts`](file:///f:/Dev/building-101-game/src/tests/QFactoryToySweetSim.test.ts) (Created)
- [`src/tests/QFactoryClayDioramaBuilder.test.ts`](file:///f:/Dev/building-101-game/src/tests/QFactoryClayDioramaBuilder.test.ts) (Created)
- [`stories/story-003-teddy-sweetshop-and-wonder-toy-factory.md`](file:///f:/Dev/building-101-game/stories/story-003-teddy-sweetshop-and-wonder-toy-factory.md) (Created)

---

## Validation & Verification

- `pnpm run typecheck` (`tsc --noEmit`): **Passed** (0 errors)
- `pnpm test` (`vitest run`): **Passed** (4 test suites, 34/34 unit & performance tests passing in 217ms)
- `pnpm build` (`tsc && vite build`): **Passed** (clean production bundle in 1.97s)

---

## Commit Message Line

`- [2026-11-10 23:05] Teddy's Sweetshop & Wonder-Toy Factory Prototype: implement playable Sugar/Color/Cog/Wheel/Widget/Toy/Gift-Box simulation, WASD plush Teddy-Bear avatar, and dual-mode claymation cutaway 3D model builder`
