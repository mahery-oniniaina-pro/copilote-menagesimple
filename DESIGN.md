---
name: Copilote · registre des plis
description: A support copilot drawn as a register of Swiss registered-mail envelopes whose drafts are printer's proofs annotated in blue pencil.
colors:
  sheet: "#ffffff"
  ground: "#e9ede4"
  ink-50: "#f1f3ee"
  ink-100: "#dfe3d9"
  ink-150: "#d3d8cc"
  ink-200: "#cdd0c9"
  ink-300: "#b0b3ac"
  ink-400: "#7c8077"
  ink-500: "#5d6159"
  ink-600: "#50534d"
  ink-700: "#383a36"
  ink-900: "#141613"
  signal: "#f2c230"
  signal-soft: "#fcf1cc"
  pencil: "#2652cc"
  pencil-soft: "#e9eefc"
  ok: "#22704d"
  ok-soft: "#e2f1e9"
  errata: "#c2361f"
  errata-soft: "#fbe8e3"
typography:
  headline:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title-sm:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  section:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  body-sm:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.375
  button:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 500
    lineHeight: 1.5
  proof:
    fontFamily: "Source Serif 4, ui-serif, Georgia, serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.8
  quote:
    fontFamily: "Source Serif 4, ui-serif, Georgia, serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  code:
    fontFamily: "Geist Mono, ui-monospace, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  stamp:
    fontFamily: "Geist Mono, ui-monospace, Menlo, monospace"
    fontSize: "9.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.06em"
rounded:
  mark: "2px"
  label: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  full: "9999px"
spacing:
  hair: "4px"
  gap: "8px"
  inset: "12px"
  gutter: "16px"
  card: "20px"
  block: "24px"
  page: "32px"
components:
  button-sign:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.sheet}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-sign-hover:
    backgroundColor: "{colors.ink-700}"
  button-handoff:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink-900}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-handoff-quiet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-900}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-handoff-quiet-hover:
    backgroundColor: "{colors.signal-soft}"
  button-outline:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-900}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-outline-hover:
    backgroundColor: "{colors.ink-50}"
  button-ghost:
    textColor: "{colors.ink-600}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  button-ghost-hover:
    backgroundColor: "{colors.ink-50}"
  button-pencil:
    textColor: "{colors.pencil}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  button-pencil-hover:
    backgroundColor: "{colors.pencil-soft}"
  chip-filter:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-600}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  chip-filter-active:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-ready:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok}"
    rounded: "{rounded.sm}"
    padding: "1px 6px"
  badge-review:
    backgroundColor: "{colors.errata-soft}"
    textColor: "{colors.errata}"
    rounded: "{rounded.sm}"
    padding: "1px 6px"
  badge-handoff:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.sm}"
    padding: "1px 6px"
  badge-archive:
    backgroundColor: "{colors.ink-50}"
    textColor: "{colors.ink-600}"
    rounded: "{rounded.sm}"
    padding: "1px 6px"
  tag-urgent:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.sheet}"
    typography: "{typography.stamp}"
    rounded: "{rounded.sm}"
    padding: "1px 4px"
  registry-row:
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
  registry-row-selected:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
  tracking-label:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-900}"
    typography: "{typography.code}"
    rounded: "{rounded.label}"
  proof-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-900}"
    typography: "{typography.proof}"
    rounded: "{rounded.lg}"
    padding: "24px 28px"
  proof-edit:
    backgroundColor: "{colors.pencil-soft}"
    textColor: "{colors.ink-900}"
    typography: "{typography.proof}"
    rounded: "{rounded.md}"
    padding: "16px"
  input-composer:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  stamp-signed:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ok}"
    typography: "{typography.stamp}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  stamp-handed-off:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink-900}"
    typography: "{typography.stamp}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  errata-note:
    backgroundColor: "{colors.errata-soft}"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  toast:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  rail-item:
    textColor: "{colors.ink-500}"
    rounded: "{rounded.lg}"
    padding: "10px 0"
  rail-item-active:
    backgroundColor: "{colors.ink-50}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
    padding: "10px 0"
