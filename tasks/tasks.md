# Building 101 — Master Task Registry & Implementation Plan

This document tracks all completed tasks, architectural specifications, and planned implementation phases for **Building 101**, following the strict Test-First Development (TDD) methodology defined in [`.agents/AGENTS.md`](file:///f:/Dev/building-101-game/.agents/AGENTS.md).

---

## 1. Planned Implementation Roadmap (Active Backlog)

| Phase / Step | Title & Scope | Story | Detailed Plan | Status |
|---|---|---|---|---|
| **Step 1** | Standalone `building-101-game` Extraction, Tailored AI Directives, `STORY-001` & Tasks Roadmap | [STORY-001](file:///f:/Dev/building-101-game/stories/story-001-machine-framework-and-visual-designer.md) | [2026-11-10-2145-standalone-bootstrap-and-story-001.md](file:///f:/Dev/building-101-game/tasks/2026-11-10-2145-standalone-bootstrap-and-story-001.md) | Completed (Pending Commit) |
| **Step 2** | Declarative `MachineDefinition` JSON Schema (*Teddy's Sweetshop & Wonder-Toy Factory*), Multi-Mode Mechanics, Smoke/Sign/Basket Systems, Playable Plush Teddy Avatar & Simple Blockout ↔ Clay Diorama Toggle | [STORY-001](file:///f:/Dev/building-101-game/stories/story-001-machine-framework-and-visual-designer.md), [STORY-003](file:///f:/Dev/building-101-game/stories/story-003-teddy-sweetshop-and-wonder-toy-factory.md) | [2026-11-10-2305-teddy-sweet-toy-prototype-and-clay-models.md](file:///f:/Dev/building-101-game/tasks/2026-11-10-2305-teddy-sweet-toy-prototype-and-clay-models.md) | Completed (Pending Commit) |
| **Step 3** | On-Demand Visual Machine Designer Webpage (Cube Frame Drag/Resize, Gears/Stamper/Wire/Lever Add-ons, Belt/Wire Connectors, Front Marker, Multi-Level Cardboard Floors + Poles, Economy & Art-Style Switcher) | [STORY-001](file:///f:/Dev/building-101-game/stories/story-001-machine-framework-and-visual-designer.md), [STORY-003](file:///f:/Dev/building-101-game/stories/story-003-teddy-sweetshop-and-wonder-toy-factory.md) | [2026-11-11-0006-machine-editor-styles-multilevel-and-tunnel-belts.md](file:///f:/Dev/building-101-game/tasks/2026-11-11-0006-machine-editor-styles-multilevel-and-tunnel-belts.md) | Completed (Pending Commit) |

---

## 2. Completed Task Registry

| Date / Time Reference | Task Slug / Identifier | Summary | Task Details | Status | Commit / Notes |
|---|---|---|---|---|---|
| 2026-11-10 21:45:00 | `standalone-bootstrap-and-story-001` | Extracted standalone `building-101-game` Three.js factory app, adapted `.agents/AGENTS.md`, documented `STORY-001`, and created Step 2 & Step 3 TDD task plans | [2026-11-10-2145-standalone-bootstrap-and-story-001.md](file:///f:/Dev/building-101-game/tasks/2026-11-10-2145-standalone-bootstrap-and-story-001.md) | Pending Commit | Pending initial git init / `'commit'` command |
| 2026-11-10 22:04:00 | `wonder-think-carnival-concept-and-story-002` | Canonized *Wonder-Think!* claymation carnival "Inside the Miracle Computer" game concept (`STORY-002`), Brains/Tokens/Widgets/Wockets/Tings/Bings taxonomy, Super-Brain goal, 7 concept art assets, and aligned Step 2 plan | [2026-11-10-2204-wonder-think-carnival-concept-and-story-002.md](file:///f:/Dev/building-101-game/tasks/2026-11-10-2204-wonder-think-carnival-concept-and-story-002.md) | Pending Commit | Parked as future concept |
| 2026-11-10 23:05:00 | `teddy-sweet-toy-prototype-and-clay-models` | Built playable *Teddy's Sweetshop & Wonder-Toy Factory* prototype (`STORY-003`): Sugar/Color River/Timber/Brass harvesting, Cogs/Wheels/Widgets/Sweets/Toys/Gift-Boxes crafting, `WASD` Plush Teddy-Bear avatar, and dual-mode Clay Diorama ↔ Blockout 3D builders | [2026-11-10-2305-teddy-sweet-toy-prototype-and-clay-models.md](file:///f:/Dev/building-101-game/tasks/2026-11-10-2305-teddy-sweet-toy-prototype-and-clay-models.md) | Pending Commit | 34/34 Vitest tests & `tsc` clean |
| 2026-11-11 00:06:00 | `machine-editor-styles-multilevel-and-tunnel-belts` | Built interactive Cube & Add-on Machine Editor webpage, 2nd/3rd-level pole-supported cardboard floors, Cardboard/Clay/Metal/Coloured Goo economy bar, Sweet-Toy ↔ Toy-Smarts Brain concept switch, Clay/Anime/Vinyl/Blockout 3D style switcher, 4 coloured teddy-bear players, and recessed tunnel conveyors | [2026-11-11-0006-machine-editor-styles-multilevel-and-tunnel-belts.md](file:///f:/Dev/building-101-game/tasks/2026-11-11-0006-machine-editor-styles-multilevel-and-tunnel-belts.md) | Pending Commit | 45/45 Vitest tests, `tsc` & `vite build` clean |
| 2026-11-11 11:59:00 | `git-setup-and-ai-instructions-alignment` | Initialized Git (`main`), expanded `.gitignore`, and aligned `.agents/AGENTS.md`, `.agents/memory/MEMORY.md`, and `docs/issues.md` with `Document-Vault-Manager` including the post-section `'commit'` & push protocol | [2026-11-11-1159-git-setup-and-ai-instructions-alignment.md](file:///f:/Dev/building-101-game/tasks/2026-11-11-1159-git-setup-and-ai-instructions-alignment.md) | Pending Commit | Ready for batch commit & push |
