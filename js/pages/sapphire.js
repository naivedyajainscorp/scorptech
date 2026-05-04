/* ════════════════════════════════════════════════════════════════════════════
   SAPPHIRE PAGE INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */

import { initInfiniteScroll } from '../components/InfiniteScroll.js';
import { initBackground } from '../components/fog_bg.js';

console.log('💎 Sapphire page initialization started');

/* ════════════════════════════════════════════════════════════════════════════
   SAPPHIRE CAPABILITY CARDS ANIMATIONS
   Migrated from capabilities.html
   ════════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// 1. Guides Card - Step Indicators Animation
// ─────────────────────────────────────────────────────────────────────────────

function initGuidesStepAnimation() {
    const steps      = document.querySelectorAll('.s-cpblts-step-indicators .s-cpblts-step');
    const playIcon   = document.querySelector('.s-cpblts-play-anim .s-cpblts-play-circle i');
    const progFill   = document.querySelector('.s-cpblts-progress .s-cpblts-progress-fill');

    if (!steps.length || !playIcon || !progFill) {
        console.log('ℹ️ Guides card animation elements not found');
        return;
    }

    // Phase config
    const phases = [
        { icon: 'fas fa-book-open',           progress: '25%'  },  // Step 1 — Read
        { icon: 'bi bi-ui-checks',            progress: '50%'  },  // Step 2 — Quiz
        { icon: 'fas fa-magnifying-glass-chart', progress: '75%' },  // Step 3 — Analyse
        { icon: 'fas fa-crown',               progress: '100%' },  // Step 4 — Mastered
    ];

    let current = 0;

    function activateStep(index) {
        // Update step circles
        steps.forEach((step, i) => step.classList.toggle('active', i === index));

        // Cross-fade icon
        playIcon.style.opacity   = '0';
        playIcon.style.transform = 'scale(0.4) rotate(-15deg)';

        setTimeout(() => {
            playIcon.className       = phases[index].icon;
            playIcon.style.opacity   = '1';
            playIcon.style.transform = 'scale(1) rotate(0deg)';
        }, 180);

        // Progress bar
        progFill.style.width = phases[index].progress;
    }

    // Set initial state
    activateStep(0);

    // Cycle every 2.2 seconds
    setInterval(() => {
        current = (current + 1) % phases.length;
        activateStep(current);
    }, 2200);

    console.log('✅ Guides step animation initialized');
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Analytics Card - Pie Chart Animation
// ─────────────────────────────────────────────────────────────────────────────

function initAnalyticsPieChart() {
    const C = 251.33; // 2 * PI * r (r=40, full circumference of the donut)

    const pie1 = document.querySelector('.s-cpblts-pie-chart .s-cpblts-pie-1');
    const pie2 = document.querySelector('.s-cpblts-pie-chart .s-cpblts-pie-2');
    const pie3 = document.querySelector('.s-cpblts-pie-chart .s-cpblts-pie-3');

    if (!pie1 || !pie2 || !pie3) {
        console.log('ℹ️ Analytics pie chart elements not found');
        return;
    }

    // Generate 3 random percentages that sum to 100, each at least 10%
    function getSlices() {
        let a = 25 + Math.floor(Math.random() * 35); // 25–59%
        let b = 15 + Math.floor(Math.random() * 30); // 15–44%
        let c = 100 - a - b;
        if (c < 10) { a -= (10 - c); c = 10; }       // floor segment 3 at 10%
        return [a, b, c];
    }

    function resetAll() {
        [pie1, pie2, pie3].forEach(el => {
            el.style.transition = 'none';
            el.setAttribute('stroke-dasharray', `0 ${C}`);
        });
    }

    function cycle() {
        resetAll();

        // Small pause so browser registers the reset before we animate
        setTimeout(() => {
            const [p1, p2, p3] = getSlices();
            const s1 = (p1 / 100) * C;
            const s2 = (p2 / 100) * C;
            const s3 = (p3 / 100) * C;

            // Position each segment at its correct starting angle
            pie1.setAttribute('transform', 'rotate(-90 50 50)');
            pie2.setAttribute('transform', `rotate(${(-90 + (p1 / 100) * 360).toFixed(2)} 50 50)`);
            pie3.setAttribute('transform', `rotate(${(-90 + ((p1 + p2) / 100) * 360).toFixed(2)} 50 50)`);

            // Staggered fill: segment 1 → 2 → 3
            requestAnimationFrame(() => {
                pie1.style.transition = 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                pie1.setAttribute('stroke-dasharray', `${s1.toFixed(2)} ${(C - s1).toFixed(2)}`);

                setTimeout(() => {
                    pie2.style.transition = 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    pie2.setAttribute('stroke-dasharray', `${s2.toFixed(2)} ${(C - s2).toFixed(2)}`);
                }, 320);

                setTimeout(() => {
                    pie3.style.transition = 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    pie3.setAttribute('stroke-dasharray', `${s3.toFixed(2)} ${(C - s3).toFixed(2)}`);
                }, 640);
            });

            // Next cycle after fill completes + hold pause
            setTimeout(cycle, 3600); // ~1.44s total fill + ~2.16s hold
        }, 80);
    }

    // First run after a short page-load delay
    setTimeout(cycle, 600);

    console.log('✅ Analytics pie chart animation initialized');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Mobile USP Card - Work Order List Animation
// ─────────────────────────────────────────────────────────────────────────────

function initMobileUSPWorkOrder() {
    const inner = document.querySelector('.s-cpblts-mob-wo-inner');
    if (!inner) {
        console.log('ℹ️ Mobile USP work order elements not found');
        return;
    }

    // Multi-color palette
    const palette = [
        // Orange shades
        '#fb923c',  // orange
        '#f97316',  // orange-500
        '#ea580c',  // orange-600
        '#c2410c',  // orange-700
        // Green shades
        '#4ade80',  // green-400
        '#22c55e',  // green-500
        '#16a34a',  // green-600
        '#15803d',  // green-700
        // Pink shades
        '#f472b6',  // pink-400
        '#ec4899',  // pink-500
        '#db2777',  // pink-600
        '#be185d',  // pink-700
        // Red shades
        '#f87171',  // red-400
        '#ef4444',  // red-500
        '#dc2626',  // red-600
        '#b91c1c',  // red-700
        // Yellow shades
        '#facc15',  // yellow-400
        '#eab308',  // yellow-500
        '#ca8a04',  // yellow-600
        // Blue shades (for variety)
        '#22d3ee',  // cyan
        '#0ea5e9',  // sky blue
        '#38bdf8',  // light cyan
        '#0891b2',  // teal
        '#2563eb',  // royal blue
        '#0066cc',  // sapphire
    ];

    const ITEM_H = 28;   // row height + gap in px
    const MAX    = 8;    // items kept in DOM at once

    let pool = [];

    function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function makeItem(color) {
        const d  = document.createElement('div');
        d.className = 's-cpblts-mob-wo-item';
        const lineW = Math.random() > 0.5 ? 'long' : 'medium';
        d.innerHTML = `
            <div class="s-cpblts-wo-dot"
                style="background:${color};
                        box-shadow:0 0 6px ${color}cc,0 0 12px ${color}55;">
            </div>
            <div class="s-cpblts-wo-lines">
                <div class="s-cpblts-wo-line ${lineW}"></div>
                <div class="s-cpblts-wo-line short"></div>
            </div>`;
        return d;
    }

    // Seed 6 initial items instantly (fill the visible area)
    for (let i = 0; i < 6; i++) {
        const item = makeItem(rnd(palette));
        inner.appendChild(item);
        pool.push(item);
    }

    function scrollIn(color) {
        // New item enters invisible from below
        const item = makeItem(color);
        item.style.opacity   = '0';
        item.style.transform = 'translateY(10px)';
        inner.appendChild(item);
        pool.push(item);

        // Slide the whole inner wrapper up by one row
        inner.style.transition = 'transform 0.52s cubic-bezier(0.4,0,0.2,1)';
        inner.style.transform  = `translateY(-${ITEM_H}px)`;

        // Fade + settle new item
        requestAnimationFrame(() => requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.38s ease, transform 0.38s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'translateY(0)';
        }));

        // After scroll ends: snap wrapper back, drop oldest item
        setTimeout(() => {
            inner.style.transition = 'none';
            inner.style.transform  = 'translateY(0)';
            if (pool.length > MAX) {
                const old = pool.shift();
                if (old && old.parentNode === inner) inner.removeChild(old);
            }
        }, 540);
    }

    function cycle() {
        try {
            // 55% chance: 1 new item — 45% chance: 2 new items
            const count  = Math.random() > 0.45 ? 1 : 2;
            // Occasionally give 2 consecutive items the same color (looks like related orders)
            const anchor = rnd(palette);
            for (let i = 0; i < count; i++) {
                const color = Math.random() > 0.38 ? rnd(palette) : anchor;
                setTimeout(() => scrollIn(color), i * 520);
            }
            // Next cycle after current batch finishes + pause (infinite loop)
            const pause = 2400 + count * 520 + Math.random() * 600;
            setTimeout(cycle, pause);
        } catch(e) {
            console.log('WO cycle error:', e);
            // Restart cycle even if error occurs
            setTimeout(cycle, 3000);
        }
    }

    // First cycle after a brief page-load settle
    setTimeout(cycle, 1400);

    console.log('✅ Mobile USP work order animation initialized');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main initializer for all capability card animations
// ─────────────────────────────────────────────────────────────────────────────

function initSapphireCapabilityCards() {
    console.log('💎 Initializing Sapphire capability card animations...');
    initGuidesStepAnimation();
    initAnalyticsPieChart();
    initMobileUSPWorkOrder();
}

/* ════════════════════════════════════════════════════════════════════════════
   Fog Background Initialization
   ═════════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Showcase WHITE tone moods only for Sapphire hero
  const sapphireHero = document.querySelector('#sapphireHero');
  if (sapphireHero) {
    initBackground('#sapphireHero', 'fog', {
      tone: 'BLUE',
      mood: 'SAPPHIRE',
      blur: 0.65,
      pace: 0.7,
      zoom: 0.85,
      showcase: true,
      showcaseTone: 'BLUE',
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. AOS (Animate On Scroll) Initialization
// ─────────────────────────────────────────────────────────────────────────────

function initAOS() {
  if (typeof AOS === 'undefined') {
    console.warn('⚠️ AOS library not loaded');
    return;
  }

  AOS.init({
    duration: 300,
    once: true,
    offset: 50
  });

  console.log('✅ AOS initialized');
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Sapphire Hero Grid Generator
// ─────────────────────────────────────────────────────────────────────────────

function initializeSapphireHeroGrid() {
  const sapphireGrid = document.getElementById('sapphireCorporateGrid');
  if (!sapphireGrid) {
    console.log('ℹ️ Sapphire hero grid container not found');
    return;
  }

  sapphireGrid.innerHTML = ''; // Clear existing content

  // Calculate grid size based on screen size
  let gridCols = 10;
  let gridRows = 10;

  if (window.innerWidth < 576) {
    gridCols = 5;
    gridRows = 6;
  } else if (window.innerWidth < 768) {
    gridCols = 6;
    gridRows = 8;
  } else if (window.innerWidth < 992) {
    gridCols = 8;
    gridRows = 9;
  }

  const totalCells = gridCols * gridRows;

  // Create grid cells with Sapphire-specific classes
  for (let i = 0; i < totalCells; i++) {
    const gridCell = document.createElement('div');
    gridCell.className = 'sapphire-grid-cell';

    // Add pulse element
    const gridPulse = document.createElement('div');
    gridPulse.className = 'sapphire-grid-pulse';

    // Add random delay for staggered animation
    const randomDelay = Math.random() * 2;
    gridCell.style.animationDelay = `${randomDelay}s`;
    gridPulse.style.animationDelay = `${randomDelay + 1}s`;

    gridCell.appendChild(gridPulse);
    sapphireGrid.appendChild(gridCell);
  }

  console.log(`✅ Sapphire hero grid initialized (${gridCols}x${gridRows} = ${totalCells} cells)`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Module Showcase — Tab + Panel System
// ─────────────────────────────────────────────────────────────────────────────

function initModuleShowcase() {
  const tabs      = document.querySelectorAll('.s-showcase-tab');
  const panels    = document.querySelectorAll('.s-showcase-panel');
  const showcase  = document.getElementById('module-showcase');
  const navEl     = document.getElementById('showcaseNav');

  if (!tabs.length || !panels.length) return;

  function activateModule(moduleId) {
    tabs.forEach(t => {
      const isActive = t.dataset.showcaseTarget === moduleId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach(p => {
      p.classList.toggle('active', p.id === `showcase-${moduleId}`);
    });

    // Scroll active tab into view within the horizontal scroller
    const activeTab = document.querySelector(`.s-showcase-tab[data-showcase-target="${moduleId}"]`);
    activeTab?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  // Tab bar clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateModule(tab.dataset.showcaseTarget));
  });

  // Card "Explore" buttons → scroll to showcase + activate module
  document.querySelectorAll('[data-showcase-target]').forEach(btn => {
    // Skip tabs themselves (they already have the click handler above)
    if (btn.classList.contains('s-showcase-tab')) return;

    btn.addEventListener('click', () => {
      activateModule(btn.dataset.showcaseTarget);
      const navOffset = navEl ? navEl.offsetHeight : 0;
      const top = showcase.getBoundingClientRect().top + window.scrollY - 64 - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  console.log('✅ Module Showcase initialized');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Industry Card Pill Rails — Infinite Scroll
// ─────────────────────────────────────────────────────────────────────────────

function initIndustryPillRails() {
  const rails = document.querySelectorAll('.s-cm-feature-subrail');
  if (!rails.length) {
    console.log('ℹ️ Industry pill rail containers not found');
    return;
  }

  let count = 0;
  rails.forEach((rail, i) => {
    rail.id = `industry-pill-rail-${i}`;
    const result = initInfiniteScroll(`#${rail.id}`, {
      direction: 'left',
      speed: 'normal',
      cloneMultiplier: 2
    });
    if (result) count++;
  });

  console.log(`✅ Industry pill rails initialized: ${count}/${rails.length}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initializeSapphireHeroGrid();
  initModuleShowcase();
  initSapphireCapabilityCards();
  initIndustryPillRails();

  // Reinitialize grid on window resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initializeSapphireHeroGrid();
    }, 250);
  }, { passive: true });

  console.log('✅ Sapphire page fully initialized');
});

// Remove loading class when page fully loads
window.addEventListener('load', () => {
  document.body.classList.remove('loading');
}, { passive: true });
