const id = (value) => document.getElementById(value);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function sbar(time = "09:14") {
  return `
    <div class="s-bar">
      <span class="s-bar-t">${time}</span>
      <span class="s-bar-i">● ● ●</span>
    </div>
  `;
}

function abar(title, back = false, action = "") {
  return `
    <div class="s-ab">
      ${back ? '<span class="s-ab-bk">‹</span>' : ""}
      <span class="s-ab-tt">${title}</span>
      ${action ? `<span class="s-ab-ac">${action}</span>` : ""}
    </div>
  `;
}

async function type(el, text, ms = 26) {
  if (!el) return;
  el.textContent = "";
  el.classList.add("cur");
  for (const char of text) {
    el.textContent += char;
    await sleep(ms + Math.random() * 12);
  }
  el.classList.remove("cur");
}

function rip(el) {
  if (!el) return;
  const r = document.createElement("div");
  r.className = "s-rip";
  const size = Math.min(el.offsetWidth, el.offsetHeight) * 0.9;
  Object.assign(r.style, {
    width: `${size}px`,
    height: `${size}px`,
    top: `${el.offsetHeight / 2 - size / 2}px`,
    left: `${el.offsetWidth / 2 - size / 2}px`,
  });
  el.appendChild(r);
  setTimeout(() => r.remove(), 600);
}

const started = new Set();

function watchSection(sectionId, screenId, startFn) {
  const section = id(sectionId);
  const screen = id(screenId);
  if (!section || !screen) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting || started.has(screenId)) return;
      started.add(screenId);
      startFn(screen);
      observer.disconnect();
    },
    { threshold: 0.2 }
  );

  observer.observe(section);
}

function initRevealObserver() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll(".mu-rv").forEach((el) => revealObserver.observe(el));
}

function initPhoneTilt() {
  const scenes = document.querySelectorAll(".ph-scene");

  scenes.forEach((scene) => {
    const tilt = scene.querySelector(".ph-tilt");
    if (!tilt) return;

    const baseRY = parseFloat(tilt.dataset.ry || "0");
    const baseRX = parseFloat(tilt.dataset.rx || "0");

    const reset = () => {
      tilt.style.transform = `perspective(1200px) rotateY(${baseRY}deg) rotateX(${baseRX}deg)`;
    };

    reset();

    if (window.matchMedia("(max-width: 991px)").matches) return;

    scene.addEventListener("mousemove", (e) => {
      const rect = scene.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const ry = baseRY + px * 10;
      const rx = baseRX - py * 8;
      tilt.style.transform = `perspective(1200px) rotateY(${ry}deg) rotateX(${rx}deg)`;
    });

    scene.addEventListener("mouseleave", reset);
  });
}

function initFloatingBadges() {
  const cards = document.querySelectorAll(".mu-fa");
  cards.forEach((card, index) => {
    card.style.animationDelay = card.style.animationDelay || `${index * 0.6}s`;
  });
}

async function f1Loop(screen) {
  while (screen.isConnected) {
    await f1(screen);
    await sleep(300);
  }
}

async function f1(screen) {
  screen.innerHTML = `
    ${sbar("09:14")}
    ${abar("Quick Actions", false, "All")}
    <div class="s-body">
      <div class="s-lbl">Good morning, Arjun · Bay 3</div>

      <div class="s-tiles">
        <div class="s-tile" id="t1">
          <div class="s-tile-ico">⚡</div>
          <div class="s-tile-l">Issue Asset</div>
        </div>
        <div class="s-tile" id="t2">
          <div class="s-tile-ico">📝</div>
          <div class="s-tile-l">Log Entry</div>
        </div>
        <div class="s-tile" id="t3">
          <div class="s-tile-ico">✅</div>
          <div class="s-tile-l">Inspection</div>
        </div>
        <div class="s-tile" id="t4">
          <div class="s-tile-ico">🛠</div>
          <div class="s-tile-l">Work Order</div>
        </div>
      </div>

      <div class="s-lbl">Today's Queue</div>

      <div class="s-card">
        <div class="s-card-hd">
          <span class="s-card-tt">WO-0891 · HVAC-12</span>
          <span class="ph-pill pi-am">Due 14:00</span>
        </div>
        <div class="s-card-sb">Filter replacement · Bay 2</div>
      </div>

      <div class="s-card">
        <div class="s-card-hd">
          <span class="s-card-tt">INSP-0241 · CNC-04</span>
          <span class="ph-pill pi-rd">Overdue 1d</span>
        </div>
        <div class="s-card-sb">Pre-repair inspection</div>
      </div>

      <div class="s-ov" id="f1ov">
        <div class="s-ov-c" style="background:#dcfce7;">✓</div>
        <div class="s-ov-tt">Work Order Filed</div>
        <div class="s-ov-rf">WO-2026-0892</div>
        <div class="s-ov-sb">CNC-04 · Arjun Mehta<br>Assigned instantly</div>
      </div>
    </div>
  `;

  await sleep(1800);

  const tile = id("t1");
  const overlay = id("f1ov");

  if (tile) {
    tile.classList.add("tap");
    rip(tile);
  }

  await sleep(700);

  if (overlay) overlay.classList.add("show");

  await sleep(2600);

  if (overlay) overlay.classList.remove("show");
  if (tile) tile.classList.remove("tap");

  await sleep(400);
}