---

# Design System: Copilote · registre des plis

## Overview

**Creative North Star: "The Registered Proof"**

Every customer message is a *pli recommandé*: it carries a tracking label with a barcode, moves along a five-step tracking line, and only leaves with a human signature. The reply inside it is a printer's proof: a perforated white sheet set in a serif, where every sourced figure is underlined in blue pencil and keyed to a numbered note in the margin. The register (list, chrome, controls) is a cool grey-green paper; the proof is the only true white surface and the only lifted one.

The system is dense and quiet, built for an agent who triages all day and a newcomer who must understand it in seconds. Hierarchy comes from typeface changes (grotesk for the register, serif for the proof, mono for anything stamped) and from fine rules, not from colour or size jumps. Colour is reserved for state, four hues with one job each. Postal objects (label, tracking rule, stamps, outline buttons) are drawn with a heavier 1.5px ink stroke so they read as printed forms, not as cards.

The direction rejects the generic grey three-column support inbox (neutral greys, one indigo accent, soft cards). The three panes exist; what keeps them out of that genre is the paper ground, the proof sheet, the postal strokes and the state-only colour.

**Key Characteristics:**
- Grey-green paper ground (`ground`), white only for the proof and for cards that hold content.
- One green-tinted ink ramp for all neutrals; four state hues (signal, pencil, ok, errata), each with a `-soft` wash.
- Three faces with fixed roles: Schibsted Grotesk (UI), Source Serif 4 (proof and quotations), Geist Mono (codes, times, counts, URLs, stamps).
- Explicit pixel type sizes in half-pixel steps, 9.5px to 26px; no fluid type.
- 1px hairlines for structure, 1.5px ink strokes for postal objects, 2px for pencil underlines and stamps.
- Single-key keyboard operation of the register (J/K, S, T, N).

**Divergences from the direction contract (recorded, not canonized):**
- The rail's "RR" monogram is filled with signal yellow although it is not a human action.
- The "Copier" ghost button in the proof's action bar copies the draft to the clipboard without signing or stamping it.
- Proof-to-margin click linking fails in the three-column layout: `Margin` is rendered twice (an `xl:hidden` copy under the proof, then the aside), both emit `id="note-N"`, and `getElementById` resolves to the hidden copy, so `scrollIntoView` does nothing at ≥1280px. Margin-to-proof highlighting is mouse-only (note rows are not focusable).
- Pencil blue extends beyond sources: it is also the global focus ring, text selection, caret, the "Modifier" control and the draft editor.
- The "Reçu le 05.11.26" date stamp is hard-coded for every pli, including messages typed in the composer; the barcode is a deterministic hash of the code, not an encoding.

## Colors

A cool, green-tinted neutral ramp on grey-green paper, with four saturated state inks used sparingly.

### Primary
- **Signal Yellow** (`signal`): a human must act. The waiting step of the tracking line, the "À transmettre" badge and registry mark (with a 1px ink ring), the "Transmettre à l'équipe" button when hand-off is the expected action, and the "Transmis" stamp. Text on signal is always ink-900 (10.9:1); filled shapes carry an ink-900 border or ring.
- **Signal Wash** (`signal-soft`): hover state of the quiet "Transmettre" button only.

### Secondary
- **Blue Pencil** (`pencil`): sources and verification. The 2px underline under sourced figures, superscript note numbers, margin note numbers, every source URL, the "Modifier" control, the draft editor border, focus ring, caret and selection text. 6.6:1 on sheet.
- **Pencil Wash** (`pencil-soft`): the active note highlight (proof segment and margin row together), text selection background, the editor fill (at 40%), hover of pencil controls.

