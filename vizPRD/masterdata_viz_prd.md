# MODULE 3 Master Data Management — Individual Viz PRD for Qwen

## Architecture
Replace the entire `scm-layout-taxonomy` div with a new layout.
Each of the 8 data types gets its own `scm-md-section` block stacked vertically.
Each block = viz canvas (left ~58% desktop) + description panel (right ~38% desktop).
On mobile: stacked, viz on top, description below.
All CSS prefix: `scm-md-`. All JS in one IIFE: `MODULE 3 — MASTER DATA VIZ`.
8 separate init functions, each triggered by its own IntersectionObserver.

---

## HTML — replace `<div class="scm-layout-taxonomy">…</div>` with:

```html
<div class="scm-md-layout" id="scmMasterDataLayout">

  <!-- 1. Location Hierarchy -->
  <div class="scm-md-section" id="scmMdLocation" data-aos="fade-up">
    <div class="scm-md-viz-panel">
      <div class="scm-md-stage" id="scmLocStage">
        <div class="scm-md-iso-viewport" id="scmLocIso"></div>
      </div>
    </div>
    <div class="scm-md-desc-panel">
      <span class="s-pill s-pill-info s-pill-round-sm s-pill-sm">Location</span>
      <h5 class="scm-md-desc-title">Location Hierarchy</h5>
      <p class="scm-md-desc-text">Define your facility's physical layout down to individual shelves and drawers. 5 levels — Building, Floor, Zone, Room, Shelf — all fully configurable.</p>
    </div>
  </div>

  <!-- 2. Units of Measurement -->
  <div class="scm-md-section scm-md-section-alt" id="scmMdUnits" data-aos="fade-up">
    <div class="scm-md-desc-panel">
      <span class="s-pill s-pill-green s-pill-round-sm s-pill-sm">Units</span>
      <h5 class="scm-md-desc-title">Units of Measurement</h5>
      <p class="scm-md-desc-text">Operation-specific measurement units with automatic conversion. Define custom unit pairs that match your actual workflows.</p>
    </div>
    <div class="scm-md-viz-panel">
      <div class="scm-md-stage" id="scmUnitsStage">
        <div class="scm-md-flip-carousel" id="scmUnitsCarousel"></div>
      </div>
    </div>
  </div>

  <!-- 3. Tax Management -->
  <div class="scm-md-section" id="scmMdTax" data-aos="fade-up">
    <div class="scm-md-viz-panel">
      <div class="scm-md-stage" id="scmTaxStage">
        <div class="scm-md-dial-wrap" id="scmTaxDials"></div>
      </div>
    </div>
    <div class="scm-md-desc-panel">
      <span class="s-pill s-pill-amber s-pill-round-sm s-pill-sm">Tax</span>
      <h5 class="scm-md-desc-title">Tax Management</h5>
      <p class="scm-md-desc-text">Configure SGST, CGST and IGST rates independently per transaction type. No waiting for platform updates — your rates, your control.</p>
    </div>
  </div>

  <!-- 4. Fuel Types -->
  <div class="scm-md-section scm-md-section-alt" id="scmMdFuel" data-aos="fade-up">
    <div class="scm-md-desc-panel">
      <span class="s-pill s-pill-danger s-pill-round-sm s-pill-sm">Fuel</span>
      <h5 class="scm-md-desc-title">Fuel Types</h5>
      <p class="scm-md-desc-text">Categorize and track fuel types across your operation. Grade-level classification for Petrol, Diesel, CNG, and Electric assets.</p>
    </div>
    <div class="scm-md-viz-panel">
      <div class="scm-md-stage" id="scmFuelStage">
        <div class="scm-md-fuel-grid" id="scmFuelGrid"></div>
      </div>
    </div>
  </div>

  <!-- 5. Brands & OEMs -->
  <div class="scm-md-section" id="scmMdBrands" data-aos="fade-up">
    <div class="scm-md-viz-panel">
      <div class="scm-md-stage" id="scmBrandsStage">
        <div class="scm-md-logo-wall" id="scmLogoWall"></div>
      </div>
    </div>
    <div class="scm-md-desc-panel">
      <span class="s-pill s-pill-royal s-pill-round-sm s-pill-sm">Brands</span>
      <h5 class="scm-md-desc-title">Brands &amp; OEMs</h5>
      <p class="scm-md-desc-text">Manage equipment brands with star ratings and manufacturer metadata. Full OEM catalog with categorized brand-to-asset mapping.</p>
    </div>
  </div>

  <!-- 6. Holiday Calendar -->
  <div class="scm-md-section scm-md-section-alt" id="scmMdCalendar" data-aos="fade-up">
    <div class="scm-md-desc-panel">
      <span class="s-pill s-pill-indigo s-pill-round-sm s-pill-sm">Calendar</span>
      <h5 class="scm-md-desc-title">Holiday Calendar</h5>
      <p class="scm-md-desc-text">Define operational holidays per location. Weekends, national holidays, and custom regional holidays — all configurable and location-specific.</p>
    </div>
    <div class="scm-md-viz-panel">
      <div class="scm-md-stage" id="scmCalStage">
        <div class="scm-md-cal-wrap" id="scmCalWrap"></div>
      </div>
    </div>
  </div>

  <!-- 7. Departments -->
  <div class="scm-md-section" id="scmMdDepts" data-aos="fade-up">
    <div class="scm-md-viz-panel">
      <div class="scm-md-stage" id="scmDeptStage">
        <svg class="scm-md-sankey-svg" id="scmDeptSvg" xmlns="http://www.w3.org/2000/svg"></svg>
        <div class="scm-md-sankey-nodes" id="scmDeptNodes"></div>
      </div>
    </div>
    <div class="scm-md-desc-panel">
      <span class="s-pill s-pill-pop s-pill-round-sm s-pill-sm">Departments</span>
      <h5 class="scm-md-desc-title">Departments</h5>
      <p class="scm-md-desc-text">Define department hierarchy for routing and reporting. Employees, managers, and HODs assigned per department with full visibility.</p>
    </div>
  </div>

  <!-- 8. Titles & Designations -->
  <div class="scm-md-section scm-md-section-alt" id="scmMdTitles" data-aos="fade-up">
    <div class="scm-md-desc-panel">
      <span class="s-pill s-pill-success s-pill-round-sm s-pill-sm">Titles</span>
      <h5 class="scm-md-desc-title">Titles &amp; Designations</h5>
      <p class="scm-md-desc-text">Standardize job titles across your organization. Each role in the hierarchy maps to a configurable set of designations.</p>
    </div>
    <div class="scm-md-viz-panel">
      <div class="scm-md-stage" id="scmTitlesStage">
        <div class="scm-md-pyramid-wrap" id="scmPyramidWrap"></div>
        <svg class="scm-md-pyramid-svg" id="scmPyramidSvg" xmlns="http://www.w3.org/2000/svg"></svg>
        <div class="scm-md-pyramid-labels" id="scmPyramidLabels"></div>
      </div>
    </div>
  </div>

</div>
```

---

## DATA — add `masterDataViz` to SCM_DATA:

```javascript
masterDataViz: {

  locationLevels: [
    { label:"Building",  icon:"fa-building",     color:"#0891b2", depth:0 },
    { label:"Floor",     icon:"fa-layer-group",  color:"#0ea5e9", depth:1 },
    { label:"Zone",      icon:"fa-vector-square",color:"#38bdf8", depth:2 },
    { label:"Room",      icon:"fa-door-open",    color:"#7dd3fc", depth:3 },
    { label:"Shelf",     icon:"fa-shelves",      color:"#bae6fd", depth:4 }
  ],

  unitConversions: [
    { fromQty:1,  fromUnit:"Barrel",  fromIcon:"fa-oil-can",       toQty:159,  toUnit:"Litres",   toIcon:"fa-flask",        label:"Petroleum Storage"  },
    { fromQty:1,  fromUnit:"Pallet",  fromIcon:"fa-pallet",        toQty:48,   toUnit:"Boxes",    toIcon:"fa-box",          label:"Warehouse Logistics" },
    { fromQty:1,  fromUnit:"Tonne",   fromIcon:"fa-weight-hanging",toQty:1000, toUnit:"Kilograms",toIcon:"fa-scale-balanced",label:"Heavy Goods"        },
    { fromQty:1,  fromUnit:"Gross",   fromIcon:"fa-cubes",         toQty:144,  toUnit:"Units",    toIcon:"fa-cube",         label:"Bulk Stationery"    },
    { fromQty:1,  fromUnit:"Kit",     fromIcon:"fa-toolbox",       toQty:8,    toUnit:"Parts",    toIcon:"fa-screwdriver",  label:"Maintenance Kit"    },
    { fromQty:1,  fromUnit:"Drum",    fromIcon:"fa-drum",          toQty:200,  toUnit:"Litres",   toIcon:"fa-droplet",      label:"Chemical Store"     }
  ],

  taxGroups: [
    {
      group:"SGST", color:"#0891b2",
      rates:[
        { pct:2.5,  label:"Basic Goods" },
        { pct:6,    label:"FMCG / Food" },
        { pct:9,    label:"Services"    },
        { pct:14,   label:"Luxury Goods"}
      ]
    },
    {
      group:"CGST", color:"#7c3aed",
      rates:[
        { pct:2.5,  label:"Basic Goods" },
        { pct:6,    label:"FMCG / Food" },
        { pct:9,    label:"Services"    },
        { pct:14,   label:"Luxury Goods"}
      ]
    },
    {
      group:"IGST", color:"#ea580c",
      rates:[
        { pct:5,   label:"Essential"  },
        { pct:12,  label:"Standard"   },
        { pct:18,  label:"Premium"    },
        { pct:28,  label:"Sin / Lux"  }
      ]
    }
  ],

  fuelTypes: [
    { label:"Petrol",   icon:"fa-fire-flame-curved", color:"#ef4444", accent:"#fca5a5",
      anim:"flame",    grade:"RON 87 / 91 / 95",    tag:"Internal Combustion" },
    { label:"Diesel",   icon:"fa-droplet",            color:"#f59e0b", accent:"#fcd34d",
      anim:"drip",     grade:"BS6 / HSD / LDO",      tag:"Compression Ignition" },
    { label:"CNG",      icon:"fa-wind",               color:"#4ade80", accent:"#86efac",
      anim:"bubble",   grade:"Auto / Industrial",     tag:"Compressed Natural Gas" },
    { label:"Electric", icon:"fa-bolt",               color:"#22d3ee", accent:"#67e8f9",
      anim:"spark",    grade:"AC / DC Fast / Slow",   tag:"Zero Emission" }
  ],

  brands: [
    "Bosch","Makita","DeWalt","Stanley","Hilti","Festool","Metabo","Hitachi",
    "Caterpillar","JCB","Komatsu","Atlas Copco","Ingersoll Rand","Cummins","Perkins",
    "Siemens","ABB","Schneider","Eaton","Legrand","Parker","SKF","Timken","NSK",
    "3M","Honeywell","Tata","Mahindra","L&T","Godrej","Bharat Forge","Havells",
    "Kirloskar","WABCO","Ametek","Graco","Lincoln","Fluke","Grundfos","Xylem",
    "Watts","Danfoss","Emerson","Rexnord","Loctite","WD-40","CRC","Castrol"
  ],

  calendar: {
    months: [
      {
        name:"January 2025", year:2025, month:0, startDay:3,
        days: 31,
        holidays:[
          { date:1,  label:"New Year",         type:"national",  repeat:true  },
          { date:14, label:"Makar Sankranti",  type:"national",  repeat:true  },
          { date:26, label:"Republic Day",     type:"national",  repeat:true  }
        ]
      },
      {
        name:"August 2025", year:2025, month:7, startDay:5,
        days: 31,
        holidays:[
          { date:15, label:"Independence Day", type:"national",  repeat:true  },
          { date:27, label:"Janmashtami",      type:"national",  repeat:true  }
        ]
      },
      {
        name:"October 2025", year:2025, month:9, startDay:3,
        days: 31,
        holidays:[
          { date:2,  label:"Gandhi Jayanti",   type:"national",  repeat:true  },
          { date:2,  label:"Dussehra",         type:"regional",  repeat:false },
          { date:20, label:"Diwali",           type:"regional",  repeat:false }
        ]
      },
      {
        name:"December 2025", year:2025, month:11, startDay:1,
        days: 31,
        holidays:[
          { date:25, label:"Christmas",        type:"national",  repeat:true  },
          { date:31, label:"Year End Off",     type:"custom",    repeat:false }
        ]
      }
    ]
  },

  departments: [
    { id:"ops",    name:"Operations",  hod:"#3b82f6", mgr:"#f59e0b", emp:4 },
    { id:"maint",  name:"Maintenance", hod:"#3b82f6", mgr:"#f59e0b", emp:3 },
    { id:"prod",   name:"Production",  hod:"#3b82f6", mgr:"#f59e0b", emp:5 },
    { id:"logis",  name:"Logistics",   hod:"#3b82f6", mgr:"#f59e0b", emp:3 },
    { id:"admin",  name:"Admin",       hod:"#3b82f6", mgr:"#f59e0b", emp:2 }
  ],

  titleHierarchy: [
    {
      role:"Owner",         color:"#0891b2", width:12,
      titles:["Proprietor","Director","CEO","MD"]
    },
    {
      role:"Prime Manager", color:"#7c3aed", width:22,
      titles:["Operations Head","Branch Manager","Regional Head"]
    },
    {
      role:"General Manager",color:"#16a34a", width:36,
      titles:["Floor Manager","Shift Supervisor","Site Incharge"]
    },
    {
      role:"Issuer",        color:"#ea580c", width:54,
      titles:["Storekeeper","Warehouse Incharge","Inventory Officer"]
    },
    {
      role:"Employee",      color:"#64748b", width:72,
      titles:["Technician","Operator","Helper","Driver","Loader"]
    }
  ]
}
```

---

## CSS

Add after MODULE 2 CSS rules:

