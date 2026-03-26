/* ════════════════════════════════════════════════════════════════════════════
   INDEX (LANDING) PAGE INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */

// ── Import only what this page needs ──
import { initSmoothScroll } from '../components/NavigationManager.js';
import { initNetBackgroundWithVideoHide } from '../components/net_bg.js';

console.log('🏠 Index page initialization started');

// ── Initialize Vanta Net Background on Hero Section ──
initNetBackgroundWithVideoHide('#homeHero', '.hero-video-bg', {
  color: 0x0066cc,
  backgroundColor: 0x000000,
  points: 15,
  maxDistance: 20,
  spacing: 15
}).then(effect => {
  if (effect) {
    console.log('✅ Vanta Net background initialized on hero section');
  } else {
    console.warn('⚠️ Vanta Net background initialization failed, falling back to video');
  }
}).catch(error => {
  console.error('❌ Error initializing Vanta Net background:', error);
});

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