async function f2Loop(screen) {
  while (screen.isConnected) {
    await f2(screen);
    await sleep(300);
  }
}

async function f2(screen) {
  screen.innerHTML = `
    ${sbar("09:16")}
    ${abar("Log Entry · Maintenance", true)}
    <div class="s-body">
      <div class="s-field" id="f2a" style="position:relative;">
        <div class="s-fl">Asset ID <span style="color:var(--p);font-size:9px;font-weight:700;">SCAN</span></div>
        <div class="s-fv" id="f2va"></div>
      </div>

      <div class="s-field" id="f2b">
        <div class="s-fl">Work Type</div>
        <div class="s-fv" id="f2vb"></div>
      </div>

      <div class="s-field" id="f2c">
        <div class="s-fl">Parts Used</div>
        <div class="s-fv" id="f2vc"></div>
      </div>

      <div class="s-field" id="f2d">
        <div class="s-fl">Cost</div>
        <div class="s-fv" id="f2vd"></div>
      </div>

      <div class="s-field" id="f2e">
        <div class="s-fl">Technician</div>
        <div class="s-fv" id="f2ve"></div>
      </div>

      <button class="s-btn s-btn-success" id="f2btn" disabled><i class="fas fa-check me-1"></i>Log Entry</button>

      <div class="s-ov" id="f2ov">
        <div class="s-ov-c" style="background:#dcfce7;">✓</div>
        <div class="s-ov-tt">Entry Logged</div>
        <div class="s-ov-rf">LOG-2026-1142</div>
        <div class="s-ov-sb">09:16:42 · Synced to cloud</div>
      </div>
    </div>
  `;

  const scanField = id("f2a");
  const scanValue = id("f2va");

  if (scanField && scanValue) {
    scanField.classList.add("on");
    const scanLine = document.createElement("div");
    scanLine.className = "s-scan";
    scanField.appendChild(scanLine);
    await sleep(1000);
    await type(scanValue, "CNC-04 Bearing Assembly", 22);
    scanField.classList.remove("on");
    scanField.classList.add("done");
  }

  const fields = [
    ["f2b", "f2vb", "Corrective Repair"],
    ["f2c", "f2vc", "SKF-6205 ×1, Seal ×2"],
    ["f2d", "f2vd", "₹12,400"],
    ["f2e", "f2ve", "Arjun Mehta · Bay 3"],
  ];

  for (const [fieldId, valueId, text] of fields) {
    const field = id(fieldId);
    const value = id(valueId);
    if (!field || !value) continue;

    field.classList.add("on");
    await type(value, text, 20);
    field.classList.remove("on");
    field.classList.add("done");
    await sleep(120);
  }

  const btn = id("f2btn");
  if (btn) btn.disabled = false;

  await sleep(600);

  if (btn) rip(btn);

  await sleep(400);

  const overlay = id("f2ov");
  if (overlay) overlay.classList.add("show");

  await sleep(2200);

  if (overlay) overlay.classList.remove("show");

  ["f2a", "f2b", "f2c", "f2d", "f2e"].forEach((fieldId) => {
    const field = id(fieldId);
    if (field) field.classList.remove("done", "on");
  });

  ["f2va", "f2vb", "f2vc", "f2vd", "f2ve"].forEach((valueId) => {
    const value = id(valueId);
    if (value) value.textContent = "";
  });

  if (btn) btn.disabled = true;

  await sleep(400);
}

