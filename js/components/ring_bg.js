/**
 * Vanta.js Rings Background Component
 * Axes: PALETTE + SPIN + DEPTH + RING + SPEED
 * 
 * Usage:
 *   import { initRings, PALETTE, SPIN, BG, RING, SPEED } from './ring_bg.js';
 *   
 *   initRings('#hero-section', {
 *     palette: PALETTE.SAPPHIRE,
 *     spin:    SPIN.DRIFT,
 *     bg:      BG.VOID,
 *     ring:    RING.VIVID,
 *     speed:   SPEED.MEDIUM
 *   });
 */

// ── CDN Loader ───────────────────────────────────────────────
async function loadVanta() {
  // Check if already loaded
  if (window.VANTA?.RINGS) {
    console.log('[Rings] Vanta already loaded');
    return true;
  }

  const scripts = [
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js',
    'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.rings.min.js'
  ];

  for (const src of scripts) {
    // Skip if already exists
    if (document.querySelector(`script[src="${src}"]`)) {
      continue;
    }

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log(`[Rings] Loaded: ${src}`);
        resolve();
      };
      script.onerror = () => {
        console.error(`[Rings] Failed to load: ${src}`);
        reject(new Error(`Failed to load ${src}`));
      };
      document.head.appendChild(script);
    });
  }

  return true;
}

// ── Color Math ───────────────────────────────────────────────
function hslToHex(h, s, l) {
  s /= 100; 
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c);
  };
  return (f(0) << 16) | (f(8) << 8) | f(4);
}

