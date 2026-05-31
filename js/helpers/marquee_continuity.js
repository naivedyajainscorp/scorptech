// js/helpers/marquee_continuity.js

// export function initMarqueeLoops() {
//   window.addEventListener('load', () => {
//     document.querySelectorAll('.s-mq-row').forEach(row => {
//       const cards = Array.from(row.children);
//       cards.forEach(card => {
//         const clone = card.cloneNode(true);
//         clone.setAttribute('aria-hidden', 'true'); 
//         clone.setAttribute('tabindex', '-1'); 
//         row.appendChild(clone);
//       });
//     });
//   });
// }


export function initMarqueeLoops() {
  window.addEventListener('load', () => {
    const cloneRowChildren = (selector) => {
      document.querySelectorAll(selector).forEach(row => {
        if (row.dataset.marqueeCloned === 'true') return;

        const items = Array.from(row.children);
        items.forEach(item => {
          const clone = item.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          clone.setAttribute('tabindex', '-1');
          row.appendChild(clone);
        });

        row.dataset.marqueeCloned = 'true';
      });
    };

    cloneRowChildren('.s-mq-row');
    cloneRowChildren('.ix-ticker-track');
  });
}