# Qwen Coder — capabilities-2.html Add-On Tasks
## (Append these after the Intelligence Card Fix instructions)

**File to edit:** `capabilities-2.html` only — no other file is touched in any step below.

---

## TASK A — Remove 4 Sections from capabilities-2.html

Remove the following 4 complete `<section>` (and `<footer>`) blocks from capabilities-2.html entirely.
Delete everything from the opening tag to its matching closing tag, inclusive.
Leave zero empty lines in their place — just clean deletion.

Do NOT touch the Hero section or the "Experience the Magic" / Enhanced Cards section.

---

### A1 — Remove the Capability Highlight Section

**Identify it by:** The section contains the heading "Built for the Real World, Designed for Humans"
and the four stat cards (95%, 10x, 24/7, 50+).

**Find the opening tag** (it will look like one of these depending on whether refactor ran):
```html
<section class="capability-highlight py-5" ...>
<!-- OR after refactor: -->
<section class="s-cpblts-highlight py-5" ...>
```

Delete from that opening `<section` tag all the way to its matching `</section>` closing tag.
This section contains: the eyebrow "Why Choose Sapphire", the h2 heading,
the paragraph, the 3 bullet feature list (Zero Learning Curve / Scalable Architecture / Enterprise Security),
the Book a Demo button, and the 4 stat cards.

---

### A2 — Remove the Comparison Section

**Identify it by:** The section contains the heading "See the Difference"
and the comparison table (Mobile USP / Intelligence / Analytics / Guides columns).

**Find the opening tag:**
```html
<section class="capability-comparison py-5" ...>
<!-- OR after refactor: -->
<section class="s-cpblts-comparison py-5" ...>
```

Delete from that opening `<section` tag to its matching `</section>`.
This section contains: the "See the Difference" h2, the subtitle paragraph,
the responsive table wrapper div, and the full `<table>` with thead and tbody.

---

### A3 — Remove the CTA Section

**Identify it by:** The section contains the heading "Ready to Experience Sapphire?"
and two buttons: "Book a Demo" and "Contact Us".

**Find the opening tag:**
```html
<section class="s-cta capabilities-cta" ...>
<!-- OR after refactor: -->
<section class="s-cta s-cpblts-cta" ...>
```

Delete from that opening `<section` tag to its matching `</section>`.
This section contains: the 3 `cta-decorative-circle` divs, the container,
the h2 heading, the paragraph, the 2 CTA buttons, and the 4 trust pill badges
(Secure / Fast Setup / User-Friendly / 24/7 Support).

---

### A4 — Remove the Footer

**Identify it by:** The `<footer>` tag.

**Find:**
```html
<footer ...>
```

Delete from the opening `<footer` tag to its matching `</footer>` tag, inclusive.
If there is no `<footer>` tag present in the file, skip this step.

---

### A — CSS Cleanup After Section Removals

After the 4 section removals above, scan the `<style>` block inside capabilities-2.html
and delete the CSS rule blocks for the classes that now have no corresponding HTML.

Delete these CSS rules (only if their HTML section was successfully removed above):

**From Highlight section removal:**
- `.capability-highlight` / `.s-cpblts-highlight`
- `.capability-stat-card` / `.s-cpblts-stat-card`
- `.capability-stat-card:hover` / `.s-cpblts-stat-card:hover`
- `.capability-accent-bg` / `.s-cpblts-accent-bg`

**From Comparison section removal:**
- `.capability-comparison` / `.s-cpblts-comparison`
- `.capability-comparison-table` / `.s-cpblts-comparison-table`
- `.capability-comparison-table th`
- `.capability-comparison-table td`
- `.capability-comparison-table tbody tr:hover`

**From CTA section removal:**
- `.cta-decorative-circle` / `.s-cpblts-cta-circle`
- `.cta-circle-1` / `.s-cpblts-cta-circle-1`
- `.cta-circle-2` / `.s-cpblts-cta-circle-2`
- `.cta-circle-3` / `.s-cpblts-cta-circle-3`
- `.capabilities-cta` / `.s-cpblts-cta` (only the page-scoped rule — do NOT delete `s-cta` from any global stylesheet)

