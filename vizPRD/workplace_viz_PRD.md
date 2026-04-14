# PRD — Workplace Management Visualization
## Module 1 Renovation: Hub & Spoke + Marvel Multi-Org Reveal
**Target file:** `content_moderation.html`
**Section:** Module 01 — Workplace Management creative layout block only
**Replaces:** Previous `scm-layout-newsroom` section entirely

---

## 1. WHAT YOU ARE BUILDING

A self-contained animated visualization that does two things in sequence:

**Act 1 (0–4s):** One organisation with 5 workplaces renders as a hub-and-spoke diagram. Fully readable. The org block is the command hub. Lines draw outward. Workplace nodes pop in. Data chips attach. Dot packets flow continuously along the lines to show live control.

**Act 2 (4–7s):** A title card punches in. 4 ghost org trees fly in from behind the main one (Marvel intro card style — 3D flip/trajectory). They settle behind the main viz at varying depths, rotations, and opacities. The message is felt, not read.

**Act 3 (7s+):** Everything breathes gently in a loop. Ghost orgs do a slow drift. Dot packets keep flowing on the main org. After 12s total, the whole sequence resets and replays.

---

## 2. FILE & CODE RULES

- All code goes in `content_moderation.html` only
- New CSS: `<style>` tag in `<head>`, all classes prefixed `scm-`
- New JS: single `<script>` block at bottom of `<body>`
- Reuse existing `s-*` classes from `style.css` for typography, pills, buttons
- GSAP (already in page CDN) handles all animation
- No canvas. No WebGL. Pure DOM + CSS + GSAP only
- The visualization container must be responsive — collapse behavior defined in Section 8

---

## 3. DATA — STORE IN `SCM_DATA` CONST

Place this at the very top of the `<script>` block, before all other JS.
This is the single source of truth for all visualization data on the page.

