# Workplace Management Visualization — Instructions for Qwen Coder

## Task
In `content_moderation.html`, replace the inner creative layout block of Module 01 (Workplace Management) with the hub-and-spoke animation described below. Do not touch anything outside the layout block — module header, CTA row, and `<hr>` stay as-is.

All new CSS goes in the existing `<style>` tag in `<head>`, prefixed `scm-`.
All new JS goes in the existing `<script>` tag at bottom of `<body>`.
No new files. No external scripts beyond what is already in the page.

---

## Data

At the very top of the `<script>` block, define this before all other JS:

```javascript
const SCM_DATA = {
  workplaceViz: {
    primaryOrg: {
      name: "Precision Auto Works",
      tagline: "Automotive Service Chain",
      icon: "fa-wrench",
      workplaces: [
        { id:"wp0", name:"Malviya Nagar",   city:"Jaipur",  industry:"Automotive Service", icon:"fa-wrench",   status:"open",   angle:330 },
        { id:"wp1", name:"Vaishali Nagar",  city:"Jaipur",  industry:"Automotive Service", icon:"fa-wrench",   status:"open",   angle:45  },
        { id:"wp2", name:"Tonk Road",       city:"Jaipur",  industry:"Automotive Service", icon:"fa-wrench",   status:"closed", angle:110 },
        { id:"wp3", name:"Mansarovar",      city:"Jaipur",  industry:"Automotive Service", icon:"fa-wrench",   status:"open",   angle:185 },
        { id:"wp4", name:"Sitapura RIICO",  city:"Jaipur",  industry:"Industrial Area",    icon:"fa-industry", status:"open",   angle:255 }
      ]
    },
    ghostOrgs: [
      {
        name:"Mehta Pharmaceuticals", industry:"Pharmaceutical Mfg.", icon:"fa-pills", color:"#a78bfa",
        workplaces:[
          { name:"Bhiwadi Plant A",   city:"Bhiwadi",   icon:"fa-industry", status:"open",   angle:340 },
          { name:"Neemrana Plant B",  city:"Neemrana",  icon:"fa-industry", status:"open",   angle:60  },
          { name:"Jaipur Warehouse",  city:"Jaipur",    icon:"fa-warehouse",status:"open",   angle:160 }
        ],
        entryFrom:{ x:-320, y:-80,  rotateY:-55, rotateZ:-8,  scale:0.7  },
        restAt:   { x:-110, y:20,   rotateY:-22, rotateZ:-3,  scale:0.82, opacity:0.32, zIndex:3 }
      },
      {
        name:"Grand Spice Hotels", industry:"Hospitality Group", icon:"fa-hotel", color:"#f59e0b",
        workplaces:[
          { name:"Flagship Jodhpur", city:"Jodhpur", icon:"fa-hotel",          status:"open",   angle:30  },
          { name:"Resort Udaipur",   city:"Udaipur", icon:"fa-umbrella-beach", status:"open",   angle:120 },
          { name:"Budget Inn Ajmer", city:"Ajmer",   icon:"fa-bed",            status:"closed", angle:210 },
          { name:"Jaipur Cafe",      city:"Jaipur",  icon:"fa-utensils",       status:"open",   angle:290 }
        ],
        entryFrom:{ x:350,  y:-60,  rotateY:60,  rotateZ:10,  scale:0.65 },
        restAt:   { x:120,  y:30,   rotateY:25,  rotateZ:4,   scale:0.80, opacity:0.28, zIndex:2 }
      },
      {
        name:"Rajputana Cold Chain", industry:"Logistics & Storage", icon:"fa-truck", color:"#4ade80",
        workplaces:[
          { name:"Jaipur Hub Depot", city:"Jaipur", icon:"fa-truck",    status:"open", angle:50  },
          { name:"Kota Depot",       city:"Kota",   icon:"fa-truck",    status:"open", angle:170 },
          { name:"Alwar Cold Store", city:"Alwar",  icon:"fa-warehouse",status:"open", angle:280 }
        ],
        entryFrom:{ x:-280, y:120,  rotateY:-45, rotateZ:12,  scale:0.6  },
        restAt:   { x:-80,  y:55,   rotateY:-15, rotateZ:5,   scale:0.75, opacity:0.22, zIndex:1 }
      },
      {
        name:"Sterling Fabricators", industry:"Metal Fabrication", icon:"fa-industry", color:"#fb923c",
        workplaces:[
          { name:"Sitapura Plant 1",  city:"Jaipur",  icon:"fa-industry", status:"open", angle:20  },
          { name:"Bhiwadi Plant 2",   city:"Bhiwadi", icon:"fa-industry", status:"open", angle:100 },
          { name:"Jaipur Warehouse",  city:"Jaipur",  icon:"fa-warehouse",status:"open", angle:200 },
          { name:"Delhi Office",      city:"Delhi",   icon:"fa-building", status:"open", angle:290 }
        ],
        entryFrom:{ x:260,  y:130,  rotateY:50,  rotateZ:-12, scale:0.62 },
        restAt:   { x:90,   y:60,   rotateY:18,  rotateZ:-4,  scale:0.73, opacity:0.18, zIndex:0 }
      }
    ]
  }
};
```

