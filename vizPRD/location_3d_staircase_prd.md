# Location Hierarchy Viz — 3D Staircase Bars PRD for Qwen
## Scope: Replace ONLY the location hierarchy viz inside MODULE 3
## Target: the `#scmLocStage` div and its inner `#scmLocIso` contents

---

## Visual Spec (from reference image)

- Dark navy stage background
- 5 rows in a LEFT-TO-RIGHT staircase — Row 1 (Building) starts at leftmost, each
  subsequent row indents further right, like stairs going down-right
- Each row: colored step number → 3D bar → dark description panel
- 3D bar has three visible faces: front (main color), top (lighter), right side (darker)
- White icon on the left section of each bar
- White bold label in the center of each bar
- Step numbers stay at the left edge — only the bar+desc indents per row
- Animation: each row slides in from right, staggered

---

## Step 1 — Update `#scmLocStage` background

Find `.scm-md-stage` and add a scoped override:

```css
#scmLocStage {
  background: #080d24;
  border-color: rgba(255,255,255,0.06);
  padding: clamp(16px, 2.5vw, 32px) clamp(12px, 2vw, 24px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(5px, 0.8vw, 10px);
  height: clamp(320px, 42vw, 560px);
}
```

---

## Step 2 — Replace `#scmLocIso` inner content (HTML)

Remove all existing children of `#scmLocIso`. Qwen should NOT build this in JS.
Instead replace `#scmLocIso` div itself with the following static HTML.
Also rename the inner id from `scmLocIso` to keep the observe() hook — just
empty it and inject via JS as shown in Step 5.

Actually: keep `#scmLocIso` as the mount point. The JS will inject the rows.
No changes to the HTML scaffold above the stage.

---

## Step 3 — Add CSS (add after existing `.scm-md-iso-*` rules, keep old rules)

```css
/* ---- Location 3D Staircase ---- */
#scmLocIso {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(5px, 0.8vw, 10px);
}

.scm-md-loc-row {
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 12px);
  opacity: 0;
}

.scm-md-loc-num {
  width: clamp(22px, 2.8vw, 34px);
  flex-shrink: 0;
  font-size: clamp(0.55rem, 0.9vw, 0.85rem);
  font-weight: 900;
  font-family: monospace;
  text-align: right;
  line-height: 1;
}

.scm-md-loc-inner {
  display: flex;
  flex: 1;
  align-items: stretch;
  min-width: 0;
  /* staircase margin applied per row via inline style */
}

/* ---- 3D Bar ---- */
.scm-md-loc-3d-bar {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.2vw, 16px);
  padding: 0 clamp(10px, 1.5vw, 20px);
  height: clamp(42px, 5.5vw, 64px);
  flex-shrink: 0;
  width: clamp(160px, 22vw, 290px);
  position: relative;
  /* depth constant */
  --d: clamp(9px, 1.2vw, 14px);
}

/* Top face — lighter parallelogram */
.scm-md-loc-3d-bar::before {
  content: '';
  position: absolute;
  top: calc(-1 * var(--d));
  left: 0;
  right: calc(-1 * var(--d));
  height: var(--d);
  background: var(--bar-lt);
  clip-path: polygon(var(--d) 0, 100% 0, calc(100% - var(--d)) 100%, 0 100%);
}

/* Right face — darker parallelogram */
.scm-md-loc-3d-bar::after {
  content: '';
  position: absolute;
  top: calc(-1 * var(--d));
  right: calc(-1 * var(--d));
  width: var(--d);
  height: calc(100% + var(--d));
  background: var(--bar-dk);
  clip-path: polygon(0 var(--d), 100% 0, 100% 100%, 0 100%);
}

.scm-md-loc-bar-icon {
  width: clamp(30px, 4vw, 48px);
  height: clamp(30px, 4vw, 48px);
  border-radius: 8px;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: clamp(0.75rem, 1.2vw, 1.1rem);
  color: white;
}

.scm-md-loc-bar-label {
  font-size: clamp(0.6rem, 1vw, 0.9rem);
  font-weight: 800;
  color: white;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  flex: 1;
  white-space: nowrap;
}

/* ---- Description panel ---- */
.scm-md-loc-desc {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border-left: 2px solid rgba(255,255,255,0.08);
  height: clamp(42px, 5.5vw, 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 clamp(10px, 1.5vw, 20px);
  min-width: 0;
  margin-left: 2px;
}

.scm-md-loc-desc-title {
  font-size: clamp(0.5rem, 0.75vw, 0.7rem);
  font-weight: 800;
  color: rgba(255,255,255,0.85);
  margin-bottom: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scm-md-loc-desc-text {
  font-size: clamp(0.4rem, 0.6vw, 0.58rem);
  color: rgba(255,255,255,0.4);
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Responsive: collapse staircase offset on very small screens */
@media (max-width: 480px) {
  .scm-md-loc-inner { margin-left: 0 !important; }
  .scm-md-loc-3d-bar { width: clamp(120px, 38vw, 180px); }
}
```

