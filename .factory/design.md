# Bench Bin BOM — visual thesis

## Direction: paper-cut workbench diorama

Bench Bin BOM is about a small physical ritual: lay out the project card, open
drawers, and pull what is needed. The UI treats that moment as a layered paper
diorama rather than a warehouse dashboard. Project paper sits over a deep ink
bench; bins are cut-out leaves with visible offset shadows. This makes the
comparison feel tactile and personal without pretending that hobby inventory is
an ERP.

## Tokens

- **Bench ink:** `#172A3A` (background), a midnight blue-green that recalls a
  rubber work mat.
- **Paper:** `#FFF8E9` (surface) and `#F2E7D0` (surface-muted), warm stock card.
- **Graphite:** `#172A3A` (text), `#455866` (muted) — 7:1+ against paper.
- **Cut edge:** `#E29A4A` (accent), `#AD4D38` (warning), `#177A66` (ready), all
  paired with labels and icons.
- **Spacing:** 4px base; 8, 12, 16, 24, 32, 48; generous 24px panels mimic
  separated paper pieces.
- **Type:** `Georgia` for project headings (a familiar field notebook voice),
  `ui-monospace` for quantities, bins and BOM values. Both are local system
  fonts, so no third-party type request or font payload is needed.

## Interaction and motion

Cards lift by 2px and cast a closer paper shadow only while hovered/focused.
Dialogs enter with a 180ms opacity/translate transition. Removing a record
offers a six-second Undo toast. When reduced motion is requested, all movement
is removed; state is communicated with immediate color and text changes.

## Illustration plan and provenance

The landing illustration is an original generated collage of labelled-free
component drawers, a folded project list, and loose electronic parts. It
clarifies the “compare before you buy” promise. Generated 2026-08-28 using the
factory Azure image deployment via `/opt/fleet/lib/gen-image.sh`; no third-party
asset, brand, logo, text, or watermark is permitted. Source prompt is kept in
`assets/src/bench-diorama.prompt.json`; the shipping image is optimized WebP.