### Tertiary
- **Green Ink** (`ok`) and **Green Wash** (`ok-soft`): ready and signed. "Prêt à relire et signer" badge, passed-check circles, the "Signé · bon à envoyer" stamp, passing cells on the test bench.
- **Vermilion** (`errata`) and **Vermilion Wash** (`errata-soft`): failure and contradiction. "À revoir" badge, failed-check circles, errata slips and stamps, failed test-bench cells (struck-through id on a 60% wash), form errors. 4.6:1 on its wash.

### Neutral
- **Register Paper** (`ground`): page background, header, panes, the composer field (at 60%).
- **Proof White** (`sheet`): the proof, content cards, the rail, selected registry row, filter chips (at 70%), inverse text on ink.
- **Ink ramp** (`ink-50` to `ink-900`, green-tinted): `ink-900` text, active fills, postal strokes; `ink-700` secondary body; `ink-600` muted body and ghost controls; `ink-500` metadata, the lightest text tone (5.3:1 on ground); `ink-400`/`ink-300` bullets, separators, outline tags only; `ink-200` control borders; `ink-150` pane and card borders; `ink-100` rules inside cards; `ink-50` hover and active wash.

### Named Rules
**The State-Only Rule.** Colour carries state, never decoration. Anything that is not signal, pencil, ok or errata is drawn from the ink ramp.

**The Yellow Hand Rule.** Signal yellow means "waiting for a person". If nobody has to act, it is not yellow.

**The Never-Alone Rule.** A status colour always travels with a text label or an icon: registry mark plus label, check or cross in the circle, struck-through id on the bench, "en attente de vous" beside the yellow dot.

## Typography

**Display Font:** Schibsted Grotesk (with ui-sans-serif, system-ui)
**Body Font:** Schibsted Grotesk for the register; Source Serif 4 (with ui-serif, Georgia) for the proof and site quotations
**Label/Mono Font:** Geist Mono (with ui-monospace, Menlo)

**Character:** A sturdy newspaper grotesk runs the register, a bookish serif sets only what the customer will read or what the website literally says, and a mono stamps every code, time and count. `html` sets `font-feature-settings: "ss01", "cv11"`; `.tabular` adds tabular numerals wherever figures align.

### Hierarchy
- **Headline** (600, 26px, 1.25, -0.02em): page titles on Banc d'essai, Errata, Méthode.
- **Title** (600, 22px, 1.25, -0.015em, `text-wrap: balance`): the pli summary above the tracking line. Méthode section heads use 18px/-0.01em.
- **Title-sm** (600, 17px, -0.01em): the workspace header "Registre des plis".
- **Section** (600, 13px): proof header, margin section heads, composer label, table captions.
- **Body** (400, 15px, 1.625, max 62 to 74ch): reading pages. The customer message uses 15.5px.
- **Body-sm** (400, 13 to 13.5px, 1.375): registry excerpts, margin text, checks, welcome banner.
- **Label** (500, 12 to 12.5px): badges, chips, tracking labels, metadata; 11.5px for tracking details.
- **Proof** (Source Serif 4, 400, 16.5px, 1.8, `pre-wrap`): the draft. 1.7 in the editor; 15px/1.7 in bench previews.
- **Quote** (Source Serif 4, 400, 15px, 1.6): site quotations on Errata; 13.5px italic in the margin, always inside « ».
- **Code** (Geist Mono, 400, 10.5 to 13px, tabular): tracking codes, times, counts, URLs, kbd hints, note numbers (10 to 11px, 500, pencil).
- **Stamp** (Geist Mono, uppercase, 0.06em, 9.5 to 12px): priority tags, errata ids, the date stamp, the signature stamp, the RR monogram.

### Named Rules
**The Three Hands Rule.** Grotesk is the register, serif is the proof, mono is the rubber stamp. Never set UI chrome in the serif or running text in the mono.

**The Stamp Case Rule.** Uppercase appears only through the mono stamp style, and only on postal marks that carry data (priority, errata id, decision, date).

## Layout

