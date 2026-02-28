/* ════════════════════════════════════════════════════════════════════════════
   INDEX (LANDING) PAGE INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */

// ── Import only what this page needs ──
import { initSmoothScroll } from '../components/NavigationManager.js';

console.log('🏠 Index page initialization started');

// ── Conditional carousel initialization ──
// Only loads the carousel module if carousels exist in the HTML
if (document.querySelector('[data-bs-ride="carousel"]')) {
  import('../components/CarouselHoverPause.js').then(module => {
    module.initCarouselHoverPause();
    console.log('✅ Carousel hover pause initialized');
  });
} else {
  console.log('ℹ️ No carousels found on this page, skipping carousel initialization');
}

// ── Initialize smooth scroll ──
initSmoothScroll();

console.log('✅ Index page fully initialized');
