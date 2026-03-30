/**
 * Vanta.js Fog Background Component
 * Clean implementation with TONE + MOOD axes and BLUR + PACE + ZOOM overrides
 */

// ── AXIS 1: TONE (color family) ───────────────────────────────
export const TONE = {
  WHITE:  'WHITE',
  BLUE:   'BLUE',
  PURPLE: 'PURPLE',
  WARM:   'WARM',
  MIXED:  'MIXED',
};

// ── AXIS 2: MOOD (preset within tone) ────────────────────────
export const MOOD = {
  // WHITE tones
  PEARL: 'PEARL', MIST: 'MIST', CLOUD: 'CLOUD', BREATH: 'BREATH', FROST: 'FROST',
  IMAGE_MATCH: 'IMAGE_MATCH', SUBTLEBLUE: 'SUBTLEBLUE', GHOSTWHITE: 'GHOSTWHITE',
  PALEMIST: 'PALEMIST', SOFTBREATH: 'SOFTBREATH',
  DEEP_OCEAN: 'DEEP_OCEAN', NAVY_MIST: 'NAVY_MIST', COBALT_FOG: 'COBALT_FOG',
  CHARCOAL: 'CHARCOAL', SLATE: 'SLATE', ASH: 'ASH',
  NEON_BLUE: 'NEON_BLUE', CYAN_GLOW: 'CYAN_GLOW', ELECTRIC: 'ELECTRIC',
  PURE_MIST: 'PURE_MIST', SOFT_CLOUD: 'SOFT_CLOUD',
  // BLUE tones
  SAPPHIRE: 'SAPPHIRE', COBALT: 'COBALT', OCEAN: 'OCEAN', ICE: 'ICE', MIDNIGHT: 'MIDNIGHT',
  // PURPLE tones
  NEBULA: 'NEBULA', DUSK: 'DUSK', AMETHYST: 'AMETHYST',
  // WARM tones
  AMBER: 'AMBER', EMBER: 'EMBER', COPPER: 'COPPER', SOLAR: 'SOLAR',
  // MIXED tones
  AURORA: 'AURORA', DAWNBREAK: 'DAWNBREAK', TWILIGHT: 'TWILIGHT',
  EMBER_SEA: 'EMBER_SEA', FOREST: 'FOREST',
};

// ── AXIS 3: BLUR (fog density) ────────────────────────────────
export const BLUR = {
  SHARP:  0.3,
  SOFT:   0.55,
  MEDIUM: 0.65,
  HEAVY:  0.78,
  DENSE:  0.9,
};

// ── AXIS 4: PACE (animation speed) ───────────────────────────
export const PACE = {
  STILL:  0.3,
  SLOW:   0.7,
  MEDIUM: 1.2,
  FAST:   2.0,
  STORM:  3.5,
};

// ── AXIS 5: ZOOM ──────────────────────────────────────────────
export const ZOOM = {
  CLOSE:  0.6,
  NEAR:   0.75,
  NORMAL: 0.85,
  FAR:    1.0,
  WIDE:   1.2,
};

