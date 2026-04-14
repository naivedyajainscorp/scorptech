
# PRD — content_moderation.html Visualization Bug Fixes
### Product: Sapphire EAM · Marketing Page (content_moderation.html)
### Prepared for: Qwen Coding Agent
### Scope: 8 targeted visualization corrections — do NOT touch any other module/section
---

## 0. General Rules for the Agent
- Edit only the CSS `<style>` block and the `<script>` block. Do not restructure HTML unless a fix explicitly requires it.
- Preserve all existing class names, IDs, GSAP timelines, IntersectionObserver hooks, and AOS attributes.
- All size values must use `clamp()` so they remain responsive.
- After every fix, the viz must fill its `.scm-md-stage` or `.scm-um-stage` container edge-to-edge (100% width, 100% height) unless the spec says otherwise.
- Never add a card/panel wrapper around an element that is already inside a card/panel wrapper.

---

## BUG 01 — User Management Carousel Gets Stuck
**Module:** Module 02 · `#scmUserMgmtViz`  
**Symptom:** The scene carousel advances to scene 1 (or 2) then freezes; subsequent scenes never render.

### Root Cause Analysis
The `scheduleNext()` call inside `animateScene(idx)` fires `nextScene` after `SCENEDURATION` ms. However the scene functions `s1–s8` that run GSAP timelines with `repeat: -1` never get killed when `showScene()` hides them — the ongoing GSAP tweens on hidden elements conflict with new scene enter animations. Additionally scene indices jump over index 5 (no `s5` entry in the `fns` array maps correctly to Scene 6 which is `scmScene7` in the DOM) causing a silent JS error that halts `scheduleNext`.

### Required Fixes

**Fix 1A — Kill all running tweens before scene switch**  
In `showScene(idx)`: for every scene `i !== idx`, call:
```js
gsap.killTweensOf(sceneElement.querySelectorAll('*'));
gsap.set(sceneElement, { opacity: 0 });
sceneElement.classList.remove('active');
```
Do this synchronously before the new scene's enter tween.

**Fix 1B — Guard the scene-function dispatch array**  
The `fns` array is `[s1, s2, s3, s4, s5, s7, s8]` — 7 entries for indices 0–6.  
`s6` does not exist (scene index 5 maps to `s7` in code). Confirm the array is exactly:
```js
const fns = [s1, s2, s3, s4, s5, s7, s8];
```
Wrap each call in a try/catch so a single broken scene never halts the loop:
```js
function animateScene(idx) {
  showScene(idx);
  try { fns[idx] && fns[idx](); } catch(e) { console.warn('Scene error', idx, e); }
  scheduleNext();
}
```

**Fix 1C — Clear previous scene timers before scheduling next**  
In `scheduleNext()`:
```js
function scheduleNext() {
  clearTimeout(sceneTimer);
  sceneTimer = setTimeout(nextScene, SCENEDURATION);
}
```

**Fix 1D — Reset DOM content on each scene entry**  
Each scene builder (`s1`–`s8`) already sets `innerHTML = ''` at the top — verify this is present for ALL 7 functions. Add it wherever missing.

---

## BUG 02 — 3D Location Cards: Wrong Face Orientations
**Module:** Module 03 · Location Hierarchy viz · `#scmLocStage`  
**Symptom:** The right-face (`.scm-md-loc-ext-right`) and top-face (`.scm-md-loc-ext-top`) of the 3D bar appear facing the viewer instead of facing right and top respectively.

### Root Cause
The 3D extrusion faces are built as absolutely-positioned `<div>` children but lack the correct CSS `transform` declarations to rotate them into the right plane.

### Required Fix — CSS corrections

Replace / ensure these rules exist in the `<style>` block:

```css
/* The main bar face — faces the viewer, no transform needed */
.scm-md-loc-3d-bar {
  position: relative;
  transform-style: preserve-3d;
}

/* Top face — rotated -90deg around X axis, positioned at top of bar */
.scm-md-loc-ext-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: clamp(8px, 1.2vw, 16px);   /* depth of the extrusion */
  transform-origin: top center;
  transform: rotateX(90deg);          /* folds backward and up */
  background: inherit;
  filter: brightness(1.35);
}

/* Right face — rotated +90deg around Y axis, positioned at right edge */
.scm-md-loc-ext-right {
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(8px, 1.2vw, 16px);    /* depth of the extrusion */
  height: 100%;
  transform-origin: right center;
  transform: rotateY(-90deg);         /* folds backward and right */
  background: inherit;
  filter: brightness(0.70);
}
```