---

## Step 4 — DATA (inside existing SCM_DATA.masterDataViz)

Replace existing `locationLevels` array with this richer version:

```javascript
locationLevels: [
  {
    num:"01", label:"Building",  icon:"fa-building",
    color:"#10b981", light:"#6ee7b7", dark:"#059669",
    descTitle:"Building", descText:"Top-level physical container. All floors, zones, rooms, and shelves live under a building."
  },
  {
    num:"02", label:"Floor",     icon:"fa-layer-group",
    color:"#06b6d4", light:"#67e8f9", dark:"#0891b2",
    descTitle:"Floor", descText:"A physical storey within a building. Contains defined operational zones."
  },
  {
    num:"03", label:"Zone",      icon:"fa-vector-square",
    color:"#ec4899", light:"#f9a8d4", dark:"#db2777",
    descTitle:"Zone", descText:"Defined area on a floor — workshop, bay, stockroom section, or loading dock."
  },
  {
    num:"04", label:"Room",      icon:"fa-door-open",
    color:"#a855f7", light:"#d8b4fe", dark:"#9333ea",
    descTitle:"Room", descText:"Enclosed space within a zone. Maps to a specific storage or work room."
  },
  {
    num:"05", label:"Shelf",     icon:"fa-archive",
    color:"#f59e0b", light:"#fcd34d", dark:"#d97706",
    descTitle:"Shelf", descText:"Granular storage unit. Pinpoints exact item placement down to individual slots."
  }
],
```

---

## Step 5 — JS (replace the `observe('scmMdLocation', ...)` block entirely)

```javascript
observe('scmMdLocation', function () {
  const vp = $('scmLocIso');
  if (!vp || vp.dataset.built) return;
  vp.dataset.built = 1;
  vp.innerHTML = '';

  const levels = MD.locationLevels;
  const step   = 'clamp(20px, 3.5vw, 44px)';
  // Staircase: each row indents by (i * step)
  // We compute pixel values for margin-left inline using CSS calc

  levels.forEach((level, i) => {
    const row = document.createElement('div');
    row.className = 'scm-md-loc-row';

    // Step number
    const num = document.createElement('span');
    num.className = 'scm-md-loc-num';
    num.style.color = level.color;
    num.textContent = level.num;

    // Inner wrapper (holds bar + desc, gets the staircase indent)
    const inner = document.createElement('div');
    inner.className = 'scm-md-loc-inner';
    // CSS calc for responsive staircase
    inner.style.marginLeft = i === 0 ? '0' : `calc(${i} * clamp(20px, 3.5vw, 44px))`;

    // 3D Bar
    const bar = document.createElement('div');
    bar.className = 'scm-md-loc-3d-bar';
    bar.style.background = level.color;
    bar.style.setProperty('--bar-lt', level.light);
    bar.style.setProperty('--bar-dk', level.dark);

    const iconWrap = document.createElement('div');
    iconWrap.className = 'scm-md-loc-bar-icon';
    iconWrap.innerHTML = `<i class="fas ${level.icon}"></i>`;

    const labelEl = document.createElement('div');
    labelEl.className = 'scm-md-loc-bar-label';
    labelEl.textContent = level.label;

    bar.appendChild(iconWrap);
    bar.appendChild(labelEl);

    // Description panel
    const desc = document.createElement('div');
    desc.className = 'scm-md-loc-desc';
    desc.innerHTML = `
      <div class="scm-md-loc-desc-title">${level.descTitle}</div>
      <div class="scm-md-loc-desc-text">${level.descText}</div>`;

    inner.appendChild(bar);
    inner.appendChild(desc);
    row.appendChild(num);
    row.appendChild(inner);
    vp.appendChild(row);

    // Animate each row sliding in from right, staggered
    gsap.to(row, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      delay: 0.15 + i * 0.18,
      ease: 'power2.out',
      onStart: () => gsap.set(row, { x: 50 })
    });

    // Idle hover: subtle vertical float per bar
    gsap.to(bar, {
      y: -3,
      duration: 1.8 + i * 0.25,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.0 + i * 0.2
    });
  });
});
```

---

## Checklist
- [ ] `#scmLocStage` has dark background + correct padding + flex column layout
- [ ] Old `.scm-md-iso-layer` CSS left untouched (it's unused now but harmless)
- [ ] New `.scm-md-loc-*` CSS rules added
- [ ] `locationLevels` array in `SCM_DATA.masterDataViz` updated with new fields
- [ ] `observe('scmMdLocation', ...)` block replaced entirely
- [ ] 5 rows render with staircase `margin-left` increasing per row
- [ ] Each bar has correct `--bar-lt` and `--bar-dk` CSS custom properties set inline
- [ ] `::before` top face and `::after` right face visible on each bar
- [ ] Step numbers use `level.color`
- [ ] Rows animate in from right with stagger (x: 50 → 0)
- [ ] Bars idle-float vertically after entry animation
- [ ] No changes to MODULE 1, 2, or other MODULE 3 sections
