/* ════════════════════════════════════════════════════════════════════════════
   CARD TILT EFFECTS - UNIVERSAL COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */

export function initCardTiltEffects() {
  // Check for reduced motion preference (accessibility)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) {
    console.log('ℹ️ Card tilt effects disabled (reduced motion preference)');
    return;
  }

  // Find all cards with data-tilt attribute
  const cards = document.querySelectorAll('[data-tilt]');
  
  if (cards.length === 0) {
    console.log('ℹ️ No tilt-enabled cards found on this page');
    return;
  }

  cards.forEach(card => {
    let rafId = null;
    
    // Initialize CSS custom properties for gradient
    card.style.setProperty('--glx', '50%');
    card.style.setProperty('--gly', '0%');

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on mouse position
      const rotateX = Math.max(-3, Math.min(3, ((y - rect.height / 2) / 50)));
      const rotateY = Math.max(-3, Math.min(3, ((rect.width / 2 - x) / 50)));
      
      // Calculate gradient position
      const gradientX = (x / rect.width) * 100;
      const gradientY = Math.max(0, (y / rect.height) * 100);

      // Cancel previous animation frame
      if (rafId) cancelAnimationFrame(rafId);
      
      // Schedule update on next frame
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.setProperty('--glx', `${gradientX}%`);
        card.style.setProperty('--gly', `${gradientY}%`);
      });
    };

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      
      // Reset to default state
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      card.style.setProperty('--glx', '50%');
      card.style.setProperty('--gly', '0%');
    };

    // Attach event listeners
    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    card.addEventListener('blur', handleMouseLeave, true); // Reset on focus loss
  });

  console.log(`✅ Card tilt effects initialized for ${cards.length} card(s)`);
}

// Optional: Manual initialization for dynamically added cards
export function applyTiltToCard(cardElement) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  if (!cardElement.hasAttribute('data-tilt')) {
    cardElement.setAttribute('data-tilt', '');
  }

  initCardTiltEffects(); // Re-initialize for new cards
}
