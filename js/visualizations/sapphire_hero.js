/* =========================================================
   SAPPHIRE HERO — Scene Engine
   Usage:  SapphireHero.init('#container-id');
   Or:     <div data-sapphire-hero-viz></div>  (auto-init)
   ========================================================= */

(function (root) {
  'use strict';

  const DESIGN_W = 1440;
  const DESIGN_H = 760;
  const CYCLE_MS = 60000;

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
                <button class="sh-app-tab" id="sb-inv">Inventory</button>
                <button class="sh-app-tab" id="sb-req">Requests <span class="sh-nav-badge">4</span></button>
                <button class="sh-app-tab" id="sb-insp">Inspections <span class="sh-nav-badge">1</span></button>
                <button class="sh-app-tab" id="sb-maint">Maintenance</button>
                <button class="sh-app-tab" id="sb-opex">OPEX</button>
                <button class="sh-app-tab" id="sb-rep">Reports</button>
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
                      <div class="sh-inv-page-title">Live item ledger</div>
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
                          <td>3 Feb 2027</td>
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
                          <td class="s-text-danger">28 May 2026</td>
                          <td>18 Dec 2026</td>
                          <td>8 Jun 2026</td>
                        </tr>

                        <tr data-sh-inv-row>
                          <td>TLS-4481</td>
                          <td>Torque Wrench Kit</td>
                          <td>Tool</td>
                          <td>1N</td>
                          <td>Body Shop</td>
                          <td>B2/BS1/R8/C3</td>
                          <td><span class="sh-inv-pill sh-inv-pill--attention sh-inv-condition-pill">Incomplete Kit</span></td>
                          <td><span class="sh-inv-pill sh-inv-pill--success sh-inv-status-pill">Available</span></td>
                          <td>N/A</td>
                          <td>22 Jan 2027</td>
                          <td>N/A</td>
                          <td class="s-text-attention">12 Jun 2026</td>
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
                          <td>30 Nov 2027</td>
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
           LIVE ACTIONS — 8 sequential animated acts
           ============================================================ */

        // ---- helpers ----
        const engine = this;
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

        // ---- icons ----
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
          this.switchScene(this.currentScene);
        }, 55000);
      }
    },

    mobile: {
      id: 'mobile',
      title: 'Mobile',
      subtitle: 'Approvals & Field Flow',
      icon: '📱',
      render() {
        return `
          <div class="sh-mobile-scene">
            <div class="sh-phone">
              <div class="sh-phone-screen">
                <div class="sh-phone-status"><span>9:41</span><span>5G · 100%</span></div>
                <div class="sh-phone-screen-inner">
                  <div class="sh-phone-app-bar">
                    <div class="sh-phone-app-logo">S</div>
                    <div class="sh-phone-app-title">Sapphire Mobile</div>
                  </div>
                  <div class="sh-notification"><div class="sh-notif-header"><span class="sh-notif-app">Sapphire</span><span>just now</span></div><div class="sh-notif-title">Work order raised</div><div class="sh-notif-desc">WO-2026-0892 needs approval and inspection scheduling.</div></div>
                  <div class="sh-notification"><div class="sh-notif-header"><span class="sh-notif-app">Sapphire</span><span>+12 sec</span></div><div class="sh-notif-title">Inspection assigned</div><div class="sh-notif-desc">Arjun Mehta assigned for pre-repair inspection at CNC-04.</div></div>
                  <div class="sh-notification"><div class="sh-notif-header"><span class="sh-notif-app">Sapphire</span><span>+28 sec</span></div><div class="sh-notif-title">Approval completed</div><div class="sh-notif-desc">Supervisor approved parts issue and maintenance booking.</div></div>
                </div>
              </div>
            </div>

            <div class="sh-mobile-info-panel">
              <div class="sh-mip-title">${ICON.workorder} Approval Cascade</div>
              <div class="sh-mip-step"><div class="sh-mip-num">1</div><div class="sh-mip-step-text"><div class="sh-mip-step-title">Work order created</div><div class="sh-mip-step-desc">Machine fault logged from production floor.</div></div></div>
              <div class="sh-mip-step"><div class="sh-mip-num">2</div><div class="sh-mip-step-text"><div class="sh-mip-step-title">Manager notified</div><div class="sh-mip-step-desc">Approver receives mobile alert instantly.</div></div></div>
              <div class="sh-mip-step"><div class="sh-mip-num">3</div><div class="sh-mip-step-text"><div class="sh-mip-step-title">Inspection triggered</div><div class="sh-mip-step-desc">Field technician gets checklist and schedule.</div></div></div>
              <div class="sh-mip-step"><div class="sh-mip-num">4</div><div class="sh-mip-step-text"><div class="sh-mip-step-title">Status synced</div><div class="sh-mip-step-desc">Dashboard reflects approval and action state.</div></div></div>
            </div>

            <div class="sh-phone">
              <div class="sh-phone-screen">
                <div class="sh-phone-status"><span>9:42</span><span>5G · 98%</span></div>
                <div class="sh-phone-screen-inner">
                  <div class="sh-phone-app-bar">
                    <div class="sh-phone-app-logo">S</div>
                    <div class="sh-phone-app-title">Inspection App</div>
                  </div>
                  <div class="sh-notification"><div class="sh-notif-header"><span class="sh-notif-app">Checklist</span><span>live</span></div><div class="sh-notif-title">Pre-repair checklist opened</div><div class="sh-notif-desc">Technician captured wear status, seal condition, and image proof.</div></div>
                  <div class="sh-notification"><div class="sh-notif-header"><span class="sh-notif-app">Maintenance</span><span>synced</span></div><div class="sh-notif-title">Repair plan linked</div><div class="sh-notif-desc">Parts and task sheet linked back to the central system.</div></div>
                </div>
              </div>
            </div>
          </div>`;
      },
      animate(ctx) {
        const { schedule, qsa, qs } = ctx;
        const phones = qsa('.sh-phone');
        const notices = qsa('.sh-notification');
        const steps = qsa('.sh-mip-step');
        const panel = qs('.sh-mobile-info-panel');

        phones.forEach((phone, i) => schedule(() => phone.classList.add('visible'), 300 + i * 400));
        schedule(() => panel && panel.classList.add('visible'), 900);

        notices.forEach((note, i) => schedule(() => note.classList.add('visible'), 1400 + i * 500));

        steps.forEach((step, i) => {
          schedule(() => step.classList.add('active'), 1800 + i * 900);
          if (i > 0) schedule(() => steps[i - 1].classList.add('complete'), 1800 + i * 900);
        });

        if (steps.length) {
          schedule(() => steps[steps.length - 1].classList.add('complete'), 1800 + steps.length * 900);
        }
      }
    },

    analytics: {
      id: 'analytics',
      title: 'Analytics',
      subtitle: 'Live Insights',
      icon: '📊',
      render() {
        const heatCells = Array.from({ length: 40 }, (_, i) => {
          const lvl = (i % 5) + 1;
          return `<div class="sh-heat-cell lvl-${lvl}"></div>`;
        }).join('');

        const bars = [
          { label: 'Procure', value: '₹8K', cls: 'positive', h: '70px' },
          { label: 'Repair', value: '₹12K', cls: 'negative', h: '110px' },
          { label: 'Inspect', value: '₹4K', cls: 'positive', h: '44px' },
          { label: 'Downtime', value: '₹18K', cls: 'negative', h: '140px' },
          { label: 'Recovery', value: '₹7K', cls: 'positive', h: '60px' }
        ].map((b) => `
          <div class="sh-wf-bar ${b.cls}" style="--sh-wf-h:${b.h}">
            <div class="sh-wf-value">${b.value}</div>
            <div class="sh-wf-bar-body"></div>
            <div class="sh-wf-label">${b.label}</div>
          </div>
        `).join('');

        const txns = [
          ['procure', 'Bearing assembly issued', 'Inventory → CNC-04', '₹8,450', '2m ago', 'neg'],
          ['maint', 'Maintenance task opened', 'WO-2026-0892', '₹12,000', '1m ago', 'neg'],
          ['prod', 'Downtime recovery estimate', 'Shift B adjustment', '₹7,200', 'just now', 'pos'],
          ['procure', 'Seal kit reserved', 'Stores allocation', '₹3,280', 'just now', 'neg']
        ].map((t) => `
          <div class="sh-txn">
            <div class="sh-txn-icon ${t[0]}">${t[0] === 'procure' ? '📦' : t[0] === 'maint' ? '🔧' : '📈'}</div>
            <div><div class="sh-txn-title">${t[1]}</div><div class="sh-txn-meta">${t[2]}</div></div>
            <div class="sh-txn-amount ${t[5]}">${t[3]}</div>
            <div class="sh-txn-time">${t[4]}</div>
          </div>
        `).join('');

        return `
          <div class="sh-analytics">
            <div class="sh-analytics-head">
              <div class="sh-analytics-title">Financial & Operational Analytics</div>
              <div class="sh-analytics-tabs">
                <div class="sh-a-tab active">Today</div>
                <div class="sh-a-tab">Week</div>
                <div class="sh-a-tab">Month</div>
              </div>
            </div>

            <div class="sh-heatmap-card">
              <div class="sh-card-h">
                <div class="sh-card-h-title">Module Activity Heatmap</div>
                <div class="sh-card-h-sub">Live intensity</div>
              </div>
              <div class="sh-heatmap">${heatCells}</div>
            </div>

            <div class="sh-waterfall-card">
              <div class="sh-card-h">
                <div class="sh-card-h-title">Cost Waterfall</div>
                <div class="sh-card-h-sub">Repair event impact</div>
              </div>
              <div class="sh-waterfall">${bars}</div>
            </div>

            <div class="sh-transactions-card">
              <div class="sh-card-h">
                <div class="sh-card-h-title">Recent Transactions</div>
                <div class="sh-card-h-sub">Auto-posted from operations</div>
              </div>
              <div class="sh-txn-list">${txns}</div>
            </div>
          </div>`;
      },
      animate(ctx) {
        const { schedule, qs, qsa } = ctx;
        const heatCard = qs('.sh-heatmap-card');
        const wfCard = qs('.sh-waterfall-card');
        const txnCard = qs('.sh-transactions-card');
        const heatCells = qsa('.sh-heat-cell');
        const bars = qsa('.sh-wf-bar');
        const txns = qsa('.sh-txn');

        schedule(() => heatCard && heatCard.classList.add('visible'), 300);
        schedule(() => wfCard && wfCard.classList.add('visible'), 600);
        schedule(() => txnCard && txnCard.classList.add('visible'), 900);

        heatCells.forEach((cell, i) => schedule(() => cell.classList.add('visible'), 1100 + i * 40));
        schedule(() => {
          [4, 11, 18, 26, 33].forEach((i) => heatCells[i] && heatCells[i].classList.add('pulse'));
        }, 3200);

        bars.forEach((bar, i) => {
          schedule(() => bar.classList.add('visible'), 1500 + i * 180);
          schedule(() => bar.classList.add('grow'), 1800 + i * 180);
        });

        txns.forEach((txn, i) => schedule(() => txn.classList.add('visible'), 2400 + i * 180));
      }
    }
  };

  const Engine = {
    init(sel, opts = {}) {
      this.container = typeof sel === 'string' ? document.querySelector(sel) : sel;
      if (!this.container || this.container.dataset.shInitialized === 'true') return this;
      this.container.dataset.shInitialized = 'true';
      this.currentScene = null;
      this.timeouts = [];
      this.resizeObserver = null;
      this.defaultScene = opts.defaultScene || 'desktop';

      this.renderShell();
      this.attachTabHandlers();
      this.setupResize();
      this.handleVisibility();
      this.switchScene(this.defaultScene);

      return this;
    },

    renderShell() {
      const tabsHtml = Object.values(SCENES).map(s => `
        <button class="sh-tab" data-sh-scene="${s.id}">
          <span class="sh-tab-icon">${s.icon}</span>
          <span>${s.title}</span>
        </button>
      `).join('');

      this.container.innerHTML = `
        <div class="sapphire-hero-viz">
          <div class="sh-topnav">
            <div class="sh-topnav-brand">
              <div class="sh-topnav-logo">S</div>
              <span>Sapphire Live Demo</span>
            </div>
            <div class="sh-topnav-tabs">${tabsHtml}</div>
            <div class="sh-topnav-status">
              <span class="sh-live-indicator"></span>
              <span>Live Preview</span>
            </div>
          </div>

          <div class="sh-demo-frame">
            <div class="sh-viewport">
              <div class="sh-canvas" data-sh-canvas></div>
            </div>
          </div>
        </div>`;
    },

    attachTabHandlers() {
      this.container.querySelectorAll('[data-sh-scene]').forEach(btn => {
        btn.addEventListener('click', () => this.switchScene(btn.dataset.shScene));
      });
    },

    switchScene(sceneId) {
      const scene = SCENES[sceneId];
      if (!scene) return;

      this.clearTimers();
      this.currentScene = sceneId;

      this.container.querySelectorAll('.sh-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.shScene === sceneId);
      });

      const canvas = this.container.querySelector('[data-sh-canvas]');
      if (!canvas) return;

      canvas.innerHTML = scene.render();
      this.scaleCanvas();

      const ctx = {
        schedule: (fn, delay) => this.timeouts.push(setTimeout(fn, delay)),
        qs: (sel) => canvas.querySelector(sel),
        qsa: (sel) => canvas.querySelectorAll(sel)
      };

      scene.animate(ctx);

      this.timeouts.push(setTimeout(() => {
        if (this.currentScene === sceneId) this.switchScene(sceneId);
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
      this._boundVisibility = () => {
        if (document.hidden) {
          this.clearTimers();
        } else if (this.currentScene) {
          this.switchScene(this.currentScene);
        }
      };
      document.addEventListener('visibilitychange', this._boundVisibility);
    },

    destroy() {
      this.clearTimers();
      if (this.resizeObserver) this.resizeObserver.disconnect();
      if (this._boundResize) window.removeEventListener('resize', this._boundResize);
      if (this._boundLoad) window.removeEventListener('load', this._boundLoad);
      if (this._boundVisibility) document.removeEventListener('visibilitychange', this._boundVisibility);

      if (this.container) {
        this.container.innerHTML = '';
        delete this.container.dataset.shInitialized;
      }
    }
  };

  root.SapphireHero = {
    init: (sel, opts) => {
      const instance = Object.create(Engine);
      instance.init(sel, opts);
      return instance;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-sapphire-hero-viz]').forEach(el => {
      const scene = el.getAttribute('data-sapphire-hero-viz') || 'desktop';
      root.SapphireHero.init(el, { defaultScene: scene });
    });
  });
})(typeof window !== 'undefined' ? window : this);