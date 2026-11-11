# Building 101 (*Teddy's Sweetshop & Wonder-Toy Factory*)

**Building 101** is a standalone, joyful 3D tabletop automation, logistics, and machine-design game built with **React, TypeScript, Three.js, Vite, and Vitest** (architected for seamless `.glb` interoperability with **Godot 4**).

Run around a warm **Corrugated-Cardboard & Claymation Carnival Workshop** as a **fluffy plush Teddy-Bear** (`WASD` + `E`), harvesting **Sugar Crystals**, siphoning **Rainbow Dye** from the **Color River**, milling **Wooden Toy Wheels, Clockwork Brass Cogs, and Star Widgets**, assembling **Toy Trains, Spinning Tops, and Rockets**, and wrapping them into festive **Ribbon Gift Boxes**!

Separated cleanly from the `adventure1` VTT prototype, this repository focuses on:
1. **3D Sweetshop & Wonder-Toy Simulation**: Sugar/Timber/Brass patches, Rainbow Color River, multi-mode JSON machines with spin-up/spin-down inertia, roller conveyor belts, playable Teddy-Bear hand-feeding & basket scooping, and Deluxe Gift-Box wrapping.
2. **Dual-Visual-Mode Machine Architecture** (`[Style: Clay Diorama | Blockout]`):
   - **Simple Blockout Mode**: Lightweight color-coded boxes, connector ports, and socket markers for rapid factory layout testing (see [`docs/images/prototype-blockout-mode.jpg`](file:///f:/Dev/building-101-game/docs/images/prototype-blockout-mode.jpg)).
   - **Detailed Claymation Cutaway Mode**: Tactile plasticine cutaway housings, carnival striped awnings & marquee bulbs, whirring cog gears & articulated robotic arms, pooled `CanvasTexture` toothpick flags (`"EXTRA SPRINKLES"`, `"SPARE PARTS"`), visibly filling front baskets, cotton-wool smoke puffs, and fuzzy plush Teddy-Bears (see [`docs/images/teddy-sweet-toy-factory.jpg`](file:///f:/Dev/building-101-game/docs/images/teddy-sweet-toy-factory.jpg)).
3. **On-Demand Visual Machine Designer**: An integrated browser workspace (Top-Down, Side-On, End-On orthographic views with Mirror Symmetry + Live 3D Test Bench) to lay out machine frames, connectors, animations, and JSON mode properties before generating final 3D artwork.

---

## Quickstart Commands

```bash
pnpm install
pnpm dev          # Starts Vite dev server on http://localhost:3001
pnpm run typecheck # Runs strict TypeScript check (tsc --noEmit)
pnpm test         # Runs Vitest unit & performance test suites
pnpm build        # Production build
```

---

## Repository Navigation Map

- **AI Rules & Invariants**:
  - [`.agents/AGENTS.md`](file:///f:/Dev/building-101-game/.agents/AGENTS.md) (Core Architecture Directives, TDD, `'commit'` & Push Protocol, `'review'` & `'check performance'`)
  - [`.agents/memory/MEMORY.md`](file:///f:/Dev/building-101-game/.agents/memory/MEMORY.md)
- **Known & Resolved Issues**:
  - [`docs/issues.md`](file:///f:/Dev/building-101-game/docs/issues.md)
- **Stories & Feature Design**:
  - [`stories/README.md`](file:///f:/Dev/building-101-game/stories/README.md)
  - [`stories/story-001-machine-framework-and-visual-designer.md`](file:///f:/Dev/building-101-game/stories/story-001-machine-framework-and-visual-designer.md)
  - [`stories/story-003-teddy-sweetshop-and-wonder-toy-factory.md`](file:///f:/Dev/building-101-game/stories/story-003-teddy-sweetshop-and-wonder-toy-factory.md) (Active Theme & Prototype)
  - [`stories/story-002-wonder-think-carnival-brain-factory.md`](file:///f:/Dev/building-101-game/stories/story-002-wonder-think-carnival-brain-factory.md) (Parked Future Idea)
- **3D Asset & Rendering Architecture**:
  - [`docs/3d-machine-asset-pipeline.md`](file:///f:/Dev/building-101-game/docs/3d-machine-asset-pipeline.md)
- **Tasks & Planned Execution Roadmap**:
  - [`tasks/tasks.md`](file:///f:/Dev/building-101-game/tasks/tasks.md) (Master Task Registry + Planned Steps 2 & 3)
  - [`tasks/plan-step-02-machine-json-schema-and-dual-visual-mode.md`](file:///f:/Dev/building-101-game/tasks/plan-step-02-machine-json-schema-and-dual-visual-mode.md)
  - [`tasks/plan-step-03-on-demand-visual-machine-designer.md`](file:///f:/Dev/building-101-game/tasks/plan-step-03-on-demand-visual-machine-designer.md)
