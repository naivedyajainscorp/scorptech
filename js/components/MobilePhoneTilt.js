/* ════════════════════════════════════════════════════════════════════════════
   MOBILE PHONE 3D TILT PARALLAX COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */

// Helper functions
const $ = (selector) => document.querySelector(selector);

export function initMobilePhoneTilt() {
  const phoneContainer = $('#phoneParallax');
  const section = $('.mobile-usp-section');

  if (!phoneContainer) {
    console.warn('⚠️ Phone container #phoneParallax not found');
    return;
  }

  if (!section) {
    console.warn('⚠️ Section .mobile-usp-section not found');
    return;
  }

  // Check for reduced motion preference
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    console.log('⚠️ Reduced motion detected - phone tilt disabled');
    return;
  }

  // Configuration
  const MAX_TILT_Y = 35;
  const MAX_TILT_X = 8.5;
  const EASE = 0.1;

  // State variables
  let isInView = false;
  let sx = 0, sy = 0; // Source (mouse) position
  let tx = 0, ty = 0; // Target (smoothed) position
  let cx = 0, cy = 0; // Center position
  let animId = null;
  let armed = false; // Mouse is inside section

  // Reset phone to neutral position
  const resetNeutral = () => {
    phoneContainer.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) scale(1)';
    const shadow = phoneContainer.querySelector('.phone-shadow');
    if (shadow) {
      shadow.style.transform = 'translateX(-50%) translateY(0px) scale(1)';
      shadow.style.opacity = '0.25';
    }
  };

  // Update center position of phone
  const updateCenter = () => {
    const r = phoneContainer.getBoundingClientRect();
    cx = r.left + r.width / 2;
    cy = r.top + r.height / 2;
  };

  // Initialize
  resetNeutral();
  updateCenter();

  // Intersection Observer - check if section is in viewport
  const visObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isInView = entry.isIntersecting;
      if (isInView) {
        updateCenter();
        resetNeutral();
        armed = false;
        if (!animId) animId = requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.1 });

  visObserver.observe(section);

  // Mouse enter - arm the effect
  section.addEventListener('mouseenter', () => {
    armed = true;
    updateCenter();
  }, { passive: true });

  // Mouse leave - disarm and reset
  section.addEventListener('mouseleave', () => {
    armed = false;
    sx = 0;
    sy = 0;
  }, { passive: true });

  // Mouse move - update target position
  section.addEventListener('mousemove', (e) => {
    if (!armed) return;
    sx = e.clientX - cx;
    sy = e.clientY - cy;
  }, { passive: true });

  // Animation loop
  function tick() {
    if (!isInView) {
      animId = null;
      return;
    }

    // Smooth interpolation
    tx += (sx - tx) * EASE;
    ty += (sy - ty) * EASE;

    // Calculate rotation
    const rotX = -((ty / (window.innerHeight / 2)) * MAX_TILT_X);
    const rotY = (tx / (window.innerWidth / 2)) * MAX_TILT_Y;

    // Calculate shift
    const shiftX = tx * 0.015;
    const shiftY = ty * 0.015;

    // Apply transform to phone
    phoneContainer.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateX(${shiftX}px) translateY(${shiftY}px) scale(1)`;

    // Update shadow
    const shadow = phoneContainer.querySelector('.phone-shadow');
    if (shadow) {
      const sRotX = rotX * 0.5;
      const sRotY = rotY * 0.5;
      const sShift = Math.sqrt(sRotX * sRotX + sRotY * sRotY) * 0.5;
      const sScale = 1 + Math.abs(rotY) * 0.003;
      const sOpacity = Math.max(0.15, 0.25 - Math.abs(rotY) * 0.002);

      shadow.style.transform = `translateX(-50%) translateY(${sShift}px) scale(${sScale})`;
      shadow.style.opacity = sOpacity;
    }

    animId = requestAnimationFrame(tick);
  }

  console.log('✅ Mobile phone 3D tilt initialized');
}
