/* ════════════════════════════════════════════════════════════════════════════
   SAPPHIRE PAGE INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */

console.log('💎 Sapphire page initialization started');

/* ════════════════════════════════════════════════════════════════════════════
   Fog Background Initialization
   ═════════════════════════════════════════════════════════════════════════════ */

import { initBackground } from '../components/fog_bg.js';

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
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initializeSapphireHeroGrid();
  initModuleShowcase();

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
