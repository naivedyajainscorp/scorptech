/* ═══════════════════════════════════════════════════════
   WORD SLIDER - JARVIS-STYLE TEXT ROTATOR
   Smooth fade + slide animation with circular rotation
   Dynamic width detection for zero layout shift
   ═══════════════════════════════════════════════════════ */

export class WordSlider {
  constructor(element) {
    this.wrapper = element;
    this.speed = parseInt(element.dataset.speed) || 2500;
    this.direction = element.dataset.direction || 'up';
    this.words = Array.from(element.children).map(el => el.textContent.trim());
    this.currentIndex = 0;
    this.interval = null;
    this.resizeTimer = null;
    this.init();
  }

  init() {
    // Clear existing content
    this.wrapper.innerHTML = '';
    this.wrapper.classList.add('s-word-rotator');

    // Build word elements
    this.words.forEach((word, index) => {
      const h1 = document.createElement('h1');
      h1.className = 's-word-rotator-word';
      h1.textContent = word;
      if (index === 0) h1.classList.add('active');
      this.wrapper.appendChild(h1);
    });

    this.items = Array.from(this.wrapper.querySelectorAll('.s-word-rotator-word'));

    // Dynamically calculate and set fixed width based on longest word
    this.setDynamicWidth();

    // Add resize listener to handle responsive font changes
    window.addEventListener('resize', () => this.handleResize());

    this.start();
  }

  setDynamicWidth() {
    let maxWidth = 0;

    // Use a temporary span to measure the width accurately without affecting layout
    const measureEl = document.createElement('span');
    const computed = window.getComputedStyle(this.wrapper);
    measureEl.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: nowrap;
      font-size: ${computed.fontSize};
      font-family: ${computed.fontFamily};
      font-weight: ${computed.fontWeight};
      letter-spacing: ${computed.letterSpacing};
      text-transform: ${computed.textTransform};
      font-style: ${computed.fontStyle};
    `;
    document.body.appendChild(measureEl);

    this.words.forEach(word => {
      measureEl.textContent = word;
      const width = measureEl.getBoundingClientRect().width;
      if (width > maxWidth) maxWidth = width;
    });

    document.body.removeChild(measureEl);

    // Set the fixed width on the wrapper to accommodate the longest word + padding
    const finalWidth = Math.ceil(maxWidth) + 10;
    this.wrapper.style.width = `${finalWidth}px`;
    this.wrapper.style.minWidth = `${finalWidth}px`;
    this.wrapper.style.maxWidth = `${finalWidth}px`;
  }

  handleResize() {
    // Simple debounce to avoid layout thrashing
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.setDynamicWidth();
    }, 200);
  }

  start() {
    this.interval = setInterval(() => this.rotate(), this.speed);
  }

  rotate() {
    if (!this.items || this.items.length === 0) return;

    const current = this.items[this.currentIndex];

    // Add transitioning classes for smooth handover
    current.classList.add('exiting');

    // Staged cleanup for smooth exit
    setTimeout(() => {
      current.classList.remove('active', 'exiting');
    }, 350); // Half of the 700ms transition

    // Move to next (circular)
    this.currentIndex = (this.currentIndex + 1) % this.items.length;

    // Add active to new
    this.items[this.currentIndex].classList.add('active');
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', () => this.handleResize());
    this.items = null;
  }
}

// Auto-initialize all word sliders
export function initWordSlider() {
  const sliders = document.querySelectorAll('[data-word-rotator]');
  sliders.forEach(el => new WordSlider(el));
  console.log(`✅ Word Rotator initialized with Dynamic Width & Resize Support`);
}

export default WordSlider;
