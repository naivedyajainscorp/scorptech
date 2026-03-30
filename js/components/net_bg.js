/**
 * Vanta.js Net Background Component
 * Axes: BANDWIDTH + PATTERN + HARMONY (+ optional SPEED)
 */

// ── CDN Loader ───────────────────────────────────────────────
function loadScript(src, attributes = {}) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const script = document.createElement('script');
    script.src = src;
    Object.keys(attributes).forEach(k => script.setAttribute(k, attributes[k]));
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

// ── Color Math ───────────────────────────────────────────────
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c);
  };
  return (f(0) << 16) | (f(8) << 8) | f(4);
}

// ── Responsive Density ───────────────────────────────────────
function lerp(minW, maxW, minVal, maxVal) {
  const t = Math.min(1, Math.max(0, (window.innerWidth - minW) / (maxW - minW)));
  return minVal + (maxVal - minVal) * t;
}

function getNetConfig(hue, harmonyFn, style = {}) {
  const spacing = Math.round(lerp(320, 1920, 20, 15));
  const netHue = harmonyFn ? harmonyFn(hue) : (hue + 30) % 360;
  const netSat  = style.netSat  ?? 100;
  const netLit  = style.netLit  ?? 55;
  const bgSat   = style.bgSat   ?? 60;
  const bgLit   = style.bgLit   ?? 8;

  return {
    points:          Math.round(lerp(320, 1920, 12, 15)),
    spacing:         spacing,
    maxDistance:     20,
    color:           hslToHex(netHue, netSat, netLit),
    backgroundColor: hslToHex(hue, bgSat, bgLit),
  };
}

// ── AXIS 1: BANDWIDTH ────────────────────────────────────────
export const BANDWIDTH = {
  ALL:    { startHue: 0,   endHue: 360 },
  COLD:   { startHue: 180, endHue: 240 },
  OCEAN:  { startHue: 185, endHue: 220 },
  ICE:    { startHue: 190, endHue: 210 },
  WARM:   { startHue: 0,   endHue: 60 },
  EMBER:  { startHue: 0,   endHue: 30 },
  AMBER:  { startHue: 30,  endHue: 60 },
  FOREST: { startHue: 100, endHue: 150 },
  PURPLE: { startHue: 240, endHue: 300 },
  NEBULA: { startHue: 260, endHue: 320 },
};

// ── AXIS 2: PATTERN ──────────────────────────────────────────
export const PATTERN = {
  LOOP:        'LOOP',
  OSCILLATE:   'OSCILLATE',
  BOUNCE_EASE: 'BOUNCE_EASE',
};

// ── AXIS 3: HARMONY ──────────────────────────────────────────
export const HARMONY = {
  ANALOGOUS:      (h) => (h + 30) % 360,
  ANALOGOUS_SOFT: (h) => (h + 20) % 360,
  COMPLEMENTARY:  (h) => (h + 180) % 360,
  SPLIT:          (h) => (h + 150) % 360,
  TRIADIC:        (h) => (h + 120) % 360,
  MONO:           (h) => h,
};