---

## HTML

Replace the existing `scm-layout-newsroom` div with:

```html
<div class="scm-layout-hubspoke" id="scmWorkplaceViz">

  <div class="scm-viz-stage" id="scmVizStage">

    <!-- Ghost orgs render here (behind everything) -->
    <div class="scm-ghost-layer" id="scmGhostLayer"></div>

    <!-- Main org layer -->
    <div class="scm-main-org-layer" id="scmMainOrgLayer">

      <svg class="scm-spoke-svg" id="scmSpokeSvg" xmlns="http://www.w3.org/2000/svg"></svg>

      <div class="scm-org-hub" id="scmOrgHub">
        <div class="scm-hub-ring scm-hub-ring-1"></div>
        <div class="scm-hub-ring scm-hub-ring-2"></div>
        <div class="scm-hub-inner">
          <div class="scm-hub-icon"><i class="fas fa-building"></i></div>
          <div class="scm-hub-label">ORGANISATION</div>
          <div class="scm-hub-name">Precision Auto Works</div>
          <div class="scm-hub-industry"><i class="fas fa-wrench"></i> Automotive Service</div>
        </div>
      </div>

      <div class="scm-nodes-layer" id="scmNodesLayer"></div>

    </div>

    <!-- Title overlay — hidden until Act 2 -->
    <div class="scm-marvel-title" id="scmMarvelTitle">
      <span class="scm-marvel-line1">1 organisation or 50</span>
      <span class="scm-marvel-line2">Sapphire has got you covered.</span>
    </div>

  </div>

  <!-- Feature chips below the viz -->
  <div class="row g-3 mt-4">
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="0">
      <div class="scm-strip-chip"><i class="fas fa-building s-text-gradient-primary"></i><span>Unlimited Workplaces</span></div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">
      <div class="scm-strip-chip"><i class="fas fa-clock s-text-gradient-amber"></i><span>Overlapping Shifts</span></div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">
      <div class="scm-strip-chip"><i class="fas fa-circle-dot s-text-gradient-green"></i><span>Live Open / Closed Status</span></div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="300">
      <div class="scm-strip-chip"><i class="fas fa-boxes-stacked s-text-gradient-info"></i><span>Real-Time Asset Count</span></div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="0">
      <div class="scm-strip-chip"><i class="fas fa-scroll s-text-gradient-royal"></i><span>Live Activity Log</span></div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">
      <div class="scm-strip-chip"><i class="fas fa-user-shield s-text-gradient-indigo"></i><span>Role-Based Visibility</span></div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">
      <div class="scm-strip-chip"><i class="fas fa-clipboard-check s-text-gradient-danger"></i><span>Inspection on Log-in</span></div>
    </div>
    <div class="col-6 col-lg-3" data-aos="fade-up" data-aos-delay="300">
      <div class="scm-strip-chip"><i class="fas fa-globe s-text-gradient-pop"></i><span>Multi-Industry Ready</span></div>
    </div>
  </div>

</div>
```

---

## CSS

Add inside `<style>` tag:

```css
/* Stage */
.scm-viz-stage {
  position: relative;
  width: 100%;
  height: 560px;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(160deg, var(--s-primary-980) 0%, var(--s-primary-940) 60%, var(--s-primary-920) 100%);
  border: 1px solid rgba(34,211,238,0.1);
}

/* SVG lines layer */
.scm-spoke-svg {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 2;
}
.scm-spoke-line {
  fill: none;
  stroke: rgba(34,211,238,0.25);
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
}

/* Org Hub */
.scm-main-org-layer {
  position: absolute;
  inset: 0;
  z-index: 4;
}
.scm-org-hub {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 130px; height: 130px;
  z-index: 6;
}
.scm-hub-ring {
  position: absolute;
  top: 50%; left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(34,211,238,0.18);
  transform: translate(-50%,-50%);
  animation: scmRingPulse 3s ease-out infinite;
}
.scm-hub-ring-1 { width: 170px; height: 170px; animation-delay: 0s; }
.scm-hub-ring-2 { width: 215px; height: 215px; animation-delay: 1.2s; }
@keyframes scmRingPulse {
  0%   { opacity: 0.55; transform: translate(-50%,-50%) scale(0.93); }
  70%  { opacity: 0.1; }
  100% { opacity: 0; transform: translate(-50%,-50%) scale(1.35); }
}
.scm-hub-inner {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(34,211,238,0.13), rgba(34,211,238,0.04));
  border: 1.5px solid rgba(34,211,238,0.55);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 0.75rem 0.5rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 30px rgba(34,211,238,0.12), inset 0 1px 0 rgba(255,255,255,0.07);
}
.scm-hub-icon { font-size: 1.4rem; color: #22d3ee; }
.scm-hub-label {
  font-size: 0.48rem;
  letter-spacing: 0.15em;
  font-weight: 800;
  color: rgba(34,211,238,0.55);
  font-family: monospace;
}
.scm-hub-name {
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  text-align: center;
  line-height: 1.3;
  padding: 0 4px;
}
.scm-hub-industry {
  font-size: 0.52rem;
  color: rgba(255,255,255,0.45);
  display: flex;
  align-items: center;
  gap: 3px;
}

/* Workplace nodes */
.scm-nodes-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}
.scm-wp-node {
  position: absolute;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}
.scm-wp-node-inner {
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04));
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px;
  padding: 0.5rem 0.7rem;
  min-width: 100px;
  max-width: 118px;
  text-align: center;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
.scm-wp-icon { font-size: 0.85rem; color: rgba(34,211,238,0.8); margin-bottom: 2px; }
.scm-wp-name { font-size: 0.6rem; font-weight: 700; color: rgba(255,255,255,0.88); line-height: 1.3; margin-bottom: 2px; }
.scm-wp-status { font-size: 0.48rem; font-weight: 800; letter-spacing: 0.1em; font-family: monospace; }
.scm-wp-status.open   { color: #4ade80; }
.scm-wp-status.closed { color: #f87171; }
.scm-wp-chips { display: flex; flex-direction: column; gap: 3px; margin-top: 4px; align-items: center; }
.scm-wp-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.47rem;
  color: rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 5px;
  padding: 1px 5px;
  white-space: nowrap;
}
.scm-wp-chip .scm-pin-icon { color: #f87171; font-size: 0.44rem; }
.scm-wp-chip .scm-ind-icon { color: rgba(34,211,238,0.7); font-size: 0.44rem; }

/* Dot packets */
.scm-dot-packet {
  position: absolute;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #22d3ee;
  box-shadow: 0 0 6px rgba(34,211,238,0.9);
  pointer-events: none;
  z-index: 7;
}

/* Ghost layer */
.scm-ghost-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  perspective: 900px;
  perspective-origin: 50% 50%;
}
.scm-ghost-org {
  position: absolute;
  top: 0; left: 0;
  opacity: 0;
  will-change: transform, opacity;
}
.scm-ghost-spoke-svg {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}
.scm-ghost-spoke-line { fill: none; stroke-width: 1; stroke-dasharray: 4 4; opacity: 0.35; }
.scm-ghost-hub {
  position: absolute;
  width: 88px; height: 88px;
  transform: translate(-50%,-50%);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 0.4rem;
}
.scm-ghost-hub-name { font-size: 0.48rem; font-weight: 700; color: rgba(255,255,255,0.65); text-align: center; line-height: 1.2; }
.scm-ghost-wp-node {
  position: absolute;
  transform: translate(-50%,-50%);
  border-radius: 7px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.03);
  padding: 2px 6px;
  min-width: 60px;
  text-align: center;
}
.scm-ghost-wp-name { font-size: 0.44rem; color: rgba(255,255,255,0.45); font-weight: 600; }

/* Marvel title */
.scm-marvel-title {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  z-index: 20;
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}
.scm-marvel-line1 {
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  font-weight: 900;
  color: rgba(255,255,255,0.93);
  letter-spacing: -0.02em;
  text-shadow: 0 0 40px rgba(34,211,238,0.35);
}
.scm-marvel-line2 {
  font-size: clamp(0.9rem, 1.8vw, 1.3rem);
  font-weight: 600;
  color: #22d3ee;
}

/* Feature strip */
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
.scm-strip-chip:hover { border-color: rgba(34,211,238,0.4); }
.scm-strip-chip i { font-size: 0.9rem; flex-shrink: 0; }

/* Responsive */
@media (max-width: 991px) {
  .scm-viz-stage { height: 480px; }
  .scm-org-hub { width: 110px; height: 110px; }
  .scm-hub-ring-1 { width: 144px; height: 144px; }
  .scm-hub-ring-2 { width: 182px; height: 182px; }
  .scm-wp-node-inner { min-width: 84px; max-width: 100px; }
}
@media (max-width: 767px) {
  .scm-viz-stage { height: auto; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; }
  .scm-spoke-svg, .scm-nodes-layer, .scm-ghost-layer, .scm-hub-ring { display: none; }
  .scm-org-hub { position: relative; top: auto; left: auto; transform: none; margin-bottom: 1rem; width: 110px; height: 110px; }
  .scm-main-org-layer { position: relative; display: flex; flex-direction: column; align-items: center; }
  .scm-marvel-title { display: none; }
  .scm-mobile-wp-list { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
  .scm-mobile-wp-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.6rem 1rem;
    background: rgba(255,255,255,0.06);
    border-radius: 10px;
    border-left: 3px solid rgba(34,211,238,0.4);
    font-size: 0.78rem;
    color: rgba(255,255,255,0.8);
  }
  .scm-mobile-wp-item i { color: #22d3ee; }
  .scm-mobile-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-left: auto; }
  .scm-mobile-status-dot.open { background: #4ade80; }
  .scm-mobile-status-dot.closed { background: #f87171; }
}
@media (prefers-reduced-motion: reduce) {
  .scm-hub-ring { animation: none !important; }
}
```

