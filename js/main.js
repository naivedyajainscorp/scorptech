/* ════════════════════════════════════════════════════════════════════════════
   SAPPHIRE MAIN ENGINE - UNIVERSAL INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */

import { SFloatingButton } from './components/SFloatingButton.js';
import { initNavigationManager } from './components/NavigationManager.js';
import { initCardTiltEffects } from './components/CardTiltEffects.js';
import { initInfiniteScroll } from './components/InfiniteScroll.js';
import { initWordSlider } from './components/WordSlider.js';
import { initAccordions } from './components/SAccordion.js';
import FloatingElementCard from './components/FloatingElementCard.js';
import { FormEnhancements } from './utils/form-enhancements.js';
import { initFooterManager } from './components/FooterManager.js';
import { initIntelligencePage } from './pages/intelligence.js';
import { initCardWatermarks } from './helpers/card_watermark.js';
import { initScrollTo } from './helpers/scroll_to.js';
import { initMarqueeLoops } from './helpers/marquee_continuity.js';


// ═════════════════════════════════════════════════════════════════════════════
// ✅ GLOBAL EVENT LISTENERS (Mouse proximity for scrollbar visibility)
// ═════════════════════════════════════════════════════════════════════════════
console.log('🔵 Main.js loaded - waiting for DOM...');
const SCROLLBAR_EDGE_THRESHOLD = 50;

document.addEventListener('mousemove', (e) => {
  // Check if mouse is near the right edge
  const nearEdge = e.clientX >= window.innerWidth - SCROLLBAR_EDGE_THRESHOLD;
  if (nearEdge) {
    document.documentElement.classList.add('scrollbar-visible');
  } else {
    document.documentElement.classList.remove('scrollbar-visible'); 
  }
});
// Hide if mouse leaves window
document.addEventListener('mouseleave', () => {
  document.documentElement.classList.remove('scrollbar-visible');
});
// ═════════════════════════════════════════════════════════════════════════════
// ✅ SINGLE DOMContentLoaded INITIALIZATION
// ═════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM ready - initializing universal components');
  // ─────────────────────────────────────────────────────────────────────────────
  // FORM ENHANCEMENTS (Universal - dropdowns, validation, etc.)
  // ─────────────────────────────────────────────────────────────────────────────
  FormEnhancements.init();
  initFooterManager();
  console.log('✅ Form Enhancements and Footer initialized');
  // ─────────────────────────────────────────────────────────────────────────────
  // FLOATING ACTION BUTTON (Universal - appears on all pages)
  // ─────────────────────────────────────────────────────────────────────────────
  if (document.querySelector('.s-fab-trigger')) {
    const fab = new SFloatingButton();
    console.log('✅ Floating Action Button initialized');
  }
  // ─────────────────────────────────────────────────────────────────────────────
  // NAVIGATION MANAGER (Universal - active state handling)
  // ─────────────────────────────────────────────────────────────────────────────
  initNavigationManager();
  // ─────────────────────────────────────────────────────────────────────────────
  // CARD TILT EFFECTS (Universal - applies to any card with data-tilt)
  // ─────────────────────────────────────────────────────────────────────────────
  initCardTiltEffects();
  // ─────────────────────────────────────────────────────────────────────────────
  // WORD ROTATOR (Universal - auto-detects data-word-rotator)
  // ─────────────────────────────────────────────────────────────────────────────
  initWordSlider();
  // ─────────────────────────────────────────────────────────────────────────────
  // S-ACCORDION SYSTEM - ✅ INITIALIZED ONCE HERE
  // ─────────────────────────────────────────────────────────────────────────────
  initAccordions();
  // ─────────────────────────────────────────────────────────────────────────────
  // CARD WATERMARKS (Universal - auto-detects s-card-watermark & s-pic-card-watermark)
  // ─────────────────────────────────────────────────────────────────────────────
  initCardWatermarks();
  console.log('✅ Card Watermarks initialized');
  // ─────────────────────────────────────────────────────────────────────────────
  // scrollTo Helper (Universal - auto-detects data-scroll-to attributes)
  // ─────────────────────────────────────────────────────────────────────────────
  initScrollTo();
  console.log('✅ Scroll-To initialized');
  // ─────────────────────────────────────────────────────────────────────────────
  // scrollTo Helper (Universal - auto-detects data-scroll-to attributes)
  // ─────────────────────────────────────────────────────────────────────────────
  initMarqueeLoops();
  console.log('✅ Marquee Loops initialized');
  // ─────────────────────────────────────────────────────────────────────────────
  // FLOATING ELEMENT CARD (Universal - cards with floating icon animations)
  // ─────────────────────────────────────────────────────────────────────────────
  if (document.querySelector('.philosophy-card-floating')) {
    const floatingCards = new FloatingElementCard();
    console.log('✅ Floating Element Cards initialized');
  }
  // ─────────────────────────────────────────────────────────────────────────────
  // PILLS RAIL (Universal - appears on analytics and other pages)
  // ─────────────────────────────────────────────────────────────────────────────
  const pillRail = document.querySelector('.pill-rail');
  if (pillRail) {
    initInfiniteScroll('.pill-rail', {
      speed: 5.5,
      direction: 'left',
      pauseOnHover: true
    });
    console.log('✅ Pills Rail initialized');
  }
  console.log('✅ All universal components initialized');

  
  // ─────────────────────────────────────────────────────────────────────────────
  // INTELLIGENCE PAGE INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────────
  if (document.getElementById('masterRingCanvas')) {
    initIntelligencePage();
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// EXPOSE REFRESH FUNCTIONS FOR DYNAMIC CONTENT
// ⚠️ These are safe because SAccordion.js uses idempotent initialization
// ─────────────────────────────────────────────────────────────────────────────

window.refreshForms = function () {
  FormEnhancements.refresh?.();
  console.log('🔄 Form Enhancements refreshed');
};

// ✅ Safe to call - won't double-bind thanks to dataset flag
window.refreshAccordions = function () {
  initAccordions();
  console.log('🔄 Accordions refreshed');
};

// ✅ Refresh Floating Element Cards dynamically
window.refreshFloatingCards = function () {
  if (document.querySelector('.philosophy-card-floating')) {
    window.floatingElementCard = new FloatingElementCard();
    console.log('🔄 Floating Element Cards refreshed');
  }
};
// ─────────────────────────────────────────────────────────────────────────────
// CLEANUP ON PAGE UNLOAD
// ─────────────────────────────────────────────────────────────────────────────

window.addEventListener('beforeunload', () => {
  console.log('🧹 Cleaning up...');
}, { passive: true });