async function f3Loop(screen) {
  while (screen.isConnected) {
    await f3(screen);
    await sleep(300);
  }
}

async function f3(screen) {
  let reserve = 124;
  let active = 67;

  screen.innerHTML = `
    ${sbar("09:18")}
    ${abar("Smart Inventories", false, "Filter")}
    <div style="padding:8px 10px 0;background:var(--bg);flex-shrink:0;">
      <div class="s-inv-strip">
        <div class="s-inv-c" style="border:1px solid var(--p);">
          <div class="s-inv-n" id="f3r">${reserve}</div>
          <div class="s-inv-l">Reserve</div>
        </div>
        <div class="s-inv-c">
          <div class="s-inv-n" id="f3a">${active}</div>
          <div class="s-inv-l">Active</div>
        </div>
        <div class="s-inv-c">
          <div class="s-inv-n">12</div>
          <div class="s-inv-l">Issued</div>
        </div>
      </div>
    </div>

    <div class="s-tabs">
      <div class="s-tab on">Reserved</div>
      <div class="s-tab">Active</div>
      <div class="s-tab">Issued</div>
    </div>

    <div class="s-body">
      <div class="s-item" id="f3i1">
        <div class="s-item-ico">📦</div>
        <div style="flex:1;">
          <div class="s-item-n">Bearing SKF-6205</div>
          <div class="s-item-s">Qty 4 · Bay Store A</div>
        </div>
        <button class="s-item-btn" id="f3b1">Issue</button>
      </div>

      <div class="s-item">
        <div class="s-item-ico">🧰</div>
        <div style="flex:1;">
          <div class="s-item-n">Shaft Seal 40568</div>
          <div class="s-item-s">Qty 8 · Bay Store A</div>
        </div>
        <button class="s-item-btn">Issue</button>
      </div>

      <div class="s-item">
        <div class="s-item-ico">🛢</div>
        <div style="flex:1;">
          <div class="s-item-n">Hydraulic Oil SAE-46</div>
          <div class="s-item-s">Qty 12L · Chemicals</div>
        </div>
        <button class="s-item-btn">Issue</button>
      </div>

      <div class="s-ov" id="f3ov">
        <div class="s-ov-c" style="background:#dcfce7;">✓</div>
        <div class="s-ov-tt">Item Issued</div>
        <div class="s-ov-rf">ISS-2026-0418</div>
        <div class="s-ov-sb">Bearing SKF-6205<br>Arjun Mehta · Bay 3</div>
      </div>
    </div>
  `;

  await sleep(2000);

  const item = id("f3i1");
  const button = id("f3b1");
  const reserveNode = id("f3r");
  const activeNode = id("f3a");
  const overlay = id("f3ov");

  if (item) item.classList.add("hi");

  await sleep(500);

  if (button) rip(button);

  await sleep(500);

  if (item) {
    item.classList.remove("hi");
    item.classList.add("done");
  }

  reserve -= 1;
  active += 1;

  if (reserveNode) {
    reserveNode.style.color = "var(--er)";
    reserveNode.textContent = reserve;
    setTimeout(() => {
      reserveNode.style.color = "";
    }, 800);
  }

  if (activeNode) {
    activeNode.style.color = "var(--ok)";
    activeNode.textContent = active;
    setTimeout(() => {
      activeNode.style.color = "";
    }, 800);
  }

  if (overlay) overlay.classList.add("show");

  await sleep(2400);

  if (overlay) overlay.classList.remove("show");
  if (item) item.classList.remove("done");

  await sleep(400);
}

async function f4Loop(screen) {
  while (screen.isConnected) {
    await f4(screen);
    await sleep(300);
  }
}

