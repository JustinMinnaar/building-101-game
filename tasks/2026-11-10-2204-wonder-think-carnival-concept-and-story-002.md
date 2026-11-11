# TASK-20261110-2204: Wonder-Think! Carnival Claymation Brain Factory Concept & STORY-002

- **Date / Time Reference**: 2026-11-10 22:04:00 (+02:00)
- **Status**: `Committed` (`2a32213` on `2026-11-11 12:00`)
- **Related Stories**: [`STORY-002`](file:///f:/Dev/building-101-game/stories/story-002-wonder-think-carnival-brain-factory.md), [`STORY-001`](file:///f:/Dev/building-101-game/stories/story-001-machine-framework-and-visual-designer.md)

---

## Summary

Defined and canonized the ***Wonder-Think!* — Inside the Miracle Carnival Thinking Box** game concept, relaxed comedy sandbox mechanics, item taxonomy (`Smooth Brains`, `Wrinkled Brains`, `Guarded Brains`, `Shiny Tokens`, `Widgets`, `Wockets`, `Tings`, `Bings`, plus comedic basket byproducts), active walk-around `USER QUERY` → `ANSWER!` fulfillment loop, and **Grand Miracle Super-Brain** progression monument, backed by 7 custom stop-motion claymation cutaway concept artworks.

---

## Key Changes & Decisions

1. **Theme Pivot to *Wonder-Think!* (`STORY-002`)**:
   - Set inside "Professor Wonder's Miracle Thinking Computer", where the player is a blocky claymation AI robot running around a corrugated-cardboard & carnival midway factory.
   - Established a relaxed, zero-punishment sandbox comedy tone satirizing AI hype and public fear while robots earnestly build a lovable patchwork **Miracle Super-Brain**.
2. **First Playable Production Chain Aligned with Step 2**:
   - Updated Step 2 TDD plan to target the `Putty Vat` (`Smooth Brain`) → `Wrinkle-O-Matic Press` (`Wrinkled Brain` + `DUMB IDEAS` basket) → `Refusal Stamper` (`Guarded Brain` + `REFUSALS` basket) chain alongside the multi-mode `Widget/Wocket/Ting/Bing Calliope Maker` and `Query-to-Response Booth`.
3. **7 Custom Claymation Cutaway Concept Art Assets**:
   - Generated and stored 7 tabletop plasticine diorama references in [`docs/images/wonder-think/`](file:///f:/Dev/building-101-game/docs/images/wonder-think/) matching the dual-mode cutaway blueprint.

---

## Affected Files

- [`stories/story-002-wonder-think-carnival-brain-factory.md`](file:///f:/Dev/building-101-game/stories/story-002-wonder-think-carnival-brain-factory.md) (Created)
- [`stories/README.md`](file:///f:/Dev/building-101-game/stories/README.md) (Updated)
- [`README.md`](file:///f:/Dev/building-101-game/README.md) (Updated)
- [`tasks/plan-step-02-machine-json-schema-and-dual-visual-mode.md`](file:///f:/Dev/building-101-game/tasks/plan-step-02-machine-json-schema-and-dual-visual-mode.md) (Updated)
- [`docs/images/wonder-think/world-carnival-brainworks.jpg`](file:///f:/Dev/building-101-game/docs/images/wonder-think/world-carnival-brainworks.jpg) (Created)
- [`docs/images/wonder-think/machine-wrinkle-press.jpg`](file:///f:/Dev/building-101-game/docs/images/wonder-think/machine-wrinkle-press.jpg) (Created)
- [`docs/images/wonder-think/machine-hallucination-centrifuge.jpg`](file:///f:/Dev/building-101-game/docs/images/wonder-think/machine-hallucination-centrifuge.jpg) (Created)
- [`docs/images/wonder-think/machine-sycophant-glazer.jpg`](file:///f:/Dev/building-101-game/docs/images/wonder-think/machine-sycophant-glazer.jpg) (Created)
- [`docs/images/wonder-think/concept-prompt-response-booth.jpg`](file:///f:/Dev/building-101-game/docs/images/wonder-think/concept-prompt-response-booth.jpg) (Created)
- [`docs/images/wonder-think/concept-widget-wocket-maker.jpg`](file:///f:/Dev/building-101-game/docs/images/wonder-think/concept-widget-wocket-maker.jpg) (Created)
- [`docs/images/wonder-think/concept-super-brain-monument.jpg`](file:///f:/Dev/building-101-game/docs/images/wonder-think/concept-super-brain-monument.jpg) (Created)
- [`tasks/tasks.md`](file:///f:/Dev/building-101-game/tasks/tasks.md) (Updated)

---

## Validation & Verification

- `pnpm run typecheck` (`tsc --noEmit`): **Passed** (0 errors)
- `pnpm test` (`vitest run`): **Passed** (2 test suites, 22/22 tests passing in 660ms)

---

## Commit Message Line

`- [2026-11-10 22:04] Wonder-Think! Carnival Concept & STORY-002: canonize claymation Inside-the-Miracle-Computer brain/token/gizmo factory concept, 7 diorama art assets, and Step 2 machine chain`