```javascript
const SCM_DATA = {

  workplaceViz: {

    primaryOrg: {
      name: "Precision Auto Works",
      tagline: "Automotive Service Chain",
      icon: "fa-wrench",
      color: "#22d3ee",
      workplaces: [
        {
          id: "wp1",
          name: "Malviya Nagar",
          fullName: "Branch 1 — Malviya Nagar",
          city: "Jaipur",
          industry: "Automotive Service",
          icon: "fa-wrench",
          status: "open",
          angle: 330   // degrees from center, for spoke positioning
        },
        {
          id: "wp2",
          name: "Vaishali Nagar",
          fullName: "Branch 2 — Vaishali Nagar",
          city: "Jaipur",
          industry: "Automotive Service",
          icon: "fa-wrench",
          status: "open",
          angle: 45
        },
        {
          id: "wp3",
          name: "Tonk Road",
          fullName: "Branch 3 — Tonk Road",
          city: "Jaipur",
          industry: "Automotive Service",
          icon: "fa-wrench",
          status: "closed",
          angle: 110
        },
        {
          id: "wp4",
          name: "Mansarovar",
          fullName: "Branch 4 — Mansarovar",
          city: "Jaipur",
          industry: "Automotive Service",
          icon: "fa-wrench",
          status: "open",
          angle: 185
        },
        {
          id: "wp5",
          name: "Sitapura RIICO",
          fullName: "Branch 5 — Sitapura RIICO",
          city: "Jaipur",
          industry: "Industrial Area",
          icon: "fa-industry",
          status: "open",
          angle: 255
        }
      ]
    },

    ghostOrgs: [
      {
        name: "Mehta Pharmaceuticals",
        industry: "Pharmaceutical Mfg.",
        icon: "fa-pills",
        color: "#a78bfa",
        workplaces: [
          { name: "Bhiwadi Plant A", city: "Bhiwadi", icon: "fa-industry", status: "open", angle: 340 },
          { name: "Neemrana Plant B", city: "Neemrana", icon: "fa-industry", status: "open", angle: 60 },
          { name: "Jaipur Warehouse", city: "Jaipur", icon: "fa-warehouse", status: "open", angle: 160 }
        ],
        // Marvel entry transform: where it flies in FROM
        entryFrom: { x: -320, y: -80, rotateY: -55, rotateZ: -8, scale: 0.7 },
        // Resting position behind main org
        restAt:   { x: -110, y: 20,  rotateY: -22, rotateZ: -3, scale: 0.82, opacity: 0.32, zIndex: 3 }
      },
      {
        name: "Grand Spice Hotels",
        industry: "Hospitality Group",
        icon: "fa-hotel",
        color: "#f59e0b",
        workplaces: [
          { name: "Flagship Jodhpur", city: "Jodhpur", icon: "fa-hotel", status: "open", angle: 30 },
          { name: "Resort Udaipur", city: "Udaipur", icon: "fa-umbrella-beach", status: "open", angle: 120 },
          { name: "Budget Inn Ajmer", city: "Ajmer", icon: "fa-bed", status: "closed", angle: 210 },
          { name: "Jaipur Cafe", city: "Jaipur", icon: "fa-utensils", status: "open", angle: 290 }
        ],
        entryFrom: { x: 350, y: -60, rotateY: 60, rotateZ: 10, scale: 0.65 },
        restAt:   { x: 120, y: 30,  rotateY: 25, rotateZ: 4,  scale: 0.80, opacity: 0.28, zIndex: 2 }
      },
      {
        name: "Rajputana Cold Chain",
        industry: "Logistics & Storage",
        icon: "fa-truck",
        color: "#4ade80",
        workplaces: [
          { name: "Jaipur Hub Depot", city: "Jaipur", icon: "fa-truck", status: "open", angle: 50 },
          { name: "Kota Depot", city: "Kota", icon: "fa-truck", status: "open", angle: 170 },
          { name: "Alwar Cold Store", city: "Alwar", icon: "fa-warehouse", status: "open", angle: 280 }
        ],
        entryFrom: { x: -280, y: 120, rotateY: -45, rotateZ: 12, scale: 0.6 },
        restAt:   { x: -80,  y: 55,  rotateY: -15, rotateZ: 5,  scale: 0.75, opacity: 0.22, zIndex: 1 }
      },
      {
        name: "Sterling Fabricators",
        industry: "Metal Fabrication",
        icon: "fa-industry",
        color: "#fb923c",
        workplaces: [
          { name: "Sitapura Plant 1", city: "Jaipur", icon: "fa-industry", status: "open", angle: 20 },
          { name: "Bhiwadi Plant 2", city: "Bhiwadi", icon: "fa-industry", status: "open", angle: 100 },
          { name: "Jaipur Warehouse", city: "Jaipur", icon: "fa-warehouse", status: "open", angle: 200 },
          { name: "Delhi Office", city: "Delhi", icon: "fa-building", status: "open", angle: 290 }
        ],
        entryFrom: { x: 260, y: 130, rotateY: 50, rotateZ: -12, scale: 0.62 },
        restAt:   { x: 90,  y: 60,  rotateY: 18, rotateZ: -4, scale: 0.73, opacity: 0.18, zIndex: 0 }
      }
    ]
  }

  // Future module data added here:
  // inventoryViz: { ... }
  // requestViz:   { ... }
};
```

---

## 4. HTML STRUCTURE

Replace the existing `scm-layout-newsroom` div with this entire block:

