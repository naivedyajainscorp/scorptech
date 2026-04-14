# MODULE 2 User Management Viz — PRD for Qwen

## Context
File: `content_moderation-fixed.html`
Scope: MODULE 2 only. Replace the existing `scm-layout-matrix` div and its contents with the
new visualization. All CSS uses `scm-um-` prefix. All JS is inside a self-executing function
marked `MODULE 2 — USER MANAGEMENT VIZ`. Do not touch anything outside MODULE 2.

---

## Concept
A single stage cycles through 8 scenes back to back, each showing a different aspect of
User Management. Each scene plays for ~3.5s, transitions out in 0.4s, next scene fades in.
Total loop: ~32s then repeats.

---

## HTML — replace `<div class="scm-layout-matrix">...</div>` with:

```html
<div class="scm-layout-usermgmt" id="scmUserMgmtViz">

  <div class="scm-um-stage" id="scmUmStage">

    <!-- Scene indicator dots -->
    <div class="scm-um-dots" id="scmUmDots"></div>

    <!-- Scene label -->
    <div class="scm-um-scene-label" id="scmUmSceneLabel"></div>

    <!-- Scene 1: Permission Matrix -->
    <div class="scm-um-scene" id="scmScene1">
      <div class="scm-um-matrix-wrap">
        <div class="scm-um-matrix-grid" id="scmUmMatrix"></div>
      </div>
    </div>

    <!-- Scene 2: Org Tree -->
    <div class="scm-um-scene" id="scmScene2">
      <svg class="scm-um-tree-svg" id="scmUmTreeSvg" xmlns="http://www.w3.org/2000/svg"></svg>
      <div class="scm-um-tree-nodes" id="scmUmTreeNodes"></div>
    </div>

    <!-- Scene 3: User Card Deck -->
    <div class="scm-um-scene" id="scmScene3">
      <div class="scm-um-card-deck" id="scmUmCardDeck"></div>
    </div>

    <!-- Scene 4: Role Switcher -->
    <div class="scm-um-scene" id="scmScene4">
      <div class="scm-um-switcher-wrap">
        <div class="scm-um-switcher-card" id="scmUmSwitcherCard"></div>
        <div class="scm-um-switcher-perms" id="scmUmSwitcherPerms"></div>
      </div>
    </div>

    <!-- Scene 5: Heatmap Grid -->
    <div class="scm-um-scene" id="scmScene5">
      <div class="scm-um-heatmap-wrap" id="scmUmHeatmap"></div>
    </div>

    <!-- Scene 6: Multi-location User Map -->
    <div class="scm-um-scene" id="scmScene6">
      <svg class="scm-um-map-svg" id="scmUmMapSvg" xmlns="http://www.w3.org/2000/svg"></svg>
      <div class="scm-um-map-nodes" id="scmUmMapNodes"></div>
    </div>

    <!-- Scene 7: Block/Unblock Toggle -->
    <div class="scm-um-scene" id="scmScene7">
      <div class="scm-um-block-wrap" id="scmUmBlockWrap"></div>
    </div>

    <!-- Scene 8: Audit Trail Ticker -->
    <div class="scm-um-scene" id="scmScene8">
      <div class="scm-um-ticker-wrap" id="scmUmTicker"></div>
    </div>

  </div>

  <!-- Feature detail cards — keep existing ones below, unchanged -->

</div>
```

---

## DATA (top of script, add to existing SCM_DATA object)

Inside `SCM_DATA`, add a `userMgmtViz` key:

```javascript
userMgmtViz: {
  roles: ["Owner", "Prime Mgr", "Supervisor", "Worker"],
  actions: ["Issue", "Return", "View Cost", "Send Svc", "Transfer", "Block User", "Approve", "Manage Inv"],
  // 1 = allowed, 0 = denied — [Owner, PrimeMgr, Supervisor, Worker]
  permissions: {
    "Issue":      [1,1,1,1],
    "Return":     [1,1,1,1],
    "View Cost":  [1,1,0,0],
    "Send Svc":   [1,1,1,0],
    "Transfer":   [1,1,1,0],
    "Block User": [1,1,0,0],
    "Approve":    [1,1,0,0],
    "Manage Inv": [1,0,0,0]
  },
  users: [
    { name:"Arjun Mehta",   role:"Owner",      avatar:"AM", status:"active",  workplaces:["Malviya Nagar","Vaishali Nagar","Tonk Road","Mansarovar","Sitapura RIICO"] },
    { name:"Priya Sharma",  role:"Prime Mgr",  avatar:"PS", status:"active",  workplaces:["Malviya Nagar","Vaishali Nagar"] },
    { name:"Ravi Kumar",    role:"Supervisor", avatar:"RK", status:"active",  workplaces:["Tonk Road","Mansarovar"] },
    { name:"Neha Singh",    role:"Worker",     avatar:"NS", status:"blocked", workplaces:["Sitapura RIICO"] },
    { name:"Vikram Das",    role:"Worker",     avatar:"VD", status:"active",  workplaces:["Malviya Nagar"] }
  ],
  auditLog: [
    { user:"Ravi Kumar",   action:"Issued Torque Wrench Set",  location:"Tonk Road",       time:"2m ago",  type:"issue"  },
    { user:"Priya Sharma", action:"Approved transfer request",  location:"Vaishali Nagar",  time:"5m ago",  type:"approve"},
    { user:"Arjun Mehta",  action:"Blocked Neha Singh",         location:"Sitapura RIICO",  time:"12m ago", type:"block"  },
    { user:"Vikram Das",   action:"Returned Safety Helmet",     location:"Malviya Nagar",   time:"18m ago", type:"return" },
    { user:"Ravi Kumar",   action:"Sent Compressor to service", location:"Tonk Road",       time:"31m ago", type:"service"},
    { user:"Priya Sharma", action:"Issued Engine Oil 5W-30",    location:"Malviya Nagar",   time:"45m ago", type:"issue"  },
    { user:"Arjun Mehta",  action:"Transferred Forklift FL-02", location:"Mansarovar",      time:"1h ago",  type:"transfer"}
  ]
}
```