Also ensure the parent `.scm-md-iso-viewport` has:
```css
.scm-md-iso-viewport {
  perspective: 800px;
  transform-style: preserve-3d;
}
```

---

## BUG 03 — Units of Measurement Flip Viz: Too Small + Card-in-Card
**Module:** Module 03 · Units of Measurement · `#scmUnitsStage`  
**Symptom:** The flip counter is tiny inside its stage. There is a visible card border inside the stage (`.scm-md-flip-example` renders as a separate card with its own border, padding, background inside the already-styled `.scm-md-stage` container).

### Required Fixes

**Fix 3A — Remove card-in-card styling from `.scm-md-flip-example`**  
Strip all card-like properties from `.scm-md-flip-example`:
```css
.scm-md-flip-example {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(12px, 2vw, 28px);
  background: transparent;   /* was: var(--s-white) */
  border: none;              /* was: 1px solid var(--s-gray-200) */
  border-radius: 0;          /* was: 14px */
  padding: 0;                /* was: clamp(12px,...) */
  position: relative;
}
```

**Fix 3B — Make the carousel fill the full stage**  
```css
.scm-md-flip-carousel {
  width: 100%;               /* was: 92% */
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 1.4vw, 18px);
  padding: clamp(12px, 1.5vw, 20px);
  box-sizing: border-box;
}
```

**Fix 3C — Scale up the flip stage inner**  
```css
.scm-md-flip-stage-inner {
  position: relative;
  width: 100%;
  height: clamp(120px, 18vw, 200px);   /* was: clamp(100px, 14vw, 160px) */
}
```

**Fix 3D — Scale up digit tiles and icons**  
```css
.scm-md-flip-digit {
  width:  clamp(24px, 3.5vw, 46px);   /* was: clamp(18px, 2.5vw, 32px) */
  height: clamp(34px, 4.8vw, 60px);   /* was: clamp(26px, 3.5vw, 44px) */
  font-size: clamp(0.9rem, 1.6vw, 1.4rem);
}
.scm-md-flip-icon {
  font-size: clamp(1.8rem, 3.2vw, 2.8rem);   /* was: clamp(1.4rem, 2.5vw, 2.2rem) */
}
.scm-md-flip-unit-name {
  font-size: clamp(0.62rem, 0.95vw, 0.88rem);
}
```

---

## BUG 04 — Tax Management Dials Occupy Only Left Half
**Module:** Module 03 · Tax Management · `#scmTaxStage`  
**Symptom:** The three dial groups (SGST, CGST, IGST) are all crammed into the left half of the viz panel. The right half is blank.

### Root Cause
`.scm-md-dial-wrap` is `flex-direction: column` with no explicit width or centering. The flex rows inside (`.scm-md-dial-row`) have `flex-wrap: wrap` but no `justify-content`, defaulting to `flex-start` (left-align).

### Required Fixes

**Fix 4A — Make dial-wrap fill stage and center content**
```css
.scm-md-dial-wrap {
  width: 100%;              /* was: 94% */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;  /* spread groups vertically */
  align-items: stretch;
  gap: 0;
  padding: clamp(10px, 1.5vw, 20px) clamp(12px, 2vw, 28px);
  box-sizing: border-box;
}
```

**Fix 4B — Spread dial items across full row width**
```css
.scm-md-dial-row {
  display: flex;
  gap: clamp(8px, 1.2vw, 16px);
  align-items: flex-end;
  flex-wrap: wrap;
  justify-content: space-evenly;   /* ADD THIS — was missing/defaulting to flex-start */
  width: 100%;
}
```