async function f4(screen) {
  const items = [
    { l: "Power isolation confirmed", t: "pass", r: "Pass" },
    { l: "Bearing wear measured", t: "warn", r: "0.8mm" },
    { l: "Lubrication levels checked", t: "pass", r: "OK" },
    { l: "Shaft seal integrity", t: "fail", r: "Replace" },
    { l: "Photos captured · 4", t: "pass", r: "Done" },
    { l: "Digital signature", t: "pass", r: "Signed" },
  ];

  screen.innerHTML = `
    ${sbar("09:22")}
    ${abar("Inspection · CNC-04", true)}
    <div style="padding:6px 10px 4px;background:var(--bg);flex-shrink:0;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span class="s-lbl" id="f4l0">${items.length} checkpoints</span>
        <span class="s-lbl">INSP-0241</span>
      </div>
      <div class="s-prog">
        <div class="s-prog-b" id="f4p" style="width:0%"></div>
      </div>
    </div>

    <div class="s-body">
      ${items
        .map(
          (item, i) => `
            <div class="s-chk" id="f4c${i}">
              <div class="s-cb" id="f4b${i}"></div>
              <div class="s-chk-l">${item.l}</div>
              <div class="s-chk-r">${item.r}</div>
            </div>
          `
        )
        .join("")}

      <button class="s-btn s-btn-success" id="f4sub" disabled><i class"fas fa-check me-1"></i>Submit Report</button>

      <div class="s-ov" id="f4ov">
        <div class="s-ov-c s-bg-danger s-text-danger"><i class="fas fa-flag me-1"></i></div>
        <div class="s-text-danger">Report Submitted</div>
        <div class="s-ov-rf">INSP-0241 · CNC-04</div>
        <div class="s-ov-sb">6/6 checkpoints · 2 flags<br>Arjun Mehta · 09:22:47</div>
      </div>
    </div>
  `;

  await sleep(600);

  for (let i = 0; i < items.length; i += 1) {
    const card = id(`f4c${i}`);
    const box = id(`f4b${i}`);
    const progress = id("f4p");
    const label = id("f4l0");
    const item = items[i];

    if (!card) continue;

    card.classList.add(item.t);
    if (box) box.textContent = item.t === "pass" ? "✓" : item.t === "fail" ? "!" : "•";
    if (progress) progress.style.width = `${((i + 1) / items.length) * 100}%`;
    if (label) label.textContent = `${i + 1}/${items.length} checkpoints`;

    await sleep(560);
  }

  const submit = id("f4sub");
  if (submit) submit.disabled = false;

  await sleep(700);

  if (submit) rip(submit);

  await sleep(400);

  const overlay = id("f4ov");
  if (overlay) overlay.classList.add("show");

  await sleep(2400);

  if (overlay) overlay.classList.remove("show");

  await sleep(400);
}

async function f5Loop(screen) {
  while (screen.isConnected) {
    await f5(screen);
    await sleep(300);
  }
}