---

## CSS

Add inside `<style>` tag, after existing MODULE 1 rules:

```css
/* ---- MODULE 2 USER MGMT VIZ ---- */

.scm-layout-usermgmt { position: relative; }

/* Stage */
.scm-um-stage {
  position: relative;
  width: 100%;
  height: clamp(400px, 48vw, 640px);
  border-radius: 20px;
  background: var(--s-gray-50);
  border: 1px solid var(--s-gray-200);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Scene */
.scm-um-scene {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
}
.scm-um-scene.active {
  opacity: 1;
  pointer-events: auto;
}

/* Scene label */
.scm-um-scene-label {
  position: absolute;
  top: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.55rem, 0.7vw, 0.7rem);
  font-weight: 800;
  letter-spacing: 0.2em;
  color: var(--s-primary-400);
  font-family: monospace;
  text-transform: uppercase;
  z-index: 20;
  white-space: nowrap;
}

/* Dots */
.scm-um-dots {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 20;
}
.scm-um-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--s-gray-300);
  transition: background 0.3s, transform 0.3s;
}
.scm-um-dot.active {
  background: var(--s-primary-500);
  transform: scale(1.4);
}

/* ---- SCENE 1: Matrix ---- */
.scm-um-matrix-wrap {
  width: 92%;
  overflow-x: auto;
}
.scm-um-matrix-grid {
  display: grid;
  grid-template-columns: clamp(80px, 10vw, 130px) repeat(8, 1fr);
  gap: clamp(3px, 0.4vw, 6px);
  background: var(--s-primary-940);
  border-radius: 16px;
  padding: clamp(12px, 1.5vw, 20px);
}
.scm-um-mhdr {
  font-size: clamp(0.44rem, 0.55vw, 0.6rem);
  font-weight: 700;
  color: rgba(255,255,255,0.45);
  text-align: center;
  padding: clamp(4px,0.5vw,8px) 2px;
  font-family: monospace;
  letter-spacing: 0.05em;
}
.scm-um-mrole {
  font-size: clamp(0.55rem, 0.7vw, 0.75rem);
  font-weight: 700;
  color: rgba(255,255,255,0.75);
  display: flex;
  align-items: center;
  padding: clamp(4px,0.5vw,8px) 0;
}
.scm-um-mcell {
  text-align: center;
  padding: clamp(5px,0.6vw,9px) 2px;
  border-radius: 6px;
  font-size: clamp(0.75rem,1vw,1.1rem);
  transition: background 0.3s, transform 0.25s;
}
.scm-um-mcell.allow { color: #4ade80; }
.scm-um-mcell.deny  { color: rgba(255,255,255,0.12); }
.scm-um-mcell.hl    { background: rgba(34,211,238,0.2); transform: scale(1.15); color: #22d3ee; }

/* ---- SCENE 2: Org Tree ---- */
.scm-um-tree-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.scm-um-tree-nodes { position: absolute; inset: 0; }
.scm-um-tnode {
  position: absolute;
  transform: translate(-50%, -50%);
  background: var(--s-white);
  border: 2px solid var(--s-gray-200);
  border-radius: 12px;
  padding: clamp(8px,0.9vw,14px) clamp(12px,1.4vw,22px);
  display: flex;
  align-items: center;
  gap: clamp(5px,0.6vw,10px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  opacity: 0;
  scale: 0;
  white-space: nowrap;
}
.scm-um-tnode.root { border-color: var(--s-primary-400); background: rgba(34,211,238,0.04); }
.scm-um-tnode-avatar {
  width: clamp(28px,3vw,40px);
  height: clamp(28px,3vw,40px);
  border-radius: 50%;
  background: var(--s-primary-100);
  color: var(--s-primary-600);
  font-size: clamp(0.5rem,0.75vw,0.72rem);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.scm-um-tnode-name { font-size: clamp(0.55rem,0.8vw,0.78rem); font-weight: 700; color: var(--s-gray-800); }
.scm-um-tnode-role { font-size: clamp(0.42rem,0.6vw,0.58rem); color: var(--s-gray-400); }
.scm-um-tree-line { fill: none; stroke: var(--s-gray-300); stroke-width: 1.5; stroke-dasharray: 5 3; }

/* ---- SCENE 3: Card Deck ---- */
.scm-um-card-deck {
  position: relative;
  width: clamp(200px,22vw,300px);
  height: clamp(180px,20vw,260px);
}
.scm-um-ucard {
  position: absolute;
  inset: 0;
  background: var(--s-white);
  border: 1px solid var(--s-gray-200);
  border-radius: 18px;
  padding: clamp(14px,1.6vw,24px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: clamp(6px,0.7vw,10px);
  opacity: 0;
}
.scm-um-ucard-avatar {
  width: clamp(36px,4vw,54px);
  height: clamp(36px,4vw,54px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: clamp(0.6rem,0.85vw,0.85rem);
  margin-bottom: 2px;
}
.scm-um-ucard-name { font-size: clamp(0.65rem,0.9vw,0.88rem); font-weight: 700; color: var(--s-gray-800); }
.scm-um-ucard-role { font-size: clamp(0.48rem,0.65vw,0.62rem); color: var(--s-gray-400); }
.scm-um-ucard-wps  { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 2px; }
.scm-um-ucard-wp {
  font-size: clamp(0.38rem,0.52vw,0.5rem);
  padding: 1px clamp(4px,0.5vw,7px);
  background: var(--s-gray-50);
  border: 1px solid var(--s-gray-200);
  border-radius: 4px;
  color: var(--s-gray-500);
}
.scm-um-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: clamp(0.4rem,0.55vw,0.52rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  font-family: monospace;
  padding: 2px 7px;
  border-radius: 5px;
  align-self: flex-start;
}
.scm-um-status-badge.active  { color: #16a34a; background: rgba(22,163,74,0.08); }
.scm-um-status-badge.blocked { color: #dc2626; background: rgba(220,38,38,0.08); }

/* ---- SCENE 4: Role Switcher ---- */
.scm-um-switcher-wrap {
  display: flex;
  align-items: center;
  gap: clamp(16px,2.5vw,40px);
  flex-wrap: wrap;
  justify-content: center;
}
.scm-um-switcher-card {
  background: var(--s-white);
  border: 2px solid var(--s-primary-300);
  border-radius: 18px;
  padding: clamp(16px,2vw,30px);
  min-width: clamp(140px,15vw,210px);
  text-align: center;
  box-shadow: 0 4px 20px rgba(34,211,238,0.08);
}
.scm-um-sw-avatar {
  width: clamp(44px,5vw,64px);
  height: clamp(44px,5vw,64px);
  border-radius: 50%;
  background: var(--s-primary-100);
  color: var(--s-primary-600);
  font-weight: 800;
  font-size: clamp(0.7rem,1vw,1rem);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto clamp(6px,0.8vw,12px);
}
.scm-um-sw-name { font-size: clamp(0.65rem,0.9vw,0.88rem); font-weight: 700; color: var(--s-gray-800); margin-bottom: 4px; }
.scm-um-sw-role {
  font-size: clamp(0.5rem,0.7vw,0.68rem);
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 20px;
  display: inline-block;
  margin-top: 4px;
}
.scm-um-switcher-perms {
  display: flex;
  flex-direction: column;
  gap: clamp(4px,0.5vw,7px);
  min-width: clamp(160px,18vw,250px);
}
.scm-um-sw-perm-row {
  display: flex;
  align-items: center;
  gap: clamp(6px,0.8vw,12px);
  font-size: clamp(0.5rem,0.72vw,0.7rem);
  color: var(--s-gray-600);
  padding: clamp(3px,0.4vw,6px) clamp(8px,1vw,14px);
  background: var(--s-gray-50);
  border-radius: 8px;
  border: 1px solid var(--s-gray-200);
  transition: all 0.3s;
}
.scm-um-sw-perm-row.granted { border-color: rgba(22,163,74,0.3); background: rgba(22,163,74,0.05); }
.scm-um-sw-perm-row.denied  { opacity: 0.45; }
.scm-um-sw-perm-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.scm-um-sw-perm-dot.granted { background: #4ade80; }
.scm-um-sw-perm-dot.denied  { background: var(--s-gray-300); }

/* ---- SCENE 5: Heatmap ---- */
.scm-um-heatmap-wrap {
  width: 90%;
  overflow-x: auto;
}
.scm-um-hm-grid {
  display: grid;
  gap: clamp(3px,0.4vw,5px);
}
.scm-um-hm-cell {
  border-radius: 6px;
  height: clamp(28px,3.2vw,44px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.38rem,0.55vw,0.54rem);
  font-weight: 700;
  transition: all 0.4s;
  color: rgba(255,255,255,0.85);
}
.scm-um-hm-label-col { font-size: clamp(0.42rem,0.6vw,0.6rem); color: var(--s-gray-500); font-weight: 700; display: flex; align-items: center; }
.scm-um-hm-label-row { font-size: clamp(0.42rem,0.6vw,0.6rem); color: var(--s-gray-500); font-weight: 700; text-align: center; line-height: 1.2; display: flex; align-items: center; justify-content: center; padding: 2px; }

/* ---- SCENE 6: Map ---- */
.scm-um-map-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.scm-um-map-nodes { position: absolute; inset: 0; }
.scm-um-map-user-node {
  position: absolute;
  transform: translate(-50%, -50%);
  background: var(--s-white);
  border: 2px solid var(--s-primary-400);
  border-radius: 14px;
  padding: clamp(10px,1.2vw,18px) clamp(14px,1.6vw,24px);
  box-shadow: 0 4px 18px rgba(34,211,238,0.1);
  text-align: center;
  opacity: 0;
}
.scm-um-map-wp-node {
  position: absolute;
  transform: translate(-50%, -50%);
  background: var(--s-white);
  border: 1px solid var(--s-gray-200);
  border-radius: 10px;
  padding: clamp(6px,0.7vw,10px) clamp(8px,1vw,14px);
  font-size: clamp(0.44rem,0.65vw,0.62rem);
  font-weight: 600;
  color: var(--s-gray-700);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  opacity: 0;
  text-align: center;
}
.scm-um-map-line { fill: none; stroke-width: 1.5; stroke-dasharray: 5 3; opacity: 0.5; }

/* ---- SCENE 7: Block/Unblock ---- */
.scm-um-block-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(14px,1.8vw,28px);
}
.scm-um-block-card {
  background: var(--s-white);
  border-radius: 18px;
  padding: clamp(16px,2vw,30px) clamp(20px,2.5vw,40px);
  border: 2px solid var(--s-gray-200);
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: clamp(12px,1.5vw,24px);
  transition: border-color 0.4s, box-shadow 0.4s;
  min-width: clamp(220px,28vw,360px);
}
.scm-um-block-card.blocked { border-color: rgba(220,38,38,0.35); box-shadow: 0 4px 24px rgba(220,38,38,0.08); }
.scm-um-block-avatar {
  width: clamp(44px,5vw,64px);
  height: clamp(44px,5vw,64px);
  border-radius: 50%;
  font-weight: 800;
  font-size: clamp(0.65rem,0.9vw,0.85rem);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: filter 0.4s;
}
.scm-um-block-card.blocked .scm-um-block-avatar { filter: grayscale(1) opacity(0.5); }
.scm-um-block-info { flex: 1; }
.scm-um-block-name { font-size: clamp(0.65rem,0.9vw,0.85rem); font-weight: 700; color: var(--s-gray-800); }
.scm-um-block-role { font-size: clamp(0.48rem,0.65vw,0.62rem); color: var(--s-gray-400); margin-top: 2px; }
.scm-um-block-toggle {
  width: clamp(36px,4vw,52px);
  height: clamp(20px,2.2vw,28px);
  border-radius: 999px;
  background: var(--s-gray-200);
  position: relative;
  cursor: pointer;
  transition: background 0.4s;
  flex-shrink: 0;
}
.scm-um-block-toggle.on { background: #4ade80; }
.scm-um-block-toggle.off { background: #f87171; }
.scm-um-block-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(clamp(20px,2.2vw,28px) - 6px);
  height: calc(clamp(20px,2.2vw,28px) - 6px);
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: left 0.4s cubic-bezier(0.4,0,0.2,1);
}
.scm-um-block-toggle.on  .scm-um-block-thumb { left: calc(100% - clamp(20px,2.2vw,28px) + 3px); }
.scm-um-block-toggle.off .scm-um-block-thumb { left: 3px; }
.scm-um-block-status-text {
  font-size: clamp(0.6rem,0.85vw,0.8rem);
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 0.08em;
  transition: color 0.4s;
}

/* ---- SCENE 8: Audit Ticker ---- */
.scm-um-ticker-wrap {
  width: 88%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  gap: clamp(6px,0.8vw,11px);
}
.scm-um-tick-row {
  display: flex;
  align-items: center;
  gap: clamp(8px,1vw,14px);
  padding: clamp(8px,1vw,14px) clamp(10px,1.3vw,18px);
  background: var(--s-white);
  border: 1px solid var(--s-gray-200);
  border-radius: 12px;
  opacity: 0;
  transform: translateY(10px);
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
}
.scm-um-tick-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.scm-um-tick-dot.issue    { background: #22d3ee; }
.scm-um-tick-dot.approve  { background: #4ade80; }
.scm-um-tick-dot.block    { background: #f87171; }
.scm-um-tick-dot.return   { background: #a78bfa; }
.scm-um-tick-dot.service  { background: #f59e0b; }
.scm-um-tick-dot.transfer { background: #fb923c; }
.scm-um-tick-user { font-size: clamp(0.52rem,0.75vw,0.72rem); font-weight: 700; color: var(--s-gray-800); white-space: nowrap; }
.scm-um-tick-action { font-size: clamp(0.5rem,0.7vw,0.68rem); color: var(--s-gray-500); flex: 1; }
.scm-um-tick-loc { font-size: clamp(0.42rem,0.58vw,0.56rem); color: var(--s-primary-400); white-space: nowrap; }
.scm-um-tick-time { font-size: clamp(0.4rem,0.55vw,0.52rem); color: var(--s-gray-400); white-space: nowrap; font-family: monospace; }

/* Responsive */
@media (max-width: 767px) {
  .scm-um-switcher-wrap { flex-direction: column; align-items: center; }
  .scm-um-matrix-wrap { overflow-x: scroll; }
  .scm-um-heatmap-wrap { overflow-x: scroll; }
  .scm-um-tick-action { display: none; }
}
```