// Convert hex to HSL for manipulation
function hexToHsl(hex) {
  const r = ((hex >> 16) & 255) / 255;
  const g = ((hex >> 8) & 255) / 255;
  const b = (hex & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

// ── AXIS 1: PALETTE (hue range for ring color oscillation) ───
export const PALETTE = {
  // Blues
  SAPPHIRE:   { start: 211, end: 228 },
  COBALT:     { start: 215, end: 232 },
  ROYAL:      { start: 225, end: 245 },
  MIDNIGHT:   { start: 232, end: 248 },
  ICE:        { start: 195, end: 210 },

  // Teals
  OCEAN:      { start: 185, end: 210 },
  TEAL:       { start: 172, end: 195 },
  LAGOON:     { start: 178, end: 198 },

  // Purples
  VIOLET:     { start: 255, end: 275 },
  NEBULA:     { start: 265, end: 295 },
  DUSK:       { start: 245, end: 272 },
  AMETHYST:   { start: 275, end: 300 },

  // Warm
  AMBER:      { start: 32,  end: 48  },
  COPPER:     { start: 22,  end: 38  },
  SOLAR:      { start: 42,  end: 58  },
  EMBER:      { start: 8,   end: 25  },

  // Cross-spectrum
  AURORA:     { start: 155, end: 210 },
  DAWNBREAK:  { start: 235, end: 32  },
  EMBER_SEA:  { start: 205, end: 38  },
  TWILIGHT:   { start: 225, end: 285 },
  FOREST:     { start: 115, end: 148 },

  // Neutrals
  STEEL:      { start: 205, end: 220 },
  FROST:      { start: 192, end: 208 },
};

// ── AXIS 2: SPIN (ring rotation speed - NOTE: Vanta RINGS doesn't support this natively) ──
// This parameter is kept for API consistency but doesn't affect Vanta's internal animation
// The visual motion you see is from Vanta's fixed internal animation
export const SPIN = {
  STILL:   0.5,   // minimal motion effect
  SLOW:    1.0,   // meditative
  DRIFT:   2.0,   // default, elegant
  TURN:    3.5,   // noticeable motion
  FAST:    5.0,   // energetic
};

// ── AXIS 3: DEPTH (background darkness) ──────────────────────
export const BG = {
  VOID:    { sat: 80, lit: 3  },  // near-black, maximum ring contrast
  DEEP:    { sat: 70, lit: 6  },  // default dark
  RICH:    { sat: 60, lit: 10 },  // slightly lighter, still premium
  SURFACE: { sat: 50, lit: 16 },  // lighter bg, softer rings
};

// ── AXIS 4: RING BRIGHTNESS ───────────────────────────────────
export const RING = {
  DIM:     { sat: 60, lit: 35 },  // moody, barely lit
  NORMAL:  { sat: 80, lit: 45 },  // solid, visible
  VIVID:   { sat: 90, lit: 55 },  // bright and punchy
  GLOW:    { sat: 95, lit: 65 },  // near-neon intensity
};

// ── AXIS 5: SPEED (hue cycle rate - how fast colors oscillate) ─
export const SPEED = {
  VERY_SLOW: 1,
  SLOW:      2,
  MEDIUM:    4,
  FAST:      7,
  VERY_FAST: 10,
};

// ── Main Init ─────────────────────────────────────────────────
export async function initRings(selector, options = {}) {
  console.log('[Rings] initRings called with:', selector, options);

  // Resolve element
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!element) {
    console.error('[Rings] ❌ Element not found:', selector);
    console.error('[Rings] Make sure the element exists in the DOM before calling initRings');
    console.error('[Rings] If using in a module, wrap in DOMContentLoaded or call after page load');
    return null;
  }

  console.log('[Rings] ✅ Element found:', element);

  // Load Vanta
  try {
    await loadVanta();
  } catch (err) {
    console.error('[Rings] ❌ Failed to load Vanta:', err);
    return null;
  }

  if (!window.VANTA?.RINGS) {
    console.error('[Rings] ❌ VANTA.RINGS not available after loading scripts');
    return null;
  }

  // Extract options with defaults
  const palette = options.palette || PALETTE.COBALT;
  const spin    = options.spin    || SPIN.DRIFT;
  const bg      = options.bg      || BG.DEEP;
  const ring    = options.ring    || RING.NORMAL;
  const speed   = options.speed   || SPEED.MEDIUM;

  console.log('[Rings] Config:', { palette, spin, bg, ring, speed });

  // Calculate hue range
  const startHue = palette.start;
  const endHue   = palette.end;
  const lo       = Math.min(startHue, endHue);
  const hi       = Math.max(startHue, endHue);

  let currentHue = startHue;
  let direction  = endHue > startHue ? 1 : -1;
  let lastTime   = null;
  let animationFrameId = null;

  // Initial colors
  const initialColor = hslToHex(currentHue, ring.sat, ring.lit);
  const initialBgColor = hslToHex(currentHue, bg.sat, bg.lit);

  console.log('[Rings] Initial color:', `#${initialColor.toString(16).padStart(6, '0')}`);
  console.log('[Rings] Initial bg:', `#${initialBgColor.toString(16).padStart(6, '0')}`);

  // Create Vanta effect
  const effect = window.VANTA.RINGS({
    el: element,
    mouseControls: true,
    touchControls: true,
    gyroControls:  false,
    minHeight: 200,
    minWidth:  200,
    scale: 1.0,
    scaleMobile: 1.0,
    color:           initialColor,
    backgroundColor: initialBgColor,
    backgroundAlpha: 1.0,
    // Allow overrides
    ...options.override
  });

  if (!effect) {
    console.error('[Rings] ❌ VANTA.RINGS returned null');
    return null;
  }

  console.log('[Rings] ✅ Vanta effect created:', effect);
  console.log('[Rings] Effect options:', effect.options);

  // Store effect on element for later access
  element.__ringsEffect = effect;

  // Diagnostic helper
  console.log('[Rings] Access effect via: document.querySelector("%s").__ringsEffect', selector);

  // ── Hue Tick Loop (color oscillation) ─────────────────────
  // Find the ring mesh for direct material manipulation
  const ringMesh = effect.mesh 
    || effect.scene?.children?.find(c => c.isMesh)
    || effect.scene?.children?.find(c => c.type === 'Mesh');

  console.log('[Rings] Ring mesh:', ringMesh);

  function tick(timestamp) {
    if (!effect || !element.__ringsEffect) {
      console.log('[Rings] Tick stopped - effect destroyed');
      return;
    }

    if (!lastTime) lastTime = timestamp;
    const delta = Math.min((timestamp - lastTime) / 1000, 0.1); // Cap at 100ms
    lastTime = timestamp;

    // Oscillate hue between lo and hi
    currentHue += speed * delta * direction;
    if (currentHue >= hi) { 
      currentHue = hi; 
      direction = -1; 
    }
    if (currentHue <= lo) { 
      currentHue = lo; 
      direction = 1; 
    }

    // Update colors
    const newColor = hslToHex(currentHue, ring.sat, ring.lit);
    const newBgColor = hslToHex(currentHue, bg.sat, bg.lit);

    // Direct material manipulation (setOptions doesn't work for RINGS)
    if (ringMesh?.material) {
      ringMesh.material.color.setHex(newColor);
      ringMesh.material.needsUpdate = true;
      console.log('[Rings] Color updated:', `#${newColor.toString(16).padStart(6, '0')}`);
    }

    // Background via setOptions (may work)
    effect.setOptions({ backgroundColor: newBgColor });

    // Continue loop
    animationFrameId = requestAnimationFrame(tick);
  }

  // Start the hue oscillation loop
  console.log('[Rings] 🚀 Starting hue oscillation loop with speed:', speed);
  animationFrameId = requestAnimationFrame(tick);

  // ── Resize Handler ─────────────────────────────────────────
  let resizeTimer;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (effect && element.__ringsEffect) {
        effect.resize();
        console.log('[Rings] Resized');
      }
    }, 300);
  };

  window.addEventListener('resize', handleResize);

  // Store cleanup info
  element.__ringsCleanup = () => {
    console.log('[Rings] Cleanup called');
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    clearTimeout(resizeTimer);
    window.removeEventListener('resize', handleResize);
    if (effect?.destroy) {
      effect.destroy();
      console.log('[Rings] Vanta effect destroyed');
    }
    element.__ringsEffect = null;
    element.__ringsCleanup = null;
  };

  console.log('[Rings] ✅ Rings initialized successfully', { 
    palette: { start: palette.start, end: palette.end },
    spin,
    bg: { sat: bg.sat, lit: bg.lit },
    ring: { sat: ring.sat, lit: ring.lit },
    speed
  });

  return effect;
}

