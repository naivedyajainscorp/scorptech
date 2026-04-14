# MODULE 1 Workplace Viz — Renovation PRD for Qwen

## Context
File: `content_moderation.html`
Scope: Only the MODULE 1 workplace viz — CSS rules prefixed `scm-` for MODULE 1 only, and the JS
block marked `---- MODULE 1: Workplace Viz ----`. Do not touch anything outside that boundary.

---

## Problem
1. Nodes fall outside the stage or bunch together — they don't use the full canvas.
2. Connector endpoints are calculated from hardcoded offsets, not from the actual rendered
   card positions, so they disconnect from nodes when scale changes.
3. Font sizes and card dimensions do not scale fluidly — they jump at breakpoints instead of
   scaling smoothly as the stage width changes.
4. Stage height is fixed — it doesn't breathe with the viewport.

---

## Fix 1 — Stage height (CSS)

Replace the current fixed `height: 600px` on `.scm-viz-stage` with:

```css
.scm-viz-stage {
  height: clamp(420px, 50vw, 700px);
}
```

Remove the overrides for stage height in the `@media (max-width: 991px)` and
`@media (max-width: 767px)` blocks. The clamp handles everything.

---

## Fix 2 — Fluid font + card sizing (CSS)

Replace ALL font-size and min/max-width values on the following classes with the
exact `clamp()` values listed below. Do not touch any other property on these rules.

```css
/* Hub */
.scm-hub-icon       { font-size: clamp(1.2rem, 2.5vw, 2.1rem); }
.scm-hub-label      { font-size: clamp(0.38rem, 0.5vw, 0.52rem); }
.scm-hub-name       { font-size: clamp(0.6rem,  1vw,  0.9rem); }
.scm-hub-industry   { font-size: clamp(0.44rem, 0.65vw, 0.62rem); }
.scm-org-hub        { width: clamp(130px, 13vw, 200px); height: clamp(130px, 13vw, 200px); }
.scm-hub-ring-1     { width: clamp(170px, 17vw, 260px); height: clamp(170px, 17vw, 260px); }
.scm-hub-ring-2     { width: clamp(215px, 22vw, 330px); height: clamp(215px, 22vw, 330px); }

/* Node card */
.scm-wp-card {
  min-width:  clamp(88px, 9.5vw, 175px);
  max-width:  clamp(105px, 12vw, 200px);
  padding:    clamp(7px, 0.9vw, 15px) clamp(9px, 1.2vw, 20px);
  border-radius: clamp(10px, 1.2vw, 16px);
  gap: clamp(2px, 0.3vw, 5px);
}
.scm-wp-icon   { font-size: clamp(0.65rem, 1.1vw, 1.1rem); }
.scm-wp-name   { font-size: clamp(0.48rem, 0.85vw, 0.8rem); }
.scm-wp-status { font-size: clamp(0.34rem, 0.58vw, 0.55rem); }
.scm-wp-chip   { font-size: clamp(0.32rem, 0.55vw, 0.52rem); padding: 1px clamp(3px, 0.5vw, 7px); }

/* Marvel title */
.scm-marvel-line1 { font-size: clamp(1.2rem, 2.8vw, 2.2rem); }
.scm-marvel-line2 { font-size: clamp(0.8rem,  1.6vw, 1.3rem); }
```

Also remove the individual font-size overrides for hub and node elements that exist inside
`@media (max-width: 991px)` and `@media (max-width: 767px)` — the clamp handles all of it.
Keep any non-font-size rules in those blocks untouched.

---

## Fix 3 — Node positioning (JS: `getNodePositions`)

Replace the entire `getNodePositions(W, H)` function with this:

```javascript
function getNodePositions(W, H) {
  const hubY = H * 0.17;
  const cx   = W / 2;

  // Estimate rendered card half-width at this stage size
  // clamp(88px, 9.5vw, 175px) → 9.5vw of W, clamped
  const cardHalfW = Math.min(175, Math.max(88, W * 0.095)) / 2 + W * 0.025;

  const leftEdge  = cardHalfW;
  const rightEdge = W - cardHalfW;
  const span      = rightEdge - leftEdge;

  // Row Y positions — spaced well below hub
  const row1Y = H * 0.46;
  const row2Y = H * 0.76;

  return {
    hubY,
    cx,
    nodes: [
      { x: leftEdge + span * 0.00, y: row1Y },   // far left
      { x: leftEdge + span * 0.50, y: row1Y },   // center
      { x: leftEdge + span * 1.00, y: row1Y },   // far right
      { x: leftEdge + span * 0.25, y: row2Y },   // mid-left
      { x: leftEdge + span * 0.75, y: row2Y },   // mid-right
    ]
  };
}
```

---

## Fix 4 — Connector endpoints from actual DOM (JS: `buildDesktop`)

The connectors currently use hardcoded offsets (`hubY + 55`, `n.y - 28`) to estimate the
hub bottom edge and node top edge. These break when card sizes change.

Replace that section inside `buildDesktop()` with a two-pass approach:

