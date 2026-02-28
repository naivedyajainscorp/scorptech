/* ════════════════════════════════════════════════════════════════════════════
   MOBILE USP PAGE INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */

import { initMobilePhoneTilt } from '../components/MobilePhoneTilt.js';
import { initCarouselHoverPause } from '../components/CarouselHoverPause.js';

console.log('📱 Mobile USP page initialization started');

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔵 Mobile USP page DOMContentLoaded');

  // Initialize 3D phone tilt parallax (FIXED: was initMobileParallax)
  initMobilePhoneTilt();

  // Initialize carousel hover pause
  initCarouselHoverPause();

  console.log('🎉 Mobile USP page fully initialized');
});
