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
Dialogs use the browser's native focus-managed opening. Removing a record
offers an Undo toast until the next action. When reduced motion is requested,
all movement is removed; state uses immediate color and text changes.

The demo opens with a compact paper pull card above the stock list. Its green
and red stamped results are computed from the sample data, so a phone viewport
shows the real task without replacing the tactile workbench identity.

## Color-mode policy

This product intentionally uses one explicitly painted treatment. Warm paper
against a dark rubber work mat is the core physical metaphor, and switching the
paper to a luminous dark surface would weaken stock-card legibility. Every
route paints both foreground and background colors, so it does not inherit an
uncontrolled browser light or dark canvas. Contrast remains at least 4.5:1.

## Illustration plan and provenance

The landing illustration is an original generated collage of labelled-free
component drawers, a folded project list, and loose electronic parts. It
clarifies the “compare before you buy” promise. Generated 2026-08-28 using the
factory Azure image deployment via `/opt/fleet/lib/gen-image.sh`; no third-party
asset, brand, logo, text, or watermark is permitted. Source prompt is kept in
`assets/src/bench-diorama.prompt.json`; the shipping image is optimized WebP.

The 1200×630 social card is a center crop of that generated source, created
locally with ImageMagick on 2026-08-29. The three walkthrough images are direct
Playwright captures of the shipped demo at 1200×750, stored in
`assets/src/walkthrough-*.png` and reduced to WebP for the landing page. They
contain only this product's interface and sample data. No third-party visual
asset was added during the repair.