> ⚠️ IMPORTANT: Only delete CSS rules from the `<style>` block INSIDE capabilities-2.html.
> Do not touch core.css, utilities.css, or style.css.
> The class `s-cta` may exist in a global stylesheet — do not touch it there.

---

## TASK B — Fix Card Width on Desktop ("Experience the Magic" Section)

The 4 capability cards use Bootstrap column class `col-xl-3` inside a `.container`.
Bootstrap's `.container` caps at ~1320px on large desktops, making the cards narrow
(~300px wide each) even when there is plenty of screen real estate available.

### B1 — Add a CSS Override in the `<style>` Block

In the `<style>` block of capabilities-2.html, find the existing rule for
`.capabilities-section-enhanced` (or `.s-cpblts-section` after refactor).

Add the following override to expand the container width for this section only:

```css
/* Widen the 4-card grid to use available desktop space */
.capabilities-section-enhanced .container,
.s-cpblts-section .container {
  max-width: min(1600px, 96vw);
}
```

Include BOTH selectors (with and without refactor prefix) so this works
regardless of whether the class rename from the main refactor task has run.

### B2 — Adjust Card Column Classes

Find the 4 card column wrappers. Each looks like:
```html
<div class="col-lg-6 col-xl-3">
```

Change each one to:
```html
<div class="col-sm-12 col-md-6 col-xl-3">
```

This removes `col-lg-6` (which was triggering 2-per-row at 992–1200px) and explicitly
sets the behaviour:
- Mobile (`sm`): full-width stack
- Tablet (`md`): 2 per row
- Desktop (`xl`+): 4 per row in the widened container

> There are exactly 4 of these column divs — all direct children of the `<div class="row g-4">`.
> Change all 4. Do not change any other `col-*` classes on nested elements inside the cards.

### B3 — Normalize Card Height for Wider Cards

The cards currently have a fixed `height: 520px` inline style. At the widened container,
the cards will now be ~370px wide each — a less portrait-heavy proportion.
Update the card height to be slightly more balanced:

Find the inline `style="height: 520px; ..."` on each of the 4 `.capability-card-enhanced`
(or `.s-cpblts-card`) divs and change `height: 520px` to `height: 480px`.

Also update the responsive breakpoint rules in the `<style>` block:

Find:
```css
@media (max-width: 1200px) {
  .capability-card-enhanced { height: 480px !important; }
}
@media (max-width: 992px) {
  .capability-card-enhanced { height: 520px !important; }
}
@media (max-width: 576px) {
  .capability-card-enhanced { height: 460px !important; }
}
```

Replace with (update these to match the new default height):
```css
@media (max-width: 1200px) {
  .capability-card-enhanced,
  .s-cpblts-card { height: 460px !important; }
}
@media (max-width: 992px) {
  .capability-card-enhanced,
  .s-cpblts-card { height: 480px !important; }
}
@media (max-width: 576px) {
  .capability-card-enhanced,
  .s-cpblts-card { height: 440px !important; }
}
```

---

## TASK B — Verification Checklist

- [ ] The Highlight section ("Built for the Real World...") is gone from the HTML
- [ ] The Comparison section ("See the Difference" table) is gone from the HTML
- [ ] The CTA section ("Ready to Experience Sapphire?") is gone from the HTML
- [ ] Footer is gone (or confirmed absent)
- [ ] CSS rules for all removed sections are deleted from the `<style>` block only
- [ ] No CSS was deleted from core.css, utilities.css, or any external stylesheet
- [ ] The Hero section (`s-cpblts-hero` / `capabilities-hero`) is untouched
- [ ] The "Experience the Magic" section (`capabilities-section-enhanced` / `s-cpblts-section`) structure is untouched
- [ ] The `.container` inside the cards section has the new `max-width: min(1600px, 96vw)` rule
- [ ] All 4 card column divs changed from `col-lg-6 col-xl-3` to `col-sm-12 col-md-6 col-xl-3`
- [ ] All 4 card inline heights changed from `520px` to `480px`
- [ ] The 3 responsive `@media` rules for card height are updated

