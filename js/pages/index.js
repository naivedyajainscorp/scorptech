import { initSmoothScroll } from '../components/NavigationManager.js';
import { initHeroNet, BANDWIDTH, PATTERN, HARMONY } from '../components/net_bg.js';

initHeroNet('#homeHero', {
  bandwidth: BANDWIDTH.ICE,
  pattern: PATTERN.OSCILLATE,
  harmony: HARMONY.ANALOGOUS
});
initSmoothScroll();
console.log('✅ Index page fully initialized');