async function f5(screen) {
  screen.innerHTML = `
    ${sbar("09:26")}
    <div class="s-ab">
      <span class="s-ab-tt">Pending Approvals</span>
      <span class="s-ab-bdg" id="f5bd">2</span>
    </div>

    <div class="s-body">
      <div class="s-card" id="f5cd" style="border-color:var(--wa);">
        <div class="s-card-hd">
          <span class="s-card-tt">REQ-2026-0341</span>
          <span class="ph-pill pi-am" id="f5st">PENDING</span>
        </div>
        <div class="s-card-sb">
          CNC-04 Bearing Seal<br>
          Est. cost <strong>₹12,400</strong> · Parts reserved
        </div>

        <div style="display:flex;gap:7px;margin-top:9px;" id="f5bts">
          <button style="flex:1;background:#fee2e2;color:var(--er);border:none;border-radius:5px;font-size:10px;font-weight:700;padding:7px;cursor:pointer;">Reject</button>
          <button style="flex:1;background:var(--ok);color:#fff;border:none;border-radius:5px;font-size:10px;font-weight:700;padding:7px;cursor:pointer;" id="f5ap">Approve</button>
        </div>
      </div>

      <div class="s-card">
        <div class="s-card-hd">
          <span class="s-card-tt">REQ-2026-0340</span>
          <span class="ph-pill pi-am">PENDING</span>
        </div>
        <div class="s-card-sb">HVAC-12 Filter Set · ₹3,200</div>
      </div>

      <div class="s-lbl">Approval Timeline</div>

      <div class="s-tl">
        <div class="s-tl-row show">
          <div class="s-tl-sp">
            <div class="s-tl-dot ok"></div>
            <div class="s-tl-ln"></div>
          </div>
          <div>
            <div class="s-tl-txt">Submitted by Arjun Mehta</div>
            <div class="s-tl-t">09:26:14</div>
          </div>
        </div>

        <div class="s-tl-row show">
          <div class="s-tl-sp">
            <div class="s-tl-dot ok"></div>
            <div class="s-tl-ln"></div>
          </div>
          <div>
            <div class="s-tl-txt">Routed to Priya Singh</div>
            <div class="s-tl-t">09:26:15</div>
          </div>
        </div>

        <div class="s-tl-row" id="f5tl3">
          <div class="s-tl-sp">
            <div class="s-tl-dot ac" id="f5dt3"></div>
          </div>
          <div>
            <div class="s-tl-txt" id="f5tx3">Awaiting decision…</div>
            <div class="s-tl-t" id="f5tm3">—</div>
          </div>
        </div>
      </div>
    </div>

    <div class="s-toast" id="f5ts">
      <div class="s-toast-ico">🔔</div>
      <div class="s-toast-txt">Priya Singh approved<br><strong>REQ-2026-0341</strong></div>
    </div>
  `;

  await sleep(2200);

  const approve = id("f5ap");
  if (approve) rip(approve);

  await sleep(500);

  const card = id("f5cd");
  const status = id("f5st");
  const buttons = id("f5bts");
  const row3 = id("f5tl3");
  const dot3 = id("f5dt3");
  const txt3 = id("f5tx3");
  const time3 = id("f5tm3");
  const toast = id("f5ts");
  const badge = id("f5bd");

  if (card) {
    card.style.borderColor = "var(--ok)";
    card.style.background = "#f0fdf4";
  }

  if (status) {
    status.textContent = "APPROVED";
    status.className = "ph-pill pi-gn";
  }

  if (buttons) buttons.style.display = "none";
  if (row3) row3.classList.add("show");
  if (dot3) dot3.className = "s-tl-dot ok";
  if (txt3) txt3.textContent = "Approved · Priya Singh";
  if (time3) time3.textContent = "09:30:22";
  if (toast) toast.classList.add("show");
  if (badge) badge.textContent = "1";

  await sleep(2600);

  if (toast) toast.classList.remove("show");

  await sleep(600);

  if (card) {
    card.style.borderColor = "var(--wa)";
    card.style.background = "";
  }

  if (status) {
    status.textContent = "PENDING";
    status.className = "ph-pill pi-am";
  }

  if (buttons) buttons.style.display = "flex";
  if (row3) row3.classList.remove("show");
  if (dot3) dot3.className = "s-tl-dot ac";
  if (txt3) txt3.textContent = "Awaiting decision…";
  if (time3) time3.textContent = "—";
  if (badge) badge.textContent = "2";

  await sleep(400);
}
const liveFeedItems = [
  { ico: "🛠", ib: "var(--pl)", ic: "var(--p)", tx: "WO-0892 created · CNC-04", t: "09:14" },
  { ico: "✅", ib: "#dcfce7", ic: "var(--ok)", tx: "Inspection INSP-0241 submitted", t: "09:22" },
  { ico: "📦", ib: "var(--pl)", ic: "var(--p)", tx: "Parts reserved · Bearing Seal", t: "09:20" },
  { ico: "⚠", ib: "#fef3c7", ic: "var(--wa)", tx: "HVAC-12 maintenance overdue", t: "09:05" },
  { ico: "✔", ib: "#dcfce7", ic: "var(--ok)", tx: "REQ-0341 approved · ₹12,400", t: "09:30" },
  { ico: "📍", ib: "var(--pl)", ic: "var(--p)", tx: "Repair scheduled · CNC-04", t: "09:31" },
];

let liveIndex = 0;

function addLiveRow(feed, data, instant = false) {
  const row = document.createElement("div");
  row.className = `s-act${instant ? " show" : ""}`;
  row.innerHTML = `
    <div class="s-act-ico" style="background:${data.ib};color:${data.ic};">${data.ico}</div>
    <div class="s-act-txt">${data.tx}</div>
    <div class="s-act-t">${data.t}</div>
  `;
  feed.insertBefore(row, feed.firstChild);

  if (!instant) {
    requestAnimationFrame(() => row.classList.add("show"));
  }
}