```css
/* ============================================================
   MODULE 3 — MASTER DATA VIZ
   ============================================================ */

.scm-md-layout { display: flex; flex-direction: column; gap: 4rem; }

/* Section block */
.scm-md-section {
  display: grid;
  grid-template-columns: 58% 1fr;
  gap: clamp(20px, 3vw, 48px);
  align-items: center;
}
.scm-md-section-alt { grid-template-columns: 1fr 58%; }

/* Description panel */
.scm-md-desc-panel { display: flex; flex-direction: column; gap: 0.75rem; }
.scm-md-desc-title { font-size: clamp(1rem, 1.4vw, 1.3rem); font-weight: 700; color: var(--s-gray-900); margin: 0.3rem 0 0; }
.scm-md-desc-text  { font-size: clamp(0.78rem, 1vw, 0.9rem); color: var(--s-gray-500); line-height: 1.65; margin: 0; }

/* Viz stage */
.scm-md-stage {
  width: 100%;
  height: clamp(280px, 36vw, 480px);
  border-radius: 18px;
  background: var(--s-gray-50);
  border: 1px solid var(--s-gray-200);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* ---- 1. ISOMETRIC LOCATION ---- */
.scm-md-iso-viewport {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 900px;
}
.scm-md-iso-stack {
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(48deg) rotateY(0deg) rotateZ(-20deg);
  width: clamp(200px, 26vw, 340px);
}
.scm-md-iso-layer {
  position: relative;
  width: 100%;
  height: clamp(34px, 4.5vw, 58px);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: clamp(8px, 1vw, 14px);
  padding: 0 clamp(12px, 1.5vw, 20px);
  margin-bottom: 4px;
  transform-origin: center top;
  opacity: 0;
  transform: translateY(-20px) scaleY(0.3);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3);
}
.scm-md-iso-layer-icon { font-size: clamp(0.8rem, 1.1vw, 1.1rem); color: white; opacity: 0.9; flex-shrink: 0; }
.scm-md-iso-layer-label { font-size: clamp(0.55rem, 0.8vw, 0.78rem); font-weight: 700; color: white; letter-spacing: 0.05em; }
.scm-md-iso-layer-count { font-size: clamp(0.44rem, 0.6vw, 0.58rem); color: rgba(255,255,255,0.6); margin-left: auto; font-family: monospace; }
/* Left face of each layer for 3D depth */
.scm-md-iso-layer::before {
  content: '';
  position: absolute;
  left: 0; bottom: -8px;
  width: 100%;
  height: 8px;
  background: rgba(0,0,0,0.18);
  border-radius: 0 0 4px 4px;
  transform: rotateX(-90deg);
  transform-origin: top center;
}

/* ---- 2. FLIP COUNTER ---- */
.scm-md-flip-carousel {
  width: 92%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1vw, 14px);
}
.scm-md-flip-example {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 1.5vw, 24px);
  background: var(--s-white);
  border: 1px solid var(--s-gray-200);
  border-radius: 14px;
  padding: clamp(12px, 1.5vw, 20px) clamp(14px, 2vw, 28px);
  position: absolute;
  opacity: 0;
}
.scm-md-flip-unit-block { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.scm-md-flip-icon { font-size: clamp(1.4rem, 2.5vw, 2.2rem); color: var(--s-primary-500); }
.scm-md-flip-digits {
  display: flex;
  gap: 2px;
}
.scm-md-flip-digit {
  width: clamp(18px, 2.5vw, 32px);
  height: clamp(26px, 3.5vw, 44px);
  background: var(--s-primary-940);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.75rem, 1.2vw, 1.1rem);
  font-weight: 800;
  color: #22d3ee;
  font-family: monospace;
  overflow: hidden;
  position: relative;
}
.scm-md-flip-digit-inner {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center bottom;
  backface-visibility: hidden;
}
.scm-md-flip-unit-name { font-size: clamp(0.5rem, 0.75vw, 0.7rem); font-weight: 700; color: var(--s-gray-600); text-transform: uppercase; letter-spacing: 0.1em; }
.scm-md-flip-arrow { font-size: clamp(1rem, 1.5vw, 1.4rem); color: var(--s-gray-300); flex-shrink: 0; }
.scm-md-flip-label {
  font-size: clamp(0.42rem, 0.6vw, 0.58rem);
  color: var(--s-primary-400);
  font-family: monospace;
  letter-spacing: 0.12em;
  position: absolute;
  bottom: 8px;
  right: 12px;
}
.scm-md-flip-stage-inner { position: relative; width: 100%; height: clamp(100px, 14vw, 160px); }

/* ---- 3. TAX DIALS ---- */
.scm-md-dial-wrap {
  width: 94%;
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.4vw, 18px);
}
.scm-md-dial-group { display: flex; flex-direction: column; gap: clamp(5px, 0.7vw, 9px); }
.scm-md-dial-group-label {
  font-size: clamp(0.55rem, 0.75vw, 0.72rem);
  font-weight: 800;
  letter-spacing: 0.15em;
  font-family: monospace;
  text-transform: uppercase;
}
.scm-md-dial-row { display: flex; gap: clamp(8px, 1.2vw, 16px); align-items: flex-end; flex-wrap: wrap; }
.scm-md-dial-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.scm-md-dial-svg-wrap { position: relative; }
.scm-md-dial-pct {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.6rem, 0.9vw, 0.85rem);
  font-weight: 800;
  font-family: monospace;
}
.scm-md-dial-sub {
  font-size: clamp(0.36rem, 0.5vw, 0.48rem);
  color: var(--s-gray-400);
  text-align: center;
  max-width: clamp(40px, 5vw, 65px);
  line-height: 1.3;
}
/* SVG arc track + fill drawn in JS */

/* ---- 4. FUEL TYPES ---- */
.scm-md-fuel-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(8px, 1.2vw, 16px);
  width: 94%;
}
.scm-md-fuel-card {
  border-radius: 16px;
  padding: clamp(12px, 1.5vw, 20px) clamp(8px, 1vw, 14px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(6px, 0.8vw, 12px);
  border: 1px solid rgba(0,0,0,0.06);
  position: relative;
  overflow: hidden;
}
.scm-md-fuel-anim-area {
  position: relative;
  width: clamp(44px, 5.5vw, 72px);
  height: clamp(44px, 5.5vw, 72px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.scm-md-fuel-icon {
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  position: relative;
  z-index: 2;
}
.scm-md-fuel-label { font-size: clamp(0.55rem, 0.8vw, 0.78rem); font-weight: 800; letter-spacing: 0.06em; }
.scm-md-fuel-grade { font-size: clamp(0.38rem, 0.55vw, 0.54rem); color: var(--s-gray-400); text-align: center; line-height: 1.3; }
.scm-md-fuel-tag {
  font-size: clamp(0.34rem, 0.5vw, 0.48rem);
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 0.06em;
}

/* Petrol flame particles */
.scm-md-flame-particle {
  position: absolute;
  border-radius: 50% 50% 20% 50%;
  animation: scmFlameFlicker 0.8s ease-in-out infinite alternate;
  transform-origin: bottom center;
}
@keyframes scmFlameFlicker {
  0%   { transform: scaleY(1)   rotate(-3deg); opacity: 0.9; }
  100% { transform: scaleY(1.2) rotate(3deg);  opacity: 0.6; }
}

/* Diesel drip */
.scm-md-drip {
  position: absolute;
  width: 5px;
  border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
  animation: scmDrip 1.4s ease-in infinite;
}
@keyframes scmDrip {
  0%   { top: 10%; opacity: 1; transform: scaleY(0.5); }
  70%  { top: 70%; opacity: 1; transform: scaleY(1.3); }
  100% { top: 80%; opacity: 0; transform: scaleY(0.8); }
}

/* CNG bubble */
.scm-md-bubble {
  position: absolute;
  border-radius: 50%;
  animation: scmBubbleFloat 2s ease-in infinite;
  opacity: 0;
}
@keyframes scmBubbleFloat {
  0%   { bottom: 0;   opacity: 0;   transform: scale(0.4) translateX(0); }
  30%  { opacity: 0.6; }
  100% { bottom: 90%; opacity: 0;   transform: scale(1.1) translateX(8px); }
}

/* Electric spark */
.scm-md-spark {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #22d3ee;
  animation: scmSparkShoot 0.6s ease-out infinite;
}
.scm-md-leaf {
  position: absolute;
  font-size: 0.6rem;
  animation: scmLeafDrift 2.5s ease-in-out infinite;
}
@keyframes scmSparkShoot {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--sx,8px), var(--sy,-10px)) scale(0); opacity: 0; }
}
@keyframes scmLeafDrift {
  0%   { transform: translate(0,0) rotate(0deg); opacity: 0.8; }
  50%  { transform: translate(5px,-12px) rotate(15deg); opacity: 0.5; }
  100% { transform: translate(-3px,-24px) rotate(-10deg); opacity: 0; }
}

/* ---- 5. LOGO WALL ---- */
.scm-md-logo-wall {
  display: grid;
  gap: clamp(5px, 0.7vw, 9px);
  padding: clamp(10px, 1.3vw, 18px);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.scm-md-logo-tile {
  perspective: 400px;
  cursor: default;
}
.scm-md-logo-tile-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.4,0,0.2,1);
  border-radius: 8px;
}
.scm-md-logo-tile.flipped .scm-md-logo-tile-inner { transform: rotateY(180deg); }
.scm-md-logo-front, .scm-md-logo-back {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.44rem, 0.65vw, 0.64rem);
  font-weight: 800;
  text-align: center;
  letter-spacing: 0.02em;
  padding: 2px;
  border: 1px solid var(--s-gray-200);
}
.scm-md-logo-back { transform: rotateY(180deg); }

/* ---- 6. CALENDAR ---- */
.scm-md-cal-wrap {
  width: 94%;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.scm-md-cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(6px, 0.8vw, 10px);
}
.scm-md-cal-month-name {
  font-size: clamp(0.7rem, 1vw, 0.95rem);
  font-weight: 800;
  color: var(--s-gray-800);
}
.scm-md-cal-legend { display: flex; gap: clamp(6px, 0.8vw, 12px); align-items: center; }
.scm-md-cal-legend-item { display: flex; align-items: center; gap: 3px; font-size: clamp(0.36rem, 0.5vw, 0.48rem); font-weight: 600; color: var(--s-gray-500); }
.scm-md-cal-legend-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.scm-md-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(2px, 0.3vw, 4px);
}
.scm-md-cal-day-hdr {
  text-align: center;
  font-size: clamp(0.4rem, 0.55vw, 0.54rem);
  font-weight: 800;
  color: var(--s-gray-400);
  padding: clamp(2px, 0.3vw, 4px) 0;
  font-family: monospace;
  letter-spacing: 0.1em;
}
.scm-md-cal-day-hdr.weekend { color: #dc2626; }
.scm-md-cal-cell {
  aspect-ratio: 1;
  border-radius: clamp(4px, 0.5vw, 7px);
  background: white;
  border: 1px solid var(--s-gray-100);
  position: relative;
  padding: clamp(2px, 0.3vw, 4px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.2s;
}
.scm-md-cal-cell.empty { background: transparent; border-color: transparent; }
.scm-md-cal-cell.weekend .scm-md-cal-date { color: #dc2626; }
.scm-md-cal-cell.national { background: rgba(59,130,246,0.06); border-color: rgba(59,130,246,0.25); }
.scm-md-cal-cell.regional { background: rgba(34,211,238,0.06); border-color: rgba(34,211,238,0.25); }
.scm-md-cal-cell.custom   { background: rgba(167,139,250,0.06); border-color: rgba(167,139,250,0.2); }
.scm-md-cal-date {
  font-size: clamp(0.5rem, 0.75vw, 0.72rem);
  font-weight: 700;
  color: var(--s-gray-800);
  line-height: 1;
}
.scm-md-cal-hlabel {
  font-size: clamp(0.3rem, 0.42vw, 0.4rem);
  color: #3b82f6;
  line-height: 1.2;
  margin-top: 1px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.scm-md-cal-cell.regional .scm-md-cal-hlabel { color: #0891b2; }
.scm-md-cal-cell.custom   .scm-md-cal-hlabel { color: #7c3aed; }
.scm-md-cal-icon {
  position: absolute;
  top: 2px; right: 2px;
  font-size: clamp(0.3rem, 0.42vw, 0.4rem);
}
.scm-md-cal-icon.repeat { color: #3b82f6; animation: scmIconPulse 2s ease-in-out infinite; }
.scm-md-cal-icon.once   { color: #94a3b8; }
@keyframes scmIconPulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50%     { opacity: 0.5; transform: scale(0.8); }
}
/* Calendar flip transition */
.scm-md-cal-grid-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
}
.scm-md-cal-grid-slide {
  transition: transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s;
}
.scm-md-cal-grid-slide.exit-left  { transform: translateX(-100%); opacity: 0; }
.scm-md-cal-grid-slide.enter-right{ transform: translateX(100%);  opacity: 0; }
.scm-md-cal-nav-btn {
  background: none;
  border: 1px solid var(--s-gray-200);
  border-radius: 6px;
  width: clamp(22px, 2.5vw, 30px);
  height: clamp(22px, 2.5vw, 30px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: clamp(0.5rem, 0.7vw, 0.66rem);
  color: var(--s-gray-600);
  transition: all 0.2s;
}
.scm-md-cal-nav-btn:hover { background: var(--s-gray-50); border-color: var(--s-primary-300); }

/* ---- 7. DEPARTMENTS SANKEY ---- */
.scm-md-sankey-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.scm-md-sankey-nodes { position: absolute; inset: 0; z-index: 2; }
.scm-md-dept-org-node {
  position: absolute;
  transform: translate(-50%, -50%);
  background: var(--s-white);
  border: 2px solid var(--s-primary-300);
  border-radius: 14px;
  padding: clamp(8px, 1vw, 14px) clamp(10px, 1.3vw, 18px);
  text-align: center;
  box-shadow: 0 4px 16px rgba(34,211,238,0.1);
  opacity: 0;
}
.scm-md-dept-org-label { font-size: clamp(0.5rem, 0.75vw, 0.72rem); font-weight: 800; color: var(--s-primary-600); letter-spacing: 0.1em; font-family: monospace; }
/* Isometric dept card */
.scm-md-dept-card {
  position: absolute;
  transform: translate(-50%, -50%);
  width: clamp(70px, 8vw, 110px);
  opacity: 0;
}
.scm-md-dept-card-iso {
  background: var(--s-white);
  border: 1px solid var(--s-gray-200);
  border-radius: 10px;
  padding: clamp(6px, 0.8vw, 11px) clamp(8px, 1vw, 14px);
  box-shadow: 4px 4px 0 var(--s-gray-200);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.scm-md-dept-name { font-size: clamp(0.44rem, 0.65vw, 0.62rem); font-weight: 800; color: var(--s-gray-700); text-align: center; }
.scm-md-dept-users { display: flex; gap: 2px; justify-content: center; flex-wrap: wrap; margin-top: 2px; }
.scm-md-dept-user-icon { font-size: clamp(0.55rem, 0.8vw, 0.75rem); }
.scm-md-sankey-flow-line { fill: none; stroke-width: 2; stroke-linecap: round; opacity: 0.3; }
.scm-md-user-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  z-index: 3;
  pointer-events: none;
}

/* ---- 8. PYRAMID ---- */
.scm-md-pyramid-wrap {
  position: absolute;
  left: clamp(16px, 4vw, 60px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  z-index: 2;
}
.scm-md-pyramid-level {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  height: clamp(26px, 3.2vw, 42px);
  font-size: clamp(0.42rem, 0.62vw, 0.6rem);
  font-weight: 800;
  color: white;
  letter-spacing: 0.04em;
  opacity: 0;
  transform: scaleX(0.3);
  position: relative;
}
.scm-md-pyramid-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.scm-md-pyramid-labels { position: absolute; inset: 0; z-index: 3; pointer-events: none; }
.scm-md-title-chip {
  position: absolute;
  transform: translate(0, -50%);
  background: var(--s-white);
  border: 1px solid var(--s-gray-200);
  border-radius: 6px;
  padding: 2px clamp(5px, 0.7vw, 9px);
  font-size: clamp(0.38rem, 0.55vw, 0.52rem);
  font-weight: 600;
  color: var(--s-gray-600);
  white-space: nowrap;
  opacity: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.scm-md-pyramid-connector { fill: none; stroke: var(--s-gray-200); stroke-width: 1; stroke-dasharray: 3 2; }

/* Responsive */
@media (max-width: 991px) {
  .scm-md-section,
  .scm-md-section-alt { grid-template-columns: 1fr; }
  .scm-md-section-alt .scm-md-desc-panel { order: 1; }
  .scm-md-section-alt .scm-md-viz-panel  { order: 2; }
  .scm-md-fuel-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 767px) {
  .scm-md-stage { height: clamp(220px, 60vw, 320px); }
  .scm-md-fuel-grid { grid-template-columns: repeat(4, 1fr); }
}
```

