/* ================================================================
   INDEX PAGE — Ticker + Teaser JS
   initInfiniteScroll: pure CSS animation, no GSAP dependency
   initTeaserAnims: GSAP ScrollTrigger, anime.js idle float
   ================================================================ */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  /* ── 1. Infinite Scroll Ticker ───────────────────────────── */
  function initInfiniteScroll() {
    var speedMap = { slow: 60, normal: 40, fast: 22 };

    document.querySelectorAll('[data-infinite-scroll]').forEach(function (wrapper) {
      var direction = wrapper.getAttribute('data-infinite-scroll'); // 'left' | 'right'
      var speed     = speedMap[wrapper.getAttribute('data-speed')] || 40;
      var track     = wrapper.querySelector('[data-infinite-track]');
      if (!track) return;

      /* measure natural width of ONE set of items (before duplication) */
      var naturalWidth = track.scrollWidth;

      /* inject keyframe dynamically so speed is correct */
      var uid    = 'ix-scroll-' + Math.random().toString(36).slice(2, 7);
      var startX = direction === 'right' ? -naturalWidth / 2 : 0;
      var endX   = direction === 'right' ? 0 : -(naturalWidth / 2);

      var style = document.createElement('style');
      style.textContent =
        '@keyframes ' + uid + ' {' +
          'from { transform: translateX(' + startX + 'px); }' +
          'to   { transform: translateX(' + endX   + 'px); }' +
        '}';
      document.head.appendChild(style);

      var duration = (naturalWidth / 2) / speed; /* seconds */
      track.style.animation = uid + ' ' + duration + 's linear infinite';

      if (reduceMotion) {
        track.style.animationPlayState = 'paused';
      }

      /* pause on hover over any item */
      track.querySelectorAll('.ix-industry-item').forEach(function (item) {
        item.addEventListener('mouseenter', function () {
          track.style.animationPlayState = 'paused';
          if (typeof gsap !== 'undefined') {
            track.querySelectorAll('.ix-industry-item').forEach(function (s) {
              gsap.to(s, { opacity: s === item ? 1 : 0.4, scale: s === item ? 1.1 : 1, duration: 0.2 });
            });
          }
        });
        item.addEventListener('mouseleave', function () {
          track.style.animationPlayState = '';
          if (typeof gsap !== 'undefined') {
            track.querySelectorAll('.ix-industry-item').forEach(function (s) {
              gsap.to(s, { opacity: 1, scale: 1, duration: 0.2 });
            });
          }
        });
      });
    });
  }

  /* ── 2. Teaser ScrollTrigger Animations ─────────────────── */
  function initTeaserAnims() {
    if (reduceMotion) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    /* Ticker header fade-up */
    gsap.from('#ix-ticker-header', {
      scrollTrigger: { trigger: '.ix-ticker-section', start: 'top 82%' },
      y: 30,
      opacity: 0,
      duration: 0.6
    });

    /* Teaser text slide-in left */
    gsap.from('.ix-teaser-text', {
      scrollTrigger: { trigger: '.ix-teaser', start: 'top 80%' },
      x: -60,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    /* Mock UI slide-in right with perspective */
    gsap.from('.ix-mock-visual', {
      scrollTrigger: { trigger: '.ix-teaser', start: 'top 80%' },
      x: 60,
      rotateX: 15,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    /* Idle float animation on mock UI (anime.js) */
    ScrollTrigger.create({
      trigger: '.ix-teaser',
      start: 'top 80%',
      once: true,
      onEnter: function () {
        if (typeof anime === 'undefined') return;
        anime({
          targets: '.ix-mock-visual',
          translateY: [0, -10, 0],
          duration: 5000,
          loop: true,
          easing: 'easeInOutQuad'
        });
        anime({
          targets: '.ix-mock-ui',
          borderColor: [
            'rgba(2,132,199,0.22)',
            'rgba(2,132,199,0.50)',
            'rgba(2,132,199,0.22)'
          ],
          duration: 3000,
          loop: true,
          easing: 'easeInOutSine'
        });
      }
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    initInfiniteScroll();
    initTeaserAnims();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();