async function f6Loop(screen) {
  let wo = 64;
  let opex = 48;

  screen.innerHTML = `
    ${sbar("09:30")}
    <div class="s-ab">
      <span class="s-ab-tt">Live Dashboard</span>
      <span style="font-size:11px;font-weight:700;color:#4ade80;display:flex;align-items:center;gap:4px;">
        <span class="s-live"></span>Live
      </span>
    </div>

    <div class="s-body">
      <div class="s-kpi-grid">
        <div class="s-kpi">
          <div class="s-kpi-l">Open WOs</div>
          <div class="s-kpi-v" id="f6wo">${wo}</div>
          <div class="s-kpi-d d-up">+3</div>
        </div>
        <div class="s-kpi">
          <div class="s-kpi-l">OPEX Today</div>
          <div class="s-kpi-v" id="f6op">₹${opex}K</div>
          <div class="s-kpi-d d-dn">running</div>
        </div>
        <div class="s-kpi">
          <div class="s-kpi-l">Inspections</div>
          <div class="s-kpi-v">8</div>
          <div class="s-kpi-d d-up">+1</div>
        </div>
        <div class="s-kpi">
          <div class="s-kpi-l">Uptime</div>
          <div class="s-kpi-v">97%</div>
          <div class="s-kpi-d d-dn">CNC-04</div>
        </div>
      </div>

      <div class="s-lbl" style="display:flex;align-items:center;gap:5px;">
        Live Activity <span class="s-live" style="box-shadow:none;margin:0;"></span>
      </div>

      <div id="f6fd" style="display:flex;flex-direction:column;gap:7px;overflow:hidden;"></div>
    </div>
  `;

  const feed = id("f6fd");
  if (feed) {
    for (let i = 0; i < 2; i += 1) {
      const item = liveFeedItems[liveIndex % liveFeedItems.length];
      liveIndex += 1;
      addLiveRow(feed, item, true);
    }
  }

  while (screen.isConnected) {
    await sleep(1900);

    const woNode = id("f6wo");
    const opNode = id("f6op");

    if (!woNode || !opNode || !feed) break;

    if (Math.random() > 0.5) {
      wo += 1;
      woNode.style.color = "var(--p)";
      woNode.textContent = wo;
      setTimeout(() => {
        woNode.style.color = "";
      }, 600);
    } else {
      opex += 2;
      opNode.style.color = "var(--er)";
      opNode.textContent = `₹${opex}K`;
      setTimeout(() => {
        opNode.style.color = "";
      }, 600);
    }

    const item = liveFeedItems[liveIndex % liveFeedItems.length];
    liveIndex += 1;
    addLiveRow(feed, item, false);

    while (feed.children.length > 4) {
      feed.removeChild(feed.lastChild);
    }
  }
}

async function heroLoop() {
  const screen = id("h0");
  if (!screen) return;

  while (screen.isConnected) {
    await hS1(screen);
    await sleep(200);
    await hS2(screen);
    await sleep(200);
    await hS3(screen);
    await sleep(200);
    await hS4(screen);
    await sleep(200);
  }
}

async function hS1(screen) {
  screen.innerHTML = `
    ${sbar("09:14")}
    ${abar("My Workstation", false, "New")}
    <div class="s-body">
      <div class="s-kpi-grid">
        <div class="s-kpi" id="ha1">
          <div class="s-kpi-l">Open WOs</div>
          <div class="s-kpi-v">64</div>
          <div class="s-kpi-d d-up">+3 today</div>
        </div>
        <div class="s-kpi" id="ha2">
          <div class="s-kpi-l">My Assets</div>
          <div class="s-kpi-v">12</div>
          <div class="s-kpi-d d-dn">steady</div>
        </div>
        <div class="s-kpi" id="ha3">
          <div class="s-kpi-l">Inspections</div>
          <div class="s-kpi-v">3</div>
          <div class="s-kpi-d d-up">2 due today</div>
        </div>
        <div class="s-kpi" id="ha4">
          <div class="s-kpi-l">Uptime</div>
          <div class="s-kpi-v">97%</div>
          <div class="s-kpi-d d-dn">good</div>
        </div>
      </div>

      <div class="s-lbl">Recent Activity</div>

      <div class="s-act">
        <div class="s-act-ico" style="background:#dcfce7;color:var(--ok);">✓</div>
        <div class="s-act-txt">WO-0892 created · CNC-04 bearing</div>
        <div class="s-act-t">09:14</div>
      </div>

      <div class="s-act">
        <div class="s-act-ico" style="background:#dcfce7;color:var(--ok);">✓</div>
        <div class="s-act-txt">Inspection INSP-0241 closed</div>
        <div class="s-act-t">09:08</div>
      </div>

      <div class="s-act">
        <div class="s-act-ico" style="background:#fef3c7;color:var(--wa);">!</div>
        <div class="s-act-txt">HVAC-12 maintenance overdue 3d</div>
        <div class="s-act-t">08:55</div>
      </div>

      <div class="s-act">
        <div class="s-act-ico" style="background:var(--pl);color:var(--p);">↗</div>
        <div class="s-act-txt">Bearing SKF-6205 issued</div>
        <div class="s-act-t">08:40</div>
      </div>
    </div>
  `;

  await sleep(300);
  ["ha1", "ha2", "ha3", "ha4"].forEach((nodeId, index) => {
    setTimeout(() => {
      const el = id(nodeId);
      if (el) el.classList.add("show");
    }, index * 180);
  });
  await sleep(3800);
}

