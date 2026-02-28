/**
 * CSS Marquee Infinite Scroll (Minimal Setup)
 * Replaces complex JS animation with simple class toggling.
 * Actual animation is handled by CSS in components.css
 */

class CSSInfiniteScroll {
  static instances = new Map();

  static init(containerSelector, options = {}) {
    // Cleanup if re-initializing
    if (this.instances.has(containerSelector)) {
      this.instances.get(containerSelector).destroy();
    }

    const container = document.querySelector(containerSelector);
    if (!container) {
      console.warn(`Container "${containerSelector}" not found`);
      return null;
    }

    const track = container.querySelector('[data-infinite-track]');
    if (!track) {
      console.warn(`Track not found in "${containerSelector}"`);
      return null;
    }

    const config = {
      direction: options.direction ?? 'left',
      speed: options.speed ?? 'normal', // 'slow', 'normal', 'fast'
      cloneMultiplier: options.cloneMultiplier ?? 1
    };

    // 1. Clone children for seamless loop
    // CSS animation moves -50%, so we need 2 sets of content minimum
    const originalChildren = Array.from(track.children);
    // Determine how many clones we need based on width - simple heuristic
    // For CSS marquee, usually 1 full clone set is enough if width is sufficient, 
    // but 2 is safer for wide screens.
    for (let i = 0; i < config.cloneMultiplier; i++) {
      originalChildren.forEach(child => track.appendChild(child.cloneNode(true)));
    }

    // 2. Set attributes to trigger CSS animations
    container.setAttribute('data-infinite-scroll', config.direction);

    // 3. Dynamic Speed Calculation (Pixels Per Second) to fix responsive slowness
    const updateSpeed = () => {
      let runWidth, runHeight;

      // Calculate total scroll distance (for one set of content)
      // Since we have 2 sets (original + clone), the loop distance is 50% of total
      if (config.direction === 'left' || config.direction === 'right') {
        // Use scrollWidth
        runWidth = track.scrollWidth / 2;
      } else {
        // Use scrollHeight
        runHeight = track.scrollHeight / 2;
      }

      // Define target speed in Pixels Per Second (PPS)
      // TUNED DOWN: Previous values (20/50/100) were way too fast on mobile
      const baseSpeeds = {
  slow: 3,      // very gentle drift
  normal: 8,    // calm, readable pace
  fast: 12      // noticeable but composed
};

// PERCEPTUAL SPEED SCALING:
// Aggressive mobile reduction for ultra-smooth, slow perception
const viewportWidth = window.innerWidth;
let responsiveMultiplier = 1.0;

if (viewportWidth <= 480) {
  // Phone: scale to 10-20% of desktop speed (ultra-slow)
  responsiveMultiplier = 0.10 + (0.50 * (viewportWidth - 320) / (480 - 320));
} else if (viewportWidth <= 768) {
  // Tablet portrait: scale to 20-35%
  responsiveMultiplier = 0.20 + (0.15 * (viewportWidth - 480) / (768 - 480));
} else if (viewportWidth <= 1200) {
  // Tablet landscape / small desktop: 35-65%
  responsiveMultiplier = 0.35 + (0.30 * (viewportWidth - 768) / (1200 - 768));
} else if (viewportWidth <= 1400) {
  // Standard desktop: 65-85%
  responsiveMultiplier = 0.65 + (0.20 * (viewportWidth - 1200) / (1400 - 1200));
} else {
  // Large desktop: 85-100%
  responsiveMultiplier = 0.85 + (0.15 * Math.min((viewportWidth - 1400) / 600, 1));
}


      // Clamp between 0.2 and 1.0
      responsiveMultiplier = Math.max(0.2, Math.min(1.0, responsiveMultiplier));

      const targetPPS = (typeof config.speed === 'number'
        ? (40 / config.speed) * 5   // legacy number support (also halved)
        : baseSpeeds[config.speed] || 18) * responsiveMultiplier;

      const distance = (config.direction === 'left' || config.direction === 'right') ? runWidth : runHeight;

      if (distance > 0) {
        const duration = distance / targetPPS;
        container.style.setProperty('--scroll-duration', `${duration}s`);
      }
    };

    // Initial calculation
    // Small delay to allow DOM layout to settle (important for correct scrollWidth)
    requestAnimationFrame(() => updateSpeed());

    // 4. Responsive Handler
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => updateSpeed());
    });
    resizeObserver.observe(container);
    resizeObserver.observe(track); // Observe track too for content changes

    console.log(`✅ CSS Infinite Scroll initialized: "${containerSelector}" (Dynamic Speed)`);

    const instance = {
      container,
      track,
      options: config,
      observer: resizeObserver,

      pause: () => {
        track.style.animationPlayState = 'paused';
      },
      play: () => {
        track.style.animationPlayState = 'running';
      },
      destroy: () => {
        resizeObserver.disconnect();
        container.removeAttribute('data-infinite-scroll');
        container.removeAttribute('data-speed');
        container.style.removeProperty('--scroll-duration');
        CSSInfiniteScroll.instances.delete(containerSelector);
      }
    };

    this.instances.set(containerSelector, instance);
    return instance;
  }

  static destroyAll() {
    this.instances.forEach(i => i.destroy());
    this.instances.clear();
  }
}

// Export for usage
export function initInfiniteScroll(containerSelector, options = {}) {
  return CSSInfiniteScroll.init(containerSelector, options);
}

export function destroyAllScrolls() {
  CSSInfiniteScroll.destroyAll();
}