**Fix 4C — Increase dial SVG size proportionally**  
In the JS where dial SVGs are created (look for `arcPath`, `svgNS`, `createElementNS`), increase the SVG `width` and `height` attributes. The dial `<svg>` viewBox is typically `0 0 100 60`. Change the rendered size:
```js
// Find the line where dial svg size is set, e.g.:
// svg.setAttribute('width', clampValue);
// Increase to fill available space:
const dialSize = Math.min(stage.offsetWidth / dialCount * 0.75, 120);
svg.setAttribute('width', dialSize);
svg.setAttribute('height', dialSize * 0.65);
```
If the size is hard-coded in CSS rather than JS, replace:
```css
.scm-md-dial-svg-wrap svg {
  width:  clamp(64px, 9vw, 130px);   /* increase from whatever it was */
  height: clamp(42px, 6vw, 86px);
}
```

---

## BUG 05 — Fuel Types: 2 Icons Per Card Instead of 1
**Module:** Module 03 · Fuel Types · `#scmFuelStage`  
**Symptom:** Each fuel card shows two icons stacked — the `<i>` icon AND a duplicate rendered by the animation particle system.

### Root Cause
Inside `scm-md-fuel-anim-area`, the `<i class="fas {fuel.icon} scm-md-fuel-icon">` element is always appended. For the `spark` and `leaf` animation types, the JS also appends additional `<i>` tags (e.g., `🌿` leaf elements or spark dots) but the primary icon is accidentally duplicated because the icon append call (`animArea.appendChild(icon)`) happens before the `if (fuel.anim === 'flame')` block AND a second icon is appended inside some animation branches.

### Required Fix

In the JS fuel grid builder, restructure to ensure the main icon is appended **exactly once**, and animation particles are appended **after** the icon and are styled `pointer-events: none; position: absolute`:

```js
// CORRECT structure — one icon, then particles
const animArea = document.createElement('div');
animArea.className = 'scm-md-fuel-anim-area';

// 1. Main icon — always exactly one
const icon = document.createElement('i');
icon.className = `fas ${fuel.icon} scm-md-fuel-icon`;
icon.style.color = fuel.color;
animArea.appendChild(icon);

// 2. Animation particles — purely decorative, positioned absolute
if (fuel.anim === 'flame') {
  [-6,-8,0,-10,6,-8].forEach((ox, oy_idx, arr) => {
    // flame particles only — NOT another <i> icon
    const p = document.createElement('div');  // use div, not <i>
    p.className = 'scm-md-flame-particle';
    // ... styles
    animArea.appendChild(p);
  });
} else if (fuel.anim === 'drip') {
  // drip divs only
} else if (fuel.anim === 'bubble') {
  // bubble divs only
} else if (fuel.anim === 'spark') {
  // spark divs only — do NOT append another <i> here
} else if (fuel.anim === 'leaf') {
  // leaf spans only — do NOT append another <i> here
}
```

**Also add this CSS guard:**
```css
.scm-md-fuel-anim-area > i {
  /* only one icon should exist; if two somehow render, hide extras */
}
.scm-md-fuel-anim-area > i ~ i {
  display: none !important;
}
```

---

## BUG 06 — Holiday Calendar: Overflow + Uncalibrated Sizing + Hidden Month/Year
**Module:** Module 03 · Holiday Calendar · `#scmCalStage`  
**Symptom:** 
- Entire calendar widget overflows out of `.scm-md-stage` container
- Month/year header text (`.scm-md-cal-month-name`) is not visible
- Grid cells are too large; calendar doesn't fit
- Font sizes too small relative to cell sizes

### Required Fixes

**Fix 6A — Contain the calendar wrap inside the stage**
```css
.scm-md-stage {
  overflow: hidden;   /* ensure stage clips overflow — ADD if not present */
}

.scm-md-cal-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: clamp(8px, 1vw, 14px);
  box-sizing: border-box;
  overflow: hidden;
}
```

**Fix 6B — Fix the calendar header so month/year is visible**
```css
.scm-md-cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(4px, 0.6vw, 8px);
  flex-shrink: 0;           /* ADD: do not compress the header */
  min-height: clamp(22px, 3vw, 34px);
}

.scm-md-cal-month-name {
  font-size: clamp(0.75rem, 1.1vw, 1.05rem);
  font-weight: 800;
  color: var(--s-gray-800);
  white-space: nowrap;
  visibility: visible !important;  /* force visible if hidden */
  opacity: 1 !important;
}
```

**Fix 6C — Make the grid-wrap fill remaining height**
```css
.scm-md-cal-grid-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  flex: 1;           /* ADD: take all remaining vertical space after header */
  min-height: 0;     /* ADD: allow flex shrink below content size */
}
```