---

## JS

Add inside the single `<script>` block. Place it after `AOS.init()` and `gsap.registerPlugin(ScrollTrigger)`.

```javascript
// ---- MODULE 1: Workplace Viz ----
(function () {

  function isMobile() { return window.innerWidth < 768; }

  function polar(cx, cy, r, deg) {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function buildMobile() {
    const layer = document.getElementById('scmNodesLayer');
    if (!layer) return;
    const list = document.createElement('div');
    list.className = 'scm-mobile-wp-list';
    SCM_DATA.workplaceViz.primaryOrg.workplaces.forEach(wp => {
      const el = document.createElement('div');
      el.className = 'scm-mobile-wp-item';
      el.innerHTML = `<i class="fas ${wp.icon}"></i><span>${wp.name}, ${wp.city}</span><div class="scm-mobile-status-dot ${wp.status}"></div>`;
      list.appendChild(el);
    });
    layer.appendChild(list);
  }

  function buildDesktop() {
    const stage  = document.getElementById('scmVizStage');
    const svg    = document.getElementById('scmSpokeSvg');
    const nLayer = document.getElementById('scmNodesLayer');
    if (!stage || !svg || !nLayer) return null;

    svg.innerHTML = '';
    nLayer.innerHTML = '';

    const W  = stage.offsetWidth;
    const H  = stage.offsetHeight;
    const cx = W / 2;
    const cy = H / 2;
    const R  = Math.min(W, H) * 0.36;
    const eps = [];

    SCM_DATA.workplaceViz.primaryOrg.workplaces.forEach((wp, i) => {
      const end = polar(cx, cy, R, wp.angle);
      const len = Math.hypot(end.x - cx, end.y - cy);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx); line.setAttribute('y1', cy);
      line.setAttribute('x2', end.x); line.setAttribute('y2', end.y);
      line.setAttribute('class', 'scm-spoke-line');
      line.setAttribute('id', `scmLine${i}`);
      line.setAttribute('stroke-dasharray', len);
      line.setAttribute('stroke-dashoffset', len);
      svg.appendChild(line);
      eps.push({ cx, cy, ex: end.x, ey: end.y });

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
            <div class="scm-wp-chip"><i class="fas fa-location-pin scm-pin-icon"></i><span>${wp.city}</span></div>
            <div class="scm-wp-chip"><i class="fas fa-industry scm-ind-icon"></i><span>${wp.industry}</span></div>
          </div>
        </div>`;
      nLayer.appendChild(node);
    });

    return { eps, cx, cy, W, H };
  }

  function buildGhost(ghostData, idx, W, H) {
    const cx = W / 2, cy = H / 2;
    const R  = Math.min(W, H) * 0.27;
    const layer = document.getElementById('scmGhostLayer');
    if (!layer) return null;

    const wrap = document.createElement('div');
    wrap.className = 'scm-ghost-org';
    wrap.id = `scmGhost${idx}`;
    wrap.style.cssText = `width:${W}px;height:${H}px;`;

    const gSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    gSvg.setAttribute('class', 'scm-ghost-spoke-svg');
    wrap.appendChild(gSvg);

    ghostData.workplaces.forEach(wp => {
      const end = polar(cx, cy, R, wp.angle);
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', cx); l.setAttribute('y1', cy);
      l.setAttribute('x2', end.x); l.setAttribute('y2', end.y);
      l.setAttribute('class', 'scm-ghost-spoke-line');
      l.setAttribute('stroke', ghostData.color);
      gSvg.appendChild(l);

      const wn = document.createElement('div');
      wn.className = 'scm-ghost-wp-node';
      wn.style.cssText = `position:absolute;left:${end.x}px;top:${end.y}px;`;
      wn.innerHTML = `<div class="scm-ghost-wp-name">${wp.name}</div>`;
      wrap.appendChild(wn);
    });

    const hub = document.createElement('div');
    hub.className = 'scm-ghost-hub';
    hub.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;`;
    hub.innerHTML = `
      <i class="fas ${ghostData.icon}" style="font-size:1.1rem;color:${ghostData.color};opacity:0.7;"></i>
      <div class="scm-ghost-hub-name">${ghostData.name}</div>`;
    wrap.appendChild(hub);

    layer.appendChild(wrap);
    return wrap;
  }

  let dotIntervals = [];
  let activeDots   = [];

  function startDots(eps) {
    eps.forEach((ep, i) => {
      const iv = setInterval(() => {
        if (document.hidden) return;
        const stage = document.getElementById('scmVizStage');
        if (!stage) return;
        const dot = document.createElement('div');
        dot.className = 'scm-dot-packet';
        stage.appendChild(dot);
        activeDots.push(dot);
        gsap.fromTo(dot,
          { x: ep.cx, y: ep.cy, opacity: 1 },
          { x: ep.ex, y: ep.ey, opacity: 0, duration: 1.3, ease: 'power1.in',
            onComplete: () => { dot.remove(); activeDots = activeDots.filter(d => d !== dot); } }
        );
      }, 1900 + i * 230);
      dotIntervals.push(iv);
    });
  }

  function stopDots() {
    dotIntervals.forEach(clearInterval);
    dotIntervals = [];
    activeDots.forEach(d => d.remove());
    activeDots = [];
  }

  function cleanup() {
    stopDots();
    gsap.killTweensOf('#scmOrgHub .scm-hub-inner');
    gsap.killTweensOf('.scm-hub-ring');
    gsap.killTweensOf('#scmMarvelTitle');
    gsap.killTweensOf('.scm-marvel-line1');
    gsap.killTweensOf('.scm-marvel-line2');
    document.querySelectorAll('[id^=scmLine]').forEach(el => gsap.killTweensOf(el));
    document.querySelectorAll('[id^=scmWpNode]').forEach(el => gsap.killTweensOf(el));
    document.querySelectorAll('.scm-ghost-org').forEach(el => { gsap.killTweensOf(el); el.remove(); });
    gsap.set('#scmMarvelTitle', { opacity: 0 });
  }

  function runAnim() {
    if (isMobile()) { buildMobile(); return; }

    cleanup();
    const refs = buildDesktop();
    if (!refs) return;
    const { eps, W, H } = refs;

    // Set hub hidden before animate
    gsap.set('#scmOrgHub .scm-hub-inner', { scale: 0, opacity: 0 });
    gsap.set('.scm-hub-ring', { scale: 0, opacity: 0 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2, onRepeat: cleanup });

    // ACT 1
    tl.to('#scmOrgHub .scm-hub-inner', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' });
    tl.to('.scm-hub-ring', { scale: 1, opacity: 1, duration: 0.4, stagger: 0.15, ease: 'power2.out' }, '-=0.2');

    eps.forEach((_, i) => {
      const el = document.getElementById(`scmLine${i}`);
      if (!el) return;
      const len = parseFloat(el.getAttribute('stroke-dasharray'));
      tl.to(`#scmLine${i}`, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, 0.4 + i * 0.1);
    });

    SCM_DATA.workplaceViz.primaryOrg.workplaces.forEach((_, i) => {
      tl.to(`#scmWpNode${i}`, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.5)' }, 0.65 + i * 0.12);
    });

    tl.add(() => startDots(eps), 1.7);
    tl.addPause('+=2.2');

    // ACT 2 — Marvel title
    tl.to('#scmMarvelTitle', { opacity: 1, duration: 0.12 });
    tl.from('.scm-marvel-line1', { y: 28, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, '-=0.05');
    tl.from('.scm-marvel-line2', { y: 18, opacity: 0, duration: 0.35, ease: 'power2.out' }, '-=0.2');

    // ACT 2 — Ghost orgs
    SCM_DATA.workplaceViz.ghostOrgs.forEach((g, i) => {
      const el = buildGhost(g, i, W, H);
      if (!el) return;
      gsap.set(el, {
        x: g.entryFrom.x, y: g.entryFrom.y,
        rotateY: g.entryFrom.rotateY, rotateZ: g.entryFrom.rotateZ,
        scale: g.entryFrom.scale, opacity: 0,
        transformPerspective: 900, zIndex: g.restAt.zIndex
      });
      tl.to(el, {
        x: g.restAt.x, y: g.restAt.y,
        rotateY: g.restAt.rotateY, rotateZ: g.restAt.rotateZ,
        scale: g.restAt.scale, opacity: g.restAt.opacity,
        duration: 0.7, ease: 'power3.out'
      }, '>-0.4');
    });

    // ACT 3 — Drift
    tl.add(() => {
      document.querySelectorAll('.scm-ghost-org').forEach((el, i) => {
        gsap.to(el, { y: `+=${6 + i * 3}`, duration: 2.5 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      });
    });

    tl.addPause('+=4');
  }

  // Init on scroll into view
  const section = document.getElementById('scmWorkplaceViz');
  if (section) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { obs.disconnect(); runAnim(); }
    }, { threshold: 0.25 });
    obs.observe(section);
  }

  // Re-init on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(runAnim, 400);
  });

})();
// ---- END MODULE 1 ----
```

---

## Checklist
- [ ] `SCM_DATA` const defined at very top of `<script>` block
- [ ] `scm-layout-hubspoke` replaces `scm-layout-newsroom` only — nothing else changed
- [ ] Hub appears with `back.out(2)` spring pop
- [ ] 5 spokes draw with `stroke-dashoffset` animation
- [ ] 5 workplace nodes pop in staggered after spokes
- [ ] Each node has location chip (red pin) + industry chip (cyan industry icon)
- [ ] Dot packets animate outward along spokes continuously
- [ ] 2.2s pause after nodes appear so user can read
- [ ] Marvel title punches in — line 1 then line 2
- [ ] 4 ghost org trees fly in staggered from `entryFrom` to `restAt` positions
- [ ] Ghost orgs drift slowly after settling (Act 3)
- [ ] Sequence loops automatically (repeats from top after 4s hold)
- [ ] Mobile (< 768px): hub + vertical list only, no SVG, no ghosts, no Marvel title
- [ ] `prefers-reduced-motion`: pulse ring animation disabled
- [ ] No `console.log` in final code