**Pass 1 — place hub and all nodes first (same as now), but do NOT draw connectors yet.**

After placing all nodes, add this second pass:

```javascript
// Pass 2 — measure actual rendered positions, then draw connectors
requestAnimationFrame(() => {
  const stageRect = stage.getBoundingClientRect();
  const hubRect   = document.getElementById('scmOrgHub').getBoundingClientRect();
  const hubBotX   = hubRect.left - stageRect.left + hubRect.width  / 2;
  const hubBotY   = hubRect.bottom - stageRect.top;

  SCM_DATA.workplaceViz.primaryOrg.workplaces.forEach((wp, i) => {
    const nodeEl   = document.getElementById(`scmWpNode${i}`);
    const cardEl   = nodeEl ? nodeEl.querySelector('.scm-wp-card') : null;
    if (!nodeEl || !cardEl) return;

    const cardRect  = cardEl.getBoundingClientRect();
    const nodeTopX  = cardRect.left - stageRect.left + cardRect.width  / 2;
    const nodeTopY  = cardRect.top  - stageRect.top;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', buildElbowPath(hubBotX, hubBotY, nodeTopX, nodeTopY));
    path.setAttribute('class', 'scm-connector');
    path.setAttribute('id', `scmLine${i}`);
    const pathLen = path.getTotalLength();
    path.setAttribute('stroke-dasharray', pathLen);
    path.setAttribute('stroke-dashoffset', pathLen);
    svg.appendChild(path);
    eps.push({ sx: hubBotX, sy: hubBotY, ex: nodeTopX, ey: nodeTopY, len: pathLen });
  });
});
```

Because connectors now draw inside `requestAnimationFrame`, the GSAP connector animation
`tl.to('#scmLine${i}', ...)` needs to fire after the RAF. Wrap the entire GSAP timeline build
in a second `requestAnimationFrame` call so it runs after the connectors are in the DOM:

```javascript
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    // all the GSAP tl. calls go here
  });
});
```

This double-RAF guarantees the DOM has painted before GSAP tries to read path lengths.

---

## Fix 5 — `buildElbowPath` midpoint adjustment

The current `midY = sy + (ey - sy) * 0.45` sometimes creates awkward paths when nodes are
far left or right and the hub is near center-top.

Replace `buildElbowPath` with:

```javascript
function buildElbowPath(sx, sy, ex, ey) {
  // Elbow: down from hub, then horizontal, then up into node (mind-map style)
  const verticalDrop = (ey - sy) * 0.42;
  const midY = sy + verticalDrop;
  return `M${sx},${sy} L${sx},${midY} L${ex},${midY} L${ex},${ey}`;
}
```

---

## Fix 6 — Dot packet animation endpoints

The `eps` array is now built inside the RAF callback (Fix 4). The `startDots(eps)` call is
currently scheduled at `tl.add(() => startDots(eps), 1.7)`.

Because `eps` is populated asynchronously, capture it as a `let` in the outer function scope
and reference it by closure — it will be populated by the time the 1.7s mark is reached.

```javascript
// At top of buildDesktop(), before any pass:
const eps = [];
// ... (rest of the function)
// In the RAF callback, push to eps as shown in Fix 4.
// The tl.add(() => startDots(eps), 1.7) line can stay as-is — eps will be filled by then.
```

---

## Fix 7 — Resize re-init

The current resize handler calls `runAnim()` after 400ms debounce. The `cleanup()` function
needs to also clear the SVG and node layer before rebuild. Verify `cleanup()` contains:

```javascript
const svg    = document.getElementById('scmSpokeSvg');
const nLayer = document.getElementById('scmNodesLayer');
if (svg)    svg.innerHTML    = '';
if (nLayer) nLayer.innerHTML = '';
```

If those two lines are missing from `cleanup()`, add them. If they're already there, leave as-is.

---

## What NOT to change
- The `SCM_DATA` object — data stays exactly as defined.
- The HTML structure inside `#scmVizStage` — no changes.
- The ghost org system — no changes.
- Act 2 / Act 3 animation logic — no changes.
- The feature strip chips below the viz — no changes.
- Any CSS or JS for MODULE 2 through MODULE 9.
- AOS init, GSAP plugin registration, or any other global setup.

---

## Checklist
- [ ] `.scm-viz-stage` height is `clamp(420px, 50vw, 700px)` — fixed pixel overrides removed
- [ ] All hub + node font-size and dimension values use `clamp()` as listed in Fix 2
- [ ] `getNodePositions()` replaced with Fix 3 version — nodes spread full canvas width
- [ ] `buildDesktop()` uses two-pass RAF approach for connector endpoints (Fix 4)
- [ ] `buildElbowPath()` updated with Fix 5
- [ ] `eps` is declared as `let eps = []` at outer scope and populated inside RAF (Fix 6)
- [ ] GSAP timeline is wrapped in double-RAF so connectors exist before animation runs
- [ ] `cleanup()` clears SVG and nLayer innerHTML (Fix 7)
- [ ] No changes to anything outside MODULE 1 boundary