App shell: a rail plus a content column. Below 768px the rail becomes a fixed 64px bottom tab bar and content gets 64px bottom padding.

Workspace grid (home):
- **<768px:** one column, list/detail toggle. Opening a pli hides the list, header title, filters and composer button and shows "← Tous les plis"; the margin stacks under the proof (32px gap). Filter chips scroll horizontally edge to edge.
- **768px to 1279px:** registry (290 to 350px) | open pli. The workspace is `100dvh` and each pane scrolls on its own; the margin still stacks under the proof.
- **≥1280px:** registry (300 to 350px) | open pli | margin aside (290 to 340px), separated by 1px `ink-150` rules.

The open pli is a centred column, max 760px, 16px gutters (32px at ≥768px). Vertical rhythm inside a pli: 20px after the header, 24px after the tracking box and after the message, then the proof. The action bar is sticky to the bottom of the pane at ≥768px.

Reading pages (Banc d'essai, Errata, Méthode): centred, max 1040px (1120px for the bench), 16/32px gutters, 24/40px top padding, intro paragraphs capped at 68 to 74ch.

Breakpoints are Tailwind defaults: 640px (horizontal tracking line, button labels, ⌘ Entrée hint), 768px (rail, two panes), 1024px (kbd hints in buttons, two comparison tables side by side), 1280px (margin aside, 20-column bench grid).

Spacing is the 4px Tailwind scale. Recurring steps: 8px between controls, 12px inset, 16px mobile gutter, 20px card and margin-section padding, 24px block gap, 32px desktop gutter.

### Named Rules
**The Pane Rule.** At ≥768px the page never scrolls; panes do. A selected registry row is scrolled into view inside its own pane with 8px of slack.

## Elevation & Depth

Depth is tonal first: white sheets on grey-green paper, separated by hairlines. Three shadows exist, all tinted with ink-900 and pulled in with negative spread so they read as paper resting on paper.

### Shadow Vocabulary
- **Proof lift** (`box-shadow: 0 1px 0 rgb(20 22 19 / 0.04), 0 12px 32px -18px rgb(20 22 19 / 0.25)`): the proof sheet only.
- **Selected row** (`box-shadow: 0 6px 18px -12px rgb(20 22 19 / 0.35)`): the selected registry row.
- **Toast** (`box-shadow: 0 8px 24px -8px rgb(20 22 19 / 0.45)`): the transient confirmation pill.

### Named Rules
**The One Sheet Rule.** The proof is the only resting surface with a shadow. Cards, panels, tables and the margin are flat, bordered with `ink-150`.

## Shapes

Corners are small and functional: 2px on pencil highlights and registry marks, 3px on the tracking label, 4px on badges, tags and ghost controls, 6px on buttons, inputs, stamps and errata notes, 8px on cards, registry rows, the tracking box and the proof. Pills (9999px) only for filter chips, the toast, check circles, step dots and the date stamp.

Stroke weights carry meaning: 1px for structure, 1.5px `ink-900` for postal objects (tracking label, tracking rule and dots, outline buttons, composer frame, rail monogram, errata page stamp), 2px for pencil underlines and decision stamps. Dashed `ink-300` marks the "no reply" box of an archived pli.

The proof's top edge is perforated: a 10px band of 3.2px-radius semicircles in the ground colour, repeating every 14px (`.perforated::before`), so the top corners stay square and only the bottom corners round (8px). Bench previews reuse the perforation. Stamps are rotated: the decision stamp settles at -5deg, the date stamp at -2deg.

## Components

All controls are hand-built buttons and links styled with Tailwind; the Radix dependency is not used by the UI. Icons are Lucide: 16px in buttons (stroke 1.8), 14px in ghost controls, 12px in check circles and external links (stroke 2.5 for check and cross), 19px in the rail (stroke 2 active, 1.6 idle).

### Buttons
- **Shape:** 6px corners, 13.5px medium text, 8px × 14px padding, icon + label + mono kbd hint (≥1024px, 60% opacity).
- **Sign ("Signer et copier"):** ink-900 fill, sheet text, hover ink-700. Becomes the outline style (1.5px ink-900 border on sheet, hover ink-50) when the pli is "À transmettre".
- **Hand-off ("Transmettre à l'équipe"):** 1.5px ink-900 border always. Signal fill with hover `brightness(0.95)` when the pli is "À transmettre"; otherwise sheet fill with signal-soft hover.
- **Order:** the expected action comes first. Hand-off then sign for "À transmettre", sign then hand-off otherwise. An archived pli offers hand-off only.
- **Outline ("Essayer un message"):** 1.5px ink-900 border, sheet, 13px, 6px × 12px; label hidden below 640px.
- **Ghost ("Copier", "Annuler", close):** ink-600 text, 4px corners, hover ink-50. "Copier" swaps to a check and "Copié" for 1.5s.
- **Pencil ("Modifier" / "Terminer"):** pencil text, hover pencil-soft; toggles the draft editor.
- **Focus:** global `:focus-visible` 2px pencil outline, 2px offset, 4px radius. Colour transitions use Tailwind's 150ms default.

### Chips (status filters)
- **Style:** pill, 1px border, 4px × 10px, 12.5px text, mono count (11px, tabular). Idle: sheet at 70%, ink-200 border, ink-600 text, hover ink-300 border and ink-900 text.
- **State:** active is ink-900 fill, sheet text, ink-200 count. `aria-pressed`; grouped in a `role="toolbar"`.

### Status badges and marks
- **Badge:** 4px corners, 1px border, 1px × 6px, 12px medium, long label ("Prêt à relire et signer"). Tones: ok on ok-soft (ok/30 border), errata on errata-soft (errata/40), ink-900 on signal (ink-900 border), ink-600 on ink-50 (ink-200).
- **Registry mark:** 8px square, 2px corners, solid tone; signal gets a 1px ink-900 ring. Always followed by the short label.
- **Priority tags:** stamp style. "Urgent" ink-900 fill with sheet text; "Prioritaire" 1px ink-400 outline with ink-600 text.

### Registry rows (cards)
- **Corner Style:** 8px. **Border:** 1px transparent; selected ink-900.
- **Background:** transparent on ground, hover sheet at 60%, selected sheet with the selected-row shadow and a semibold summary.
- **Content:** mono line (code in ink-700, tags, time right-aligned) / summary 14px medium, one line / excerpt 13px ink-500, two lines / mark + status + "·" + group in 12px.
- **Decided rows** drop to 75% opacity and show the decision (Signé, Transmis) instead of the status. Rows are separated by `ink-150` at 70%. A mono shortcut legend sits under the list at ≥768px.

### Inputs / Fields
- **Composer:** a 1.5px ink-900 framed sheet card (8px corners, 12px padding) that slides in at the top of the registry. Textarea on ground at 60%, 1px ink-200 border, 6px corners, 14px/1.625; focus turns the border pencil (no outline). Error text 12.5px errata. While pending, the submit button cycles its label through the three stages every 1.4s and goes ink-600 with a progress cursor.
- **Draft editor:** replaces the proof text in place; Source Serif 4 16.5px/1.7, pencil/50 border, pencil-soft at 40% fill, focus border pencil.

### Navigation (rail)
- **≥768px:** 76px sheet column, `ink-150` right rule. A 44px signal-filled monogram with a 1.5px ink border sits on top. Items stack icon over an 11px label, 8px corners, 10px vertical padding. Active: ink-900 text, ink-50 fill, medium label, `aria-current="page"`. Idle: ink-500, hover ink-900 on ink-50.
- **<768px:** fixed bottom bar, 64px, four equal items, monogram hidden.

### Tracking label (signature)
Inline label with a 1.5px ink-900 border and 3px corners. Left cell: ink-900 block with "RR" in sheet mono (11px, 0.08em). Right cell: a 16px-tall barcode of 15 bars (1 to 3px wide, derived from the code) over the code in 10.5px mono, 0.06em, tabular.

### Tracking line (signature)
Five steps in an 8px-corner box with an ink-200 border: Reçu (time), Lu sans IA (language), Rédigé (provider, seconds), Contrôlé (n checks of m), then the final step (Signature / À transmettre / À revoir "en attente de vous", Classé, or the decision "par vous" / "à l'équipe"). Each step is a 10px dot (1.5px ink-900 border; ink-900 fill when done, signal fill when waiting on a person) joined by a 1.5px ink-900 rule. Labels 12.5px medium, details 11.5px ink-500. At ≥640px it runs horizontally, minimum 92px per step; the "Rédigé" step grows with model time (`flex-grow: 1 + min(ms / 2500, 5)`) and the last step is right-aligned. Below 640px it becomes a vertical list with the rule running down the left. The Méthode page reuses the same dot-and-rule vocabulary for its four-step strip, with the last (human) dot in signal.

### Proof (signature)
White sheet with an `ink-150` border, perforated top, 8px bottom corners and the proof lift. Header row (13px semibold title, 12px provider "· à relire", pencil "Modifier" at the right) over an `ink-100` rule. Body padding 20px (24px × 28px at ≥768px) in the proof serif.
- **Pencil marks:** every sourced figure is a button with a 2px pencil underline at the baseline and a mono superscript note number in pencil, `cursor: help`, with an accessible label "figure, source n".
- **Linking:** hovering or focusing a mark sets the active note; the mark and its margin row both take a pencil-soft wash. Clicking scrolls the matching margin note (`#note-n`) into view. Hovering a margin note highlights the mark in the proof.
- **Action bar:** sheet, `ink-100` top rule, sticky at the pane bottom at ≥768px. After a decision it shows a one-line receipt and a ghost "Annuler".
- **Archived pli:** no proof; a dashed ink-300 box explains why, with hand-off only.

### Decision stamp (signature)
Two-line mono stamp, top-right of the proof body (16px from the top, 20px from the right), 2px border, 6px corners, 6px × 12px. Signed: ok border and text on sheet at 80%, "SIGNÉ / BON À ENVOYER". Handed off: ink-900 border on signal at 90%, "TRANSMIS / À L'ÉQUIPE". It enters with `stamp-in` and is `aria-hidden`; the action bar receipt carries the information in text.

### Margin
Stacked sections (20px padding, `ink-100` rules, 13px semibold heads): "Contrôles faits sans IA" (18px check or cross circle on its wash, label, 12.5px ink-500 detail), "Sources en marge" (numbered pencil notes: statement, italic serif quote in « », mono pencil URL with external-link icon; unnumbered verified facts get a 6px ink-300 dot), "Errata glissés dans le pli" (errata-note: errata-soft box, mono errata id, title in errata, proposal in ink-700, underlined errata link to the Errata page), "Lu par le code, sans IA" (two-column definition list, ink-500 terms), "Signalements" (4px ink-400 bullets).

### Errata slip (Errata page)
Flat sheet card, 8px corners, `ink-150` border. Header band on errata-soft with an errata/25 bottom rule: stamp "ERRATA Cn" with a 1.5px errata border, 16px semibold title, the decision status in 12.5px errata at the right. Quotations sit in a grid of sheet cells separated by 1px `ink-100` gaps (two or three columns at ≥768px), serif 15px/1.6, caption with page name and mono pencil URL. Footer: "Pourquoi c'est gênant" / "Correction proposée" in two columns.

### Test-bench plate (Planche)
Sheet card with a header (15px semibold title, mono "n réussis sur m", 12.5px note). Below, a tight grid of 58px cells (5 columns, 10 at ≥640px, 20 at ≥1280px for the base set) ruled with `ink-100`. Pass: mono id, ok check, hover ink-50. Fail: errata-soft at 60%, id struck through in errata, errata cross. Sensitive case: a 4px ink-900 dot (signal when the cell is open). Open cell: ink-900 fill, sheet glyphs, `aria-expanded`; the detail slides in below with the message, expected vs obtained badges, failed checks, and a perforated proof preview on ground at 50%. Comparison tables below the plates use a 1px ink-900 rule under the header row, `ink-100` row rules and 13px mono tabular values.

### Toast and welcome banner
- **Toast:** ink-900 pill, 13px sheet text, centred 80px above the bottom (24px at ≥768px, clearing the tab bar), `aria-live="polite"`, auto-dismisses after 3.2s, enters with `sheet-in`.
- **Welcome banner:** ink-50 band under the header, 13.5px ink-700 with a semibold ink-900 lead, max 92ch, ghost close. Dismissal persists in `localStorage` (`copilote:accueil`).

### Motion
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` for all keyframe motion.
- **sheet-in** (320ms): opacity 0 → 1, translateY 6px → 0. On every newly opened pli, the composer, the toast and the bench detail.
- **stamp-in** (380ms): opacity 0, scale 1.5, rotate -9deg, blur 3px → opacity 1, scale 1, rotate -5deg. The -5deg tilt lives in the keyframe's end state, so with `prefers-reduced-motion: reduce` (both animations off) the stamp sits straight.
- State changes are colour transitions only (150ms). Clicking a pencil mark scrolls the note smoothly.

### Keyboard
- **J / ↓** next pli, **K / ↑** previous (within the current filter), **S** sign and copy (not on archived plis), **T** hand off, **N** open the composer. Ignored while typing in an input, textarea or contenteditable, and when ⌘, Ctrl or Alt is held.
- **Composer:** Esc cancels, ⌘/Ctrl + Enter submits; autofocus on open; minimum 3 characters, maximum 1500.

## Do's and Don'ts

### Do:
- **Do** keep colour to state: signal for "a person must act", pencil for sources and proof corrections, ok for ready and signed, errata for failures and contradictions; everything else from the ink ramp.
- **Do** underline every sourced figure in the proof with the 2px pencil rule and a mono superscript number that matches a numbered margin note with its quote and source URL.
- **Do** draw postal objects (tracking label, tracking rule and dots, outline buttons, composer frame, stamps) with a 1.5px ink-900 stroke, and keep structural rules at 1px `ink-150` or `ink-100`.
- **Do** pair every status colour with a text label or icon, and keep the full status in text when a stamp is `aria-hidden`.
- **Do** set codes, times, counts and URLs in Geist Mono with tabular numerals, and reserve Source Serif 4 for the draft and literal site quotations.
- **Do** put the expected action first: hand-off (signal) before sign for "À transmettre", sign (ink) before hand-off otherwise.
- **Do** give every postal element real data: code, time, language, provider and seconds, check count, decision.
- **Do** gate keyframe motion behind `prefers-reduced-motion` and keep state changes to 150ms colour transitions.
- **Do** expose single-key shortcuts for the register and show them as mono kbd hints at ≥1024px.

### Don't:
- **Don't** use signal yellow for branding, emphasis or decoration; the rail monogram's yellow fill is a known divergence, not a pattern.
- **Don't** add a second accent hue, gradients or tinted panels beyond the four `-soft` washes.
- **Don't** set text lighter than `ink-500` (#5d6159); `ink-300` and `ink-400` are for separators, bullets and outline tags only.
- **Don't** let text leave the proof without a signature: no new copy or export path that bypasses the stamp.
- **Don't** set UI chrome in the serif or running text in the mono, and don't use uppercase outside the mono stamp style.
- **Don't** lift anything but the proof, the selected row and the toast; no other shadows.
- **Don't** round beyond 8px except for pills (chips, toast, dots, check circles, date stamp).
- **Don't** let the workspace slide toward the generic support inbox: white panels, neutral greys, one indigo accent, soft cards everywhere.