async function hS2(screen) {
  screen.innerHTML = `
    ${sbar("09:16")}
    ${abar("Quick Issue", true, "")}
    <div class="s-body">
      <div class="s-field" id="hf1" style="position:relative;">
        <div class="s-fl">Asset ID <span style="color:var(--p);font-size:9px;font-weight:700;">SCAN</span></div>
        <div class="s-fv" id="hv1"></div>
      </div>

      <div class="s-field" id="hf2">
        <div class="s-fl">Category</div>
        <div class="s-fv" id="hv2"></div>
      </div>

      <div class="s-field" id="hf3">
        <div class="s-fl">Issued To</div>
        <div class="s-fv" id="hv3"></div>
      </div>

      <div class="s-field" id="hf4">
        <div class="s-fl">Purpose</div>
        <div class="s-fv" id="hv4"></div>
      </div>

      <button class="s-btn s-btn-success" id="hfb" disabled><i class="fas fa-check me-1"></i>Issue Asset</button>

      <div class="s-ov" id="hov">
        <div class="s-ov-c" style="background:#dcfce7;">✓</div>
        <div class="s-ov-tt">Asset Issued</div>
        <div class="s-ov-rf">ISS-2026-0417</div>
        <div class="s-ov-sb">CNC-04 · Arjun Mehta · Bay 3</div>
      </div>
    </div>
  `;

  const steps = [
    ["hf1", "hv1", "CNC-04 Bearing Assembly", true],
    ["hf2", "hv2", "Machinery · High Value", false],
    ["hf3", "hv3", "Arjun Mehta · Bay 3", false],
    ["hf4", "hv4", "Pre-repair inspection", false]
  ];

  for (const [fieldId, valueId, text, scan] of steps) {
    const field = id(fieldId);
    const value = id(valueId);
    if (!field || !value) continue;

    field.classList.add("on");

    if (scan) {
      const scanLine = document.createElement("div");
      scanLine.className = "s-scan";
      field.appendChild(scanLine);
      await sleep(1000);
    }

    await type(value, text, 24);
    field.classList.remove("on");
    field.classList.add("done");
    await sleep(150);
  }

  const button = id("hfb");
  if (button) button.disabled = false;

  await sleep(500);
  if (button) rip(button);

  await sleep(400);
  const overlay = id("hov");
  if (overlay) overlay.classList.add("show");

  await sleep(2400);
}

async function hS3(screen) {
  const checks = [
    { l: "Power isolation confirmed", t: "pass", r: "Pass" },
    { l: "Bearing wear measured", t: "warn", r: "0.8mm" },
    { l: "Lubrication levels OK", t: "pass", r: "Pass" },
    { l: "Shaft seal integrity", t: "fail", r: "Replace" },
    { l: "Photos captured 4", t: "pass", r: "Done" }
  ];

  screen.innerHTML = `
    ${sbar("09:22")}
    ${abar("Inspection · CNC-04", true, "")}
    <div style="padding:6px 10px 4px;background:var(--bg);flex-shrink:0;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span class="s-lbl" id="hl0">${checks.length} checkpoints</span>
        <span class="s-lbl">INSP-0241</span>
      </div>
      <div class="s-prog">
        <div class="s-prog-b" id="hp" style="width:0%"></div>
      </div>
    </div>

    <div class="s-body">
      ${checks.map((item, i) => `
        <div class="s-chk" id="hc${i}">
          <div class="s-cb" id="hb${i}"></div>
          <div class="s-chk-l">${item.l}</div>
          <div class="s-chk-r">${item.r}</div>
        </div>
      `).join("")}

      <button class="s-btn s-btn-success" id="hsub" disabled><i class="fas fa-check me-1"></i>Submit Report</button>
    </div>
  `;

  await sleep(600);

  for (let i = 0; i < checks.length; i += 1) {
    const card = id(`hc${i}`);
    const box = id(`hb${i}`);
    const progress = id("hp");
    const label = id("hl0");
    const item = checks[i];

    if (!card) continue;

    card.classList.add(item.t);
    if (box) box.textContent = item.t === "pass" ? "✓" : item.t === "fail" ? "!" : "•";
    if (progress) progress.style.width = `${((i + 1) / checks.length) * 100}%`;
    if (label) label.textContent = `${i + 1}/${checks.length} checkpoints`;

    await sleep(560);
  }

  const submit = id("hsub");
  if (submit) submit.disabled = false;

  await sleep(700);

  if (submit) rip(submit);

  await sleep(2400);
}