// ── AXIS 4: STYLE (net brightness + background lightness) ────
export const STYLE = {
  // ── Existing ──────────────────────────────────────────────
  DEFAULT:          { netSat: 100, netLit: 55,  bgSat: 60,  bgLit: 8  },
  WHITE_ON_BLUE:    { netSat: 0,   netLit: 92,  bgSat: 75,  bgLit: 32 },
  WHITE_ON_COBALT:  { netSat: 5,   netLit: 90,  bgSat: 80,  bgLit: 28 },
  WHITE_ON_ROYAL:   { netSat: 0,   netLit: 95,  bgSat: 70,  bgLit: 36 },
  WHITE_ON_TEAL:    { netSat: 5,   netLit: 88,  bgSat: 65,  bgLit: 30 },
  SILVER_ON_BLUE:   { netSat: 20,  netLit: 82,  bgSat: 72,  bgLit: 30 },

  // ── Blue nets on dark bg ──────────────────────────────────
  BRILLIANT_BLUE:   { netSat: 100, netLit: 60,  bgSat: 80,  bgLit: 5  },  // electric pure blue net
  SAPPHIRE:         { netSat: 95,  netLit: 45,  bgSat: 70,  bgLit: 6  },  // #0066cc range, rich deep
  DEEP_BLUE:        { netSat: 90,  netLit: 35,  bgSat: 75,  bgLit: 4  },  // near-navy net, very dark
  COBALT_NET:       { netSat: 100, netLit: 50,  bgSat: 85,  bgLit: 7  },  // strong cobalt
  ROYAL_NET:        { netSat: 88,  netLit: 55,  bgSat: 72,  bgLit: 8  },  // royal blue, slightly purple
  ICE_BLUE:         { netSat: 70,  netLit: 72,  bgSat: 60,  bgLit: 6  },  // pale icy blue net
  NEON_BLUE:        { netSat: 100, netLit: 65,  bgSat: 90,  bgLit: 4  },  // almost glowing blue
  STEEL_BLUE:       { netSat: 50,  netLit: 48,  bgSat: 40,  bgLit: 8  },  // muted steel blue net

  // ── Colored nets on soft white bg ────────────────────────
  BLUE_ON_WHITE:    { netSat: 100, netLit: 45,  bgSat: 20,  bgLit: 88 },  // rich blue net, off-white bg
  COBALT_ON_WHITE:  { netSat: 95,  netLit: 40,  bgSat: 15,  bgLit: 90 },  // cobalt net, warm white bg
  SAPPHIRE_ON_WHITE:{ netSat: 90,  netLit: 38,  bgSat: 25,  bgLit: 86 },  // sapphire net, cool white bg
  ROYAL_ON_WHITE:   { netSat: 85,  netLit: 50,  bgSat: 18,  bgLit: 88 },  // royal blue net, neutral white
  TEAL_ON_WHITE:    { netSat: 80,  netLit: 42,  bgSat: 20,  bgLit: 87 },  // teal net, soft white bg
  VIOLET_ON_WHITE:  { netSat: 85,  netLit: 50,  bgSat: 15,  bgLit: 89 },  // violet net, bright white bg
  NAVY_ON_WHITE:    { netSat: 90,  netLit: 30,  bgSat: 10,  bgLit: 91 },  // dark navy net, very soft white

  // ── Legacy aliases ────────────────────────────────────────
  DIM:              { netSat: 60,  netLit: 40,  bgSat: 50,  bgLit: 6  },   // Moody, subtle
  VIVID:            { netSat: 100, netLit: 60,  bgSat: 80,  bgLit: 10 },   // Bright, punchy
  GLOW:             { netSat: 95,  netLit: 70,  bgSat: 70,  bgLit: 5  },   // Near-neon intensity
};

// ── Optional SPEED ───────────────────────────────────────────
export const SPEED = {
  VERY_SLOW: 2,
  SLOW:      3,
  MEDIUM:    5,
  FAST:      8,
};

// ── Core Init ────────────────────────────────────────────────
export async function initNetBackground(selector, options = {}) {
  try {
    const element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!element) return null;

    const config = {
      el: element,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      ...options
    };

    if (typeof window.VANTA === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js');
    }

    if (window.VANTA && window.VANTA.NET) {
      const effect = window.VANTA.NET(config);
      // Store on element for diagnostic access (Vanta 0.5.x doesn't do this automatically)
      element.__vantaEffect = effect;
      return effect;
    }

    return null;

  } catch (error) {
    console.error('[VantaNet] Init failed:', error);
    return null;
  }
}

// ── Hero Engine ──────────────────────────────────────────────
export async function initHeroNet(selector, config = {}) {

  const bandwidth = config.bandwidth || BANDWIDTH.ALL;
  const pattern   = config.pattern   || PATTERN.OSCILLATE;
  const harmony   = config.harmony   || HARMONY.ANALOGOUS;
  const speed     = config.speed     || SPEED.MEDIUM;
  const style     = config.style     || STYLE.DEFAULT;

  const startHue = bandwidth.startHue;
  const endHue   = bandwidth.endHue;
  const range    = endHue - startHue;

  let currentHue = startHue;
  let direction  = 1;
  let phase      = 0;
  let lastTime   = null;

  let vantaEffect = await initNetBackground(selector, getNetConfig(currentHue, harmony, style));
  if (!vantaEffect) return null;

  function tick(timestamp) {
    if (!vantaEffect) return;

    if (!lastTime) lastTime = timestamp;
    const delta = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    switch (pattern) {

      case 'LOOP':
        currentHue += speed * delta;
        if (currentHue >= endHue) currentHue = startHue;
        break;

      case 'OSCILLATE':
        currentHue += speed * delta * direction;
        if (currentHue >= endHue) { currentHue = endHue; direction = -1; }
        if (currentHue <= startHue) { currentHue = startHue; direction = 1; }
        break;

      case 'BOUNCE_EASE':
        phase += (speed * Math.PI / range) * delta;
        currentHue = startHue + range * (0.5 - 0.5 * Math.cos(phase));
        break;
    }

    vantaEffect.setOptions(getNetConfig(currentHue, harmony, style));

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // ── Resize ───────────────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (vantaEffect) {
        vantaEffect.setOptions(getNetConfig(currentHue, harmony, style));
      }
    }, 300);
  });

  return vantaEffect;
}

// ── Utilities ────────────────────────────────────────────────
export function destroyNetBackground(vantaInstance) {
  if (vantaInstance?.destroy) vantaInstance.destroy();
}

export default {
  initHeroNet,
  initNetBackground,
  destroyNetBackground,
  BANDWIDTH,
  PATTERN,
  HARMONY,
  STYLE,
  SPEED
};