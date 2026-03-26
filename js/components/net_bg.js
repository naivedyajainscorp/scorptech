/**
 * Vanta.js Net Background Component
 * Reusable component for applying interactive net background effects
 * Dynamically loads required CDN libraries (Three.js and Vanta.js)
 * 
 * Usage:
 *   import { initNetBackground } from './components/net_bg.js';
 *   
 *   // Initialize on an element
 *   initNetBackground('#heroSection', {
 *     color: 0x0066cc,
 *     backgroundColor: 0x000000
 *   });
 */

/**
 * Load external scripts dynamically from CDN
 * @param {string} src - Script URL
 * @param {object} attributes - Optional attributes for the script tag
 * @returns {Promise} Resolves when script loads
 */
function loadScript(src, attributes = {}) {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    
    // Apply additional attributes
    Object.keys(attributes).forEach(key => {
      script.setAttribute(key, attributes[key]);
    });

    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Initialize Vanta Net background effect on specified element
 * Automatically loads Three.js and Vanta.js if not already present
 * 
 * @param {string|HTMLElement} selector - CSS selector or DOM element
 * @param {object} options - Vanta configuration options
 * @param {number} options.color - Net color (hex: 0x0066cc)
 * @param {number} options.backgroundColor - Background color (hex: 0x000000)
 * @param {number} options.points - Number of points (default: 15)
 * @param {number} options.maxDistance - Max connection distance (default: 20)
 * @param {number} options.spacing - Point spacing (default: 15)
 * @param {boolean} options.mouseControls - Enable mouse interaction (default: true)
 * @param {boolean} options.touchControls - Enable touch interaction (default: true)
 * @param {boolean} options.gyroControls - Enable gyro interaction (default: false)
 * @returns {Promise} Resolves when effect is initialized
 */
export async function initNetBackground(selector, options = {}) {
  try {
    // Get target element
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;

    if (!element) {
      console.warn(`[VantaNet] Element not found: ${selector}`);
      return;
    }

    // Default options
    const config = {
      el: element,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x0066cc,
      backgroundColor: 0x000000,
      points: 15.00,
      maxDistance: 20.00,
      spacing: 15.00,
      ...options // Override with user options
    };

    // Check if Vanta is already loaded
    if (typeof window.VANTA === 'undefined') {
      console.info('[VantaNet] Loading Three.js and Vanta.js libraries...');
      
      // Load Three.js first (required by Vanta)
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
      
      // Then load Vanta.js Net effect
      await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js');
      
      console.info('[VantaNet] Libraries loaded successfully');
    }

    // Initialize Vanta effect
    if (window.VANTA && window.VANTA.NET) {
      const effect = window.VANTA.NET(config);
      console.info('[VantaNet] Effect initialized on', selector);
      return effect;
    } else {
      console.error('[VantaNet] VANTA.NET not available');
      return null;
    }

  } catch (error) {
    console.error('[VantaNet] Initialization failed:', error);
    return null;
  }
}

/**
 * Hide video/image background and initialize net effect
 * Useful for replacing existing background media with Vanta
 * 
 * @param {string|HTMLElement} selector - Element selector or DOM node
 * @param {string} videoSelector - Selector for video element to hide
 * @param {object} options - Vanta configuration options
 * @returns {Promise} Resolves when setup complete
 */
export async function initNetBackgroundWithVideoHide(selector, videoSelector, options = {}) {
  // Hide the video/image background
  const videoElement = document.querySelector(videoSelector);
  if (videoElement) {
    videoElement.style.display = 'none';
    console.info('[VantaNet] Hidden background element:', videoSelector);
  }

  // Initialize Vanta effect
  return initNetBackground(selector, options);
}

/**
 * Destroy Vanta effect instance
 * Useful for cleaning up before page navigation or re-initialization
 * 
 * @param {object} vantaInstance - The Vanta effect instance to destroy
 */
export function destroyNetBackground(vantaInstance) {
  if (vantaInstance && typeof vantaInstance.destroy === 'function') {
    vantaInstance.destroy();
    console.info('[VantaNet] Effect destroyed');
  }
}

/**
 * Reinitialize Vanta effect with new options
 * Useful for responsive design or theme switching
 * 
 * @param {object} vantaInstance - Existing Vanta instance to destroy
 * @param {string|HTMLElement} selector - Element for new effect
 * @param {object} newOptions - New configuration options
 * @returns {Promise} Resolves with new effect instance
 */
export async function reinitNetBackground(vantaInstance, selector, newOptions = {}) {
  destroyNetBackground(vantaInstance);
  return initNetBackground(selector, newOptions);
}

export default {
  initNetBackground,
  initNetBackgroundWithVideoHide,
  destroyNetBackground,
  reinitNetBackground
};
