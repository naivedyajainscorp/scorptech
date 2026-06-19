/* =========================================================
   SAPPHIRE HERO — Scene Engine
   Usage:  SapphireHero.init('#container-id');
   Or:     <div data-sapphire-hero-viz></div>  (auto-init)
   ========================================================= */

(function (root) {
  'use strict';

  const DESIGN_W = 1440;
  const DESIGN_H = 800;
  const CYCLE_MS = 145000;

  const ICON = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    workorder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
    inventory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>',
    inspect: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    maint: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
    money: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    prop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    lock: '🔒',
    box: '📦',
    wrench: '🔧',
    // inventory scene icons
    inventoryReserve: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5-9 4.5L3 7.5Z"></path><path d="M3 12l9 4.5 9-4.5"></path><path d="M3 16.5 12 21l9-4.5"></path></svg>`,
    inventoryDist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18"></path><path d="M12 7h7"></path><path d="m16 4 3 3-3 3"></path><path d="M12 17H5"></path><path d="m8 14-3 3 3 3"></path></svg>`,
    inventoryActive: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="m9.2 12.3 1.8 1.9 3.9-4.2"></path></svg>`,
    inventorySpares: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v4H7z"></path><path d="M9 11v6"></path><path d="M15 11v6"></path><path d="M5 17h14"></path><path d="M9 4h6"></path></svg>`,
    toolkit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"></path><path d="M9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>`,
    machinery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="8" height="7"></rect><path d="M11 13h5l2 2v2"></path><circle cx="7" cy="19" r="1.6"></circle><circle cx="18" cy="19" r="1.6"></circle><path d="M6 10V7h4"></path></svg>`,
    materials: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 6h14"></path><path d="M7 6v12"></path><path d="M17 6v12"></path><path d="M7 18h10"></path><path d="M10 10h4"></path></svg>`,
    vehicle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 15h14l-1.2-4a2 2 0 0 0-1.9-1.5H8.1A2 2 0 0 0 6.2 11L5 15Z"></path><path d="M6 15v2"></path><path d="M18 15v2"></path><circle cx="8" cy="17.5" r="1.5"></circle><circle cx="16" cy="17.5" r="1.5"></circle></svg>`,
    blend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6"></path><path d="M10 3v5l-4.5 7.5A3 3 0 0 0 8.1 20h7.8a3 3 0 0 0 2.6-4.5L14 8V3"></path><path d="M8.5 14h7"></path></svg>`,
    assembly: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6" height="6"></rect><rect x="14" y="4" width="6" height="6"></rect><rect x="9" y="14" width="6" height="6"></rect><path d="M10 7h4"></path><path d="M12 10v4"></path></svg>`
  };

  // ---- Maintenance stage data (module-level for render() access) ----
  function shFormatFutureDate(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function shDueOffset(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const MAINT_ITEMS = [
    { code: 'SRV-2001', name: 'Compressor Service',         type: 'Service',       location: 'Workshop A',   priority: 'High',   due: shFormatFutureDate(shDueOffset(7,10)),  status: 'Scheduled' },
    { code: 'SRV-2002', name: 'Conveyor Belt Replace',      type: 'Replacement',   location: 'Line 3',       priority: 'Medium', due: shFormatFutureDate(shDueOffset(8,12)),  status: 'Scheduled' },
    { code: 'SRV-2003', name: 'Hydraulic Test',             type: 'Inspection',    location: 'Bay 4',         priority: 'Low',    due: shFormatFutureDate(shDueOffset(10,15)),status: 'Scheduled' },
    { code: 'SRV-2004', name: 'Welding Rig Check',          type: 'Inspection',    location: 'Fab Shop',      priority: 'Medium', due: shFormatFutureDate(shDueOffset(9,14)),  status: 'Scheduled' },
    { code: 'SRV-2005', name: 'Forklift Annual Cert',       type: 'Certification', location: 'Yard',           priority: 'High',   due: shFormatFutureDate(shDueOffset(7,10)),  status: 'Scheduled' },
    { code: 'SRV-2006', name: 'HVAC Filter Replace',        type: 'Replacement',   location: 'Office Wing',   priority: 'Low',    due: shFormatFutureDate(shDueOffset(12,15)),status: 'Scheduled' },
    { code: 'SRV-2007', name: 'Generator Load Test',        type: 'Test',          location: 'Substation',    priority: 'High',   due: shFormatFutureDate(shDueOffset(8,11)),  status: 'Scheduled' },
    { code: 'SRV-2008', name: 'Crane Wire Rope Insp',       type: 'Inspection',    location: 'Bay 2',         priority: 'High',   due: shFormatFutureDate(shDueOffset(7,9)),   status: 'Scheduled' },
    { code: 'SRV-2009', name: 'Pneumatic Tool Service',     type: 'Service',       location: 'Workshop B',   priority: 'Medium', due: shFormatFutureDate(shDueOffset(10,13)),status: 'Scheduled' },
    { code: 'SRV-2010', name: 'Lathe Bed Alignment',        type: 'Adjustment',    location: 'Machine Shop',  priority: 'Low',    due: shFormatFutureDate(shDueOffset(11,15)),status: 'Scheduled' },
    { code: 'SRV-2011', name: 'Air Compressor Drain',      type: 'Maintenance',   location: 'Line 1',        priority: 'Low',    due: shFormatFutureDate(shDueOffset(9,12)),  status: 'Scheduled' },
    { code: 'SRV-2012', name: 'Paint Booth Filter',         type: 'Replacement',   location: 'Paint Shop',    priority: 'Medium', due: shFormatFutureDate(shDueOffset(8,10)),  status: 'Scheduled' },
    { code: 'SRV-2013', name: 'Elevator Inspection',        type: 'Certification', location: 'Main Building', priority: 'High',   due: shFormatFutureDate(shDueOffset(7,8)),   status: 'Scheduled' },
    { code: 'SRV-2014', name: 'Pump Calibration',           type: 'Calibration',   location: 'Water Station', priority: 'Medium', due: shFormatFutureDate(shDueOffset(10,14)),status: 'Scheduled' },
    { code: 'SRV-2015', name: 'Welding Circuit Test',       type: 'Test',          location: 'Fab Shop',      priority: 'Medium', due: shFormatFutureDate(shDueOffset(12,15)),status: 'Scheduled' },
  ];

  function renderMaintRows() {
    return MAINT_ITEMS.map(item => {
      const statusCls = item.priority === 'High' ? 'sh-maint-pill--danger'
        : item.priority === 'Medium' ? 'sh-maint-pill--warning'
        : 'sh-maint-pill--success';
      return `<tr data-sh-maint-row>
        <td>${item.code}</td>
        <td>${item.name}</td>
        <td>${item.type}</td>
        <td>${item.location}</td>
        <td><span class="sh-maint-pill ${statusCls} sh-maint-priority-pill">${item.priority}</span></td>
        <td>${item.due}</td>
        <td><span class="sh-maint-pill sh-maint-pill--primary sh-maint-status-pill">${item.status}</span></td>
      </tr>`;
    }).join('');
  }

  const SCENES = {
    desktop: {
      id: 'desktop',
      title: 'Desktop',
      subtitle: 'Operation Cascade',
      icon: '💻',
      render() {
        return `
          <div class="sh-desktop">
            <div class="sh-app-topbar">
              <div class="sh-app-brand">
                <div class="sh-brand-logo">S</div>
                <div class="sh-brand-name">Sapphire</div>
              </div>

              <div class="sh-app-tabs">
                <button class="sh-app-tab active" id="sb-dash">Dashboard</button>
                <button class="sh-app-tab" id="sb-inv">Inventory<span class="sh-nav-badge">8</span></button>
                <button class="sh-app-tab" id="sb-req">Requests <span class="sh-nav-badge">6</span></button>
                <button class="sh-app-tab" id="sb-rep">Reports<span class="sh-nav-badge">7</span></button>
                <button class="sh-app-tab" id="sb-insp">Inspections <span class="sh-nav-badge">10+</span></button>
                <button class="sh-app-tab" id="sb-maint">Maintenance</button>
                <button class="sh-app-tab" id="sb-opex">OPEX</button>
              </div>

              <div class="sh-app-user">
                <div class="sh-user-avatar">RK</div>
                <div class="sh-user-name">Rajesh Kumar</div>
              </div>
            </div>

            <div class="sh-main">
              <div class="sh-page-head">
                <div>
                  <div class="sh-page-title">Operations Dashboard</div>
                  <div class="sh-page-sub">
                    Live updated · All locations
                    <span class="sh-live-pill"><span class="sh-live-dot"></span>LIVE</span>
                  </div>
                </div>
              </div>

              <div class="sh-card" data-sh-el="wo">
                <div class="sh-wo-top">
                  <div class="sh-wo-id">WO-2026-0892</div>
                  <div class="sh-wo-tag">Filed</div>
                </div>
                <div class="sh-wo-meta">
                  <span><strong>CNC-04</strong> · Bearing & Seal Replacement</span>
                  <span>⚡ High Priority</span>
                  <span>👤 Arjun Mehta</span>
                </div>
              </div>
              
              <div class="sh-card" data-sh-el="prop">
                <div class="sh-card-head">
                  <div class="sh-card-title">${ICON.prop} System Propagation</div>
                  <div class="sh-card-sub">Impact across connected modules · updating in real time</div>
                </div>
                <div class="sh-prop-grid">
                  <div class="sh-prop-item" data-sh-delay="0"><div class="sh-prop-check">✓</div><div class="sh-prop-icon">${ICON.inventory}</div><div class="sh-prop-label">Inventory Checking</div><div class="sh-prop-desc">Bearing Assembly · Shaft Seal</div></div>
                  <div class="sh-prop-item" data-sh-delay="1"><div class="sh-prop-check">✓</div><div class="sh-prop-icon">${ICON.money}</div><div class="sh-prop-label">OPEX Logging</div><div class="sh-prop-desc">Estimated cost queued</div></div>
                  <div class="sh-prop-item" data-sh-delay="2"><div class="sh-prop-check">✓</div><div class="sh-prop-icon">${ICON.inspect}</div><div class="sh-prop-label">Inspection Scheduled</div><div class="sh-prop-desc">Pre-repair check triggered</div></div>
                  <div class="sh-prop-item" data-sh-delay="3"><div class="sh-prop-check">✓</div><div class="sh-prop-icon">${ICON.maint}</div><div class="sh-prop-label">Maintenance Linked</div><div class="sh-prop-desc">Service cycle updated</div></div>
                </div>
              </div>

              <div class="sh-card" data-sh-el="insp">
                <div class="sh-card-head">
                  <div class="sh-card-title">${ICON.doc} Pre-Repair Inspection · CNC-04</div>
                  <div class="sh-card-sub">Auto-scheduled · Inspector: Arjun Mehta</div>
                </div>
                <div class="sh-checklist">
                  <div class="sh-check-item"><div class="sh-check-icon pass">✓</div><span>Power isolation confirmed</span></div>
                  <div class="sh-check-item"><div class="sh-check-icon warn">!</div><span>Bearing wear — High</span></div>
                  <div class="sh-check-item"><div class="sh-check-icon pass">✓</div><span>Lubrication levels OK</span></div>
                  <div class="sh-check-item"><div class="sh-check-icon fail">✗</div><span>Shaft seal — Replace</span></div>
                  <div class="sh-check-item"><div class="sh-check-icon pass">✓</div><span>Photos uploaded (4)</span></div>
                  <div class="sh-check-item"><div class="sh-check-icon pass">✓</div><span>Digital signature collected</span></div>
                </div>
              </div>

              <div class="sh-metrics" data-sh-el="metrics">
                <div class="sh-metric-card"><div class="sh-metric-label">Open WOs</div><div class="sh-metric-value">64<span class="sh-metric-trend up">▲ +1</span></div><div class="sh-metric-sub">just now</div></div>
                <div class="sh-metric-card"><div class="sh-metric-label">Inspections</div><div class="sh-metric-value">8<span class="sh-metric-trend up">▲ +1</span></div><div class="sh-metric-sub">scheduled</div></div>
                <div class="sh-metric-card"><div class="sh-metric-label">OPEX Today</div><div class="sh-metric-value">₹48.2K<span class="sh-metric-trend down">+₹12K</span></div><div class="sh-metric-sub">queued</div></div>
                <div class="sh-metric-card"><div class="sh-metric-label">Asset Uptime</div><div class="sh-metric-value">97.1%</div><div class="sh-metric-sub">CNC-04 offline</div></div>
              </div>

              <div class="sh-inv-stage" data-sh-el="inv-stage">
                <section class="sh-inv-screen sh-inv-screen--types" data-sh-inv-screen="types" aria-hidden="true">
                  <div class="sh-inv-page-head">
                    <div>
                      <div class="sh-inv-page-kicker">Inventory Structure</div>
                      <div class="sh-inv-page-title">Everything in its place.</div>
                    </div>
                    <div class="sh-inv-live-pill"><span class="sh-inv-live-dot"></span>Live sync</div>
                  </div>

                  <div class="sh-inv-card-grid">
                    <article class="sh-inv-card" data-sh-inv-card>
                      <div class="sh-inv-card-media">
                        <img src="assets/images_industries/warehouse.jpeg" alt="Reserve inventory">
                        <div class="sh-inv-card-float">
                          <span class="sh-inv-card-float-label">Primary pool</span>
                          <strong>Held for controlled release</strong>
                        </div>
                      </div>
                      <div class="sh-inv-card-body">
                        <p class="sh-inv-card-label">Inventory Type</p>
                        <h3 class="sh-inv-card-title">RESERVE</h3>
                      </div>
                    </article>

                    <article class="sh-inv-card" data-sh-inv-card>
                      <div class="sh-inv-card-media">
                        <img src="assets/images_industries/Logistics_&_Fleet_Operations.png" alt="Distribution reserve">
                        <div class="sh-inv-card-float">
                          <span class="sh-inv-card-float-label">Movement layer</span>
                          <strong>Positioned for onward issue</strong>
                        </div>
                      </div>
                      <div class="sh-inv-card-body">
                        <p class="sh-inv-card-label">Inventory Type</p>
                        <h3 class="sh-inv-card-title sh-inv-card-title--wide">DISTRIBUTION RESERVE</h3>
                      </div>
                    </article>

                    <article class="sh-inv-card" data-sh-inv-card>
                      <div class="sh-inv-card-media">
                        <img src="assets/images_industries/manufacturing_factory.jpeg" alt="Active inventory">
                        <div class="sh-inv-card-float">
                          <span class="sh-inv-card-float-label">Live use</span>
                          <strong>Already in circulation</strong>
                        </div>
                      </div>
                      <div class="sh-inv-card-body">
                        <p class="sh-inv-card-label">Inventory Type</p>
                        <h3 class="sh-inv-card-title">ACTIVE</h3>
                      </div>
                    </article>

                    <article class="sh-inv-card" data-sh-inv-card>
                      <div class="sh-inv-card-media">
                        <img src="assets/images_industries/Farm_Equipment_Warehouse.png" alt="Spare parts and materials">
                        <div class="sh-inv-card-float">
                          <span class="sh-inv-card-float-label">Support stock</span>
                          <strong>Consumables and replacement depth</strong>
                        </div>
                      </div>
                      <div class="sh-inv-card-body">
                        <p class="sh-inv-card-label">Inventory Type</p>
                        <h3 class="sh-inv-card-title sh-inv-card-title--wide">SPARE PARTS &amp; MATERIALS</h3>
                      </div>
                    </article>
                  </div>
                </section>

                <section class="sh-inv-screen sh-inv-screen--groups" data-sh-inv-screen="groups" aria-hidden="true">
                  <div class="sh-inv-page-head">
                    <div>
                      <div class="sh-inv-page-kicker">Applicability</div>
                      <div class="sh-inv-page-title">For your</div>
                    </div>
                  </div>

                  <div class="sh-inv-bento">
                    <article class="sh-inv-bento-card sh-inv-bento-card--tools" data-sh-inv-bento>
                      <img src="assets/images_industries/state-workshops.png" alt="Tools">
                      <div class="sh-inv-bento-overlay"></div>
                      <div class="sh-inv-bento-content">
                        <p class="sh-inv-bento-label">Category</p>
                        <h3 class="sh-inv-bento-title">Tools</h3>
                      </div>
                    </article>

                    <article class="sh-inv-bento-card sh-inv-bento-card--toolkits" data-sh-inv-bento>
                      <img src="assets/images_industries/Amusement_Parks.jpeg" alt="Toolkits">
                      <div class="sh-inv-bento-overlay"></div>
                      <div class="sh-inv-bento-content">
                        <p class="sh-inv-bento-label">Category</p>
                        <h3 class="sh-inv-bento-title">Toolkits</h3>
                      </div>
                    </article>

                    <article class="sh-inv-bento-card sh-inv-bento-card--machinery" data-sh-inv-bento>
                      <img src="assets/images_industries/Airport_Hangars.jpeg" alt="Machinery">
                      <div class="sh-inv-bento-overlay"></div>
                      <div class="sh-inv-bento-content">
                        <p class="sh-inv-bento-label">Category</p>
                        <h3 class="sh-inv-bento-title">Machinery</h3>
                      </div>
                    </article>

                    <article class="sh-inv-bento-card sh-inv-bento-card--materials" data-sh-inv-bento>
                      <img src="assets/images_industries/Corporate_Offices.jpeg" alt="Materials">
                      <div class="sh-inv-bento-overlay"></div>
                      <div class="sh-inv-bento-content">
                        <p class="sh-inv-bento-label">Category</p>
                        <h3 class="sh-inv-bento-title">Materials</h3>
                      </div>
                    </article>

                    <article class="sh-inv-bento-card sh-inv-bento-card--vehicles" data-sh-inv-bento>
                      <img src="assets/images_industries/Agro_Processing_Unit.jpeg" alt="Vehicles">
                      <div class="sh-inv-bento-overlay"></div>
                      <div class="sh-inv-bento-content">
                        <p class="sh-inv-bento-label">Category</p>
                        <h3 class="sh-inv-bento-title">Vehicles</h3>
                      </div>
                    </article>

                    <article class="sh-inv-bento-card sh-inv-bento-card--blends" data-sh-inv-bento>
                      <img src="assets/images_industries/automotive_service_station.jpeg" alt="Blends">
                      <div class="sh-inv-bento-overlay"></div>
                      <div class="sh-inv-bento-content">
                        <p class="sh-inv-bento-label">Category</p>
                        <h3 class="sh-inv-bento-title">Blends</h3>
                      </div>
                    </article>

                    <article class="sh-inv-bento-card sh-inv-bento-card--assembly" data-sh-inv-bento>
                    <img src="assets/images_industries/hospital.jpeg" alt="Blends">
                      <div class="sh-inv-bento-content sh-inv-bento-content--plain">
                        <p class="sh-inv-bento-label">Special</p>
                        <h3 class="sh-inv-bento-title">Assembly</h3>
                      </div>
                    </article>
                  </div>
                </section>

                <section class="sh-inv-screen sh-inv-screen--table" data-sh-inv-screen="table" aria-hidden="true">
                  <div class="sh-inv-page-head">
                    <div>
                      <div class="sh-inv-page-kicker">Inventory Register</div>
                      <div class="sh-inv-page-title">Sapphire Inventory</div>
                    </div>
                    <div class="sh-inv-live-pill"><span class="sh-inv-live-dot"></span>Synced records</div>
                  </div>

                  <div class="sh-inv-table-wrap">
                    <table class="sh-inv-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Inventory</th>
                          <th>Location</th>
                          <th>Condition</th>
                          <th>Status</th>
                          <th>Expiry Date</th>
                          <th>Warranty</th>
                          <th>Insurance</th>
                          <th>Maintenance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr data-sh-inv-row>
                          <td>SCD-488F</td>
                          <td>Screw Driver</td>
                          <td>Tool</td>
                          <td>1N</td>
                          <td>Service</td>
                          <td>B2/QS14/R9/F5</td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-condition-pill">Active</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--primary sh-inv-status-pill">Issued</span></td>
                          <td>N/A</td>
                          <td>4 Aug 2026</td>
                          <td>N/A</td>
                          <td>N/A</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>MAT-1042</td>
                          <td>High Temp Primer</td>
                          <td>Material</td>
                          <td>180 L</td>
                          <td>Paint Booth</td>
                          <td>A1/PB2/R4/D5</td>
                          <td><span class="sh-inv-pill sh-inv-pill--info-special sh-inv-condition-pill">Unfit</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--danger sh-inv-status-pill">Unavailable</span></td>
                          <td class="s-text-attention">11 Jun 2026</td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>N/A</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>ASM-2207</td>
                          <td>Hydraulic Pump</td>
                          <td>Machinery</td>
                          <td>1N</td>
                          <td>Service</td>
                          <td>F1/SB3/LN2</td>
                          <td><span class="sh-inv-pill sh-inv-pill--danger sh-inv-condition-pill">Damage</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--danger sh-inv-status-pill">Unavailable</span></td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>10 Jun 2026</td>
                          <td>14 Jun 2026</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>VEH-0914</td>
                          <td>Field Response Van</td>
                          <td>Vehicle</td>
                          <td>1N</td>
                          <td>Wash Area</td>
                          <td>Y2/WA1/B7</td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-condition-pill">OK</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-status-pill">Available</span></td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>8 Jun 2026</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>TLS-4481</td>
                          <td>Torque Wrench Kit</td>
                          <td>Toolkit</td>
                          <td>1N</td>
                          <td>Body Shop</td>
                          <td>B2/BS1/R8/C3</td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-condition-pill">Incomplete Kit</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-status-pill">Available</span></td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>12 Jun 2026</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>MAT-3328</td>
                          <td>Industrial Solvent</td>
                          <td>Material</td>
                          <td>42 Drums</td>
                          <td>Wash Area</td>
                          <td>Z1/WS4/RM2/BK9/S1</td>
                          <td><span class="sh-inv-pill sh-inv-pill--danger sh-inv-condition-pill">Expired</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--danger sh-inv-status-pill">Unavailable</span></td>
                          <td class="s-text-danger">29 May 2026</td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>N/A</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>MAC-7816</td>
                          <td>Multimeter</td>
                          <td>Tool</td>
                          <td>1N</td>
                          <td>Service</td>
                          <td>M4/SR2/LN7/D1</td>
                          <td><span class="sh-inv-pill sh-inv-pill--warning sh-inv-condition-pill">Missing</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--danger sh-inv-status-pill">Unavailable</span></td>
                          <td>N/A</td>
                          <td>17 Aug 2027</td>
                          <td>2 Mar 2027</td>
                          <td>9 Jun 2026</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>ELC-5503</td>
                          <td>Variable Frequency Drive</td>
                          <td>Machinery</td>
                          <td>1N</td>
                          <td>Power Room</td>
                          <td>E3/VFD/L1</td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-condition-pill">OK</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-status-pill">Available</span></td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>N/A</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>HYD-1209</td>
                          <td>Hydraulic Jack 20T</td>
                          <td>Tool</td>
                          <td>1N</td>
                          <td>Workshop B</td>
                          <td>WB2/HJ1/S4</td>
                          <td><span class="sh-inv-pill sh-inv-pill--warning sh-inv-condition-pill">Missing</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--danger sh-inv-status-pill">Unavailable</span></td>
                          <td>15 Jul 2026</td>
                          <td>15 Jan 2027</td>
                          <td>N/A</td>
                          <td class="s-text-attention">20 Jun 2026</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>VEH-7721</td>
                          <td>Forklift (Diesel)</td>
                          <td>Vehicle</td>
                          <td>1N</td>
                          <td>Yard A</td>
                          <td>YA/FL1/B2</td>
                          <td><span class="sh-inv-pill sh-inv-pill--attention sh-inv-condition-pill">Partially Damage</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--danger sh-inv-status-pill">Unavailable</span></td>
                          <td class="s-text-danger">2 Jun 2026</td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td class="s-text-danger">5 Jun 2026</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>ITM-8830</td>
                          <td>Network Switch 48-Port</td>
                          <td>IT Asset</td>
                          <td>1N</td>
                          <td>Server Room</td>
                          <td>SR2/NS1/U4</td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-condition-pill">OK</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-status-pill">Available</span></td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>N/A</td>
                          <td>N/A</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>CLN-3317</td>
                          <td>Industrial Vacuum Cleaner</td>
                          <td>Tool</td>
                          <td>1N</td>
                          <td>Housekeeping</td>
                          <td>HK1/VC2</td>
                          <td><span class="sh-inv-pill sh-inv-pill--pop sh-inv-condition-pill">Under Maintenance</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--danger sh-inv-status-pill">Unavailable</span></td>
                          <td>N/A</td>
                          <td>5 Mar 2027</td>
                          <td>N/A</td>
                          <td>N/A</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>PNE-6652</td>
                          <td>Pneumatic Drill</td>
                          <td>Machinery</td>
                          <td>1N</td>
                          <td>Heavy Bay</td>
                          <td>HB1/PD3/R2</td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-condition-pill">Active</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--primary sh-inv-status-pill">Issued</span></td>
                          <td>N/A</td>
                          <td>18 Oct 2027</td>
                          <td>22 Jul 2026</td>
                          <td>N/A</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>WLD-2281</td>
                          <td>MIG Welder 400A</td>
                          <td>Machinery</td>
                          <td>1N</td>
                          <td>Fabrication</td>
                          <td>FB1/MIG1/A3</td>
                          <td><span class="sh-inv-pill sh-inv-pill--attention sh-inv-condition-pill">Partially Damage</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-status-pill">Available</span></td>
                          <td>N/A</td>
                          <td>10 Sep 2026</td>
                          <td>N/A</td>
                          <td class="s-text-attention">25 Jun 2026</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>ACO-0099</td>
                          <td>Daikin Compressor</td>
                          <td>Machinery</td>
                          <td>1N</td>
                          <td>QC Lab</td>
                          <td>QC/CMM1</td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-condition-pill">OK</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-status-pill">Available</span></td>
                          <td>N/A</td>
                          <td>1 Feb 2028</td>
                          <td>N/A</td>
                          <td>N/A</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
                <section class="sh-req-stage" data-sh-el="req-stage" aria-hidden="true">
              <div class="sh-req-page-head">
                <div>
                  <div class="sh-req-page-kicker">Item Issue</div>
                  <div class="sh-req-page-title">Pending approvals</div>
                </div>
                <div class="sh-req-live-pill"><span class="sh-req-live-dot"></span>Action queue</div>
              </div>

              <div class="sh-req-grid">
                <article class="sh-req-card" data-sh-req-card data-sh-req-outcome="accept">
                  <div class="sh-req-top"><span class="sh-req-time">04 Jun 2026 · 09:10</span></div>
                  <h3 class="sh-req-asset">Variable Frequency Drive</h3>
                  <div class="sh-req-code">ELC-5503</div>
                  <div class="sh-req-meta">
                    <div class="sh-req-meta-row"><span>Inventory</span><strong>Power Room</strong></div>
                    <div class="sh-req-meta-row"><span>Requested by</span><strong>Arjun Mehta</strong></div>
                  </div>
                  <div class="sh-req-actions">
                    <button class="s-btn s-btn-md s-btn-success">Accept</button>
                    <button class="s-btn s-btn-md s-btn-danger">Reject</button>
                  </div>
                  <div class="sh-req-result sh-req-result--accept">Accepted</div>
                </article>

                <article class="sh-req-card" data-sh-req-card data-sh-req-outcome="accept">
                  <div class="sh-req-top"><span class="sh-req-time">04 Jun 2026 · 09:18</span></div>
                  <h3 class="sh-req-asset">Air Compressor Unit</h3>
                  <div class="sh-req-code">MAC-7816</div>
                  <div class="sh-req-meta">
                    <div class="sh-req-meta-row"><span>Inventory</span><strong>Service</strong></div>
                    <div class="sh-req-meta-row"><span>Requested by</span><strong>Rakesh Nair</strong></div>
                  </div>
                  <div class="sh-req-actions">
                    <button class="s-btn s-btn-md s-btn-success">Accept</button>
                    <button class="s-btn s-btn-md s-btn-danger">Reject</button>
                  </div>
                  <div class="sh-req-result sh-req-result--accept">Accepted</div>
                </article>

                <article class="sh-req-card" data-sh-req-card data-sh-req-outcome="reject">
                  <div class="sh-req-top">
                    <span class="sh-req-type">Return Request</span>
                    <span class="sh-req-time">04 Jun 2026 · 09:24</span>
                  </div>
                  <h3 class="sh-req-asset">Industrial Solvent Drum</h3>
                  <div class="sh-req-code">MAT-3328</div>
                  <div class="sh-req-meta">
                    <div class="sh-req-meta-row"><span>Inventory</span><strong>Wash Area</strong></div>
                    <div class="sh-req-meta-row"><span>Requested by</span><strong>Deepak Soni</strong></div>
                  </div>
                  <div class="sh-req-actions">
                    <button class="s-btn s-btn-md s-btn-success">Accept</button>
                    <button class="s-btn s-btn-md s-btn-danger">Reject</button>
                  </div>
                  <div class="sh-req-result sh-req-result--reject">Rejected</div>
                </article>

                <article class="sh-req-card" data-sh-req-card data-sh-req-outcome="accept">
                  <div class="sh-req-top"><span class="sh-req-time">04 Jun 2026 · 09:31</span></div>
                  <h3 class="sh-req-asset">Arc Flash Suit XL</h3>
                  <div class="sh-req-code">SAF-0044</div>
                  <div class="sh-req-meta">
                    <div class="sh-req-meta-row"><span>Inventory</span><strong>Safety Store</strong></div>
                    <div class="sh-req-meta-row"><span>Requested by</span><strong>Neeraj Singh</strong></div>
                  </div>
                  <div class="sh-req-actions">
                    <button class="s-btn s-btn-md s-btn-success">Accept</button>
                    <button class="s-btn s-btn-md s-btn-danger">Reject</button>
                  </div>
                  <div class="sh-req-result sh-req-result--accept">Accepted</div>
                </article>

                <article class="sh-req-card" data-sh-req-card data-sh-req-outcome="reject">
                  <div class="sh-req-top"><span class="sh-req-time">04 Jun 2026 · 09:37</span></div>
                  <h3 class="sh-req-asset">Forklift Diesel</h3>
                  <div class="sh-req-code">VEH-7721</div>
                  <div class="sh-req-meta">
                    <div class="sh-req-meta-row"><span>Inventory</span><strong>Yard A</strong></div>
                    <div class="sh-req-meta-row"><span>Requested by</span><strong>Mohit Joshi</strong></div>
                  </div>
                  <div class="sh-req-actions">
                    <button class="s-btn s-btn-md s-btn-success">Accept</button>
                    <button class="s-btn s-btn-md s-btn-danger">Reject</button>
                  </div>
                  <div class="sh-req-result sh-req-result--reject">Rejected</div>
                </article>

                <article class="sh-req-card" data-sh-req-card data-sh-req-outcome="reject">
                  <div class="sh-req-top">
                    <span class="sh-req-type">Return Request</span>
                    <span class="sh-req-time">04 Jun 2026 · 09:42</span>
                  </div>
                  <h3 class="sh-req-asset">Hydraulic Pump</h3>
                  <div class="sh-req-code">ASM-2207</div>
                  <div class="sh-req-meta">
                    <div class="sh-req-meta-row"><span>Inventory</span><strong>Service</strong></div>
                    <div class="sh-req-meta-row"><span>Requested by</span><strong>Vishnu Pandit</strong></div>
                  </div>
                  <div class="sh-req-actions">
                    <button class="s-btn s-btn-md s-btn-success">Accept</button>
                    <button class="s-btn s-btn-md s-btn-danger">Reject</button>
                  </div>
                  <div class="sh-req-result sh-req-result--reject">Rejected</div>
                </article>
              </div>
            </section>
            <section class="sh-rep-stage" data-sh-el="rep-stage" aria-hidden="true">
  <div class="sh-rep-page-head">
    <div>
      <div class="sh-rep-page-kicker">Operational Reports</div>
      <div class="sh-rep-page-title">Asset Reports</div>
    </div>
    <div class="sh-rep-live-pill"><span class="sh-rep-live-dot"></span>Auto refreshed</div>
  </div>

<div class="sh-rep-table-shell">
  <div class="sh-rep-table-wrap">
    <table class="sh-rep-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Item Type</th>
          <th>Inventory</th>
          <th>Location</th>
          <th>Condition</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  <tr data-sh-rep-row>
    <td><strong>MAT-1042</strong></td>
    <td>High Temp Primer</td>
    <td>Material</td>
    <td>Paint Booth</td>
    <td>H3/WR2/S4/B6</td>
    <td><span class="sh-rep-pill sh-rep-pill--info sh-rep-condition-pill">Unfit</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-status-pill">Unavailable</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>TLS-4481</strong></td>
    <td>Torque Wrench Kit</td>
    <td>Toolkit</td>
    <td>Body Shop</td>
    <td>B2BS1R8C3</td>
    <td><span class="sh-rep-pill sh-rep-pill--warning sh-rep-condition-pill">Incomplete Kit</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--success sh-rep-status-pill">Available</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>VEH-3324</strong></td>
    <td>Maintenance Pickup</td>
    <td>Vehicle</td>
    <td>Transport Pool</td>
    <td>N3/WR1/S8/B2</td>
    <td><span class="sh-rep-pill sh-rep-pill--pop sh-rep-condition-pill">Under Maintenance</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-status-pill">Unavailable</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>HYD-1209</strong></td>
    <td>Hydraulic Jack 20T</td>
    <td>Tool</td>
    <td>Workshop B</td>
    <td>B2/EL1/R8/T3</td>
    <td><span class="sh-rep-pill sh-rep-pill--warning sh-rep-condition-pill">Missing</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-status-pill">Unavailable</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>WLD-2281</strong></td>
    <td>MIG Welder 400A</td>
    <td>Machinery</td>
    <td>Fabrication</td>
    <td>G1/MH1/R7/D2</td>
    <td><span class="sh-rep-pill sh-rep-pill--attention sh-rep-condition-pill">Partially Damage</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--success sh-rep-status-pill">Available</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>TKT-4420</strong></td>
    <td>Emergency Repair Toolkit</td>
    <td>Toolkit</td>
    <td>Maintenance Hub</td>
    <td>D1/WR3/R6/D9</td>
    <td><span class="sh-rep-pill sh-rep-pill--attention sh-rep-condition-pill">Incomplete Kit</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-status-pill">Unavailable</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>VEH-0914</strong></td>
    <td>Field Response Van</td>
    <td>Vehicle</td>
    <td>Wash Area</td>
    <td>Y2WA1B7</td>
    <td><span class="sh-rep-pill sh-rep-pill--success sh-rep-condition-pill">OK</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--success sh-rep-status-pill">Available</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>ELC-5503</strong></td>
    <td>Variable Frequency Drive</td>
    <td>Machinery</td>
    <td>Power Room</td>
    <td>E3VFDL1</td>
    <td><span class="sh-rep-pill sh-rep-pill--success sh-rep-condition-pill">OK</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--success sh-rep-status-pill">Available</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>MAT-8806</strong></td>
    <td>Protective Coating Compound</td>
    <td>Material</td>
    <td>Surface Prep</td>
    <td>K1/EL4/S1/T5</td>
    <td><span class="sh-rep-pill sh-rep-pill--indigo sh-rep-condition-pill">Mishandled</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-status-pill">Unavailable</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>MAC-7816</strong></td>
    <td>Multimeter</td>
    <td>Tool</td>
    <td>Service</td>
    <td>A3/PA1/R2/B7</td>
    <td><span class="sh-rep-pill sh-rep-pill--warning sh-rep-condition-pill">Missing</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-status-pill">Unavailable</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>ASM-2207</strong></td>
    <td>Hydraulic Pump</td>
    <td>Machinery</td>
    <td>Service</td>
    <td>F1SB3LN2</td>
    <td><span class="sh-rep-pill sh-rep-pill--pop sh-rep-condition-pill">Damage</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-status-pill">Unavailable</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>MAT-3328</strong></td>
    <td>Industrial Solvent</td>
    <td>Material</td>
    <td>Wash Area</td>
    <td>J2/PA3/R9/D4</td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-condition-pill">Expired</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-status-pill">Unavailable</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>TKT-3012</strong></td>
    <td>Electrical Response Toolkit</td>
    <td>Toolkit</td>
    <td>Safety Store</td>
    <td>C4/MH2/S5/B1</td>
    <td><span class="sh-rep-pill sh-rep-pill--warning sh-rep-condition-pill">Missing</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-status-pill">Unavailable</span></td>
  </tr>

  <tr data-sh-rep-row>
    <td><strong>VEH-7721</strong></td>
    <td>Forklift Diesel</td>
    <td>Vehicle</td>
    <td>Yard A</td>
    <td>YAFL1B2</td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-condition-pill">Partially Damage</span></td>
    <td><span class="sh-rep-pill sh-rep-pill--danger sh-rep-status-pill">Unavailable</span></td>
  </tr>
</tbody>
    </table>
  </div>
</div>
</section>

              <section class="sh-insp-stage" data-sh-el="insp-stage" aria-hidden="true">
                <div class="sh-insp-page-head">
                  <div>
                    <div class="sh-insp-page-kicker">Scheduled Inspections</div>
                    <div class="sh-insp-page-title">Asset Inspections</div>
                  </div>
                  <div class="sh-insp-live-pill">
                    <span class="sh-insp-live-dot"></span>
                    Queue active
                  </div>
                </div>
                <div class="sh-insp-table-shell">
                  <div class="sh-insp-table-wrap">
                    <table class="sh-insp-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Location</th>
                          <th>Condition</th>
                          <th>Status</th>
                          <th>Last Inspected</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr data-sh-insp-row>
                          <td>TLS-4481</td>
                          <td>Torque Wrench Kit</td>
                          <td>Toolkit</td>
                          <td>Body Shop</td>
                          <td><span class="sh-insp-pill sh-insp-pill--attention sh-insp-condition-pill">Incomplete Kit</span></td>
                          <td><span class="sh-insp-pill sh-insp-pill--success sh-insp-status-pill">Available</span></td>
                          <td>14/03/2026</td>
                        </tr>
                        <tr data-sh-insp-row>
                          <td>HYD-1209</td>
                          <td>Hydraulic Jack 20T</td>
                          <td>Tool</td>
                          <td>Workshop B</td>
                          <td><span class="sh-insp-pill sh-insp-pill--warning sh-insp-condition-pill">Missing</span></td>
                          <td><span class="sh-insp-pill sh-insp-pill--danger sh-insp-status-pill">Unavailable</span></td>
                          <td>02/01/2026</td>
                        </tr>
                        <tr data-sh-insp-row>
                          <td>PNE-6652</td>
                          <td>Pneumatic Drill</td>
                          <td>Machinery</td>
                          <td>Heavy Bay</td>
                          <td><span class="sh-insp-pill sh-insp-pill--success sh-insp-condition-pill">Active</span></td>
                          <td><span class="sh-insp-pill sh-insp-pill--primary sh-insp-status-pill">Issued</span></td>
                          <td>28/04/2026</td>
                        </tr>
                        <tr data-sh-insp-row>
                          <td>VEH-3324</td>
                          <td>Maintenance Pickup</td>
                          <td>Vehicle</td>
                          <td>Transport Pool</td>
                          <td><span class="sh-insp-pill sh-insp-pill--pop sh-insp-condition-pill">Under Maintenance</span></td>
                          <td><span class="sh-insp-pill sh-insp-pill--danger sh-insp-status-pill">Unavailable</span></td>
                          <td>10/02/2026</td>
                        </tr>
                        <tr data-sh-insp-row>
                          <td>ELC-5503</td>
                          <td>Variable Frequency Drive</td>
                          <td>Machinery</td>
                          <td>Power Room</td>
                          <td><span class="sh-insp-pill sh-insp-pill--success sh-insp-condition-pill">OK</span></td>
                          <td><span class="sh-insp-pill sh-insp-pill--success sh-insp-status-pill">Available</span></td>
                          <td>19/05/2026</td>
                        </tr>
                        <tr data-sh-insp-row>
                          <td>WLD-2281</td>
                          <td>MIG Welder 400A</td>
                          <td>Machinery</td>
                          <td>Fabrication</td>
                          <td><span class="sh-insp-pill sh-insp-pill--attention sh-insp-condition-pill">Partially Damage</span></td>
                          <td><span class="sh-insp-pill sh-insp-pill--success sh-insp-status-pill">Available</span></td>
                          <td>07/04/2026</td>
                        </tr>
                        <tr data-sh-insp-row>
                          <td>VEH-0914</td>
                          <td>Field Response Van</td>
                          <td>Vehicle</td>
                          <td>Wash Area</td>
                          <td><span class="sh-insp-pill sh-insp-pill--success sh-insp-condition-pill">OK</span></td>
                          <td><span class="sh-insp-pill sh-insp-pill--success sh-insp-status-pill">Available</span></td>
                          <td>01/06/2026</td>
                        </tr>
                        <tr data-sh-insp-row>
                          <td>ACO-0099</td>
                          <td>Daikin Compressor</td>
                          <td>Machinery</td>
                          <td>QC Lab</td>
                          <td><span class="sh-insp-pill sh-insp-pill--success sh-insp-condition-pill">OK</span></td>
                          <td><span class="sh-insp-pill sh-insp-pill--success sh-insp-status-pill">Available</span></td>
                          <td>22/05/2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section class="sh-maint-stage" data-sh-el="maint-stage" aria-hidden="true">
                <div class="sh-maint-page-head">
                  <div>
                    <div class="sh-maint-page-kicker">Preventive Maintenance</div>
                    <div class="sh-maint-page-title">Maintenance Queue</div>
                  </div>
                  <div class="sh-maint-live-pill">
                    <span class="sh-maint-live-dot"></span>
                    Queue active
                  </div>
                </div>
                <div class="sh-maint-table-shell">
                  <div class="sh-maint-table-wrap">
                    <table class="sh-maint-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Location</th>
                          <th>Priority</th>
                          <th>Due</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${renderMaintRows()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              </div>
            </div>
          </div>`;
      },
      animate(ctx) {
        const { schedule, qs, qsa } = ctx;
        const wo = qs('[data-sh-el="wo"]');
        const prop = qs('[data-sh-el="prop"]');
        const insp = qs('[data-sh-el="insp"]');
        const propItems = qsa('.sh-prop-item');
        const checkItems = qsa('.sh-check-item');
        const metricCards = qsa('.sh-metric-card');
        const metricsWrap = qs('[data-sh-el="metrics"]');
        const dashTab = qs('#sb-dash');
        const invTab = qs('#sb-inv');
        const pageHead = qs('.sh-page-head');
        const invStage = qs('[data-sh-el="inv-stage"]');
        const typeScreen = qs('[data-sh-inv-screen="types"]');
        const groupScreen = qs('[data-sh-inv-screen="groups"]');
        const invCards = qsa('[data-sh-inv-card]');
        const invBento = qsa('[data-sh-inv-bento]');
        const reqTab = qs('#sb-req');
        const reqStage = qs('[data-sh-el="req-stage"]');
        const reqCards = qsa('[data-sh-req-card]');
        const repStage = qs('[data-sh-el="rep-stage"]');
        const repTab = qs('#sb-rep');

        schedule(() => wo && wo.classList.add('visible'), 400);
        schedule(() => prop && prop.classList.add('visible'), 2300);

        propItems.forEach((item, i) => {
          const d = parseInt(item.getAttribute('data-sh-delay') || '0', 10) * 500;
          schedule(() => item.classList.add('visible'), 2300 + d);
          schedule(() => item.classList.add('checked'), 2900 + d);
        });

        schedule(() => insp && insp.classList.add('visible'), 5400);
        checkItems.forEach((item, i) => schedule(() => item.classList.add('visible'), 5800 + i * 350));
        metricCards.forEach((item, i) => schedule(() => item.classList.add('visible'), 9900 + i * 250));

        schedule(() => {
          dashTab && dashTab.classList.remove('active');
          invTab && invTab.classList.add('active');
          pageHead && pageHead.classList.add('sh-dashboard-exit');
          wo && wo.classList.add('sh-dashboard-exit');
          prop && prop.classList.add('sh-dashboard-exit');
          insp && insp.classList.add('sh-dashboard-exit');
          metricsWrap && metricsWrap.classList.add('sh-dashboard-exit');
          invStage && invStage.classList.add('is-active');
        }, 11800);

        schedule(() => {
          pageHead && pageHead.classList.add('sh-dashboard-hidden');
          wo && wo.classList.add('sh-dashboard-hidden');
          prop && prop.classList.add('sh-dashboard-hidden');
          insp && insp.classList.add('sh-dashboard-hidden');
          metricsWrap && metricsWrap.classList.add('sh-dashboard-hidden');
          if (typeScreen) {
            typeScreen.classList.add('is-active', 'sh-inv-screen-shift-in');
            typeScreen.setAttribute('aria-hidden', 'false');
          }
        }, 12450);

        invCards.forEach((card, i) => {
          schedule(() => card.classList.add('is-visible'), 12900 + (i * 220));
        });

        schedule(() => {
          if (typeScreen) typeScreen.classList.add('sh-inv-screen-shift-out');
        }, 16750);

        schedule(() => {
          if (typeScreen) {
            typeScreen.classList.remove('is-active');
            typeScreen.setAttribute('aria-hidden', 'true');
          }
          if (groupScreen) {
            groupScreen.classList.add('is-active', 'sh-inv-screen-shift-in');
            groupScreen.setAttribute('aria-hidden', 'false');
          }
        }, 17450);

        invBento.forEach((card, i) => {
          schedule(() => card.classList.add('is-visible'), 17900 + (i * 180));
        });

        const tableScreen = qs('[data-sh-inv-screen="table"]');
        const invRows = Array.from(qsa('[data-sh-inv-row]'));

        schedule(() => {
          if (groupScreen) groupScreen.classList.add('sh-inv-screen-shift-out');
        }, 21950);

        schedule(() => {
          if (groupScreen) {
            groupScreen.classList.remove('is-active');
            groupScreen.setAttribute('aria-hidden', 'true');
          }
          if (tableScreen) {
            tableScreen.classList.add('is-active', 'sh-inv-screen-shift-in');
            tableScreen.setAttribute('aria-hidden', 'false');
          }
        }, 22650);

        invRows.forEach((row, i) => {
          schedule(() => row.classList.add('is-visible'), 23100 + (i * 120));
        });

        /* ============================================================
           REQUESTS APP TAB (append-only)
           ============================================================ */
        schedule(() => {
          invTab && invTab.classList.remove('active');
          reqTab && reqTab.classList.add('active');

          const tableScreen = qs('[data-sh-inv-screen="table"]');
          tableScreen && tableScreen.classList.add('sh-inv-screen-shift-out');
        }, 65500);

        schedule(() => {
          const tableScreen = qs('[data-sh-inv-screen="table"]');
          if (tableScreen) {
            tableScreen.classList.remove('is-active');
            tableScreen.setAttribute('aria-hidden', 'true');
          }
          if (reqStage) {
            reqStage.classList.add('is-active');
            reqStage.setAttribute('aria-hidden', 'false');
          }
        }, 66200);

        reqCards.forEach((card, i) => {
          schedule(() => card.classList.add('is-visible'), 66600 + (i * 160));
        });

        reqCards.forEach((card, i) => {
          const outcome = card.getAttribute('data-sh-req-outcome');
          schedule(() => {
            if (outcome === 'accept') {
              card.classList.add('is-accepted');
            } else {
              card.classList.add('is-rejected');
            }
          }, 68200 + (i * 420));
        });

        /* ============================================================
           REPORTS APP TAB
           ============================================================ */
        const repRows = qsa('[data-sh-rep-row]');

        schedule(() => {
          reqTab && reqTab.classList.remove('active');
          if (repTab) {
            repTab.classList.add('active');
          } else {
            reqStage && reqStage.classList.remove('is-active');
          }
          reqStage && reqStage.classList.add('sh-req-stage-exit');
        }, 71300);

        schedule(() => {
          reqStage && reqStage.classList.remove('is-active');
          reqStage && reqStage.setAttribute('aria-hidden', 'true');
          reqStage && reqStage.classList.remove('sh-req-stage-exit');
          if (repStage) {
            repStage.classList.add('is-active', 'sh-rep-stage-enter');
            repStage.setAttribute('aria-hidden', 'false');
          }
        }, 72000);

        schedule(() => {
          if (repStage) repStage.classList.remove('sh-rep-stage-enter');
        }, 72000 + 700);

        const REP_STAGE_T = 72000;
        const REP_ROWS_T = REP_STAGE_T + 450;

        repRows.forEach((row, i) => {
          schedule(() => row.classList.add('is-visible'), REP_ROWS_T + i * 90);
        });

        /* ============================================================
           REPORT TABLE SPLASH ACTIONS
           ============================================================ */

        /* shared engine ref + icons (also used by live ACTs below) */
        const engine = this;
        const ICO = {
          wrench: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
          recycle: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`,
          returnLeft: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M9 8l-5 5 5 5"/></svg>`,
          check: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
          trash: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
          edit: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
          clock: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
          replace: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l4 10H4L8 2z"/><path d="M12 12v10"/><path d="M8 22h8"/></svg>`
        };

        /* helpers */
        const getRepTableRowByCode = (code) => {
          return Array.from(qsa('.sh-rep-table tbody tr')).find((row) => {
            return Array.from(row.cells).some((cell) => cell.textContent.includes(code));
          });
        };

        const getRepRowPill = (row, type) => {
          if (!row) return null;
          return row.querySelector(
            type === 'condition'
              ? '.sh-rep-condition-pill'
              : '.sh-rep-status-pill'
          );
        };

        const flipRepPill = (row, type, cls, label, delay) => {
          schedule(() => {
            const pill = getRepRowPill(row, type);
            if (!pill) return;
            pill.classList.add('sh-pill-flipping');
            const halfway = setTimeout(() => {
              pill.className =
                type === 'condition'
                  ? `sh-rep-pill ${cls} sh-rep-condition-pill`
                  : `sh-rep-pill ${cls} sh-rep-status-pill`;
              pill.textContent = label;
            }, 260);
            engine.timeouts.push(halfway);
          }, delay);
        };

        const focusRepRow = (target, delay) => {
          schedule(() => {
            Array.from(qsa('.sh-rep-table tbody tr')).forEach((row) => {
              if (row === target) {
                row.classList.add('sh-row-focus');
                row.classList.remove('sh-row-dimmed');
              } else {
                row.classList.remove('sh-row-focus');
                row.classList.add('sh-row-dimmed');
              }
            });
          }, delay);
        };

        const clearRepFocus = (delay) => {
          schedule(() => {
            Array.from(qsa('.sh-rep-table tbody tr')).forEach((row) => {
              row.classList.remove('sh-row-focus', 'sh-row-dimmed');
            });
          }, delay);
        };

        const repSplashCard = (html, delay) => {
          schedule(() => {
            const wrap = qs('.sh-rep-table-wrap');
            if (!wrap) return;
            wrap.insertAdjacentHTML('beforeend', html);
            const card = wrap.querySelector('.sh-act-card');
            if (card) requestAnimationFrame(() => card.classList.add('is-active'));
          }, delay);
        };

        const removeRepSplashCard = (delay) => {
          schedule(() => {
            const card = qs('.sh-rep-table-wrap .sh-act-card');
            if (!card) return;
            card.classList.remove('is-active');
            setTimeout(() => card.remove(), 350);
          }, delay);
        };

        const slideOutRepRow = (row, delay) => {
          schedule(() => {
            if (!row) return;
            row.classList.add('sh-row-discarded');
            setTimeout(() => row.remove(), 650);
          }, delay);
        };

        /* success theme for all report page splash cards */
        const repSuccessCardHTML = ({
          icon,
          title,
          headline,
          itemLabel,
          itemValue,
          stateLabel,
          stateValue,
          extraHtml = '',
          actionsHtml = `
            <div class="sh-act-confirm">
              <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
              <button class="sh-act-btn sh-act-btn--success">Confirm</button>
            </div>
          `
        }) => `
          <div class="sh-act-card">
            <div class="sh-act-card-bar sh-act-card-bar--success"></div>
            <div class="sh-act-card-head">
              <div class="sh-act-card-icon sh-act-card-icon--success">${icon}</div>
              <div>
                <div class="sh-act-card-title">${title}</div>
                <div class="sh-act-card-headline">${headline}</div>
              </div>
            </div>
            <div class="sh-act-item-row">
              <span class="sh-act-item-label">${itemLabel}</span>
              <span class="sh-act-item-value">${itemValue}</span>
            </div>
            <div class="sh-act-state-row">
              <span class="sh-act-state-label">${stateLabel}</span>
              <span class="sh-act-state-value">${stateValue}</span>
            </div>
            ${extraHtml}
            ${actionsHtml}
          </div>
        `;

        /* report icons reuse existing ICO set */
        const repRepairChecklistHTML = `
          <div class="sh-act-log-line">
            <span class="sh-act-log-time">✓</span>
            <span class="sh-act-log-label">Repair</span>
            <span class="sh-act-log-val">Housing aligned</span>
          </div>
          <div class="sh-act-log-line">
            <span class="sh-act-log-time">✓</span>
            <span class="sh-act-log-label">Repair</span>
            <span class="sh-act-log-val">Wiring corrected</span>
          </div>
          <div class="sh-act-log-line">
            <span class="sh-act-log-time">✓</span>
            <span class="sh-act-log-label">Repair</span>
            <span class="sh-act-log-val">Output tested OK</span>
          </div>
        `;

        const repDisposeMetaHTML = `
          <div class="sh-act-log-line">
            <span class="sh-act-log-time">Code</span>
            <span class="sh-act-log-label">Item</span>
            <span class="sh-act-log-val">MAT-8806</span>
          </div>
          <div class="sh-act-log-line">
            <span class="sh-act-log-time">Name</span>
            <span class="sh-act-log-label">Material</span>
            <span class="sh-act-log-val">Protective Coating Compound</span>
          </div>
          <div class="sh-act-log-line">
            <span class="sh-act-log-time">Qty</span>
            <span class="sh-act-log-label">Volume</span>
            <span class="sh-act-log-val">240 KG</span>
          </div>
        `;

        /* timeline starts after report rows become visible */
        const REP_ACT_T1 = REP_ROWS_T + (repRows.length * 90) + 900;
        const REP_ACT_T2 = REP_ACT_T1 + 4700;
        const REP_ACT_T3 = REP_ACT_T2 + 4700;

        /* ACT 1 — WLD-2281 */
        const repRowWLD = getRepTableRowByCode('WLD-2281');

        repSplashCard(
          repSuccessCardHTML({
            icon: ICO.wrench,
            title: 'Item repair',
            headline: 'Report action • Sapphire EAM',
            itemLabel: 'Asset',
            itemValue: 'WLD-2281',
            stateLabel: 'Condition',
            stateValue: 'Partially Damage',
            extraHtml: repRepairChecklistHTML,
            actionsHtml: `
              <div class="sh-act-confirm">
                <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
                <button class="sh-act-btn sh-act-btn--success">Repair Complete</button>
              </div>
            `
          }),
          REP_ACT_T1
        );

        focusRepRow(repRowWLD, REP_ACT_T1 + 120);
        removeRepSplashCard(REP_ACT_T1 + 2500);
        flipRepPill(repRowWLD, 'condition', 'sh-rep-pill--success', 'OK', REP_ACT_T1 + 2750);
        slideOutRepRow(repRowWLD, REP_ACT_T1 + 3300);
        clearRepFocus(REP_ACT_T1 + 3950);

        /* ACT 2 — ASM-2207 */
        const repRowASM = getRepTableRowByCode('ASM-2207');

        repSplashCard(
          repSuccessCardHTML({
            icon: ICO.check,
            title: 'Service Complete',
            headline: 'Maintenance closeout • Sapphire EAM',
            itemLabel: 'Item',
            itemValue: 'Hydraulic Pump • ASM-2207',
            stateLabel: 'Update',
            stateValue: 'Damage + Unavailable',
            actionsHtml: `
              <div class="sh-act-confirm">
                <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
                <button class="sh-act-btn sh-act-btn--success">Confirm</button>
              </div>
            `
          }),
          REP_ACT_T2
        );

        focusRepRow(repRowASM, REP_ACT_T2 + 120);
        removeRepSplashCard(REP_ACT_T2 + 2400);
        flipRepPill(repRowASM, 'condition', 'sh-rep-pill--success', 'OK', REP_ACT_T2 + 2680);
        flipRepPill(repRowASM, 'status', 'sh-rep-pill--success', 'Available', REP_ACT_T2 + 2860);
        slideOutRepRow(repRowASM, REP_ACT_T2 + 3300);
        clearRepFocus(REP_ACT_T2 + 3950);

        /* ACT 3 — MAT-8806 */
        const repRowMAT = getRepTableRowByCode('MAT-8806');

        repSplashCard(
          repSuccessCardHTML({
            icon: ICO.trash,
            title: 'Material Dispose',
            headline: 'Disposal request • Sapphire EAM',
            itemLabel: 'Record',
            itemValue: 'Protective Coating Compound',
            stateLabel: 'Action',
            stateValue: 'Ready for disposal',
            extraHtml: repDisposeMetaHTML,
            actionsHtml: `
              <div class="sh-act-confirm">
                <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
                <button class="sh-act-btn sh-act-btn--success">Dispose</button>
              </div>
            `
          }),
          REP_ACT_T3
        );

        focusRepRow(repRowMAT, REP_ACT_T3 + 120);
        removeRepSplashCard(REP_ACT_T3 + 2400);
        slideOutRepRow(repRowMAT, REP_ACT_T3 + 2850);
        clearRepFocus(REP_ACT_T3 + 3450);

        /* ============================================================
           INSPECTIONS TABLE — splash → checkpoint → flip → slide
           ============================================================ */

        const inspStage   = qs('[data-sh-el="insp-stage"]');
        const inspTab     = qs('#sb-insp');
        const inspRows    = Array.from(qsa('[data-sh-insp-row]'));

        /* ---- timing: fires after Reports Act 3 fully completes ---- */
        const REPENDT     = REP_ACT_T3 + 3450;           // clearRepFocus last step
        const REPEXITT    = REPENDT + 250;               // Reports exit trigger
        const INSPSTAGET  = REPEXITT + 700;              // Inspections enters after Reports exits
        const INSPROWST   = INSPSTAGET + 450;            // rows stagger 450 ms after stage enters

        /* ---- Reports exit ---- */
        schedule(() => {
          if (repTab)  repTab.classList.remove('active');
          if (repStage) repStage.classList.add('sh-rep-stage-exit');
        }, REPEXITT);
        schedule(() => {
          if (repStage) {
            repStage.classList.remove('is-active', 'sh-rep-stage-enter', 'sh-rep-stage-exit');
            repStage.setAttribute('aria-hidden', 'true');
          }
        }, REPEXITT + 650);

        /* ---- Inspections stage reveal ---- */
        schedule(() => {
          if (inspTab)  inspTab.classList.add('active');
          if (inspStage) {
            inspStage.classList.add('is-active', 'sh-insp-stage-enter');
            inspStage.setAttribute('aria-hidden', 'false');
          }
        }, INSPSTAGET);
        schedule(() => {
          if (inspStage) inspStage.classList.remove('sh-insp-stage-enter');
        }, INSPSTAGET + 700);
        inspRows.forEach((row, i) => {
          schedule(() => row.classList.add('is-visible'), INSPROWST + i * 100);
        });

        /* ---- helpers ---- */
        const getInspRow = code =>
          inspRows.find(r => Array.from(r.cells).some(c => c.textContent.trim() === code));

        const flipInspPill = (row, type, cls, label, delay) => {
          schedule(() => {
            const pill = row.querySelector(
              type === 'condition' ? '.sh-insp-condition-pill' : '.sh-insp-status-pill'
            );
            if (!pill) return;
            pill.classList.add('sh-insp-pill-flipping');
            setTimeout(() => {
              pill.className = `sh-insp-pill ${cls} ${
                type === 'condition' ? 'sh-insp-condition-pill' : 'sh-insp-status-pill'
              }`;
              pill.textContent = label;
            }, 260);
          }, delay);
        };

        const focusInspRow = (target, delay) => {
          schedule(() => {
            inspRows.forEach(r => {
              if (r === target) r.classList.add('sh-insp-row-focus');
              else              r.classList.add('sh-insp-row-dimmed');
            });
          }, delay);
        };

        const clearInspFocus = delay => {
          schedule(() => {
            inspRows.forEach(r =>
              r.classList.remove('sh-insp-row-focus','sh-insp-row-dimmed')
            );
          }, delay);
        };

        const slideOutInspRow = (row, delay) => {
          schedule(() => {
            if (!row) return;
            row.classList.add('sh-row-discarded');
            setTimeout(() => row.remove(), 650);
          }, delay);
        };

        const getWrap = () => qs('.sh-insp-table-wrap');

        /* show/remove backdrop */
        const showInspBackdrop = delay => {
          schedule(() => {
            const w = getWrap();
            if (!w) return;
            let bd = w.querySelector('.sh-insp-backdrop');
            if (!bd) { bd = document.createElement('div'); bd.className = 'sh-insp-backdrop'; w.prepend(bd); }
            requestAnimationFrame(() => bd.classList.add('is-active'));
          }, delay);
        };
        const hideInspBackdrop = delay => {
          schedule(() => {
            const bd = getWrap()?.querySelector('.sh-insp-backdrop');
            if (!bd) return;
            bd.classList.remove('is-active');
            setTimeout(() => bd.remove(), 350);
          }, delay);
        };

        /* show/remove splash card (step 1) */
        const showInspSplash = (html, delay) => {
          schedule(() => {
            const w = getWrap();
            if (!w) return;
            w.insertAdjacentHTML('beforeend', html);
            const card = w.querySelector('.sh-insp-card');
            if (card) requestAnimationFrame(() => card.classList.add('is-active'));
          }, delay);
        };
        const removeInspSplash = delay => {
          schedule(() => {
            const card = getWrap()?.querySelector('.sh-insp-card');
            if (!card) return;
            card.classList.remove('is-active');
            setTimeout(() => card.remove(), 350);
          }, delay);
        };

        /* show/remove checkpoint card (step 2) */
        const showInspCheckCard = (html, delay) => {
          schedule(() => {
            const w = getWrap();
            if (!w) return;
            w.insertAdjacentHTML('beforeend', html);
            const card = w.querySelector('.sh-insp-check-card');
            if (card) requestAnimationFrame(() => card.classList.add('is-active'));
          }, delay);
        };
        const removeInspCheckCard = delay => {
          schedule(() => {
            const card = getWrap()?.querySelector('.sh-insp-check-card');
            if (!card) return;
            card.classList.remove('is-active');
            setTimeout(() => card.remove(), 350);
          }, delay);
        };

        /* tick checkboxes in the live card */
        const tickInspCheckboxes = (indices, delay) => {
          indices.forEach((idx, i) => {
            schedule(() => {
              const boxes = getWrap()?.querySelectorAll('.sh-insp-checkbox');
              if (boxes?.[idx]) boxes[idx].classList.add('is-checked');
            }, delay + i * 280);
          });
        };

        /* ---- SVG icons ---- */
        const ICO_INSP = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
        const ICO_CHECK_INSP = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

        /* ---- splash card HTML builder ---- */
        const inspSplashHTML = (itemName, itemCode, itemType, condition, condCls, status, statusCls) => `
<div class="sh-insp-card">
  <div class="sh-insp-card-bar"></div>
  <div class="sh-insp-card-head">
    <div class="sh-insp-card-icon">${ICO_INSP}</div>
    <div>
      <div class="sh-insp-card-title">Inspection</div>
      <div class="sh-insp-card-headline">Asset Inspection · Sapphire EAM</div>
    </div>
  </div>
  <div class="sh-insp-meta-row">
    <span class="sh-insp-meta-label">Item</span>
    <span class="sh-insp-meta-value">${itemName}</span>
  </div>
  <div class="sh-insp-meta-row">
    <span class="sh-insp-meta-label">Code</span>
    <span class="sh-insp-meta-value">${itemCode}</span>
  </div>
  <div class="sh-insp-meta-row">
    <span class="sh-insp-meta-label">Type</span>
    <span class="sh-insp-meta-value">${itemType}</span>
  </div>
  <div class="sh-insp-meta-row">
    <span class="sh-insp-meta-label">Condition</span>
    <span class="sh-insp-pill ${condCls} sh-insp-condition-pill">${condition}</span>
  </div>
  <div class="sh-insp-meta-row" style="border-bottom:none">
    <span class="sh-insp-meta-label">Status</span>
    <span class="sh-insp-pill ${statusCls} sh-insp-status-pill">${status}</span>
  </div>
  <div class="sh-insp-card-actions">
    <button class="sh-insp-btn sh-insp-btn--cancel">Cancel</button>
    <button class="sh-insp-btn sh-insp-btn--primary">Inspect</button>
  </div>
</div>`;

        /* ---- checkpoint card HTML builder ---- */
        const inspCheckCardHTML = (itemCode, checkpoints) => `
<div class="sh-insp-check-card">
  <div class="sh-insp-check-card-bar"></div>
  <div class="sh-insp-check-card-head">
    <div class="sh-insp-check-card-icon">${ICO_CHECK_INSP}</div>
    <div>
      <div class="sh-insp-check-card-title">Inspection Checklist</div>
      <div class="sh-insp-check-card-subtitle">${itemCode} · Field Inspection</div>
    </div>
  </div>
  <div class="sh-insp-checklist-body">
    ${checkpoints.map(cp => `
    <div class="sh-insp-check-item">
      <div class="sh-insp-checkbox"></div>
      <span>${cp}</span>
    </div>`).join('')}
  </div>
  <div class="sh-insp-check-card-actions">
    <button class="sh-insp-btn sh-insp-btn--cancel">Cancel</button>
    <button class="sh-insp-btn sh-insp-btn--success">Submit</button>
  </div>
</div>`;

        /* =====================================================
           ACTS — 4 items, each: splash → inspect → checkpoints
                  → random ticks → submit → flip → slide out
           ===================================================== */

        const ACTT = INSPROWST + inspRows.length * 100 + 800;

        /* ---------- SHARED CHECKPOINTS per type ---------- */
        const CP = {
          tool:      ['Visual damage check','Moving parts functional','Calibration verified','Lubrication OK','Safety guard intact','Grip and handle secure','Storage condition OK'],
          toolkit:   ['All items accounted for','Case integrity OK','Tools free of corrosion','Cutting edges serviceable','Measurement tools calibrated','Labels readable','Packed correctly'],
          machinery: ['Power isolation confirmed','Guards in place','Fluid levels checked','Vibration within limits','Operating temp normal','Sensors responsive','Last service log reviewed'],
          vehicle:   ['Tyre pressure & condition','Lights functional','Brakes responsive','Engine oil level OK','Battery charge adequate','Seat belts intact','Pre-trip log signed'],
        };

        /* each act: { code, name, type, condition, condCls, status, statusCls,
                       checkpoints, tickIdxs,
                       newCondition, newCondCls, newStatus, newStatusCls } */
        const INSP_ACTS = [
          {
            code:'TLS-4481', name:'Torque Wrench Kit', type:'Toolkit',
            condition:'Incomplete Kit', condCls:'sh-insp-pill--attention',
            status:'Available',        statusCls:'sh-insp-pill--success',
            checkpoints: CP.toolkit,   tickIdxs:[0,1,3,5],
            newCondition:'OK',         newCondCls:'sh-insp-pill--success',
            newStatus:'Available',     newStatusCls:'sh-insp-pill--success',
          },
          {
            code:'HYD-1209', name:'Hydraulic Jack 20T', type:'Tool',
            condition:'Missing',       condCls:'sh-insp-pill--warning',
            status:'Unavailable',      statusCls:'sh-insp-pill--danger',
            checkpoints: CP.tool,      tickIdxs:[0,2,4,6],
            newCondition:'OK',         newCondCls:'sh-insp-pill--success',
            newStatus:'Available',     newStatusCls:'sh-insp-pill--success',
          },
          {
            code:'VEH-3324', name:'Maintenance Pickup', type:'Vehicle',
            condition:'Under Maintenance', condCls:'sh-insp-pill--pop',
            status:'Unavailable',          statusCls:'sh-insp-pill--danger',
            checkpoints: CP.vehicle,       tickIdxs:[0,1,2,5,6],
            newCondition:'OK',             newCondCls:'sh-insp-pill--success',
            newStatus:'Available',         newStatusCls:'sh-insp-pill--success',
          },
          {
            code:'WLD-2281', name:'MIG Welder 400A', type:'Machinery',
            condition:'Partially Damage', condCls:'sh-insp-pill--attention',
            status:'Available',           statusCls:'sh-insp-pill--success',
            checkpoints: CP.machinery,    tickIdxs:[0,2,3,4,6],
            newCondition:'Active',        newCondCls:'sh-insp-pill--success',
            newStatus:'Available',        newStatusCls:'sh-insp-pill--success',
          },
        ];

        const ACT_GAP = 5200; /* ms between acts */

        INSP_ACTS.forEach((act, i) => {
          const T = ACTT + i * ACT_GAP;
          const row = getInspRow(act.code);

          /* Step 1: backdrop + splash */
          showInspBackdrop(T);
          showInspSplash(
            inspSplashHTML(act.name, act.code, act.type,
                           act.condition, act.condCls,
                           act.status, act.statusCls),
            T
          );
          focusInspRow(row, T + 120);

          /* Step 2: dismiss splash, open checkpoint card */
          removeInspSplash(T + 1600);
          showInspCheckCard(inspCheckCardHTML(act.code, act.checkpoints), T + 1900);

          /* Step 3: tick random checkboxes */
          tickInspCheckboxes(act.tickIdxs, T + 2300);

          /* Step 4: submit — dismiss checkpoint card */
          removeInspCheckCard(T + 2300 + act.tickIdxs.length * 280 + 600);
          hideInspBackdrop(T + 2300 + act.tickIdxs.length * 280 + 600);

          const afterSubmit = T + 2300 + act.tickIdxs.length * 280 + 950;

          /* Step 5: flip condition + status pills */
          flipInspPill(row, 'condition', act.newCondCls, act.newCondition, afterSubmit);
          flipInspPill(row, 'status',    act.newStatusCls, act.newStatus,  afterSubmit + 200);

          /* Step 6: slide out row */
          slideOutInspRow(row, afterSubmit + 700);
          clearInspFocus(afterSubmit + 1350);
        });

        /* ---- Inspections end + exit ---- */
        const INSPACTS_COUNT = INSP_ACTS.length;
        const LAST_INSP_T = ACTT + ((INSPACTS_COUNT - 1) * ACT_GAP);
        const LAST_INSP_AFTER_SUBMIT =
          LAST_INSP_T +
          2300 +
          (Math.max(...INSP_ACTS[INSPACTS_COUNT - 1].tickIdxs.map((_, i) => i + 1)) * 280) +
          950;
        const INSPENDT = LAST_INSP_AFTER_SUBMIT + 1350;
        const INSPEXITT = INSPENDT + 300;

        schedule(() => {
          if (inspTab) inspTab.classList.remove('active');
          if (inspStage) inspStage.classList.add('sh-insp-stage-exit');
        }, INSPEXITT);
        schedule(() => {
          if (inspStage) {
            inspStage.classList.remove('is-active', 'sh-insp-stage-enter', 'sh-insp-stage-exit');
            inspStage.setAttribute('aria-hidden', 'true');
          }
        }, INSPEXITT + 650);

        /* ============================================================
           MAINTENANCE STAGE
           ============================================================ */
        const MAINTTAB = qs('#sb-maint');
        const MAINTSTAGE = qs('[data-sh-el="maint-stage"]');

        /* ---------- Maintenance rows: dynamic access, never cache once ---------- */
        const getMaintRows = () => Array.from(qsa('[data-sh-maint-row]'));

        function getMaintRowByCode(code) {
          return getMaintRows().find(row => row.cells[0] && row.cells[0].textContent.trim() === code);
        }

        function getMaintPill(row, type) {
          if (!row) return null;
          return row.querySelector(type === 'priority' ? '.sh-maint-priority-pill' : '.sh-maint-status-pill');
        }

        function focusMaintRow(target, delay) {
          schedule(() => {
            getMaintRows().forEach(row => {
              if (row === target) {
                row.classList.add('sh-maint-row-focus');
                row.classList.remove('sh-maint-row-dimmed');
              } else {
                row.classList.remove('sh-maint-row-focus');
                row.classList.add('sh-maint-row-dimmed');
              }
            });
          }, delay);
        }

        function clearMaintFocus(delay) {
          schedule(() => {
            getMaintRows().forEach(row => {
              row.classList.remove('sh-maint-row-focus', 'sh-maint-row-dimmed');
            });
          }, delay);
        }

        function flipMaintPill(row, type, cls, label, delay) {
          schedule(() => {
            const pill = getMaintPill(row, type);
            if (!pill) return;
            pill.classList.add('sh-maint-pill-flipping');
            const halfway = setTimeout(() => {
              pill.className = cls;
              pill.textContent = label;
            }, 260);
            engine.timeouts.push(halfway);
          }, delay);
        }

        function maintCard(html, delay) {
          schedule(() => {
            const wrap = qs('.sh-maint-table-wrap');
            if (!wrap) return;
            const old = wrap.querySelector('.sh-maint-card');
            if (old) old.remove();
            wrap.insertAdjacentHTML('beforeend', html);
            const card = wrap.querySelector('.sh-maint-card');
            if (card) {
              requestAnimationFrame(() => card.classList.add('is-visible'));
            }
          }, delay);
        }

        function removeMaintCard(delay) {
          schedule(() => {
            const card = qs('.sh-maint-card');
            if (!card) return;
            card.classList.remove('is-visible');
            setTimeout(() => card.remove(), 400);
          }, delay);
        }

        function morphMaintCardToForm(delay) {
          schedule(() => {
            const card = qs('.sh-maint-card');
            if (card) card.classList.add('sh-maint-card--form');
          }, delay);
        }

        function typeMaintReason(delay) {
          schedule(() => {
            const ta = qs('.sh-maint-textarea');
            if (!ta) return;
            const txt = 'Routine service completed. All checks passed. Lubrication topped up.';
            let idx = 0;
            ta.value = '';
            const iv = setInterval(() => {
              ta.value += txt[idx++];
              if (idx >= txt.length) clearInterval(iv);
            }, 28);
            engine.timeouts.push(iv);
          }, delay);
        }

        function slideOutMaintRow(code, delay) {
          schedule(() => {
            const row = getMaintRowByCode(code);
            if (!row) return;
            row.classList.add('sh-maint-row-discard');
            setTimeout(() => row.remove(), 600);
          }, delay);
        }

        function startServiceCardHTML(code, name) {
          return `
    <div class="sh-maint-card">
      <div class="sh-maint-card-bar sh-maint-card-bar--primary"></div>
      <div class="sh-maint-card-head">
        <div class="sh-maint-card-icon sh-maint-card-icon--primary">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        </div>
        <div>
          <div class="sh-maint-card-title">Start Service</div>
          <div class="sh-maint-card-headline">${name} · ${code}</div>
        </div>
      </div>
      <div class="sh-maint-meta-row">
        <span class="sh-maint-meta-label">Action</span>
        <span class="sh-maint-meta-value">Begin scheduled maintenance</span>
      </div>
      <div class="sh-maint-form">
        <textarea class="sh-maint-textarea" placeholder="Notes optional" rows="3"></textarea>
      </div>
      <div class="sh-maint-card-actions">
        <button class="sh-maint-btn sh-maint-btn--ghost">Skip</button>
        <button class="sh-maint-btn sh-maint-btn--primary">Start Service</button>
      </div>
    </div>
  `;
        }

        function skipMaintCardHTML(code, name) {
          return `
    <div class="sh-maint-card">
      <div class="sh-maint-card-bar sh-maint-card-bar--warning"></div>
      <div class="sh-maint-card-head">
        <div class="sh-maint-card-icon sh-maint-card-icon--warning">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        </div>
        <div>
          <div class="sh-maint-card-title">Skip Service</div>
          <div class="sh-maint-card-headline">${name} · ${code}</div>
        </div>
      </div>
      <div class="sh-maint-meta-row">
        <span class="sh-maint-meta-label">Reason</span>
        <span class="sh-maint-meta-value">Resource unavailable</span>
      </div>
      <div class="sh-maint-form">
        <textarea class="sh-maint-textarea" placeholder="Reason for skipping..." rows="3"></textarea>
      </div>
      <div class="sh-maint-card-actions">
        <button class="sh-maint-btn sh-maint-btn--ghost">Cancel</button>
        <button class="sh-maint-btn sh-maint-btn--warning">Confirm Skip</button>
      </div>
    </div>
  `;
        }

        /* timing chain */
        const MAINTSTAGET = INSPEXITT + 950;
        const MAINTROWST = MAINTSTAGET + 1200;
        const MAINTACT1 = MAINTROWST + 1600;
        const MAINTACT2 = MAINTACT1 + 4200;
        const MAINTACT3 = MAINTACT2 + 4200;
        const MAINTACT4 = MAINTACT3 + 4200;
        const MAINTENDT = MAINTACT4 + 2800;

        const m1 = MAINT_ITEMS[0];
        const m2 = MAINT_ITEMS[1];
        const m3 = MAINT_ITEMS[3];
        const m4 = MAINT_ITEMS[8];

        /* enter maintenance stage */
        schedule(() => {
          if (inspTab) inspTab.classList.remove('active');
          if (MAINTTAB) MAINTTAB.classList.add('active');
          if (MAINTSTAGE) {
            MAINTSTAGE.classList.remove('sh-maint-stage-exit');
            MAINTSTAGE.classList.add('is-active', 'sh-maint-stage-enter');
            MAINTSTAGE.setAttribute('aria-hidden', 'false');
          }
        }, MAINTSTAGET);

        schedule(() => {
          if (MAINTSTAGE) MAINTSTAGE.classList.remove('sh-maint-stage-enter');
        }, MAINTSTAGET + 800);

        /* reveal rows */
        schedule(() => {
          if (MAINTSTAGE) MAINTSTAGE.setAttribute('aria-hidden', 'false');
          getMaintRows().forEach((row, i) => {
            schedule(() => row.classList.add('is-visible'), i * 60);
          });
        }, MAINTROWST);

        /* act 1 */
        focusMaintRow(getMaintRowByCode(m1.code), MAINTACT1);
        maintCard(startServiceCardHTML(m1.code, m1.name), MAINTACT1 + 400);
        morphMaintCardToForm(MAINTACT1 + 2200);
        typeMaintReason(MAINTACT1 + 2400);
        removeMaintCard(MAINTACT1 + 3600);
        clearMaintFocus(MAINTACT1 + 3700);
        flipMaintPill(getMaintRowByCode(m1.code), 'status', 'sh-maint-pill sh-maint-pill--success sh-maint-status-pill', 'In Progress', MAINTACT1 + 3800);

        /* act 2 */
        focusMaintRow(getMaintRowByCode(m2.code), MAINTACT2);
        maintCard(skipMaintCardHTML(m2.code, m2.name), MAINTACT2 + 400);
        removeMaintCard(MAINTACT2 + 2800);
        clearMaintFocus(MAINTACT2 + 2900);
        flipMaintPill(getMaintRowByCode(m2.code), 'status', 'sh-maint-pill sh-maint-pill--warning sh-maint-status-pill', 'Skipped', MAINTACT2 + 3000);

        /* act 3 */
        focusMaintRow(getMaintRowByCode(m3.code), MAINTACT3);
        maintCard(startServiceCardHTML(m3.code, m3.name), MAINTACT3 + 400);
        morphMaintCardToForm(MAINTACT3 + 2200);
        typeMaintReason(MAINTACT3 + 2400);
        removeMaintCard(MAINTACT3 + 3600);
        clearMaintFocus(MAINTACT3 + 3700);
        flipMaintPill(getMaintRowByCode(m3.code), 'status', 'sh-maint-pill sh-maint-pill--success sh-maint-status-pill', 'In Progress', MAINTACT3 + 3800);

        /* act 4 */
        focusMaintRow(getMaintRowByCode(m4.code), MAINTACT4);
        maintCard(skipMaintCardHTML(m4.code, m4.name), MAINTACT4 + 400);
        removeMaintCard(MAINTACT4 + 2800);
        clearMaintFocus(MAINTACT4 + 2900);
        flipMaintPill(getMaintRowByCode(m4.code), 'status', 'sh-maint-pill sh-maint-pill--warning sh-maint-status-pill', 'Skipped', MAINTACT4 + 3000);

        /* exit maintenance stage */
        schedule(() => {
          if (MAINTTAB) MAINTTAB.classList.remove('active');
          if (MAINTSTAGE) MAINTSTAGE.classList.add('sh-maint-stage-exit');
        }, MAINTENDT);

        schedule(() => {
          if (MAINTSTAGE) {
            MAINTSTAGE.classList.remove('is-active', 'sh-maint-stage-enter', 'sh-maint-stage-exit');
            MAINTSTAGE.setAttribute('aria-hidden', 'true');
          }
        }, MAINTENDT + 650);

        schedule(() => {
          const tableScreen = qs('[data-sh-inv-screentable]');
          if (tableScreen) {
            tableScreen.classList.remove('is-active');
            tableScreen.setAttribute('aria-hidden', 'true');
          }
          this.clearTimers();
          this.runDesktopLoop();
        }, MAINTENDT + 720);

        /* ============================================================
           LIVE ACTIONS — 8 sequential animated acts
           ============================================================ */

        // ---- helpers ----
        function getRow(code) {
          return invRows.find(r => r.cells[0] && r.cells[0].textContent.trim() === code);
        }
        function flipPill(cell, cls, label, delay) {
          schedule(() => {
            const pill = cell.querySelector('.sh-inv-pill');
            if (!pill) return;
            pill.classList.add('sh-pill-flipping');
            const halfway = setTimeout(() => {
              pill.className = 'sh-inv-pill ' + cls;
              pill.textContent = label;
            }, 260);
            engine.timeouts.push({ v: halfway });
          }, delay);
        }
        function updateQty(row, text, delay) {
          schedule(() => {
            const qtyCell = row.cells[3];
            if (!qtyCell) return;
            qtyCell.textContent = text;
            qtyCell.classList.add('sh-qty-flash');
            setTimeout(() => qtyCell.classList.remove('sh-qty-flash'), 900);
          }, delay);
        }
        function focusRow(target, delay) {
          schedule(() => {
            invRows.forEach(r => {
              if (r === target) {
                r.classList.add('sh-row-focus');
              } else {
                r.classList.add('sh-row-dimmed');
              }
            });
          }, delay);
        }
        function clearFocus(delay) {
          schedule(() => {
            invRows.forEach(r => {
              r.classList.remove('sh-row-focus', 'sh-row-dimmed');
            });
          }, delay);
        }
        function splashCard(html, delay) {
          schedule(() => {
            const wrap = qs('.sh-inv-table-wrap');
            if (!wrap) return;
            wrap.insertAdjacentHTML('beforeend', html);
            const card = wrap.querySelector('.sh-act-card');
            if (card) {
              requestAnimationFrame(() => card.classList.add('is-active'));
            }
          }, delay);
        }
        function removeCard(delay) {
          schedule(() => {
            const card = qs('.sh-act-card');
            if (card) card.classList.remove('is-active');
            setTimeout(() => card && card.remove(), 350);
          }, delay);
        }
        function pulseBtn(delay) {
          schedule(() => {
            const btn = qs('.sh-act-card .sh-act-btn--primary, .sh-act-card .sh-act-btn--success, .sh-act-card .sh-act-btn--danger, .sh-act-card .sh-act-btn--warning');
            if (btn) {
              btn.style.animation = 'none';
              btn.offsetHeight;
              btn.style.animation = 'sh-btn-pulse 1s ease infinite';
            }
          }, delay);
        }
        function confirmCard(html, delay) {
          schedule(() => {
            const old = qs('.sh-act-card');
            if (old) old.remove();
            const wrap = qs('.sh-inv-table-wrap');
            if (!wrap) return;
            wrap.insertAdjacentHTML('beforeend', html);
            const card = wrap.querySelector('.sh-act-card');
            if (card) {
              requestAnimationFrame(() => card.classList.add('is-active'));
            }
          }, delay);
        }

        function successCardHTML(icon, barClass, title, headline, itemLabel, itemVal, stateLabel, stateVal, btnCls) {
          return `<div class="sh-act-card">
  <div class="sh-act-card-bar ${barClass}"></div>
  <div class="sh-act-card-head">
    <div class="sh-act-card-icon ${barClass.replace('bar','icon')}">${icon}</div>
    <div>
      <div class="sh-act-card-title">${title}</div>
      <div class="sh-act-card-headline">${headline}</div>
    </div>
  </div>
  <div class="sh-act-item-row">
    <span class="sh-act-item-label">${itemLabel}</span>
    <span class="sh-act-item-value">${itemVal}</span>
  </div>
  <div class="sh-act-state-row">
    <span class="sh-act-state-label">${stateLabel}</span>
    <span class="sh-act-state-value">${stateVal}</span>
  </div>
  <div class="sh-act-confirm">
    <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
    <button class="sh-act-btn ${btnCls}">Confirm</button>
  </div>
</div>`;
        }

        // ============================================================
        // ============================================================
        // ACT 1 — ELC-5503 Item Requested (T=25300)
        // ============================================================
        const T = 25300;
        splashCard(`<div class="sh-act-card">
  <div class="sh-act-card-bar sh-act-card-bar--primary"></div>
  <div class="sh-act-card-head">
    <div class="sh-act-card-icon sh-act-card-icon--primary">${ICO.wrench}</div>
    <div>
      <div class="sh-act-card-title">Item Requested</div>
      <div class="sh-act-card-headline">Asset Management · Sapphire EAM</div>
    </div>
  </div>
  <div class="sh-act-item-row">
    <span class="sh-act-item-label">Item Issue Request</span>
    <span class="sh-act-item-value">ELC-5503</span>
  </div>
  <div class="sh-act-state-row">
    <span class="sh-act-state-label">Status</span>
    <span class="sh-act-state-value">Pending</span>
  </div>
  <div class="sh-act-confirm">
    <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
    <button class="sh-act-btn sh-act-btn--primary">Confirm</button>
  </div>
</div>`, T);

        removeCard(T + 2600);
        focusRow(getRow('ELC-5503'), T + 2700);
        flipPill(getRow('ELC-5503').cells[7], 'sh-inv-pill sh-inv-pill--info sh-inv-status-pill', 'Requested', T + 2900);

        // ============================================================
        // ACT 2 — MAC-7816 Asset Recovered (T2=T+3900)
        // ============================================================
        const T2 = T + 3900;
        splashCard(`<div class="sh-act-card">
  <div class="sh-act-card-bar sh-act-card-bar--success"></div>
  <div class="sh-act-card-head">
    <div class="sh-act-card-icon sh-act-card-icon--success">${ICO.check}</div>
    <div>
      <div class="sh-act-card-title">Asset Recovered</div>
      <div class="sh-act-card-headline">Asset Management · Sapphire EAM</div>
    </div>
  </div>
  <div class="sh-act-item-row">
    <span class="sh-act-item-label">Found Missing Asset</span>
    <span class="sh-act-item-value">MAC-7816</span>
  </div>
  <div class="sh-act-state-row">
    <span class="sh-act-state-label">Condition</span>
    <span class="sh-act-state-value">Fair</span>
  </div>
  <div class="sh-act-confirm">
    <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
    <button class="sh-act-btn sh-act-btn--success">Confirm</button>
  </div>
</div>`, T2);

        removeCard(T2 + 2600);
        focusRow(getRow('MAC-7816'), T2 + 2700);
        flipPill(getRow('MAC-7816').cells[6], 'sh-inv-pill sh-inv-pill--success sh-inv-condition-pill', 'OK', T2 + 2900);
        flipPill(getRow('MAC-7816').cells[7], 'sh-inv-pill sh-inv-pill--success sh-inv-status-pill', 'Available', T2 + 2950);

        // ============================================================
        // ACT 3 — SCD-488F Asset Returned (T3=T2+3900)
        // ============================================================
        const T3 = T2 + 3900;
        splashCard(`<div class="sh-act-card">
  <div class="sh-act-card-bar sh-act-card-bar--primary"></div>
  <div class="sh-act-card-head">
    <div class="sh-act-card-icon sh-act-card-icon--primary">${ICO.returnLeft}</div>
    <div>
      <div class="sh-act-card-title">Asset Returned</div>
      <div class="sh-act-card-headline">Asset Management</div>
    </div>
  </div>
  <div class="sh-act-item-row">
    <span class="sh-act-item-label">Asset Return</span>
    <span class="sh-act-item-value">SCD-488F</span>
  </div>
  <div class="sh-act-state-row">
    <span class="sh-act-state-label">Status</span>
    <span class="sh-act-state-value">Active</span>
  </div>
  <div class="sh-act-confirm">
    <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
    <button class="sh-act-btn sh-act-btn--primary">Confirm</button>
  </div>
</div>`, T3);

        removeCard(T3 + 2600);
        focusRow(getRow('SCD-488F'), T3 + 2700);
        flipPill(getRow('SCD-488F').cells[6], 'sh-inv-pill sh-inv-pill--success sh-inv-condition-pill', 'OK', T3 + 2900);
        flipPill(getRow('SCD-488F').cells[7], 'sh-inv-pill sh-inv-pill--success sh-inv-status-pill', 'Available', T3 + 2950);

        // ============================================================
        // ACT 4 — ASM-2207 Start Service (T4=T3+3900)
        // ============================================================
        const T4 = T3 + 3900;
        splashCard(`<div class="sh-act-card">
  <div class="sh-act-card-bar sh-act-card-bar--pop"></div>
  <div class="sh-act-card-head">
    <div class="sh-act-card-icon sh-act-card-icon--pop">${ICO.wrench}</div>
    <div>
      <div class="sh-act-card-title">Start Service</div>
      <div class="sh-act-card-headline">Asset Management · Sapphire EAM</div>
    </div>
  </div>
  <div class="sh-act-item-row">
    <span class="sh-act-item-label">Asset sent for service</span>
    <span class="sh-act-item-value">ASM-2207</span>
  </div>
  <div class="sh-act-state-row">
    <span class="sh-act-state-label">Condition</span>
    <span class="sh-act-state-value">Damage</span>
  </div>
  <div class="sh-act-confirm">
    <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
    <button class="sh-act-btn sh-act-btn--primary">Confirm</button>
  </div>
</div>`, T4);

        removeCard(T4 + 2600);
        focusRow(getRow('ASM-2207'), T4 + 2700);
        flipPill(getRow('ASM-2207').cells[6], 'sh-inv-pill sh-inv-pill--pop sh-inv-condition-pill', 'Under Maintenance', T4 + 2900);
        flipPill(getRow('ASM-2207').cells[7], 'sh-inv-pill sh-inv-pill--danger sh-inv-status-pill', 'Unavailable', T4 + 2950);

        // ============================================================
        // ACT 5 — CLN-3317 Service Resolved (T5=T4+3900)
        // ============================================================
        const T5 = T4 + 3900;
        splashCard(`<div class="sh-act-card">
  <div class="sh-act-card-bar sh-act-card-bar--pop"></div>
  <div class="sh-act-card-head">
    <div class="sh-act-card-icon sh-act-card-icon--pop">${ICO.check}</div>
    <div>
      <div class="sh-act-card-title">Service Resolved</div>
      <div class="sh-act-card-headline">Asset Management · Sapphire EAM</div>
    </div>
  </div>
  <div class="sh-act-item-row">
    <span class="sh-act-item-label">Asset Service Complete</span>
    <span class="sh-act-item-value">CLN-3317</span>
  </div>
  <div class="sh-act-state-row">
    <span class="sh-act-state-label">Status</span>
    <span class="sh-act-state-value">Available</span>
  </div>
  <div class="sh-act-confirm">
    <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
    <button class="sh-act-btn sh-act-btn--primary">Confirm</button>
  </div>
</div>`, T5);

        removeCard(T5 + 2600);
        focusRow(getRow('CLN-3317'), T5 + 2700);
        flipPill(getRow('CLN-3317').cells[6], 'sh-inv-pill sh-inv-pill--success sh-inv-condition-pill', 'OK', T5 + 2900);
        flipPill(getRow('CLN-3317').cells[7], 'sh-inv-pill sh-inv-pill--success sh-inv-status-pill', 'Available', T5 + 2950);

        // ============================================================
        // ACT 6 — MAT-1042 Material Replaced (T6=T5+3900)
        // ============================================================
        const T6 = T5 + 3900;
        splashCard(`<div class="sh-act-card">
  <div class="sh-act-card-bar sh-act-card-bar--primary"></div>
  <div class="sh-act-card-head">
    <div class="sh-act-card-icon sh-act-card-icon--primary">${ICO.replace}</div>
    <div>
      <div class="sh-act-card-title">Material Replaced</div>
      <div class="sh-act-card-headline">Asset Management · Sapphire EAM</div>
    </div>
  </div>
  <div class="sh-act-item-row">
    <span class="sh-act-item-label">Material Replacement</span>
    <span class="sh-act-item-value">MAT-1042</span>
  </div>
  <div class="sh-act-state-row">
    <span class="sh-act-state-label">Status</span>
    <span class="sh-act-state-value">Unavailable</span>
  </div>
  <div class="sh-act-confirm">
    <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
    <button class="sh-act-btn sh-act-btn--primary">Confirm</button>
  </div>
</div>`, T6);

        removeCard(T6 + 2600);
        focusRow(getRow('MAT-1042'), T6 + 2700);
        flipPill(getRow('MAT-1042').cells[6], 'sh-inv-pill sh-inv-pill--info sh-inv-condition-pill', 'Unfit', T6 + 2900);
        flipPill(getRow('MAT-1042').cells[7], 'sh-inv-pill sh-inv-pill--danger sh-inv-status-pill', 'Unavailable', T6 + 2950);
        // After replacement: change to OK / Available
        flipPill(getRow('MAT-1042').cells[6], 'sh-inv-pill sh-inv-pill--success sh-inv-condition-pill', 'OK', T6 + 3300);
        flipPill(getRow('MAT-1042').cells[7], 'sh-inv-pill sh-inv-pill--success sh-inv-status-pill', 'Available', T6 + 3350);
        schedule(() => {
          const expiryCell = getRow('MAT-1042').cells[8];
          if (expiryCell) {
            expiryCell.textContent = '4 Jun 2027';
            expiryCell.classList.add('sh-qty-flash');
            setTimeout(() => expiryCell.classList.remove('sh-qty-flash'), 900);
          }
        }, T6 + 3400);

        // ============================================================
        // ACT 7 — MAT-3328 Discard Material (T7=T6+3900)
        // ============================================================
        const T7 = T6 + 3900;
        splashCard(`<div class="sh-act-card">
  <div class="sh-act-card-bar sh-act-card-bar--danger"></div>
  <div class="sh-act-card-head">
    <div class="sh-act-card-icon sh-act-card-icon--danger">${ICO.trash}</div>
    <div>
      <div class="sh-act-card-title">Discard Material</div>
      <div class="sh-act-card-headline">Asset Management · Sapphire EAM</div>
    </div>
  </div>
  <div class="sh-act-item-row">
    <span class="sh-act-item-label">Discard</span>
    <span class="sh-act-item-value">MAT-3328</span>
  </div>
  <div class="sh-act-state-row">
    <span class="sh-act-state-label">Condition</span>
    <span class="sh-act-state-value">Expired</span>
  </div>
  <div class="sh-act-confirm">
    <button class="sh-act-btn sh-act-btn--cancel">Cancel</button>
    <button class="sh-act-btn sh-act-btn--danger">Confirm</button>
  </div>
</div>`, T7);

        removeCard(T7 + 2600);
        focusRow(getRow('MAT-3328'), T7 + 2700);
        flipPill(getRow('MAT-3328').cells[6], 'sh-inv-pill sh-inv-pill--danger sh-inv-condition-pill', 'Expired', T7 + 2900);
        flipPill(getRow('MAT-3328').cells[7], 'sh-inv-pill sh-inv-pill--danger sh-inv-status-pill', 'Unavailable', T7 + 2950);

        // Slide out and remove the discarded row
        schedule(() => {
          const row = getRow('MAT-3328');
          if (row) {
            row.classList.add('sh-row-discarded');
            setTimeout(() => row.remove(), 500);
          }
        }, T7 + 3400);

        // ============================================================
        // ACT 8 — MAT-1042 Consumption Cycle (T8=T7+3900)
        // MAT-1042 is already: Condition OK, Status Available, Stock 180 L, Expiry 4 Jun 2027
        // ============================================================
        const T8 = T7 + 3900;
        clearFocus(T8);
        focusRow(getRow('MAT-1042'), T8 + 50);

        // Consumption events — sequential display with quantity updates
        // Each event: show card → update qty → remove card → next event
        const consumptionItems = [
          { label: '12 L', remaining: 168 },
          { label: '8 L', remaining: 160 },
          { label: '15 L', remaining: 145 },
          { label: '20 L', remaining: 125 },
          { label: '25 L', remaining: 100 },
          { label: '18 L', remaining: 82 }
        ];
        const consumptionStart = T8 + 400;
        const consumptionInterval = 1800; // time between each consumption event

        consumptionItems.forEach((item, i) => {
          const eventTime = consumptionStart + (i * consumptionInterval);

          // Show consumption card
          confirmCard(`<div class="sh-act-card">
  <div class="sh-act-card-bar sh-act-card-bar--warning"></div>
  <div class="sh-act-card-head">
    <div class="sh-act-card-icon sh-act-card-icon--warning">${ICO.replace}</div>
    <div>
      <div class="sh-act-card-title">Material Consumed</div>
      <div class="sh-act-card-headline">MAT-1042 · Sapphire EAM</div>
    </div>
  </div>
  <div class="sh-act-item-row">
    <span class="sh-act-item-label">Material Consumption</span>
    <span class="sh-act-item-value">MAT-1042</span>
  </div>
  <div class="sh-act-state-row">
    <span class="sh-act-state-label">Consumed</span>
    <span class="sh-act-state-value">${item.label}</span>
  </div>
  <div class="sh-act-confirm">
    <button class="sh-act-btn sh-act-btn--warning">Close</button>
  </div>
</div>`, eventTime);

          // Update quantity
          schedule(() => {
            const qtyCell = getRow('MAT-1042').cells[3];
            if (qtyCell) {
              qtyCell.textContent = item.remaining + ' L';
              qtyCell.classList.add('sh-qty-flash');
              setTimeout(() => qtyCell.classList.remove('sh-qty-flash'), 900);
            }
          }, eventTime + 700);

          // Remove card
          removeCard(eventTime + 1400);
        });

        // After all consumption events, clear focus
        clearFocus(consumptionStart + (consumptionItems.length * consumptionInterval) + 500);

        /* ============================================================
           END LIVE ACTIONS
           ============================================================ */

        schedule(() => {
          const tableScreen = qs('[data-sh-inv-screen="table"]');
          if (tableScreen) {
            tableScreen.classList.remove('is-active');
            tableScreen.setAttribute('aria-hidden', 'true');
          }
          this.clearTimers();
          this.runDesktopLoop();
        }, MAINTENDT + 720);
      }
    }
  };

  const Engine = {
    init(sel, opts = {}) {
      this.container = typeof sel === 'string' ? document.querySelector(sel) : sel;
      if (!this.container || this.container.dataset.shInitialized === 'true') return this;
      this.container.dataset.shInitialized = 'true';
      this.currentScene = 'desktop';
      this.timeouts = [];
      this.resizeObserver = null;

      this.renderDesktopOnly();
      this.setupResize();
      this.handleVisibility();
      this.runDesktopLoop();

      return this;
    },

    renderDesktopOnly() {
      this.container.innerHTML = `
        <div class="sh-demo-frame">
          <div class="sh-viewport">
            <div class="sh-canvas" data-sh-canvas></div>
          </div>
        </div>
      `;

      const canvas = this.container.querySelector('[data-sh-canvas]');
      if (!canvas) return;

      canvas.innerHTML = SCENES.desktop.render();
      this.scaleCanvas();
    },

    runDesktopLoop() {
      this.clearTimers();

      const canvas = this.container.querySelector('[data-sh-canvas]');
      if (!canvas) return;

      canvas.innerHTML = SCENES.desktop.render();
      this.scaleCanvas();

      const ctx = {
        schedule: (fn, delay) => this.timeouts.push(setTimeout(fn, delay)),
        qs: (sel) => canvas.querySelector(sel),
        qsa: (sel) => canvas.querySelectorAll(sel)
      };

      SCENES.desktop.animate.call(this, ctx);

      this.timeouts.push(setTimeout(() => {
        this.runDesktopLoop();
      }, CYCLE_MS));
    },

    scaleCanvas() {
      const viewport = this.container.querySelector('.sh-viewport');
      const canvas = this.container.querySelector('[data-sh-canvas]');
      if (!viewport || !canvas) return;

      const r = viewport.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      const scale = Math.min(r.width / DESIGN_W, r.height / DESIGN_H);
      canvas.style.transform = `scale(${scale})`;
      canvas.style.width = DESIGN_W + 'px';
      canvas.style.height = DESIGN_H + 'px';
    },

    setupResize() {
      const viewport = this.container.querySelector('.sh-viewport');
      if (!viewport) return;

      let t;
      this.resizeObserver = new ResizeObserver(() => {
        clearTimeout(t);
        t = setTimeout(() => this.scaleCanvas(), 50);
      });

      this.resizeObserver.observe(viewport);
      this._boundResize = () => this.scaleCanvas();
      this._boundLoad = () => this.scaleCanvas();

      window.addEventListener('resize', this._boundResize);
      window.addEventListener('load', this._boundLoad);
    },

    clearTimers() {
      this.timeouts.forEach(t => clearTimeout(t));
      this.timeouts = [];
    },

    handleVisibility() {
      this.boundVisibility = () => {
        if (document.hidden) {
          this.clearTimers();
        } else {
          this.runDesktopLoop();
        }
      };
      document.addEventListener('visibilitychange', this.boundVisibility);
    },

    destroy() {
      this.clearTimers();
      if (this.resizeObserver) this.resizeObserver.disconnect();
      if (this._boundResize) window.removeEventListener('resize', this._boundResize);
      if (this._boundLoad) window.removeEventListener('load', this._boundLoad);
      if (this.boundVisibility) document.removeEventListener('visibilitychange', this.boundVisibility);

      if (this.container) {
        this.container.innerHTML = '';
        delete this.container.dataset.shInitialized;
      }
    }
  };

  root.SapphireHero = {
    init(sel, opts = {}) {
      const instance = Object.create(Engine);
      instance.init(sel, opts);
      return instance;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-sapphire-hero-viz]').forEach(el => {
      root.SapphireHero.init(el);
    });
  });
})(typeof window !== 'undefined' ? window : this);