---

## JS

Add inside the `<script>` tag, after the MODULE 1 IIFE. Full self-contained IIFE:

```javascript
// ============================================================
// MODULE 2 — USER MANAGEMENT VIZ
// ============================================================
(function() {

  const D = SCM_DATA.userMgmtViz;
  const ROLE_COLORS = {
    "Owner":      { bg:"rgba(34,211,238,0.12)", text:"#0891b2",  badge:"#0891b2" },
    "Prime Mgr":  { bg:"rgba(74,222,128,0.12)", text:"#16a34a",  badge:"#16a34a" },
    "Supervisor": { bg:"rgba(167,139,250,0.12)",text:"#7c3aed",  badge:"#7c3aed" },
    "Worker":     { bg:"rgba(251,146,60,0.12)", text:"#ea580c",  badge:"#ea580c" }
  };
  const SCENE_LABELS = [
    "Permission Matrix",
    "Role Hierarchy",
    "User Card Deck",
    "Role Switcher",
    "Permission Heatmap",
    "Multi-Location Access",
    "Block / Unblock",
    "Live Audit Trail"
  ];
  const SCENE_DURATION = 3800; // ms per scene
  const TRANSITION_MS  = 400;

  let currentScene = 0;
  let sceneTimer   = null;
  let loopActive   = false;

  // ---- Utility ----
  function $(id) { return document.getElementById(id); }

  function roleColor(role) {
    return ROLE_COLORS[role] || { bg:"rgba(100,100,100,0.1)", text:"#666", badge:"#666" };
  }

  // ---- Build scene indicator dots ----
  function buildDots() {
    const dotsEl = $('scmUmDots');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const d = document.createElement('div');
      d.className = 'scm-um-dot' + (i === 0 ? ' active' : '');
      d.id = `scmUmDot${i}`;
      dotsEl.appendChild(d);
    }
  }

  function setDot(idx) {
    document.querySelectorAll('.scm-um-dot').forEach((d,i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function setLabel(idx) {
    const el = $('scmUmSceneLabel');
    if (el) el.textContent = SCENE_LABELS[idx];
  }

  // ---- Scene transitions ----
  function showScene(idx) {
    document.querySelectorAll('.scm-um-scene').forEach((s,i) => {
      if (i === idx) {
        gsap.to(s, { opacity: 1, duration: TRANSITION_MS/1000, ease: 'power2.out',
          onStart: () => s.classList.add('active') });
      } else {
        gsap.to(s, { opacity: 0, duration: TRANSITION_MS/1000, ease: 'power2.in',
          onComplete: () => s.classList.remove('active') });
      }
    });
    setDot(idx);
    setLabel(idx);
  }

  function nextScene() {
    currentScene = (currentScene + 1) % 8;
    animateScene(currentScene);
  }

  function scheduleNext() {
    sceneTimer = setTimeout(nextScene, SCENE_DURATION);
  }

  function animateScene(idx) {
    showScene(idx);
    const fns = [s1, s2, s3, s4, s5, s6, s7, s8];
    fns[idx]();
    scheduleNext();
  }

  // ============================================================
  // SCENE 1 — Permission Matrix
  // ============================================================
  function buildMatrix() {
    const grid = $('scmUmMatrix');
    if (!grid || grid.dataset.built) return;
    grid.dataset.built = 1;
    const cols = D.actions.length;
    grid.style.gridTemplateColumns = `clamp(80px,10vw,130px) repeat(${cols}, 1fr)`;

    // Header row
    const emptyHdr = document.createElement('div');
    emptyHdr.className = 'scm-um-mhdr';
    grid.appendChild(emptyHdr);
    D.actions.forEach(a => {
      const h = document.createElement('div');
      h.className = 'scm-um-mhdr';
      h.textContent = a;
      grid.appendChild(h);
    });

    // Role rows
    D.roles.forEach((role, ri) => {
      const roleEl = document.createElement('div');
      roleEl.className = 'scm-um-mrole';
      roleEl.textContent = role;
      grid.appendChild(roleEl);
      D.actions.forEach(action => {
        const cell = document.createElement('div');
        const allowed = D.permissions[action][ri];
        cell.className = `scm-um-mcell ${allowed ? 'allow' : 'deny'}`;
        cell.textContent = allowed ? '✓' : '×';
        cell.dataset.role = ri;
        cell.dataset.action = action;
        grid.appendChild(cell);
      });
    });
  }

  function s1() {
    buildMatrix();
    // Cycle-highlight one role row at a time
    let role = 0;
    const cycleRole = () => {
      document.querySelectorAll('.scm-um-mcell').forEach(c => c.classList.remove('hl'));
      document.querySelectorAll(`.scm-um-mcell[data-role="${role}"]`).forEach(c => {
        if (c.classList.contains('allow')) c.classList.add('hl');
      });
      role = (role + 1) % D.roles.length;
    };
    cycleRole();
    const iv = setInterval(cycleRole, 900);
    setTimeout(() => { clearInterval(iv); document.querySelectorAll('.scm-um-mcell').forEach(c => c.classList.remove('hl')); }, SCENE_DURATION - TRANSITION_MS);
  }

  // ============================================================
  // SCENE 2 — Org Tree
  // ============================================================
  function s2() {
    const svg   = $('scmUmTreeSvg');
    const wrap  = $('scmUmTreeNodes');
    if (!svg || !wrap) return;
    svg.innerHTML = '';
    wrap.innerHTML = '';

    const stage = $('scmUmStage');
    const W = stage.offsetWidth, H = stage.offsetHeight;
    const cx = W / 2;

    // Tree layout: 4 levels — Owner at top, then PrimeMgr, then Supervisor, then Worker
    // Use users data but just roles
    const levels = [
      [{ name:"Arjun Mehta",  role:"Owner",      avatar:"AM" }],
      [{ name:"Priya Sharma", role:"Prime Mgr",  avatar:"PS" }, { name:"Karan Joshi", role:"Prime Mgr", avatar:"KJ" }],
      [{ name:"Ravi Kumar",   role:"Supervisor", avatar:"RK" }, { name:"Meera Pillai",role:"Supervisor", avatar:"MP" }],
      [{ name:"Neha Singh",   role:"Worker",     avatar:"NS" }, { name:"Vikram Das",  role:"Worker",     avatar:"VD" }, { name:"Aditi Roy", role:"Worker", avatar:"AR" }]
    ];

    const levelY = [0.18, 0.38, 0.60, 0.80];
    const nodeEls = [];

    levels.forEach((level, li) => {
      const y = H * levelY[li];
      const step = W / (level.length + 1);
      level.forEach((user, ui) => {
        const x = step * (ui + 1);
        const rc = roleColor(user.role);
        const node = document.createElement('div');
        node.className = 'scm-um-tnode' + (li === 0 ? ' root' : '');
        node.style.left = x + 'px';
        node.style.top  = y + 'px';
        node.innerHTML = `
          <div class="scm-um-tnode-avatar" style="background:${rc.bg};color:${rc.text}">${user.avatar}</div>
          <div>
            <div class="scm-um-tnode-name">${user.name}</div>
            <div class="scm-um-tnode-role">${user.role}</div>
          </div>`;
        wrap.appendChild(node);
        nodeEls.push({ el: node, x, y, level: li });
      });
    });

    // Draw lines between levels in SVG (after nodes placed)
    requestAnimationFrame(() => {
      const stageRect = stage.getBoundingClientRect();
      // Connect each child to parent (simplified: each level node to proportional parent above)
      const byLevel = [];
      let idx = 0;
      levels.forEach((level, li) => {
        const group = [];
        level.forEach(() => { group.push(nodeEls[idx++]); });
        byLevel.push(group);
      });
      for (let li = 1; li < byLevel.length; li++) {
        const parents  = byLevel[li-1];
        const children = byLevel[li];
        children.forEach((child, ci) => {
          // assign each child to a parent evenly
          const parent = parents[Math.floor(ci * parents.length / children.length)];
          const line = document.createElementNS('http://www.w3.org/2000/svg','line');
          line.setAttribute('x1', parent.x); line.setAttribute('y1', parent.y + 18);
          line.setAttribute('x2', child.x);  line.setAttribute('y2', child.y - 18);
          line.setAttribute('class','scm-um-tree-line');
          svg.appendChild(line);
        });
      }
      // Animate nodes in staggered
      nodeEls.forEach((n, i) => {
        gsap.to(n.el, { opacity: 1, scale: 1, duration: 0.35, delay: i * 0.08, ease: 'back.out(2)' });
      });
    });
  }

  // ============================================================
  // SCENE 3 — User Card Deck
  // ============================================================
  function s3() {
    const deck = $('scmUmCardDeck');
    if (!deck) return;
    deck.innerHTML = '';

    const colors = ['#22d3ee','#4ade80','#a78bfa','#f59e0b','#fb923c'];
    D.users.forEach((u, i) => {
      const rc = roleColor(u.role);
      const card = document.createElement('div');
      card.className = 'scm-um-ucard';
      card.style.zIndex   = D.users.length - i;
      card.style.transform = `translate(${i*7}px, ${i*6}px) rotate(${(i-2)*1.8}deg)`;
      card.innerHTML = `
        <div class="scm-um-ucard-avatar" style="background:${rc.bg};color:${rc.text}">${u.avatar}</div>
        <div class="scm-um-ucard-name">${u.name}</div>
        <div class="scm-um-ucard-role">${u.role}</div>
        <div class="scm-um-status-badge ${u.status}">${u.status.toUpperCase()}</div>
        <div class="scm-um-ucard-wps">${u.workplaces.map(w=>`<span class="scm-um-ucard-wp">${w}</span>`).join('')}</div>`;
      deck.appendChild(card);
    });

    // Fan out then stack back
    const cards = deck.querySelectorAll('.scm-um-ucard');
    const fanAngles = [-16,-8,0,8,16];
    const fanX      = [-80,-40,0,40,80];
    gsap.set(cards, { opacity: 0, y: 30 });
    gsap.to(cards, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(2)',
      onComplete: () => {
        // Fan out
        cards.forEach((c,i) => {
          gsap.to(c, { x: fanX[i], rotation: fanAngles[i], duration: 0.5, delay: 0.1, ease: 'power2.out' });
        });
        // Stack back after 1.8s
        setTimeout(() => {
          cards.forEach((c,i) => {
            gsap.to(c, { x: 0, rotation: (i-2)*1.8, duration: 0.4, delay: i*0.04, ease: 'power2.inOut' });
          });
        }, 1800);
      }
    });
  }

  // ============================================================
  // SCENE 4 — Role Switcher
  // ============================================================
  function s4() {
    const card  = $('scmUmSwitcherCard');
    const perms = $('scmUmSwitcherPerms');
    if (!card || !perms) return;

    const user = D.users[0]; // Arjun Mehta
    const roleList = D.roles;
    let ri = 0;

    function renderSwitcher(role) {
      const rc = roleColor(role);
      const roleIdx = D.roles.indexOf(role);
      card.innerHTML = `
        <div class="scm-um-sw-avatar" style="background:${rc.bg};color:${rc.text}">AM</div>
        <div class="scm-um-sw-name">Arjun Mehta</div>
        <span class="scm-um-sw-role" style="background:${rc.bg};color:${rc.text}">${role}</span>`;

      perms.innerHTML = '';
      D.actions.forEach(action => {
        const granted = D.permissions[action][roleIdx] === 1;
        const row = document.createElement('div');
        row.className = `scm-um-sw-perm-row ${granted ? 'granted' : 'denied'}`;
        row.innerHTML = `
          <div class="scm-um-sw-perm-dot ${granted ? 'granted' : 'denied'}"></div>
          <span>${action}</span>`;
        perms.appendChild(row);
      });
      gsap.from(card,  { x: -12, opacity: 0, duration: 0.3, ease: 'power2.out' });
      gsap.from(perms.children, { x: 12, opacity: 0, duration: 0.25, stagger: 0.04, ease: 'power2.out' });
    }

    renderSwitcher(roleList[ri]);
    const iv = setInterval(() => {
      ri = (ri + 1) % roleList.length;
      renderSwitcher(roleList[ri]);
    }, 900);
    setTimeout(() => clearInterval(iv), SCENE_DURATION - TRANSITION_MS);
  }

  // ============================================================
  // SCENE 5 — Heatmap
  // ============================================================
  function s5() {
    const wrap = $('scmUmHeatmap');
    if (!wrap) return;
    wrap.innerHTML = '';

    const actions = D.actions;
    const roles   = D.roles;
    const grid    = document.createElement('div');
    grid.className = 'scm-um-hm-grid';
    grid.style.gridTemplateColumns = `clamp(72px,9vw,120px) repeat(${roles.length}, 1fr)`;
    wrap.appendChild(grid);

    // Intensity: Owner=4, PrimeMgr=3, Supervisor=2, Worker=1
    const intensity = [4,3,2,1];
    const COLORS = [
      'rgba(34,211,238,0.12)',
      'rgba(34,211,238,0.30)',
      'rgba(34,211,238,0.55)',
      'rgba(34,211,238,0.82)'
    ];

    // Header row
    const emptyH = document.createElement('div'); emptyH.className='scm-um-hm-label-col'; grid.appendChild(emptyH);
    roles.forEach(r => {
      const h = document.createElement('div'); h.className='scm-um-hm-label-row'; h.textContent=r; grid.appendChild(h);
    });

    const cells = [];
    actions.forEach(action => {
      const rowLabel = document.createElement('div');
      rowLabel.className='scm-um-hm-label-col'; rowLabel.textContent=action; grid.appendChild(rowLabel);
      roles.forEach((role, ri) => {
        const allowed = D.permissions[action][ri];
        const inten   = allowed ? intensity[ri] : 0;
        const cell    = document.createElement('div');
        cell.className = 'scm-um-hm-cell';
        cell.style.background = allowed ? COLORS[ri] : 'var(--s-gray-100)';
        cell.style.opacity = '0';
        grid.appendChild(cell);
        cells.push({ el: cell, allowed, ri, inten });
      });
    });

    gsap.to(cells.map(c=>c.el), { opacity: 1, duration: 0.3, stagger: 0.03, ease: 'power1.out' });

    // Pulse sweep columns
    let col = 0;
    const sweep = setInterval(() => {
      cells.forEach(c => {
        gsap.to(c.el, { scale: c.ri === col ? 1.08 : 1, duration: 0.2, ease: 'power2.out' });
      });
      col = (col + 1) % roles.length;
    }, 700);
    setTimeout(() => clearInterval(sweep), SCENE_DURATION - TRANSITION_MS);
  }

  // ============================================================
  // SCENE 6 — Multi-location Map
  // ============================================================
  function s6() {
    const svg  = $('scmUmMapSvg');
    const wrap = $('scmUmMapNodes');
    if (!svg || !wrap) return;
    svg.innerHTML = '';
    wrap.innerHTML = '';

    const stage = $('scmUmStage');
    const W = stage.offsetWidth, H = stage.offsetHeight;

    // Show Arjun Mehta (Owner) at center connected to all 5 workplaces
    const user = D.users[0];
    const cx = W * 0.5, cy = H * 0.45;

    const userNode = document.createElement('div');
    userNode.className = 'scm-um-map-user-node';
    userNode.style.left = cx + 'px'; userNode.style.top = cy + 'px';
    const rc = roleColor(user.role);
    userNode.innerHTML = `
      <div style="width:clamp(32px,3.5vw,48px);height:clamp(32px,3.5vw,48px);border-radius:50%;
        background:${rc.bg};color:${rc.text};display:flex;align-items:center;justify-content:center;
        font-weight:800;font-size:clamp(0.55rem,0.8vw,0.78rem);margin:0 auto 5px;">AM</div>
      <div style="font-size:clamp(0.5rem,0.75vw,0.72rem);font-weight:700;color:var(--s-gray-800);">${user.name}</div>
      <div style="font-size:clamp(0.4rem,0.58vw,0.55rem);color:${rc.text};font-weight:700;">${user.role}</div>`;
    wrap.appendChild(userNode);

    // 5 workplace nodes arranged in an ellipse around user
    const wpAngles = [320, 25, 90, 155, 220];
    const rX = W * 0.34, rY = H * 0.33;
    const wps = SCM_DATA.workplaceViz.primaryOrg.workplaces;
    const wpNodes = [];
    wps.forEach((wp, i) => {
      const angle = (wpAngles[i] - 90) * Math.PI / 180;
      const x = cx + rX * Math.cos(angle);
      const y = cy + rY * Math.sin(angle);
      const wpEl = document.createElement('div');
      wpEl.className = 'scm-um-map-wp-node';
      wpEl.style.left = x + 'px'; wpEl.style.top = y + 'px';
      wpEl.innerHTML = `<i class="fas ${wp.icon}" style="color:var(--s-primary-400);font-size:clamp(0.55rem,0.75vw,0.72rem);margin-bottom:2px;display:block;"></i>${wp.name}`;
      wrap.appendChild(wpEl);
      wpNodes.push({ el: wpEl, x, y });

      // Draw dashed line user→wp
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',cx); line.setAttribute('y1',cy);
      line.setAttribute('x2',x);  line.setAttribute('y2',y);
      line.setAttribute('class','scm-um-map-line');
      line.setAttribute('stroke','var(--s-primary-300)');
      const len = Math.hypot(x-cx, y-cy);
      line.setAttribute('stroke-dasharray', len);
      line.setAttribute('stroke-dashoffset', len);
      line.id = `scmUmMapLine${i}`;
      svg.appendChild(line);
    });

    // Animate user node in, then draw lines, then wp nodes
    gsap.to(userNode, { opacity: 1, duration: 0.4, ease: 'back.out(2)' });
    wpNodes.forEach((n, i) => {
      gsap.to(`#scmUmMapLine${i}`, { strokeDashoffset: 0, duration: 0.5, delay: 0.5 + i * 0.12, ease: 'power2.inOut' });
      gsap.to(n.el, { opacity: 1, duration: 0.3, delay: 0.7 + i * 0.12, ease: 'back.out(2)' });
    });

    // Pulse dot along each line
    setTimeout(() => {
      wpNodes.forEach((n, i) => {
        const dot = document.createElement('div');
        dot.className = 'scm-dot-packet';
        dot.style.background = 'var(--s-primary-400)';
        stage.appendChild(dot);
        gsap.fromTo(dot, { x: cx, y: cy, opacity: 1 }, {
          x: n.x, y: n.y, opacity: 0, duration: 1.2,
          delay: i * 0.2, ease: 'power1.in',
          repeat: 2, repeatDelay: 0.5,
          onComplete: () => dot.remove()
        });
      });
    }, 1200);
  }

  // ============================================================
  // SCENE 7 — Block / Unblock
  // ============================================================
  function s7() {
    const wrap = $('scmUmBlockWrap');
    if (!wrap) return;
    wrap.innerHTML = '';

    const user = D.users[3]; // Neha Singh — blocked
    const rc   = roleColor(user.role);

    const card = document.createElement('div');
    card.className = 'scm-um-block-card';
    card.innerHTML = `
      <div class="scm-um-block-avatar" style="background:${rc.bg};color:${rc.text};">${user.avatar}</div>
      <div class="scm-um-block-info">
        <div class="scm-um-block-name">${user.name}</div>
        <div class="scm-um-block-role">${user.role} · Sitapura RIICO</div>
      </div>
      <div class="scm-um-block-toggle off" id="scmUmToggle">
        <div class="scm-um-block-thumb"></div>
      </div>`;
    wrap.appendChild(card);

    const statusText = document.createElement('div');
    statusText.className = 'scm-um-block-status-text';
    statusText.style.color = '#f87171';
    statusText.textContent = 'ACCESS BLOCKED';
    wrap.appendChild(statusText);

    gsap.from(card, { y: 20, opacity: 0, duration: 0.4, ease: 'back.out(2)' });
    gsap.from(statusText, { y: 10, opacity: 0, duration: 0.35, delay: 0.2 });

    const toggle = document.getElementById('scmUmToggle');
    let isBlocked = true;

    function flipToggle() {
      isBlocked = !isBlocked;
      if (!isBlocked) {
        toggle.className = 'scm-um-block-toggle on';
        card.classList.remove('blocked');
        statusText.style.color = '#4ade80';
        statusText.textContent = 'ACCESS ACTIVE';
        gsap.fromTo(statusText, { scale: 0.9 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
      } else {
        toggle.className = 'scm-um-block-toggle off';
        card.classList.add('blocked');
        statusText.style.color = '#f87171';
        statusText.textContent = 'ACCESS BLOCKED';
        gsap.fromTo(statusText, { scale: 0.9 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
      }
    }

    // Start blocked, flip to active after 1.2s, flip back after 2.5s
    card.classList.add('blocked');
    setTimeout(() => flipToggle(), 1200);
    setTimeout(() => flipToggle(), 2600);
  }

  // ============================================================
  // SCENE 8 — Audit Trail Ticker
  // ============================================================
  function s8() {
    const wrap = $('scmUmTicker');
    if (!wrap) return;
    wrap.innerHTML = '';

    D.auditLog.forEach((entry, i) => {
      const row = document.createElement('div');
      row.className = 'scm-um-tick-row';
      row.innerHTML = `
        <div class="scm-um-tick-dot ${entry.type}"></div>
        <span class="scm-um-tick-user">${entry.user}</span>
        <span class="scm-um-tick-action">${entry.action}</span>
        <span class="scm-um-tick-loc"><i class="fas fa-location-pin" style="font-size:0.45rem;margin-right:2px;"></i>${entry.location}</span>
        <span class="scm-um-tick-time">${entry.time}</span>`;
      wrap.appendChild(row);
    });

    gsap.to(wrap.querySelectorAll('.scm-um-tick-row'), {
      opacity: 1, y: 0, duration: 0.35, stagger: 0.1, ease: 'power2.out'
    });
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    buildDots();
    setLabel(0);
    currentScene = 0;
    showScene(0);
    s1();
    scheduleNext();
    loopActive = true;
  }

  const section = document.getElementById('scmUserMgmtViz');
  if (section) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loopActive) {
        obs.disconnect();
        init();
      }
    }, { threshold: 0.2 });
    obs.observe(section);
  }

})();
// ---- END MODULE 2 ----
```

---

## What NOT to change
- Module 2 feature cards below the viz (`scm-feed-card-detail` rows) — keep them
- All other modules (3–9)
- MODULE 1 JS or CSS
- `SCM_DATA` keys other than adding `userMgmtViz`

---

## Checklist
- [ ] `userMgmtViz` key added to `SCM_DATA`
- [ ] `scm-layout-matrix` div replaced with `scm-layout-usermgmt`
- [ ] All 8 scene divs present inside `#scmUmStage`
- [ ] All `scm-um-` CSS rules added, no existing rules removed
- [ ] MODULE 2 IIFE added after MODULE 1 IIFE in script
- [ ] All 8 scene functions: `s1` through `s8` implemented
- [ ] Scenes cycle automatically with SCENE_DURATION timing
- [ ] Scene dots and label update on each transition
- [ ] `IntersectionObserver` triggers init at 0.2 threshold
- [ ] Feature cards below viz kept intact