---

## JS

Add after MODULE 2 IIFE. One self-contained IIFE:

```javascript
// ============================================================
// MODULE 3 — MASTER DATA VIZ
// ============================================================
(function () {

  const MD = SCM_DATA.masterDataViz;

  function $(id) { return document.getElementById(id); }

  function observe(id, fn) {
    const el = $(id);
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { obs.disconnect(); fn(); }
    }, { threshold: 0.25 });
    obs.observe(el);
  }

  // ============================================================
  // VIZ 1 — ISOMETRIC LOCATION STACK
  // ============================================================
  observe('scmMdLocation', function () {
    const vp = $('scmLocIso');
    if (!vp) return;

    const stack = document.createElement('div');
    stack.className = 'scm-md-iso-stack';

    const counts = ['1–10 Buildings','1–50 Floors','Zones per Floor','Rooms per Zone','Shelves per Room'];
    MD.locationLevels.forEach((level, i) => {
      const layer = document.createElement('div');
      layer.className = 'scm-md-iso-layer';
      layer.id = `scmLocLayer${i}`;
      layer.style.background = level.color;
      layer.innerHTML = `
        <i class="fas ${level.icon} scm-md-iso-layer-icon"></i>
        <span class="scm-md-iso-layer-label">${level.label}</span>
        <span class="scm-md-iso-layer-count">${counts[i]}</span>`;
      stack.appendChild(layer);
    });
    vp.appendChild(stack);

    // Animate layers in from top, accordion expand
    MD.locationLevels.forEach((_, i) => {
      const el = $(`scmLocLayer${i}`);
      gsap.to(el, {
        opacity: 1,
        y: 0,
        scaleY: 1,
        duration: 0.5,
        delay: 0.3 + i * 0.18,
        ease: 'back.out(2)',
        onComplete: () => {
          // Idle hover float per layer
          gsap.to(el, { y: -3, duration: 1.5 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.2 });
        }
      });
    });
  });

  // ============================================================
  // VIZ 2 — FLIP COUNTER CAROUSEL
  // ============================================================
  observe('scmMdUnits', function () {
    const stage = $('scmUnitsCarousel');
    if (!stage) return;

    const inner = document.createElement('div');
    inner.className = 'scm-md-flip-stage-inner';
    stage.appendChild(inner);

    function digitsOf(n) { return String(n).split(''); }

    function buildExample(conv) {
      const wrap = document.createElement('div');
      wrap.className = 'scm-md-flip-example';

      function buildBlock(qty, unit, icon) {
        const block = document.createElement('div');
        block.className = 'scm-md-flip-unit-block';
        block.innerHTML = `<i class="fas ${icon} scm-md-flip-icon"></i>`;
        const digits = document.createElement('div');
        digits.className = 'scm-md-flip-digits';
        digitsOf(qty).forEach(d => {
          const slot = document.createElement('div');
          slot.className = 'scm-md-flip-digit';
          const inner2 = document.createElement('div');
          inner2.className = 'scm-md-flip-digit-inner';
          inner2.textContent = d;
          slot.appendChild(inner2);
          digits.appendChild(slot);
        });
        block.appendChild(digits);
        const lbl = document.createElement('div');
        lbl.className = 'scm-md-flip-unit-name';
        lbl.textContent = unit;
        block.appendChild(lbl);
        return block;
      }

      wrap.appendChild(buildBlock(conv.fromQty, conv.fromUnit, conv.fromIcon));
      const arrow = document.createElement('div');
      arrow.className = 'scm-md-flip-arrow';
      arrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
      wrap.appendChild(arrow);
      wrap.appendChild(buildBlock(conv.toQty, conv.toUnit, conv.toIcon));
      const lbl = document.createElement('div');
      lbl.className = 'scm-md-flip-label';
      lbl.textContent = conv.label;
      wrap.appendChild(lbl);
      return wrap;
    }

    const examples = MD.unitConversions.map(c => buildExample(c));
    examples.forEach(e => inner.appendChild(e));

    let current = 0;

    function flipDigits(el) {
      const innerEls = el.querySelectorAll('.scm-md-flip-digit-inner');
      innerEls.forEach((d, i) => {
        gsap.fromTo(d,
          { rotateX: -90, opacity: 0 },
          { rotateX: 0, opacity: 1, duration: 0.35, delay: i * 0.07, ease: 'back.out(2)' }
        );
      });
    }

    function showExample(idx) {
      examples.forEach((e, i) => {
        if (i === idx) {
          gsap.to(e, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
          flipDigits(e);
        } else {
          gsap.to(e, { opacity: 0, y: 0, duration: 0.25, ease: 'power2.in' });
        }
      });
    }

    showExample(0);
    setInterval(() => {
      current = (current + 1) % examples.length;
      showExample(current);
    }, 2800);
  });

  // ============================================================
  // VIZ 3 — TAX DIALS
  // ============================================================
  observe('scmMdTax', function () {
    const wrap = $('scmTaxDials');
    if (!wrap) return;

    const DIAL_SIZE = 58; // SVG size in px (will scale via CSS clamp)
    const R = 22;
    const CX = DIAL_SIZE / 2, CY = DIAL_SIZE / 2;
    const MAX_PCT = 30; // 28% is max IGST rate, round to 30

    function arcPath(pct) {
      const angle = (pct / MAX_PCT) * 270 - 135; // sweep 270deg arc
      const startAngle = -135 * Math.PI / 180;
      const endAngle   = (angle)  * Math.PI / 180;
      const x1 = CX + R * Math.cos(startAngle);
      const y1 = CY + R * Math.sin(startAngle);
      const x2 = CX + R * Math.cos(endAngle);
      const y2 = CY + R * Math.sin(endAngle);
      const large = angle - (-135) > 180 ? 1 : 0;
      return `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
    }

    function trackPath() {
      const sa = -135 * Math.PI / 180;
      const ea = 135  * Math.PI / 180;
      const x1 = CX + R * Math.cos(sa), y1 = CY + R * Math.sin(sa);
      const x2 = CX + R * Math.cos(ea), y2 = CY + R * Math.sin(ea);
      return `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 1 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
    }

    MD.taxGroups.forEach(group => {
      const grpEl = document.createElement('div');
      grpEl.className = 'scm-md-dial-group';
      const lbl = document.createElement('div');
      lbl.className = 'scm-md-dial-group-label';
      lbl.style.color = group.color;
      lbl.textContent = group.group;
      grpEl.appendChild(lbl);
      const row = document.createElement('div');
      row.className = 'scm-md-dial-row';

      group.rates.forEach(rate => {
        const item = document.createElement('div');
        item.className = 'scm-md-dial-item';

        const svgWrap = document.createElement('div');
        svgWrap.className = 'scm-md-dial-svg-wrap';
        svgWrap.style.cssText = `width:clamp(48px,5.5vw,${DIAL_SIZE}px);height:clamp(48px,5.5vw,${DIAL_SIZE}px);`;

        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox',`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`);
        svg.setAttribute('width','100%'); svg.setAttribute('height','100%');

        // Track
        const track = document.createElementNS('http://www.w3.org/2000/svg','path');
        track.setAttribute('d', trackPath());
        track.setAttribute('fill','none');
        track.setAttribute('stroke','rgba(0,0,0,0.08)');
        track.setAttribute('stroke-width','4');
        track.setAttribute('stroke-linecap','round');
        svg.appendChild(track);

        // Fill arc — animate from 0
        const fill = document.createElementNS('http://www.w3.org/2000/svg','path');
        fill.setAttribute('d', arcPath(0));
        fill.setAttribute('fill','none');
        fill.setAttribute('stroke', group.color);
        fill.setAttribute('stroke-width','4');
        fill.setAttribute('stroke-linecap','round');
        fill.id = `scmDial_${group.group}_${rate.pct}`;
        svg.appendChild(fill);
        svgWrap.appendChild(svg);

        const pctLabel = document.createElement('div');
        pctLabel.className = 'scm-md-dial-pct';
        pctLabel.style.color = group.color;
        pctLabel.textContent = `${rate.pct}%`;
        svgWrap.appendChild(pctLabel);
        item.appendChild(svgWrap);

        const sub = document.createElement('div');
        sub.className = 'scm-md-dial-sub';
        sub.textContent = rate.label;
        item.appendChild(sub);
        row.appendChild(item);

        // Animate arc on entry
        setTimeout(() => {
          const finalPath = arcPath(rate.pct);
          // Interpolate pct from 0 to rate.pct over 0.8s
          gsap.to({ p: 0 }, {
            p: rate.pct, duration: 1.0, ease: 'power2.out',
            delay: Math.random() * 0.4,
            onUpdate: function() { fill.setAttribute('d', arcPath(this.targets()[0].p)); }
          });
        }, 500);
      });

      grpEl.appendChild(row);
      wrap.appendChild(grpEl);
    });
  });

  // ============================================================
  // VIZ 4 — FUEL TYPES ELEMENTAL
  // ============================================================
  observe('scmMdFuel', function () {
    const grid = $('scmFuelGrid');
    if (!grid) return;

    MD.fuelTypes.forEach(fuel => {
      const card = document.createElement('div');
      card.className = 'scm-md-fuel-card';
      card.style.background = `linear-gradient(160deg, ${fuel.accent}22, ${fuel.color}10)`;
      card.style.borderColor = `${fuel.color}30`;

      const animArea = document.createElement('div');
      animArea.className = 'scm-md-fuel-anim-area';

      // Main icon
      const icon = document.createElement('i');
      icon.className = `fas ${fuel.icon} scm-md-fuel-icon`;
      icon.style.color = fuel.color;
      animArea.appendChild(icon);

      // Anim elements per type
      if (fuel.anim === 'flame') {
        // 3 flame particles around the icon
        [[-6,-8], [0,-10], [6,-8]].forEach(([ox,oy], i) => {
          const p = document.createElement('div');
          p.className = 'scm-md-flame-particle';
          p.style.cssText = `width:8px;height:14px;background:${fuel.color};opacity:0.4;
            bottom:60%;left:calc(50% + ${ox}px);animation-delay:${i*0.25}s;`;
          animArea.appendChild(p);
        });
      } else if (fuel.anim === 'drip') {
        for (let i = 0; i < 3; i++) {
          const d = document.createElement('div');
          d.className = 'scm-md-drip';
          d.style.cssText = `background:${fuel.color};height:${8+i*2}px;
            left:calc(50% + ${(i-1)*6}px);animation-delay:${i*0.45}s;opacity:0.5;`;
          animArea.appendChild(d);
        }
      } else if (fuel.anim === 'bubble') {
        for (let i = 0; i < 4; i++) {
          const b = document.createElement('div');
          b.className = 'scm-md-bubble';
          const sz = 4 + i * 3;
          b.style.cssText = `width:${sz}px;height:${sz}px;border:1.5px solid ${fuel.color};
            left:calc(${20+i*15}%);animation-delay:${i*0.5}s;animation-duration:${1.8+i*0.3}s;`;
          animArea.appendChild(b);
        }
      } else if (fuel.anim === 'spark') {
        for (let i = 0; i < 5; i++) {
          const s = document.createElement('div');
          s.className = 'scm-md-spark';
          const angle = (i / 5) * 360;
          const sx = Math.cos(angle * Math.PI/180) * 14;
          const sy = Math.sin(angle * Math.PI/180) * 14 - 6;
          s.style.cssText = `--sx:${sx}px;--sy:${sy}px;
            top:calc(50% + ${-sy/2}px);left:calc(50% + ${sx/2}px);
            animation-delay:${i*0.12}s;background:${fuel.color};`;
          animArea.appendChild(s);
        }
        // Leaves
        for (let i = 0; i < 2; i++) {
          const l = document.createElement('div');
          l.className = 'scm-md-leaf';
          l.textContent = '🌿';
          l.style.cssText = `bottom:${10+i*12}%;left:${20+i*35}%;animation-delay:${i*1.2}s;`;
          animArea.appendChild(l);
        }
      }

      card.appendChild(animArea);
      card.innerHTML += `
        <div class="scm-md-fuel-label" style="color:${fuel.color}">${fuel.label}</div>
        <div class="scm-md-fuel-grade">${fuel.grade}</div>
        <div class="scm-md-fuel-tag" style="background:${fuel.color}18;color:${fuel.color}">${fuel.tag}</div>`;
      // Re-insert animArea since innerHTML cleared it
      card.insertBefore(animArea, card.firstChild);
      grid.appendChild(card);
    });

    // Pop in cards
    gsap.from(grid.querySelectorAll('.scm-md-fuel-card'), {
      scale: 0.7, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(2)', delay: 0.2
    });
  });

  // ============================================================
  // VIZ 5 — LOGO WALL FLIP TILES
  // ============================================================
  observe('scmMdBrands', function () {
    const wall = $('scmLogoWall');
    if (!wall) return;

    // 4 columns × 3 rows = 12 tiles; we have 48 brands = 4 brands per tile (flip)
    const COLS = 6, ROWS = 3;
    const TILES = COLS * ROWS;
    const brands = MD.brands;
    wall.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    wall.style.gridTemplateRows    = `repeat(${ROWS}, 1fr)`;

    const tileColors = [
      '#f0f9ff','#f0fdf4','#fefce8','#fdf4ff','#fff7ed','#f0fdfa',
      '#eff6ff','#fdf2f8','#f5f3ff','#ecfeff','#fef9ee','#f9fafb'
    ];

    // Assign multiple brands per tile
    const brandsPerTile = Math.ceil(brands.length / TILES);
    const tileBrands = Array.from({length: TILES}, (_, i) =>
      brands.slice(i * brandsPerTile, (i+1) * brandsPerTile).filter(Boolean)
    );

    const tileEls = [];
    for (let i = 0; i < TILES; i++) {
      const tile = document.createElement('div');
      tile.className = 'scm-md-logo-tile';

      const inner = document.createElement('div');
      inner.className = 'scm-md-logo-tile-inner';

      const front = document.createElement('div');
      front.className = 'scm-md-logo-front';
      front.style.background = tileColors[i % tileColors.length];
      front.style.color = '#334155';
      front.textContent = tileBrands[i][0] || '';

      const back = document.createElement('div');
      back.className = 'scm-md-logo-back';
      back.style.background = tileColors[(i + 3) % tileColors.length];
      back.style.color = '#334155';
      back.textContent = tileBrands[i][1] || tileBrands[i][0] || '';

      inner.appendChild(front);
      inner.appendChild(back);
      tile.appendChild(inner);
      wall.appendChild(tile);
      tileEls.push({ tile, brands: tileBrands[i], faceIdx: 0 });
    }

    // Pop tiles in
    gsap.from(tileEls.map(t=>t.tile), { scale: 0, opacity: 0, duration: 0.3, stagger: { each: 0.04, from: 'random' }, ease: 'back.out(2)', delay: 0.1 });

    // Staggered flip loop
    function flipTile(tileObj) {
      tileObj.faceIdx++;
      const brandIdx = tileObj.faceIdx % tileObj.brands.length;
      const nextBrand = tileObj.brands[brandIdx];
      const isFlipped = tileObj.faceIdx % 2 !== 0;
      // Update the back or front text before flip
      const back  = tileObj.tile.querySelector('.scm-md-logo-back');
      const front = tileObj.tile.querySelector('.scm-md-logo-front');
      if (isFlipped) back.textContent = nextBrand;
      else front.textContent = nextBrand;
      tileObj.tile.classList.toggle('flipped', isFlipped);
    }

    tileEls.forEach((tileObj, i) => {
      setInterval(() => flipTile(tileObj), 1800 + (i % 7) * 320);
    });
  });

  // ============================================================
  // VIZ 6 — HOLIDAY CALENDAR
  // ============================================================
  observe('scmMdCalendar', function () {
    const calWrap = $('scmCalWrap');
    if (!calWrap) return;

    const DAY_NAMES = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    let monthIdx = 0;

    function buildCalendar(mData) {
      const frag = document.createDocumentFragment();

      // Header
      const hdr = document.createElement('div');
      hdr.className = 'scm-md-cal-header';

      const prevBtn = document.createElement('button');
      prevBtn.className = 'scm-md-cal-nav-btn';
      prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
      prevBtn.onclick = () => flipMonth(-1);

      const name = document.createElement('div');
      name.className = 'scm-md-cal-month-name';
      name.textContent = mData.name;

      const nextBtn = document.createElement('button');
      nextBtn.className = 'scm-md-cal-nav-btn';
      nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
      nextBtn.onclick = () => flipMonth(1);

      const legend = document.createElement('div');
      legend.className = 'scm-md-cal-legend';
      legend.innerHTML = `
        <div class="scm-md-cal-legend-item"><div class="scm-md-cal-legend-dot" style="background:#3b82f6"></div>National</div>
        <div class="scm-md-cal-legend-item"><div class="scm-md-cal-legend-dot" style="background:#0891b2"></div>Regional</div>
        <div class="scm-md-cal-legend-item"><div class="scm-md-cal-legend-dot" style="background:#7c3aed"></div>Custom</div>`;

      hdr.appendChild(prevBtn);
      hdr.appendChild(name);
      hdr.appendChild(nextBtn);
      hdr.appendChild(legend);
      frag.appendChild(hdr);

      // Grid wrap
      const gridWrap = document.createElement('div');
      gridWrap.className = 'scm-md-cal-grid-wrap';
      const grid = document.createElement('div');
      grid.className = 'scm-md-cal-grid scm-md-cal-grid-slide';

      // Day headers
      DAY_NAMES.forEach(d => {
        const h = document.createElement('div');
        h.className = 'scm-md-cal-day-hdr' + (d==='Sat'||d==='Sun' ? ' weekend' : '');
        h.textContent = d;
        grid.appendChild(h);
      });

      // Build holiday map
      const hMap = {};
      mData.holidays.forEach(h => { hMap[h.date] = h; });

      // startDay: 0=Mon,1=Tue,...,6=Sun
      const startDay = mData.startDay % 7; // 0-indexed Mon

      // Empty cells before start
      for (let e = 0; e < startDay; e++) {
        const empty = document.createElement('div');
        empty.className = 'scm-md-cal-cell empty';
        grid.appendChild(empty);
      }

      for (let d = 1; d <= mData.days; d++) {
        const dayOfWeek = (startDay + d - 1) % 7; // 0=Mon,6=Sun
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
        const holiday   = hMap[d];

        const cell = document.createElement('div');
        let cls = 'scm-md-cal-cell';
        if (isWeekend) cls += ' weekend';
        if (holiday)   cls += ` ${holiday.type}`;
        cell.className = cls;

        const dateNum = document.createElement('div');
        dateNum.className = 'scm-md-cal-date';
        dateNum.textContent = d;
        cell.appendChild(dateNum);

        if (isWeekend && !holiday) {
          const wlbl = document.createElement('div');
          wlbl.className = 'scm-md-cal-hlabel';
          wlbl.style.color = '#dc2626';
          wlbl.textContent = dayOfWeek === 5 ? 'Sat Off' : 'Sun Off';
          cell.appendChild(wlbl);
        }

        if (holiday) {
          const hlbl = document.createElement('div');
          hlbl.className = 'scm-md-cal-hlabel';
          hlbl.textContent = holiday.label;
          cell.appendChild(hlbl);

          const hicon = document.createElement('div');
          hicon.className = 'scm-md-cal-icon ' + (holiday.repeat ? 'repeat' : 'once');
          hicon.innerHTML = holiday.repeat
            ? '<i class="fas fa-rotate"></i>'
            : '<i class="fas fa-circle-dot"></i>';
          cell.appendChild(hicon);
        }

        grid.appendChild(cell);
      }

      gridWrap.appendChild(grid);
      frag.appendChild(gridWrap);
      return frag;
    }

    function flipMonth(dir) {
      const months = MD.calendar.months;
      const oldGrid = calWrap.querySelector('.scm-md-cal-grid-slide');
      monthIdx = (monthIdx + dir + months.length) % months.length;

      if (oldGrid) {
        gsap.to(oldGrid, {
          x: dir > 0 ? '-100%' : '100%',
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            calWrap.innerHTML = '';
            const newFrag = buildCalendar(months[monthIdx]);
            calWrap.appendChild(newFrag);
            const newGrid = calWrap.querySelector('.scm-md-cal-grid-slide');
            gsap.fromTo(newGrid,
              { x: dir > 0 ? '100%' : '-100%', opacity: 0 },
              { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
            );
          }
        });
      } else {
        calWrap.innerHTML = '';
        calWrap.appendChild(buildCalendar(months[monthIdx]));
      }
    }

    // Initial render
    calWrap.appendChild(buildCalendar(MD.calendar.months[0]));

    // Auto-flip months
    setInterval(() => flipMonth(1), 4000);
  });

  // ============================================================
  // VIZ 7 — DEPARTMENTS SANKEY
  // ============================================================
  observe('scmMdDepts', function () {
    const svg   = $('scmDeptSvg');
    const nodes = $('scmDeptNodes');
    if (!svg || !nodes) return;

    const stage = $('scmDeptStage');
    const W = stage.offsetWidth, H = stage.offsetHeight;

    // Org node at left-center
    const orgX = W * 0.15, orgY = H * 0.5;

    const orgNode = document.createElement('div');
    orgNode.className = 'scm-md-dept-org-node';
    orgNode.style.left = orgX + 'px'; orgNode.style.top = orgY + 'px';
    orgNode.innerHTML = `
      <i class="fas fa-building" style="color:var(--s-primary-400);font-size:clamp(0.8rem,1.2vw,1.1rem);margin-bottom:4px;display:block;"></i>
      <div class="scm-md-dept-org-label">ORGANISATION</div>`;
    nodes.appendChild(orgNode);

    // 5 dept cards on right side, evenly spaced
    const depts = MD.departments;
    const deptX = W * 0.75;
    const deptCards = [];

    depts.forEach((dept, i) => {
      const y = H * (0.12 + (i / (depts.length - 1)) * 0.76);
      const card = document.createElement('div');
      card.className = 'scm-md-dept-card';
      card.style.left = deptX + 'px'; card.style.top = y + 'px';

      // Build user icons: 1 HOD (blue), 1 mgr (orange), N-2 grey
      let userIcons = `<i class="fas fa-user scm-md-dept-user-icon" style="color:${dept.hod}"></i>`;
      userIcons    += `<i class="fas fa-user scm-md-dept-user-icon" style="color:${dept.mgr}"></i>`;
      for (let e = 0; e < dept.emp; e++) {
        userIcons += `<i class="fas fa-user scm-md-dept-user-icon" style="color:#cbd5e1"></i>`;
      }

      card.innerHTML = `
        <div class="scm-md-dept-card-iso">
          <div class="scm-md-dept-name">${dept.name}</div>
          <div class="scm-md-dept-users">${userIcons}</div>
        </div>`;
      nodes.appendChild(card);
      deptCards.push({ el: card, x: deptX, y });
    });

    // Draw SVG: single backbone line through dept Y positions + individual connectors from org
    requestAnimationFrame(() => {
      const stageRect = stage.getBoundingClientRect();
      const orgRect   = orgNode.getBoundingClientRect();
      const ox = orgRect.right - stageRect.left;
      const oy = orgRect.top - stageRect.top + orgRect.height / 2;

      deptCards.forEach((dc, i) => {
        const dr   = dc.el.getBoundingClientRect();
        const dx   = dr.left - stageRect.left;
        const dy   = dr.top  - stageRect.top + dr.height / 2;

        // Elbow connector org → dept
        const midX = (ox + dx) / 2;
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d', `M${ox},${oy} C${midX},${oy} ${midX},${dy} ${dx},${dy}`);
        path.setAttribute('class','scm-md-sankey-flow-line');
        path.setAttribute('stroke', depts[i].hod);
        const len = path.getTotalLength();
        path.setAttribute('stroke-dasharray', len);
        path.setAttribute('stroke-dashoffset', len);
        path.id = `scmDeptLine${i}`;
        svg.appendChild(path);
      });

      // Animate
      gsap.to(orgNode, { opacity: 1, duration: 0.4, ease: 'back.out(2)' });
      deptCards.forEach((dc, i) => {
        gsap.to(`#scmDeptLine${i}`, { strokeDashoffset: 0, duration: 0.6, delay: 0.4 + i * 0.12, ease: 'power2.inOut' });
        gsap.to(dc.el, { opacity: 1, duration: 0.35, delay: 0.7 + i * 0.12, ease: 'back.out(2)' });

        // Animate user dot flowing along path
        const pathEl = document.getElementById(`scmDeptLine${i}`);
        setTimeout(() => {
          if (!pathEl) return;
          const colors = [depts[i].hod, depts[i].mgr, '#cbd5e1'];
          colors.forEach((color, ci) => {
            const dot = document.createElement('div');
            dot.className = 'scm-md-user-dot';
            dot.style.background = color;
            stage.appendChild(dot);
            const pt0 = pathEl.getPointAtLength(0);
            gsap.set(dot, { x: pt0.x - 3, y: pt0.y - 3 });
            gsap.to({ t: 0 }, {
              t: 1, duration: 1.0, delay: ci * 0.25,
              ease: 'power1.inOut',
              repeat: 2, repeatDelay: 1.5,
              onUpdate: function() {
                const t = this.targets()[0].t;
                const len2 = pathEl.getTotalLength();
                const pt = pathEl.getPointAtLength(t * len2);
                gsap.set(dot, { x: pt.x - 3, y: pt.y - 3 });
              },
              onComplete: () => dot.remove()
            });
          });
        }, 1200 + i * 200);
      });
    });
  });

  // ============================================================
  // VIZ 8 — TITLES & DESIGNATIONS PYRAMID
  // ============================================================
  observe('scmMdTitles', function () {
    const wrap   = $('scmPyramidWrap');
    const svg    = $('scmPyramidSvg');
    const labels = $('scmPyramidLabels');
    if (!wrap || !svg || !labels) return;

    const stage = $('scmTitlesStage');
    const H = stage.offsetHeight;
    const levelH = clamp(26, 3.2, 42, stage.offsetWidth);
    const gap = 3;
    const totalH = (MD.titleHierarchy.length * (levelH + gap));
    const topOffset = (H - totalH) / 2;

    function clamp(mn, vw, mx, W) { return Math.min(mx, Math.max(mn, W * vw / 100)); }

    // Build pyramid levels
    MD.titleHierarchy.forEach((level, i) => {
      const el = document.createElement('div');
      el.className = 'scm-md-pyramid-level';
      el.id = `scmPyLevel${i}`;
      el.style.cssText = `width:${level.width}%;background:${level.color};margin-top:${i===0?0:gap}px;`;
      el.textContent = level.role;
      wrap.appendChild(el);
    });

    // Animate pyramid levels in
    MD.titleHierarchy.forEach((_, i) => {
      gsap.to(`#scmPyLevel${i}`, {
        opacity: 1, scaleX: 1, duration: 0.5, delay: 0.2 + i * 0.15, ease: 'back.out(1.5)'
      });
    });

    // After pyramid renders, draw connectors and place title chips
    setTimeout(() => {
      const stageRect = stage.getBoundingClientRect();
      svg.innerHTML = '';
      labels.innerHTML = '';

      MD.titleHierarchy.forEach((level, i) => {
        const levelEl = document.getElementById(`scmPyLevel${i}`);
        if (!levelEl) return;
        const lRect = levelEl.getBoundingClientRect();
        const lRight = lRect.right - stageRect.left;
        const lMidY  = lRect.top - stageRect.top + lRect.height / 2;

        const startX = lRight + 8;
        const endX   = stageRect.width * 0.6;
        const chipStartX = endX + 10;
        const chipY  = lMidY;

        // Connector line
        const line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1', startX); line.setAttribute('y1', lMidY);
        line.setAttribute('x2', endX);   line.setAttribute('y2', lMidY);
        line.setAttribute('class','scm-md-pyramid-connector');
        svg.appendChild(line);

        // Title chips
        level.titles.forEach((title, ti) => {
          const chipX = chipStartX + ti * (stageRect.width * 0.12);
          const chip = document.createElement('div');
          chip.className = 'scm-md-title-chip';
          chip.id = `scmTitleChip_${i}_${ti}`;
          chip.style.left = chipX + 'px';
          chip.style.top  = chipY + 'px';
          chip.style.borderColor = level.color + '60';
          chip.style.color = level.color;
          chip.textContent = title;
          labels.appendChild(chip);

          // Sub-connector chip to line
          const subLine = document.createElementNS('http://www.w3.org/2000/svg','line');
          subLine.setAttribute('x1', endX); subLine.setAttribute('y1', lMidY);
          subLine.setAttribute('x2', chipX); subLine.setAttribute('y2', chipY);
          subLine.setAttribute('class','scm-md-pyramid-connector');
          svg.appendChild(subLine);

          gsap.to(chip, { opacity: 1, duration: 0.3, delay: 1.0 + i * 0.15 + ti * 0.08, ease: 'power2.out' });
        });
      });
    }, 1400);
  });

})();
// ---- END MODULE 3 ----
```

---

## What NOT to change
- Existing accordion HTML inside `scm-layout-taxonomy` is REPLACED entirely — do not keep it
- All modules 1, 2, 4–9 — untouched
- All existing CSS except MODULE 3 taxonomy rules — those can remain (they won't conflict)
- `SCM_DATA` keys other than adding `masterDataViz`
- AOS data-aos attributes on section divs — keep them

---

## Checklist
- [ ] `masterDataViz` key added to `SCM_DATA`
- [ ] `scm-layout-taxonomy` replaced with `scm-md-layout` containing 8 `scm-md-section` blocks
- [ ] All 8 viz stage divs present with correct IDs
- [ ] All `scm-md-` CSS rules added after MODULE 2 CSS
- [ ] MODULE 3 IIFE added after MODULE 2 IIFE
- [ ] All 8 `observe()` init blocks implemented
- [ ] Each viz has its own IntersectionObserver — triggers independently on scroll
- [ ] Calendar auto-flips every 4s and has manual prev/next buttons
- [ ] Logo wall tiles flip staggered continuously
- [ ] Tax dial arcs animate from 0 to rate value on entry
- [ ] Isometric layers expand accordion-style with idle float loop
- [ ] Dept sankey: user dots flow along SVG paths with GSAP
- [ ] Pyramid levels scale in, title chips appear after pyramid settles
- [ ] Feature detail cards and CTA row below MODULE 3 kept intact
