/**
 * Vanta Waves Background - Simple Version
 * Just set color, wave height, wave speed, and shininess
 */

// ── Load Vanta Scripts ───────────────────────────────────────
async function loadVanta() {
  if (window.VANTA?.WAVES) return true;
  
  const scripts = [
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js',
    'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js'
  ];
  
  for (const src of scripts) {
    if (!document.querySelector(`script[src="${src}"]`)) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  }
  return true;
}

// ── Color Helper ─────────────────────────────────────────────
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

// ── Preset Colors (Hue values) ───────────────────────────────
export const COLORS = {

  // ── Blues ──────────────────────────────────────────────────
  SAPPHIRE:   { start: 211, end: 228 },  // classic rich sapphire
  COBALT:     { start: 215, end: 232 },  // strong cobalt, punchy
  ROYAL:      { start: 225, end: 245 },  // royal blue → periwinkle
  MIDNIGHT:   { start: 232, end: 248 },  // near-navy, very dark premium
  ICE:        { start: 195, end: 210 },  // pale arctic blue, crisp

  // ── Teals & Cyans ──────────────────────────────────────────
  TEAL:       { start: 172, end: 195 },  // deep teal → cyan
  OCEAN:      { start: 185, end: 210 },  // open ocean
  LAGOON:     { start: 178, end: 198 },  // tropical shallow water

  // ── Purples & Violets ──────────────────────────────────────
  VIOLET:     { start: 255, end: 275 },  // pure violet band
  NEBULA:     { start: 265, end: 295 },  // deep space purple → magenta
  DUSK:       { start: 245, end: 272 },  // blue-indigo dusk sky
  AMETHYST:   { start: 275, end: 300 },  // gem purple, rich

  // ── Warm ───────────────────────────────────────────────────
  AMBER:      { start: 32,  end: 48  },  // golden amber, warm
  COPPER:     { start: 22,  end: 38  },  // copper-bronze
  SOLAR:      { start: 42,  end: 58  },  // golden yellow, sunlight
  EMBER:      { start: 8,   end: 25  },  // hot ember, near-red

  // ── Cross-spectrum (wide oscillating arcs) ─────────────────
  AURORA:     { start: 155, end: 210 },  // green-teal → blue, northern lights
  DAWNBREAK:  { start: 235, end: 32  },  // indigo → orange sunrise (descending)
  EMBER_SEA:  { start: 205, end: 38  },  // ocean blue → amber (descending)
  TWILIGHT:   { start: 225, end: 285 },  // deep blue → violet
  FOREST:     { start: 115, end: 148 },  // deep forest green band

  // ── Neutrals ───────────────────────────────────────────────
  STEEL:      { start: 205, end: 220 },  // desaturated blue-grey feel
  FROST:      { start: 192, end: 208 },  // cold white-blue, clean
};

// ── Wave Presets ─────────────────────────────────────────────
export const WAVES = {
  CALM:   { height: 10, speed: 0.75 },
  GENTLE: { height: 15, speed: 1.0  },
  ROLLING:{ height: 20, speed: 1.5  },
  STORM:  { height: 30, speed: 2.5  },
};

// ── Shine Presets ────────────────────────────────────────────
export const SHINE = {
  MATTE:  { shine: 20,  zoom: 0.85 },
  SOFT:   { shine: 40,  zoom: 0.80 },
  GLOSSY: { shine: 80,  zoom: 0.75 },
  MIRROR: { shine: 150, zoom: 0.70 },
};

// ── Main Init Function ───────────────────────────────────────
export async function initWaves(selector, options = {}) {
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!element) {
    console.error('Waves: Element not found');
    return null;
  }

  await loadVanta();

  const color = options.color || COLORS.COBALT;
  const wave = options.wave || WAVES.GENTLE;
  const shine = options.shine || SHINE.MIRROR;

  // Use override colors if provided, otherwise use preset color math
  const useOverrideColor = options.override?.color !== undefined;
  const useOverrideBgColor = options.override?.backgroundColor !== undefined;

  const effect = window.VANTA.WAVES({
    el: element,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200,
    minWidth: 200,
    color: useOverrideColor ? options.override.color : hslToHex(color.start, 80, 45),
    backgroundColor: useOverrideBgColor ? options.override.backgroundColor : hslToHex(color.start, 60, 6),
    waveHeight: wave.height,
    waveSpeed: wave.speed,
    shininess: shine.shine,
    zoom: shine.zoom,
    ...options.override
  });

  element.__vantaEffect = effect;
  console.log('✅ Waves initialized', { color, wave, shine });
  return effect;
}

// ── Cleanup ──────────────────────────────────────────────────
export function destroyWaves(effect) {
  if (effect?.destroy) effect.destroy();
}

export default {
  initWaves,
  destroyWaves,
  COLORS,
  WAVES,
  SHINE
};