```html
<div class="scm-layout-hubspoke" id="scmWorkplaceViz">

  <!-- Visualization Stage -->
  <div class="scm-viz-stage" id="scmVizStage">

    <!-- Ghost orgs layer (behind everything) -->
    <div class="scm-ghost-layer" id="scmGhostLayer">
      <!-- JS renders ghost org trees here -->
    </div>

    <!-- Main org viz (SVG lines + DOM nodes) -->
    <div class="scm-main-org-layer" id="scmMainOrgLayer">

      <!-- SVG for spoke lines and dot packets -->
      <svg class="scm-spoke-svg" id="scmSpokeSvg" xmlns="http://www.w3.org/2000/svg">
        <!-- JS draws lines here -->
      </svg>

      <!-- Org hub (center) -->
      <div class="scm-org-hub" id="scmOrgHub">
        <div class="scm-hub-ring scm-hub-ring-1"></div>
        <div class="scm-hub-ring scm-hub-ring-2"></div>
        <div class="scm-hub-inner">
          <div class="scm-hub-icon"><i class="fas fa-building"></i></div>
          <div class="scm-hub-label">ORGANISATION</div>
          <div class="scm-hub-name" id="scmHubName">Precision Auto Works</div>
          <div class="scm-hub-industry" id="scmHubIndustry">
            <i class="fas fa-wrench"></i> Automotive Service
          </div>
        </div>
      </div>

      <!-- Workplace nodes — JS renders these -->
      <div class="scm-nodes-layer" id="scmNodesLayer">
        <!-- Each .scm-wp-node rendered here by JS -->
      </div>

    </div><!-- /scm-main-org-layer -->

    <!-- Marvel title overlay — hidden until Act 2 -->
    <div class="scm-marvel-title" id="scmMarvelTitle">
      <span class="scm-marvel-line1">1 organisation or 50</span>
      <span class="scm-marvel-line2">Sapphire has got you covered.</span>
    </div>

  </div><!-- /scm-viz-stage -->

  <!-- Feature strip below the viz (static, not animated) -->
  <div class="row g-3 mt-4" id="scmWpFeatureStrip">
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="0">
      <div class="scm-strip-chip">
        <i class="fas fa-building s-text-gradient-primary"></i>
        <span>Unlimited Workplaces</span>
      </div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">
      <div class="scm-strip-chip">
        <i class="fas fa-clock s-text-gradient-amber"></i>
        <span>Overlapping Shifts</span>
      </div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">
      <div class="scm-strip-chip">
        <i class="fas fa-circle-dot s-text-gradient-green"></i>
        <span>Live Open/Closed Status</span>
      </div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="300">
      <div class="scm-strip-chip">
        <i class="fas fa-boxes-stacked s-text-gradient-info"></i>
        <span>Real-Time Asset Count</span>
      </div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="0">
      <div class="scm-strip-chip">
        <i class="fas fa-scroll s-text-gradient-royal"></i>
        <span>Live Activity Log</span>
      </div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">
      <div class="scm-strip-chip">
        <i class="fas fa-user-shield s-text-gradient-indigo"></i>
        <span>Role-Based Visibility</span>
      </div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">
      <div class="scm-strip-chip">
        <i class="fas fa-clipboard-check s-text-gradient-danger"></i>
        <span>Inspection on Log-in</span>
      </div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="300">
      <div class="scm-strip-chip">
        <i class="fas fa-globe s-text-gradient-pop"></i>
        <span>Multi-Industry Ready</span>
      </div>
    </div>
  </div>

</div>
```

---

## 5. CSS — ALL `scm-` PREFIXED

Add inside the `<style>` block:

```css
/* ============================================================
   WORKPLACE VIZ — Hub & Spoke
   ============================================================ */

.scm-layout-hubspoke {
  position: relative;
}

/* Stage: the main canvas area */
.scm-viz-stage {
  position: relative;
  width: 100%;
  height: 560px;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(160deg, var(--s-primary-980) 0%, var(--s-primary-940) 60%, var(--s-primary-920) 100%);
  border: 1px solid rgba(34,211,238,0.1);
}

/* ---- SVG spoke lines ---- */
.scm-spoke-svg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 2;
}

.scm-spoke-line {
  fill: none;
  stroke: rgba(34,211,238,0.25);
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
  /* drawn via stroke-dashoffset animation in JS */
}

/* ---- Org Hub ---- */
.scm-main-org-layer {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 4;
}

.scm-org-hub {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  z-index: 6;
}

/* Pulsing concentric rings */
.scm-hub-ring {
  position: absolute;
  top: 50%; left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(34,211,238,0.2);
  transform: translate(-50%,-50%);
  animation: scmRingPulse 3s ease-out infinite;
}
.scm-hub-ring-1 {
  width: 160px; height: 160px;
  animation-delay: 0s;
}
.scm-hub-ring-2 {
  width: 200px; height: 200px;
  animation-delay: 1s;
}
@keyframes scmRingPulse {
  0%   { opacity: 0.5; transform: translate(-50%,-50%) scale(0.95); }
  60%  { opacity: 0.15; }
  100% { opacity: 0; transform: translate(-50%,-50%) scale(1.3); }
}

/* Hub inner box */
.scm-hub-inner {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(34,211,238,0.12), rgba(34,211,238,0.04));
  border: 1.5px solid rgba(34,211,238,0.5);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0.75rem 0.5rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 30px rgba(34,211,238,0.12), inset 0 1px 0 rgba(255,255,255,0.08);
}

.scm-hub-icon {
  font-size: 1.4rem;
  color: #22d3ee;
  margin-bottom: 2px;
}

.scm-hub-label {
  font-size: 0.5rem;
  letter-spacing: 0.15em;
  font-weight: 800;
  color: rgba(34,211,238,0.6);
  font-family: monospace;
}

.scm-hub-name {
  font-size: 0.62rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  text-align: center;
  line-height: 1.3;
  padding: 0 4px;
}

.scm-hub-industry {
  font-size: 0.55rem;
  color: rgba(255,255,255,0.45);
  display: flex;
  align-items: center;
  gap: 3px;
}

/* ---- Workplace Nodes ---- */
.scm-nodes-layer {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 5;
}

.scm-wp-node {
  position: absolute;
  transform: translate(-50%, -50%) scale(0);  /* JS animates scale to 1 */
  opacity: 0;                                   /* JS animates opacity to 1 */
  cursor: default;
}

.scm-wp-node-inner {
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04));
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  min-width: 100px;
  max-width: 120px;
  text-align: center;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}

.scm-wp-icon {
  font-size: 0.85rem;
  color: rgba(34,211,238,0.8);
  margin-bottom: 2px;
}

.scm-wp-name {
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(255,255,255,0.88);
  line-height: 1.3;
  margin-bottom: 2px;
}

.scm-wp-status {
  font-size: 0.5rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  font-family: monospace;
}
.scm-wp-status.open  { color: #4ade80; }
.scm-wp-status.closed { color: #f87171; }

/* Chip tags attached to workplace nodes */
.scm-wp-chips {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 4px;
  align-items: center;
}

.scm-wp-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.48rem;
  color: rgba(255,255,255,0.65);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  padding: 1px 5px;
  white-space: nowrap;
}

.scm-wp-chip i { font-size: 0.45rem; color: #f87171; }
.scm-wp-chip.industry-chip i { color: rgba(34,211,238,0.7); }

/* Dot packets traveling along spokes */
.scm-dot-packet {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #22d3ee;
  box-shadow: 0 0 6px rgba(34,211,238,0.8);
  pointer-events: none;
  z-index: 7;
  opacity: 0;
}

/* ---- Ghost Org Layer ---- */
.scm-ghost-layer {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  /* perspective for 3D transforms on children */
  perspective: 900px;
  perspective-origin: 50% 50%;
}

.scm-ghost-org {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transform: translate(-50%, -50%);
  opacity: 0;          /* JS controls opacity */
  will-change: transform, opacity;
}

/* Ghost org hub — simpler, smaller */
.scm-ghost-hub {
  width: 90px;
  height: 90px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0.4rem;
}

.scm-ghost-hub-icon { font-size: 1rem; }
.scm-ghost-hub-name {
  font-size: 0.5rem;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  text-align: center;
  line-height: 1.2;
}

.scm-ghost-spoke-svg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}

.scm-ghost-spoke-line {
  fill: none;
  stroke-width: 1;
  stroke-dasharray: 4 4;
  opacity: 0.4;
}

.scm-ghost-wp-node {
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  padding: 3px 6px;
  min-width: 65px;
  text-align: center;
}

.scm-ghost-wp-name {
  font-size: 0.45rem;
  color: rgba(255,255,255,0.5);
  font-weight: 600;
}

/* ---- Marvel Title Overlay ---- */
.scm-marvel-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  z-index: 20;
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.scm-marvel-line1 {
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  font-weight: 900;
  color: rgba(255,255,255,0.92);
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-shadow: 0 0 40px rgba(34,211,238,0.4);
}

.scm-marvel-line2 {
  font-size: clamp(0.9rem, 1.8vw, 1.3rem);
  font-weight: 600;
  color: #22d3ee;
  letter-spacing: 0.02em;
}

/* ---- Feature Strip ---- */
.scm-strip-chip {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1rem;
  background: rgba(255,255,255,0.97);
  border-radius: 10px;
  border: 1px solid var(--s-gray-200);
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(0,0,0,0.7);
  transition: border-color 0.2s;
}

.scm-strip-chip:hover {
  border-color: rgba(34,211,238,0.4);
}

.scm-strip-chip i {
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

/* Tablet */
@media (max-width: 991px) {
  .scm-viz-stage { height: 480px; }
  .scm-org-hub { width: 110px; height: 110px; }
  .scm-hub-ring-1 { width: 140px; height: 140px; }
  .scm-hub-ring-2 { width: 175px; height: 175px; }
  .scm-wp-node-inner { min-width: 85px; max-width: 100px; }
}

/* Mobile — flatten to list, no SVG animation */
@media (max-width: 767px) {
  .scm-viz-stage {
    height: auto;
    min-height: 200px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  /* Hide hub-spoke on mobile, show a simplified centered hub + vertical list */
  .scm-spoke-svg,
  .scm-nodes-layer,
  .scm-ghost-layer,
  .scm-dot-packet,
  .scm-hub-ring { display: none; }

  .scm-org-hub {
    position: relative;
    top: auto; left: auto;
    transform: none;
    margin-bottom: 1rem;
  }

  .scm-main-org-layer {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Mobile workplace list */
  .scm-mobile-wp-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
  .scm-mobile-wp-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 1rem;
    background: rgba(255,255,255,0.06);
    border-radius: 10px;
    border-left: 3px solid rgba(34,211,238,0.4);
    font-size: 0.78rem;
    color: rgba(255,255,255,0.8);
  }
  .scm-mobile-wp-item i { color: #22d3ee; }
  .scm-mobile-wp-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .scm-mobile-wp-status-dot.open { background: #4ade80; }
  .scm-mobile-wp-status-dot.closed { background: #f87171; }

  .scm-marvel-title { display: none; } /* Skip Marvel reveal on mobile */
}

/* prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .scm-hub-ring,
  .scm-dot-packet { animation: none !important; }
}
```

