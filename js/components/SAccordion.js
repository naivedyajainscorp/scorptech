/**
 * S-ACCORDION SYSTEM - PRODUCTION GRADE
 * Based on Bootstrap Collapse + Event Delegation pattern
 * @version 7.0.0 - FINAL
 */

export function initAccordions() {
  const accordions = document.querySelectorAll('.s-accordion');
  
  if (!accordions.length) {
    return;
  }

  accordions.forEach((accordion, idx) => {
    // ✅ Prevent duplicate initialization
    if (accordion.dataset.sAccordionInit === 'true') {
      return;
    }
    accordion.dataset.sAccordionInit = 'true';

    // Initialize all items
    const items = accordion.querySelectorAll('.s-accordion-item');
    items.forEach((item, itemIdx) => {
      setupItem(item, `acc-${idx}-item-${itemIdx}`);
    });

    // ✅ EVENT DELEGATION: Single listener for entire accordion
    accordion.addEventListener('click', handleAccordionClick);
    
    console.log(`✅ Accordion ${idx} initialized (${items.length} items)`);
  });
}

/**
 * Setup individual item with IDs and ARIA
 */
function setupItem(item, uniqueId) {
  const trigger = item.querySelector('.s-accordion-trigger');
  const panel = item.querySelector('.s-accordion-panel');
  
  if (!trigger || !panel) return;

  // Ensure proper button type
  trigger.setAttribute('type', 'button');
  
  // Assign unique IDs
  if (!panel.id) panel.id = `${uniqueId}-panel`;
  if (!trigger.id) trigger.id = `${uniqueId}-trigger`;

  // Set ARIA attributes
  trigger.setAttribute('aria-controls', panel.id);
  
  // Set initial state
  const isActive = item.classList.contains('s-accordion-active');
  trigger.setAttribute('aria-expanded', isActive);
  
  if (isActive) {
    // Open by default - measure and set height
    panel.style.height = 'auto';
    const height = panel.scrollHeight;
    panel.style.height = height + 'px';
  } else {
    // Closed by default
    panel.style.height = '0px';
  }
}

/**
 * Event delegation handler
 */
function handleAccordionClick(e) {
  // Find if click was on a trigger
  const trigger = e.target.closest('.s-accordion-trigger');
  if (!trigger) return;

  // Prevent default and stop propagation
  e.preventDefault();
  e.stopPropagation();

  // Find the item
  const item = trigger.closest('.s-accordion-item');
  if (!item) return;

  // Toggle it
  toggleItem(item);
}

/**
 * Toggle accordion item
 */
function toggleItem(item) {
  const trigger = item.querySelector('.s-accordion-trigger');
  const panel = item.querySelector('.s-accordion-panel');
  
  if (!trigger || !panel) return;

  const isActive = item.classList.contains('s-accordion-active');

  if (isActive) {
    // CLOSE
    panel.style.height = panel.scrollHeight + 'px';
    
    // Force reflow
    void panel.offsetHeight;
    
    panel.style.height = '0px';
    item.classList.remove('s-accordion-active');
    trigger.setAttribute('aria-expanded', 'false');
    
  } else {
    // OPEN
    const targetHeight = panel.scrollHeight;
    panel.style.height = targetHeight + 'px';
    item.classList.add('s-accordion-active');
    trigger.setAttribute('aria-expanded', 'true');
    
    // After animation, set to auto for responsiveness
    setTimeout(() => {
      if (item.classList.contains('s-accordion-active')) {
        panel.style.height = 'auto';
      }
    }, 300);
  }
}

/**
 * ✅ ONLY auto-init when NOT imported as module
 */
if (typeof window !== 'undefined') {
  // Check if we're in a module context
  const isModule = document.currentScript && document.currentScript.type === 'module';
  
  if (!isModule) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAccordions);
    } else {
      initAccordions();
    }
  }
}