**Fix 6D — Calibrate grid and cell sizes**
```css
.scm-md-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(2px, 0.25vw, 3px);    /* reduce gap */
  height: 100%;
}

.scm-md-cal-day-hdr {
  font-size: clamp(0.42rem, 0.6vw, 0.58rem);
  padding: clamp(2px, 0.3vw, 3px) 0;
}

.scm-md-cal-cell {
  aspect-ratio: unset;      /* REMOVE aspect-ratio — let grid rows control height */
  border-radius: clamp(3px, 0.4vw, 5px);
  padding: clamp(2px, 0.25vw, 3px);
  min-height: 0;
}

.scm-md-cal-date {
  font-size: clamp(0.48rem, 0.7vw, 0.68rem);
}

.scm-md-cal-hlabel {
  font-size: clamp(0.28rem, 0.38vw, 0.36rem);
}
```

**Fix 6E — Legend sizing**
```css
.scm-md-cal-legend {
  gap: clamp(4px, 0.5vw, 8px);
  flex-wrap: wrap;
  flex-shrink: 0;
}
.scm-md-cal-legend-item {
  font-size: clamp(0.34rem, 0.48vw, 0.46rem);
}
```

---

## BUG 07 — Departments Bubble Spray Misplaced
**Module:** Module 03 · Departments · `#scmDeptStage`  
**Symptom:** The animated user-dot bubbles (`.scm-md-user-dot`) spray/appear in the wrong area of the visualization, not along the Sankey flow lines.

### Root Cause
The user-dot position is calculated based on `stageRect` coordinates, but the dots are appended to `#scmDeptNodes` which is `position: absolute; inset: 0` within the stage. The coordinate calculation subtracts `stageRect.left/top` correctly, but the dots are actually spawned along the path between org-node and dept-card using `path.getPointAtLength(t)` — however the `stageRect` used inside the RAF callback is stale (captured before layout completes).

### Required Fix

**Fix 7A — Re-capture stageRect inside the animation loop**
In the department viz JS, find the dot animation loop. Replace any cached `stageRect` reference with a live one:
```js
// WRONG (stale reference):
// const stageRect = stage.getBoundingClientRect();  // captured once at init

// CORRECT — capture inside the RAF/interval that moves dots:
function spawnDot(path, color) {
  const stageRect = stage.getBoundingClientRect();  // live capture
  const dot = document.createElement('div');
  dot.className = 'scm-md-user-dot';
  dot.style.background = color;
  document.getElementById('scmDeptNodes').appendChild(dot);

  let t = 0;
  const len = path.getTotalLength();
  const step = () => {
    const stageR = stage.getBoundingClientRect();  // re-capture each frame
    const pt = path.getPointAtLength(t);
    dot.style.left = (pt.x) + 'px';  // path points already in SVG coords
    dot.style.top  = (pt.y) + 'px';
    t += len / 60;
    if (t < len) requestAnimationFrame(step);
    else dot.remove();
  };
  requestAnimationFrame(step);
}
```

**Fix 7B — Ensure SVG and nodes layer share the same coordinate space**
```css
.scm-md-sankey-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: visible;   /* ADD: prevent SVG from clipping paths */
}

.scm-md-sankey-nodes {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: visible;   /* ADD */
}

.scm-md-user-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  z-index: 3;
  pointer-events: none;
  transform: translate(-50%, -50%);  /* ADD: center dot on coordinate point */
}
```

**Fix 7C — Department card positioning relative to stage**
Ensure all `deptCard.style.left` and `deptCard.style.top` values are set as percentage-based values of the stage (not pixel values from getBoundingClientRect), or if pixel-based, they are calculated from `stage.offsetWidth/offsetHeight`:
```js
// Use offset-based positioning, not getBoundingClientRect-based:
card.style.left = (deptX / stage.offsetWidth * 100) + '%';
card.style.top  = (y / stage.offsetHeight * 100) + '%';
```

---

## BUG 08 — Titles & Designations Pyramid: Overflow + Text Running Out + Not Premium
**Module:** Module 03 · Titles & Designations · `#scmTitlesStage`  
**Symptom:**
- Pyramid and label chips overflow the `.scm-md-stage` container
- Title chips text runs beyond the pyramid edges
- Design is not premium quality
- Text on chips can be up to 2 lines — currently forced single-line causing overflow

