// js/helpers/marquee_continuity.js

export function initMarqueeLoops() {
  window.addEventListener('load', () => {
    document.querySelectorAll('.s-mq-row').forEach(row => {
      const cards = Array.from(row.children);
      cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); 
        clone.setAttribute('tabindex', '-1'); 
        row.appendChild(clone);
      });
    });
  });
}