// ── Preset Library ────────────────────────────────────────────
// Presets contain ONLY color values
// blurFactor, speed, zoom are set by caller via options
const PRESETS = {
  WHITE: {
    PEARL:      { highlightColor: 0xffffff, midtoneColor: 0xe8f0ff, lowlightColor: 0xb8c8dd, baseColor: 0x8899aa },
    MIST:       { highlightColor: 0xffffff, midtoneColor: 0xd8e8ff, lowlightColor: 0x9aa0cc, baseColor: 0x778899 },
    CLOUD:      { highlightColor: 0xffffff, midtoneColor: 0xe0e8ff, lowlightColor: 0xa8b0ee, baseColor: 0x667788 },
    BREATH:     { highlightColor: 0xffffff, midtoneColor: 0xc8d8ff, lowlightColor: 0x8899cc, baseColor: 0x556677 },
    FROST:      { highlightColor: 0xf8fcff, midtoneColor: 0xc8d8ff, lowlightColor: 0x8098bb, baseColor: 0x445566 },
    IMAGE_MATCH:  { highlightColor: 0xffffff, midtoneColor: 0xf8fbff, lowlightColor: 0xd8e4f0, baseColor: 0x7a8899 },
    SUBTLEBLUE:   { highlightColor: 0xffffff, midtoneColor: 0xf7fbff, lowlightColor: 0xdce6ed, baseColor: 0x6b7a88 },
    GHOSTWHITE:   { highlightColor: 0xffffff, midtoneColor: 0xf9fcff, lowlightColor: 0xdde8f0, baseColor: 0x728088 },
    PALEMIST:     { highlightColor: 0xffffff, midtoneColor: 0xf8faff, lowlightColor: 0xdce5ef, baseColor: 0x6f7d8a },
    SOFTBREATH:   { highlightColor: 0xffffff, midtoneColor: 0xfafcff, lowlightColor: 0xdfe8f0, baseColor: 0x748288 },
    DEEP_OCEAN:   { highlightColor: 0xffffff, midtoneColor: 0xccddee, lowlightColor: 0x88aacc, baseColor: 0x446688 },
    NAVY_MIST:    { highlightColor: 0xffffff, midtoneColor: 0xcce0ff, lowlightColor: 0x88bbdd, baseColor: 0x334466 },
    COBALT_FOG:   { highlightColor: 0xffffff, midtoneColor: 0xc8d8ff, lowlightColor: 0x99bbff, baseColor: 0x557799 },
    CHARCOAL:     { highlightColor: 0xffffff, midtoneColor: 0xdddddd, lowlightColor: 0xbbbbbb, baseColor: 0x666666 },
    SLATE:        { highlightColor: 0xffffff, midtoneColor: 0xe0e0e0, lowlightColor: 0xb8b8b8, baseColor: 0x707070 },
    ASH:          { highlightColor: 0xffffff, midtoneColor: 0xd8d8d8, lowlightColor: 0xaaaaaa, baseColor: 0x555555 },
    NEON_BLUE:    { highlightColor: 0xffffff, midtoneColor: 0xe8f4ff, lowlightColor: 0x88ddff, baseColor: 0x4488cc },
    CYAN_GLOW:    { highlightColor: 0xffffff, midtoneColor: 0xdff0ff, lowlightColor: 0x66ccff, baseColor: 0x2299bb },
    ELECTRIC:     { highlightColor: 0xffffff, midtoneColor: 0xe0ecff, lowlightColor: 0x44aaff, baseColor: 0x0066dd },
    PURE_MIST:    { highlightColor: 0xffffff, midtoneColor: 0xf0f4f8, lowlightColor: 0xc0d0e0, baseColor: 0x788890 },
    SOFT_CLOUD:   { highlightColor: 0xffffff, midtoneColor: 0xeff4f8, lowlightColor: 0xb8c8d8, baseColor: 0x708088 },
  },
  BLUE: {
    SAPPHIRE: { highlightColor: 0x4488ff, midtoneColor: 0x2255cc, lowlightColor: 0x112288, baseColor: 0x0a1a4a },
    COBALT:   { highlightColor: 0x55aaff, midtoneColor: 0x2266dd, lowlightColor: 0x0033aa, baseColor: 0x081530 },
    OCEAN:    { highlightColor: 0x33ccff, midtoneColor: 0x0099cc, lowlightColor: 0x005588, baseColor: 0x021020 },
    ICE:      { highlightColor: 0xaaddff, midtoneColor: 0x66aadd, lowlightColor: 0x3377bb, baseColor: 0x102030 },
    MIDNIGHT: { highlightColor: 0x3355cc, midtoneColor: 0x112299, lowlightColor: 0x050f44, baseColor: 0x020510 },
  },
  PURPLE: {
    NEBULA:   { highlightColor: 0xaa44ff, midtoneColor: 0x6611cc, lowlightColor: 0x330088, baseColor: 0x0a0520 },
    DUSK:     { highlightColor: 0x8866ff, midtoneColor: 0x4433bb, lowlightColor: 0x221177, baseColor: 0x080318 },
    AMETHYST: { highlightColor: 0xcc77ff, midtoneColor: 0x9944cc, lowlightColor: 0x550099, baseColor: 0x100520 },
  },
  WARM: {
    AMBER:    { highlightColor: 0xffcc44, midtoneColor: 0xff8800, lowlightColor: 0xcc4400, baseColor: 0x1a0800 },
    EMBER:    { highlightColor: 0xff6633, midtoneColor: 0xcc2200, lowlightColor: 0x880800, baseColor: 0x100200 },
    COPPER:   { highlightColor: 0xff9944, midtoneColor: 0xcc5511, lowlightColor: 0x882200, baseColor: 0x140800 },
    SOLAR:    { highlightColor: 0xffee55, midtoneColor: 0xffaa00, lowlightColor: 0xcc6600, baseColor: 0x180e00 },
  },
  MIXED: {
    AURORA:    { highlightColor: 0x44ffcc, midtoneColor: 0x0099aa, lowlightColor: 0x334499, baseColor: 0x020d15 },
    DAWNBREAK: { highlightColor: 0xff9944, midtoneColor: 0xcc4488, lowlightColor: 0x3322aa, baseColor: 0x080510 },
    TWILIGHT:  { highlightColor: 0x8844ff, midtoneColor: 0x4422cc, lowlightColor: 0x112288, baseColor: 0x050210 },
    EMBER_SEA: { highlightColor: 0x44aaff, midtoneColor: 0xff6622, lowlightColor: 0x112277, baseColor: 0x050510 },
    FOREST:    { highlightColor: 0x44cc88, midtoneColor: 0x228855, lowlightColor: 0x0a3322, baseColor: 0x020a05 },
  },
};