### Required Fixes

**Fix 8A — Contain pyramid within stage**
```css
.scm-md-stage {
  overflow: hidden;  /* ensure, already specified in Bug 06 */
}

/* Pyramid wrap: fill the stage properly */
.scm-md-pyramid-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);  /* CENTER horizontally and vertically */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(3px, 0.4vw, 5px);
  z-index: 2;
  width: clamp(180px, 55%, 340px);   /* constrain width within stage */
}
```

**Fix 8B — Premium pyramid level design**  
Replace the basic colored div levels with a gradient + gloss premium look:
```css
.scm-md-pyramid-level {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  height: clamp(28px, 3.5vw, 46px);
  font-size: clamp(0.44rem, 0.66vw, 0.64rem);
  font-weight: 800;
  color: white;
  letter-spacing: 0.05em;
  opacity: 0;
  transform: scaleX(0.3);
  position: relative;
  overflow: hidden;
  /* Premium glass shimmer overlay */
  box-shadow: 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25);
}

/* Shimmer pseudo-element for premium look */
.scm-md-pyramid-level::after {
  content: '';
  position: absolute;
  top: 0; left: -60%; width: 40%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
  animation: scmPyramidShimmer 3s ease-in-out infinite;
}

@keyframes scmPyramidShimmer {
  0%   { left: -60%; }
  100% { left: 160%; }
}
```

**Fix 8C — Title chips: allow 2-line wrap, prevent overflow**
```css
.scm-md-title-chip {
  position: absolute;
  transform: translate(0, -50%);
  background: var(--s-white);
  border: 1px solid var(--s-gray-200);
  border-radius: 6px;
  padding: clamp(2px, 0.3vw, 4px) clamp(5px, 0.7vw, 9px);
  font-size: clamp(0.36rem, 0.52vw, 0.5rem);
  font-weight: 600;
  color: var(--s-gray-600);

  /* REMOVE white-space: nowrap — replace with max 2 lines */
  white-space: normal;           /* was: nowrap */
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /* Constrain chip width so it doesn't exceed the pyramid level width */
  max-width: clamp(70px, 12vw, 140px);

  opacity: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
```

**Fix 8D — Pyramid labels container: prevent overflow**
```css
.scm-md-pyramid-labels {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  overflow: visible;  /* chips may extend slightly, but stage clips them */
}
```

**Fix 8E — In JS pyramid builder: use % widths so each level truly tapers**
In the JS that sets pyramid level widths (e.g., `level.width` from `titleHierarchy`), convert to percentage of the wrap:
```js
// Current values: [12, 22, 36, 54, 72] — these are already % values
// Apply them as:
levelEl.style.width = level.width + '%';   // ensure this line exists
// And ensure the wrap itself is wide enough that 72% is still readable
```

---

## Acceptance Criteria (all 8 bugs)

| # | Bug | Pass Condition |
|---|-----|----------------|
| 01 | User Management Carousel | Cycles through all 7 scenes in a continuous loop without freezing |
| 02 | 3D Location Cards | Top face visible on top, right face visible on right, front face faces viewer |
| 03 | Units Flip Viz | Fills stage container, no visible card-within-card border |
| 04 | Tax Dials | All 3 dial groups spread across full width AND height of viz panel |
| 05 | Fuel Icons | Exactly 1 icon per fuel card; animation particles are decorative divs not icon elements |
| 06 | Holiday Calendar | Entire calendar fits inside `.scm-md-stage`; month+year header legible; no overflow |
| 07 | Departments Bubbles | User-dot bubbles travel along the Sankey flow lines between org node and dept cards |
| 08 | Titles Pyramid | Pyramid centered in stage; no overflow; text chips max 2 lines; premium shimmer effect |

---

## Do NOT Touch
- Module 01 Workplace Viz  
- Module 04 Inventory Kanban  
- Module 05 Request Tracks  
- Module 06 Inspection Tablet  
- Module 07 Decision Tree  
- Module 08 Gantt Chart  
- Module 09 Spotlight Dashboard  
- Brands/OEM Logo Wall (Module 03 sub-viz 5)  
- All `<section>`, heading copy, feature cards, CTA buttons
