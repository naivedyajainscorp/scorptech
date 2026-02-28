/* ════════════════════════════════════════════════════════════════════════════
   SAPPHIRE PAGE INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */

console.log('💎 Sapphire page initialization started');

// ─────────────────────────────────────────────────────────────────────────────
// 1. AOS (Animate On Scroll) Initialization
// ─────────────────────────────────────────────────────────────────────────────

function initAOS() {
  if (typeof AOS === 'undefined') {
    console.warn('⚠️ AOS library not loaded');
    return;
  }
  
  AOS.init({
    duration: 300,
    once: true,
    offset: 50
  });
  
  console.log('✅ AOS initialized');
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Sapphire Hero Grid Generator
// ─────────────────────────────────────────────────────────────────────────────

function initializeSapphireHeroGrid() {
  const sapphireGrid = document.getElementById('sapphireCorporateGrid');
  if (!sapphireGrid) {
    console.log('ℹ️ Sapphire hero grid container not found');
    return;
  }

  sapphireGrid.innerHTML = ''; // Clear existing content

  // Calculate grid size based on screen size
  let gridCols = 10;
  let gridRows = 10;
  
  if (window.innerWidth < 576) {
    gridCols = 5;
    gridRows = 6;
  } else if (window.innerWidth < 768) {
    gridCols = 6;
    gridRows = 8;
  } else if (window.innerWidth < 992) {
    gridCols = 8;
    gridRows = 9;
  }

  const totalCells = gridCols * gridRows;

  // Create grid cells with Sapphire-specific classes
  for (let i = 0; i < totalCells; i++) {
    const gridCell = document.createElement('div');
    gridCell.className = 'sapphire-grid-cell';

    // Add pulse element
    const gridPulse = document.createElement('div');
    gridPulse.className = 'sapphire-grid-pulse';

    // Add random delay for staggered animation
    const randomDelay = Math.random() * 2;
    gridCell.style.animationDelay = `${randomDelay}s`;
    gridPulse.style.animationDelay = `${randomDelay + 1}s`;

    gridCell.appendChild(gridPulse);
    sapphireGrid.appendChild(gridCell);
  }

  console.log(`✅ Sapphire hero grid initialized (${gridCols}x${gridRows} = ${totalCells} cells)`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Modal Focus Management (Accessibility)
// ─────────────────────────────────────────────────────────────────────────────

function initModalFocusReturn() {
  if (typeof bootstrap === 'undefined') {
    console.log('ℹ️ Bootstrap not loaded, skipping modal focus management');
    return;
  }

  let lastFocusedElement = null;

  // Track which button opened the modal
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
    button.addEventListener('click', () => {
      lastFocusedElement = button;
    });
  });

  // Focus modal title when shown (accessibility)
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('shown.bs.modal', () => {
      const modalTitle = modal.querySelector('.s-modal-title, .modal-title');
      if (modalTitle) {
        modalTitle.focus();
      }
    });

    // Return focus to button when modal closes (accessibility)
    modal.addEventListener('hidden.bs.modal', () => {
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    });
  });

  console.log('✅ Modal focus management initialized');
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initializeSapphireHeroGrid();
  initModalFocusReturn();

  // Reinitialize grid on window resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initializeSapphireHeroGrid();
    }, 250);
  }, { passive: true });

  console.log('✅ Sapphire page fully initialized');
});

// Remove loading class when page fully loads
window.addEventListener('load', () => {
  document.body.classList.remove('loading');
}, { passive: true });