// ── CDN Loader ───────────────────────────────────────────────
let _vantaLoading = null;

async function loadVanta() {
  // Already loaded
  if (window.VANTA?.FOG) {
    return true;
  }

  // Prevent duplicate loading
  if (_vantaLoading) {
    return _vantaLoading;
  }

  _vantaLoading = (async () => {
    const scripts = [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', name: 'THREE' },
      { src: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js', name: 'VANTA.FOG' }
    ];

    for (const { src, name } of scripts) {
      if (!document.querySelector(`script[src="${src}"]`)) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load ${src}`));
          document.head.appendChild(script);
        });
      }
    }

    // Wait for THREE.js to initialize
    await new Promise(resolve => setTimeout(resolve, 150));

    // Poll for THREE.Color (max 500ms)
    let attempts = 0;
    while (!window.THREE?.Color && attempts < 50) {
      await new Promise(r => setTimeout(r, 10));
      attempts++;
    }

    if (!window.THREE?.Color) {
      throw new Error('THREE.Color not available');
    }

    if (!window.VANTA?.FOG) {
      throw new Error('VANTA.FOG not available');
    }

    return true;
  })();

  return _vantaLoading;
}

// ── Main Init ─────────────────────────────────────────────────
let _fogInstances = new Map();

export async function initFog(selector, tone = TONE.BLUE, mood = MOOD.COBALT, options = {}) {
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!element) {
    console.warn('[Fog] Element not found:', selector);
    return null;
  }

  // Prevent duplicate initialization on same element
  if (_fogInstances.has(element)) {
    console.log('[Fog] Already initialized on this element');
    return _fogInstances.get(element);
  }

  // Validate tone/mood
  const preset = PRESETS[tone]?.[mood];
  if (!preset) {
    console.error(`[Fog] Invalid TONE.${tone} / MOOD.${mood}`);
    return null;
  }

  // Load Vanta
  try {
    await loadVanta();
  } catch (err) {
    console.error('[Fog] Load failed:', err.message);
    return null;
  }

  // Build config - blur, speed, zoom are common values set by caller
  // Default values if not specified in options
  const config = {
    el: element,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200,
    minWidth: 200,
    highlightColor: preset.highlightColor,
    midtoneColor: preset.midtoneColor,
    lowlightColor: preset.lowlightColor,
    baseColor: preset.baseColor,
    blurFactor: options.blur !== undefined ? options.blur : 0.65,  // Default: MEDIUM
    speed: options.pace !== undefined ? options.pace : 0.7,        // Default: SLOW
    zoom: options.zoom !== undefined ? options.zoom : 0.85,        // Default: NORMAL
  };

  // Create effect
  try {
    const effect = window.VANTA.FOG(config);
    if (!effect) {
      throw new Error('VANTA.FOG returned null');
    }

    _fogInstances.set(element, effect);
    element.__fogEffect = effect;

    // Store initial colors for smooth transitions later
    effect.currentHighlightColor = config.highlightColor;
    effect.currentMidtoneColor = config.midtoneColor;
    effect.currentLowlightColor = config.lowlightColor;
    effect.currentBaseColor = config.baseColor;

    // Handle resize
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => effect.resize(), 300);
    };
    window.addEventListener('resize', onResize);
    element.__fogCleanup = () => window.removeEventListener('resize', onResize);

    return effect;
  } catch (err) {
    console.error('[Fog] Init failed:', err.message);
    return null;
  }
}

// ── Cleanup ───────────────────────────────────────────────────
export function destroyFog(selector) {
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!element) return;

  const effect = _fogInstances.get(element);
  if (effect) {
    if (typeof effect.destroy === 'function') {
      effect.destroy();
    }
    if (typeof element.__fogCleanup === 'function') {
      element.__fogCleanup();
    }
    element.__fogEffect = null;
    element.__fogCleanup = null;
    _fogInstances.delete(element);
  }
}

// ── Runtime Update ────────────────────────────────────────────
// Smooth transition helper - interpolate between two colors
function lerpColor(from, to, factor) {
  const fromR = (from >> 16) & 0xff;
  const fromG = (from >> 8) & 0xff;
  const fromB = from & 0xff;

  const toR = (to >> 16) & 0xff;
  const toG = (to >> 8) & 0xff;
  const toB = to & 0xff;

  const r = Math.round(fromR + (toR - fromR) * factor);
  const g = Math.round(fromG + (toG - fromG) * factor);
  const b = Math.round(fromB + (toB - fromB) * factor);

  return (r << 16) | (g << 8) | b;
}

// Track active transitions per element to prevent conflicts
const _activeTransitions = new Map();

// Smoothly transition fog colors over duration - stealth mode (no flash)
function transitionFogColors(element, toPreset, duration = 1000) {
  if (!element?.__fogEffect) return Promise.resolve();

  // Cancel any existing transition on this element
  const existingTransition = _activeTransitions.get(element);
  if (existingTransition) {
    existingTransition.cancelled = true;
  }

  // Get current colors from the effect or use defaults
  const effect = element.__fogEffect;
  const currentColors = {
    highlightColor: effect.currentHighlightColor || 0xffffff,
    midtoneColor: effect.currentMidtoneColor || 0xe8f0ff,
    lowlightColor: effect.currentLowlightColor || 0xb8c8dd,
    baseColor: effect.currentBaseColor || 0x8899aa,
  };

  const transitionState = { cancelled: false };
  _activeTransitions.set(element, transitionState);

  const startTime = Date.now();

  return new Promise(resolve => {
    const animate = () => {
      if (transitionState.cancelled) {
        resolve();
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease in-out cubic for smooth bleed effect (starts/stops imperceptibly)
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Calculate interpolated colors
      const newHighlight = lerpColor(currentColors.highlightColor, toPreset.highlightColor, eased);
      const newMidtone = lerpColor(currentColors.midtoneColor, toPreset.midtoneColor, eased);
      const newLowlight = lerpColor(currentColors.lowlightColor, toPreset.lowlightColor, eased);
      const newBase = lerpColor(currentColors.baseColor, toPreset.baseColor, eased);

      // Store current colors for next transition
      effect.currentHighlightColor = newHighlight;
      effect.currentMidtoneColor = newMidtone;
      effect.currentLowlightColor = newLowlight;
      effect.currentBaseColor = newBase;

      // Single setOptions call - minimal, color-only update (no flash)
      effect.setOptions({
        highlightColor: newHighlight,
        midtoneColor: newMidtone,
        lowlightColor: newLowlight,
        baseColor: newBase,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Transition complete - blur/speed/zoom remain constant (set by caller)
        _activeTransitions.delete(element);
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
}

export function updateFog(selector, tone, mood, options = {}, smooth = true) {
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!element?.__fogEffect) return;

  const preset = PRESETS[tone]?.[mood];
  if (!preset) return;

  if (smooth) {
    transitionFogColors(element, preset, options.transitionDuration || 1000);
  } else {
    // Only update colors - blur/speed/zoom remain constant (set by caller)
    const updates = {
      highlightColor: preset.highlightColor,
      midtoneColor: preset.midtoneColor,
      lowlightColor: preset.lowlightColor,
      baseColor: preset.baseColor,
      ...(options.blur !== undefined && { blurFactor: options.blur }),
      ...(options.pace !== undefined && { speed: options.pace }),
      ...(options.zoom !== undefined && { zoom: options.zoom }),
    };

    const effect = element.__fogEffect;
    effect.currentHighlightColor = preset.highlightColor;
    effect.currentMidtoneColor = preset.midtoneColor;
    effect.currentLowlightColor = preset.lowlightColor;
    effect.currentBaseColor = preset.baseColor;

    effect.setOptions(updates);
  }
}

// ── Showcase Mode ─────────────────────────────────────────────
// Cycles through all TONE/MOOD combinations automatically
// WHITE tone excluded by default, blur/pace/zoom remain constant

const _showcaseState = new Map(); // Track showcase intervals per element

export function startFogShowcase(selector, options = {}) {
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!element?.__fogEffect) {
    console.error('[Fog Showcase] No fog effect found on element');
    return null;
  }

  // Stop any existing showcase on this element
  stopFogShowcase(selector);

  // Build tone/mood queue (exclude WHITE by default)
  const excludeTones = options.excludeTones || [TONE.WHITE];
  const specificTone = options.tone || null; // If set, only cycle moods of this tone

  let toneQueue = Object.values(TONE).filter(t => !excludeTones.includes(t));
  if (specificTone) {
    toneQueue = [specificTone];
  }

  // Build flat queue of {tone, mood} pairs
  const presetQueue = [];
  for (const tone of toneQueue) {
    const moods = Object.keys(PRESETS[tone] || {});
    for (const mood of moods) {
      presetQueue.push({ tone, mood });
    }
  }

  if (presetQueue.length === 0) {
    console.error('[Fog Showcase] No presets to cycle');
    return null;
  }

  // Store constant overrides (blur, pace, zoom)
  const constantOverrides = {
    ...(options.blur !== undefined && { blur: options.blur }),
    ...(options.pace !== undefined && { pace: options.pace }),
    ...(options.zoom !== undefined && { zoom: options.zoom }),
  };

  // Duration per preset (ms) - transition happens within this time
  const duration = options.duration || 5000;

  // Transition duration (ms) - smooth bleed effect
  const transitionDuration = options.transitionDuration || 1000;

  let currentIndex = 0;

  // Apply first preset immediately (with smooth transition)
  const first = presetQueue[0];
  updateFog(element, first.tone, first.mood, { ...constantOverrides, transitionDuration }, true);
  console.log(`[Fog Showcase] Started: ${first.tone}.${first.mood}`);

  // Start cycling with smooth transitions
  const intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % presetQueue.length;
    const next = presetQueue[currentIndex];
    updateFog(element, next.tone, next.mood, { ...constantOverrides, transitionDuration }, true);
    console.log(`[Fog Showcase] ${next.tone}.${next.mood}`);
  }, duration);

  // Store interval ID for cleanup
  _showcaseState.set(element, { intervalId, presetQueue, currentIndex });

  return intervalId;
}

export function stopFogShowcase(selector) {
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  const state = _showcaseState.get(element);
  if (state) {
    clearInterval(state.intervalId);
    _showcaseState.delete(element);
    console.log('[Fog Showcase] Stopped');
  }
}

export function isFogShowcaseRunning(selector) {
  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;
  return _showcaseState.has(element);
}


// ═══════════════════════════════════════════════════════════════
// ── Universal Background Manager (Integrated) ──────────────────
// ═══════════════════════════════════════════════════════════════
// Usage: initBackground('#element', 'fog', { tone: 'BLUE', mood: 'SAPPHIRE' })
//        initBackground('#element', 'net', { bandwidth: 'ICE', style: 'WHITE_ON_BLUE' })

// ── Fog Background Wrapper ─────────────────────────────────────
export async function initFogBackground(selector, options = {}) {
  const tone = options.tone || TONE.BLUE;
  const mood = options.mood || MOOD.COBALT;
  const overrides = {};

  if (options.blur !== undefined) overrides.blur = options.blur;
      if (options.pace !== undefined) overrides.pace = options.pace;
  if (options.zoom !== undefined) overrides.zoom = options.zoom;

  const effect = await initFog(selector, tone, mood, overrides);

  // Start showcase mode if enabled
  if (options.showcase && effect) {
    startFogShowcase(selector, {
      tone: options.showcaseTone || null,
      excludeTones: options.showcaseExclude || [TONE.WHITE],
      blur: options.blur,
      pace: options.pace,
      zoom: options.zoom,
      duration: options.showcaseDuration || 5000,
      transitionDuration: options.showcaseTransition || 1000,
    });
  }

  return effect;
}

// ── Net Background Wrapper ─────────────────────────────────────
export async function initNetBackground(selector, options = {}) {
  const netModule = await import('./net_bg.js');
  const { BANDWIDTH, PATTERN, HARMONY, STYLE } = netModule;

  const config = {
    bandwidth: options.bandwidth || BANDWIDTH.OCEAN,
    pattern: options.pattern || PATTERN.OSCILLATE,
    harmony: options.harmony || HARMONY.ANALOGOUS,
    style: options.style || STYLE.DEFAULT,
  };

  if (netModule.initNetBackground) {
    return netModule.initNetBackground(selector, config);
  } else if (netModule.initNet) {
    return netModule.initNet(selector, config);
  }
  return null;
}

// ── Universal Background Manager ───────────────────────────────
export async function initBackground(selector, type = 'fog', options = {}) {
  try {
    if (type === 'fog') {
      return await initFogBackground(selector, options);
    } else if (type === 'net') {
      return await initNetBackground(selector, options);
    } else {
      console.error(`[Background] Unknown type: ${type}`);
      return null;
    }
  } catch (err) {
    console.error(`[Background] Failed to initialize ${type}:`, err.message);
    return null;
  }
}

// ── Showcase Controls ──────────────────────────────────────────
export async function startShowcase(selector, type = 'fog', options = {}) {
  if (type === 'fog') {
    return startFogShowcase(selector, options);
  }
  return null;
}

export async function stopShowcase(selector, type = 'fog') {
  if (type === 'fog') {
    stopFogShowcase(selector);
  }
}

export function isShowcaseRunning(selector, type = 'fog') {
  if (type === 'fog') {
    return isFogShowcaseRunning(selector);
  }
  return false;
}

// ── Cleanup Helper ─────────────────────────────────────────────
export async function destroyBackground(selector, type = 'fog') {
  if (type === 'fog') {
    destroyFog(selector);
  } else if (type === 'net') {
    const netModule = await import('./net_bg.js');
    if (netModule.destroyNetBackground) {
      netModule.destroyNetBackground(selector);
    } else if (netModule.destroyNet) {
      netModule.destroyNet(selector);
    }
  }
}

// ── Default Export ─────────────────────────────────────────────
export default {
  initFog,
  destroyFog,
  updateFog,
  startFogShowcase,
  stopFogShowcase,
  isFogShowcaseRunning,
  initFogBackground,
  initNetBackground,
  initBackground,
  destroyBackground,
  startShowcase,
  stopShowcase,
  isShowcaseRunning,
  TONE,
  MOOD,
  BLUR,
  PACE,
  ZOOM,
};