async function hS4(screen) {
  screen.innerHTML = `
    ${sbar("09:26")}
    <div class="s-ab">
      <span class="s-ab-tt">Live Dashboard</span>
      <span style="font-size:11px;font-weight:700;color:#4ade80;display:flex;align-items:center;gap:4px;">
        <span class="s-live"></span>Live
      </span>
    </div>

    <div class="s-body">
      <div class="s-kpi-grid">
        <div class="s-kpi" id="hd1a">
          <div class="s-kpi-l">Open WOs</div>
          <div class="s-kpi-v" id="hd1">64</div>
          <div class="s-kpi-d d-up">+1</div>
        </div>
        <div class="s-kpi" id="hd2a">
          <div class="s-kpi-l">OPEX Today</div>
          <div class="s-kpi-v">48K</div>
          <div class="s-kpi-d d-dn">-12K</div>
        </div>
        <div class="s-kpi" id="hd3a">
          <div class="s-kpi-l">Inspections</div>
          <div class="s-kpi-v">8</div>
          <div class="s-kpi-d d-up">+1</div>
        </div>
        <div class="s-kpi">
          <div class="s-kpi-l">Uptime</div>
          <div class="s-kpi-v">97%</div>
          <div class="s-kpi-d d-dn">CNC-04</div>
        </div>
      </div>

      <div class="s-lbl">Live Activity</div>

      <div class="s-act">
        <div class="s-act-ico" style="background:#dcfce7;color:var(--ok);">✓</div>
        <div class="s-act-txt"><strong>INSP-0241 submitted</strong> · CNC-04</div>
        <div class="s-act-t">09:22</div>
      </div>

      <div class="s-act">
        <div class="s-act-ico" style="background:var(--pl);color:var(--p);">↗</div>
        <div class="s-act-txt"><strong>Parts reserved</strong> · Seal ×2</div>
        <div class="s-act-t">09:20</div>
      </div>

      <div class="s-act">
        <div class="s-act-ico" style="background:var(--pl);color:var(--p);">📍</div>
        <div class="s-act-txt"><strong>Repair scheduled</strong> · CNC-04</div>
        <div class="s-act-t">09:14</div>
      </div>
    </div>
  `;

  await sleep(300);
  ["hd1a", "hd2a", "hd3a"].forEach((nodeId, index) => {
    setTimeout(() => {
      const el = id(nodeId);
      if (el) el.classList.add("show");
    }, index * 220);
  });

  await sleep(2000);
  const metric = id("hd1");
  if (metric) {
    metric.style.color = "var(--p)";
    metric.textContent = "65";
    setTimeout(() => {
      metric.style.color = "";
    }, 700);
  }

  await sleep(2000);
}

function init() {
  initRevealObserver();
  initPhoneTilt();
  initFloatingBadges();

  heroLoop();

  setTimeout(() => { const el = id("hn1"); if (el) el.classList.add("show"); }, 700);
  setTimeout(() => { const el = id("hn2"); if (el) el.classList.add("show"); }, 1200);
  setTimeout(() => { const el = id("hn3"); if (el) el.classList.add("show"); }, 1000);
  setTimeout(() => { const el = id("hn4"); if (el) el.classList.add("show"); }, 1700);

  watchSection("f1s", "s1", f1Loop);
  watchSection("f2s", "s2", f2Loop);
  watchSection("f3s", "s3", f3Loop);
  watchSection("f4s", "s4", f4Loop);
  watchSection("f5s", "s5", f5Loop);
  watchSection("f6s", "s6", f6Loop);
}

document.addEventListener("DOMContentLoaded", init);