// ── Cleanup ───────────────────────────────────────────────────
export function destroyRings(selector) {
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!element) {
    console.warn('[Rings] Element not found for destroy:', selector);
    return false;
  }

  if (element.__ringsCleanup) {
    element.__ringsCleanup();
    console.log('[Rings] ✅ Rings destroyed');
    return true;
  }

  console.warn('[Rings] No cleanup function found, effect may not exist');
  return false;
}

// ── Runtime Reconfiguration ───────────────────────────────────
export function updateRings(selector, newOptions = {}) {
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  const effect = element?.__ringsEffect;

  if (!effect) {
    console.error('[Rings] No active effect found for update');
    return false;
  }

  console.log('[Rings] Updating options:', newOptions);

  const updates = {};

  if (newOptions.ring) {
    const palette = newOptions.palette || PALETTE.COBALT;
    const currentHue = palette.start;
    updates.color = hslToHex(currentHue, newOptions.ring.sat, newOptions.ring.lit);
  }

  if (newOptions.bg) {
    const palette = newOptions.palette || PALETTE.COBALT;
    const currentHue = palette.start;
    updates.backgroundColor = hslToHex(currentHue, newOptions.bg.sat, newOptions.bg.lit);
  }

  if (Object.keys(updates).length > 0) {
    effect.setOptions(updates);
    console.log('[Rings] ✅ Options updated:', updates);
    return true;
  }

  return false;
}

// ── Default Export ────────────────────────────────────────────
export default {
  initRings,
  destroyRings,
  updateRings,
  PALETTE,
  SPIN,
  BG,
  RING,
  SPEED
};