---

## 6. JS — ANIMATION ENGINE

Add this entire block inside the single page `<script>` tag.
Place it AFTER `AOS.init()` and `gsap.registerPlugin(ScrollTrigger)`.

```javascript
// ============================================================
// MODULE 1 — WORKPLACE VIZ
// ============================================================

(function() {

  const isMobile = () => window.innerWidth < 768;

  // ---- Utility: polar to cartesian (relative to stage center) ----
  function polarToXY(cx, cy, radius, angleDeg) {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    };
  }

  // ---- BUILD MOBILE VIEW ----
  function buildMobileView() {
    const layer = document.getElementById('scmNodesLayer');
    if (!layer) return;
    const list = document.createElement('div');
    list.className = 'scm-mobile-wp-list';
    SCM_DATA.workplaceViz.primaryOrg.workplaces.forEach(wp => {
      const item = document.createElement('div');
      item.className = 'scm-mobile-wp-item';
      item.innerHTML = `
        <i class="fas ${wp.icon}"></i>
        <span>${wp.fullName}</span>
        <div class="scm-mobile-wp-status-dot ${wp.status}" style="margin-left:auto"></div>
      `;
      list.appendChild(item);
    });
    layer.appendChild(list);
  }

  // ---- BUILD DESKTOP VIEW ----
  function buildDesktopView() {
    const stage = document.getElementById('scmVizStage');
    const svg = document.getElementById('scmSpokeSvg');
    const nodesLayer = document.getElementById('scmNodesLayer');
    if (!stage || !svg || !nodesLayer) return;

    const stageW = stage.offsetWidth;
    const stageH = stage.offsetHeight;
    const cx = stageW / 2;
    const cy = stageH / 2;
    const spokeRadius = Math.min(stageW, stageH) * 0.36;

    const data = SCM_DATA.workplaceViz.primaryOrg;

    // Clear previous
    svg.innerHTML = '';
    nodesLayer.innerHTML = '';

    // Store line endpoints for dot animation
    const lineEndpoints = [];

    // Draw spokes + place nodes
    data.workplaces.forEach((wp, i) => {
      const end = polarToXY(cx, cy, spokeRadius, wp.angle);

      // SVG line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', end.x);
      line.setAttribute('y2', end.y);
      line.setAttribute('class', 'scm-spoke-line');
      line.setAttribute('id', `scmLine${i}`);
      const len = Math.hypot(end.x - cx, end.y - cy);
      line.setAttribute('stroke-dasharray', len);
      line.setAttribute('stroke-dashoffset', len); // starts hidden
      svg.appendChild(line);

      lineEndpoints.push({ cx, cy, ex: end.x, ey: end.y, len });

      // Workplace DOM node
      const node = document.createElement('div');
      node.className = 'scm-wp-node';
      node.id = `scmWpNode${i}`;
      node.style.left = end.x + 'px';
      node.style.top  = end.y + 'px';
      node.innerHTML = `
        <div class="scm-wp-node-inner">
          <div class="scm-wp-icon"><i class="fas ${wp.icon}"></i></div>
          <div class="scm-wp-name">${wp.name}</div>
          <div class="scm-wp-status ${wp.status}">${wp.status.toUpperCase()}</div>
          <div class="scm-wp-chips">
            <div class="scm-wp-chip">
              <i class="fas fa-location-pin"></i>
              <span>${wp.city}</span>
            </div>
            <div class="scm-wp-chip industry-chip">
              <i class="fas fa-industry"></i>
              <span>${wp.industry}</span>
            </div>
          </div>
        </div>
      `;
      nodesLayer.appendChild(node);
    });

    return { lineEndpoints, cx, cy, stageW, stageH };
  }

  // ---- BUILD ONE GHOST ORG ----
  function buildGhostOrg(ghostData, index) {
    const stage = document.getElementById('scmVizStage');
    const layer = document.getElementById('scmGhostLayer');
    if (!stage || !layer) return;

    const stageW = stage.offsetWidth;
    const stageH = stage.offsetHeight;
    const cx = stageW / 2;
    const cy = stageH / 2;
    const ghostRadius = Math.min(stageW, stageH) * 0.28;

    const ghostEl = document.createElement('div');
    ghostEl.className = 'scm-ghost-org';
    ghostEl.id = `scmGhost${index}`;
    ghostEl.style.width = stageW + 'px';
    ghostEl.style.height = stageH + 'px';
    ghostEl.style.left = '0';
    ghostEl.style.top = '0';
    ghostEl.style.transform = 'none'; // GSAP controls this

    // Ghost SVG for spoke lines
    const ghostSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ghostSvg.setAttribute('class', 'scm-ghost-spoke-svg');
    ghostSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    ghostEl.appendChild(ghostSvg);

    ghostData.workplaces.forEach((wp, i) => {
      const end = polarToXY(cx, cy, ghostRadius, wp.angle);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', end.x);
      line.setAttribute('y2', end.y);
      line.setAttribute('class', 'scm-ghost-spoke-line');
      line.setAttribute('stroke', ghostData.color);
      ghostSvg.appendChild(line);

      // Ghost workplace node
      const wpNode = document.createElement('div');
      wpNode.className = 'scm-ghost-wp-node';
      wpNode.style.position = 'absolute';
      wpNode.style.left = end.x + 'px';
      wpNode.style.top  = end.y + 'px';
      wpNode.innerHTML = `<div class="scm-ghost-wp-name">${wp.name}</div>`;
      ghostEl.appendChild(wpNode);
    });

    // Ghost hub
    const hub = document.createElement('div');
    hub.className = 'scm-ghost-hub';
    hub.style.position = 'absolute';
    hub.style.left = cx + 'px';
    hub.style.top  = cy + 'px';
    hub.style.borderColor = ghostData.color.replace(')', ', 0.3)').replace('rgb', 'rgba');
    hub.innerHTML = `
      <div class="scm-ghost-hub-icon">
        <i class="fas ${ghostData.icon}" style="color:${ghostData.color};opacity:0.7;font-size:1.1rem"></i>
      </div>
      <div class="scm-ghost-hub-name">${ghostData.name}</div>
    `;
    ghostEl.appendChild(hub);

    layer.appendChild(ghostEl);
    return ghostEl;
  }

  // ---- MAIN ANIMATION SEQUENCE ----
  function runWorkplaceAnimation() {
    if (isMobile()) {
      buildMobileView();
      return;
    }

    const refs = buildDesktopView();
    if (!refs) return;
    const { lineEndpoints } = refs;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

    // ACT 1 — Hub appears
    tl.from('#scmOrgHub .scm-hub-inner', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(2)'
    });

    // ACT 1 — Rings fade in
    tl.from('.scm-hub-ring', {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      stagger: 0.15,
      ease: 'power2.out'
    }, '-=0.2');

    // ACT 1 — Spoke lines draw (stroke-dashoffset 0)
    lineEndpoints.forEach((ep, i) => {
      tl.to(`#scmLine${i}`, {
        strokeDashoffset: 0,
        duration: 0.55,
        ease: 'power2.inOut'
      }, 0.4 + i * 0.1);
    });

    // ACT 1 — Workplace nodes pop in
    SCM_DATA.workplaceViz.primaryOrg.workplaces.forEach((_, i) => {
      tl.to(`#scmWpNode${i}`, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'back.out(2.5)'
      }, 0.7 + i * 0.12);
    });

    // ACT 1 — Dot packets start (after all nodes visible)
    // Dot packets are handled by a separate repeating loop (see below)
    tl.add(() => { startDotPackets(lineEndpoints); }, 1.6);

    // ACT 1 — Pause so user reads it
    tl.addPause('+=2');

    // ACT 2 — Marvel title punches in
    tl.to('#scmMarvelTitle', {
      opacity: 1,
      duration: 0.15,
      ease: 'power4.out'
    });

    tl.from('.scm-marvel-line1', {
      y: 30,
      opacity: 0,
      duration: 0.4,
      ease: 'back.out(2)'
    }, '-=0.1');

    tl.from('.scm-marvel-line2', {
      y: 20,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out'
    }, '-=0.2');

    // ACT 2 — Ghost orgs fly in (staggered)
    SCM_DATA.workplaceViz.ghostOrgs.forEach((ghostData, i) => {
      const ghostEl = buildGhostOrg(ghostData, i);
      if (!ghostEl) return;

      const { entryFrom, restAt } = ghostData;

      // Set initial position (off screen / rotated)
      gsap.set(ghostEl, {
        x: entryFrom.x,
        y: entryFrom.y,
        rotateY: entryFrom.rotateY,
        rotateZ: entryFrom.rotateZ,
        scale: entryFrom.scale,
        opacity: 0,
        transformPerspective: 900,
        zIndex: restAt.zIndex
      });

      // Fly to resting position
      tl.to(ghostEl, {
        x: restAt.x,
        y: restAt.y,
        rotateY: restAt.rotateY,
        rotateZ: restAt.rotateZ,
        scale: restAt.scale,
        opacity: restAt.opacity,
        duration: 0.7,
        ease: 'power3.out'
      }, `>-0.4`);
    });

    // ACT 3 — Gentle drift on ghost orgs
    tl.add(() => {
      document.querySelectorAll('.scm-ghost-org').forEach((el, i) => {
        gsap.to(el, {
          y: `+=${6 + i * 3}`,
          duration: 2.5 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });
    });

    // Reset: kill ghost orgs before repeat
    tl.add(() => {
      stopDotPackets();
      document.querySelectorAll('.scm-ghost-org').forEach(el => {
        gsap.killTweensOf(el);
        el.remove();
      });
      gsap.set('#scmMarvelTitle', { opacity: 0 });
    }, '+=4');
  }

  // ---- DOT PACKETS ----
  let dotPacketIntervals = [];
  let activeDots = [];

  function startDotPackets(lineEndpoints) {
    lineEndpoints.forEach((ep, i) => {
      const interval = setInterval(() => {
        if (document.hidden) return;
        const dot = document.createElement('div');
        dot.className = 'scm-dot-packet';
        document.getElementById('scmVizStage').appendChild(dot);
        activeDots.push(dot);

        gsap.fromTo(dot,
          { x: ep.cx, y: ep.cy, opacity: 0.9 },
          {
            x: ep.ex,
            y: ep.ey,
            opacity: 0,
            duration: 1.2,
            ease: 'power1.in',
            onComplete: () => { dot.remove(); activeDots = activeDots.filter(d => d !== dot); }
          }
        );
      }, 1800 + i * 220);

      dotPacketIntervals.push(interval);
    });
  }

  function stopDotPackets() {
    dotPacketIntervals.forEach(clearInterval);
    dotPacketIntervals = [];
    activeDots.forEach(d => d.remove());
    activeDots = [];
  }

  // ---- INIT ON SCROLL INTO VIEW ----
  const vizSection = document.getElementById('scmWorkplaceViz');
  if (vizSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.disconnect();
          runWorkplaceAnimation();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(vizSection);
  }

  // Re-init on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      stopDotPackets();
      gsap.killTweensOf('[id^=scmWpNode]');
      gsap.killTweensOf('[id^=scmLine]');
      gsap.killTweensOf('#scmOrgHub .scm-hub-inner');
      gsap.killTweensOf('#scmMarvelTitle');
      document.querySelectorAll('.scm-ghost-org').forEach(el => el.remove());
      gsap.set('#scmMarvelTitle', { opacity: 0 });
      runWorkplaceAnimation();
    }, 400);
  });

})();
// ============================================================
// END MODULE 1
// ============================================================
```

---

## 7. SPOKE RADIUS TUNING GUIDE

The spoke radius is `Math.min(stageW, stageH) * 0.36`.
- At 1280px wide stage → radius ≈ 200px
- At 991px → radius ≈ 172px
- At 768px → mobile view kicks in, no radius

If nodes clip the stage edge, reduce `0.36` to `0.30`.
If nodes feel too clustered, increase to `0.40`.

---

## 8. RESPONSIVE SUMMARY

| Breakpoint | Stage | Animation | Ghost Orgs | Marvel Title |
|---|---|---|---|---|
| ≥992px | 560px h, full viz | Full GSAP sequence | Yes, 4 ghosts | Yes |
| 768–991px | 480px h, full viz | Full GSAP sequence | Yes, scaled | Yes |
| <768px | Auto height, flex | Fade-in only | Hidden | Hidden |

---

## 9. WHAT TO LEAVE UNCHANGED

Everything outside the `scm-layout-hubspoke` div stays exactly as it is:
- Module header (number badge, title, tagline)
- CTA row (Explore / Why do I need this / Industry use cases)
- `<hr>` separator after the module

Only the inner creative layout block is replaced.

---

## 10. CHECKLIST

- [ ] `SCM_DATA` const defined at top of script block
- [ ] `scm-layout-hubspoke` replaces `scm-layout-newsroom`
- [ ] Hub appears with pulse rings on scroll into view
- [ ] 5 spoke lines draw with stroke-dashoffset animation
- [ ] 5 workplace nodes pop in with back.out easing
- [ ] Workplace chips (location + industry) visible on each node
- [ ] Dot packets animate along spokes continuously
- [ ] Marvel title punches in after 2s pause
- [ ] 4 ghost orgs fly in from different angles, settle behind main
- [ ] Ghost org drift animation runs in Act 3
- [ ] Sequence resets and replays automatically
- [ ] Mobile shows hub + vertical list, no SVG/GSAP
- [ ] prefers-reduced-motion respected
- [ ] No console.log in production code
- [ ] Feature strip (8 chips) renders below viz with AOS fade-up

---
*End of PRD — Workplace Management Visualization Renovation*
