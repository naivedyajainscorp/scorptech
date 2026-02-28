/* ════════════════════════════════════════════════════════════════════════════
   NAVIGATION MANAGER COMPONENT - PRD v2.1 COMPLIANT
   Click-based dropdowns, proper collapse, accessibility, all fixes applied
   ════════════════════════════════════════════════════════════════════════════ */

// Helper functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const isSamePage = (href) => {
  if (!href) return false;
  const target = href.split('#')[0];
  const current = window.location.pathname.split('/').pop() || 'index.html';
  return target === current;
};

const nudgeActive = (el) => {
  el.classList.remove('s-already-active');
  void el.offsetWidth; // Force reflow
  el.classList.add('s-already-active');
  if (window.navigator && typeof window.navigator.vibrate === 'function') {
    window.navigator.vibrate(18);
  }
};

export function initNavigationManager() {
  console.log('🔵 Navigation Manager: Initializing...');

  const navbar = $('#scorpNavbar');
  const navLinksAll = $$('.s-nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. NAVBAR SCROLL EFFECT
  // ═══════════════════════════════════════════════════════════════════════════

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
    console.log('✅ Navbar scroll effect initialized');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. NAV LINK CLICK HANDLERS (Page transition + Same-page nudge)
  // ═══════════════════════════════════════════════════════════════════════════

  if (navLinksAll.length > 0) {
    navLinksAll.forEach(link => {
      link.addEventListener('click', function (e) {
        // Allow Ctrl+Click/Meta+Click to open in new tab
        if (e.ctrlKey || e.metaKey) return;

        const href = this.getAttribute('href');

        // Skip external links, anchors, and javascript: links
        if (href && !href.startsWith('#') && !href.startsWith('http') && href !== 'javascript:void(0)') {

          // If already on this page, nudge instead of navigate
          // Don't treat Book Demo as an active page link (it's a button)
          const isBookDemo = this.classList.contains('book-demo-button');
          if (!isBookDemo && (this.classList.contains('active') || isSamePage(href))) {
            e.preventDefault();
            nudgeActive(this);
            return;
          }

          // Page transition effect
          e.preventDefault();
          document.body.classList.add('page-exit');
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    });
    console.log('✅ Nav link click handlers initialized');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ACTIVE PAGE HIGHLIGHTING
  // ═══════════════════════════════════════════════════════════════════════════

  if (navLinksAll.length > 0) {
    navLinksAll.forEach(link => {
      const linkHref = link.getAttribute('href');
      // Exclude Book Demo button from active highlighting
      if (linkHref === currentPage && !link.classList.contains('book-demo-button')) {
        navLinksAll.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
    console.log('✅ Active page highlighting initialized');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. DROPDOWN ACTIVE CHILD DETECTION
  // ═══════════════════════════════════════════════════════════════════════════

  const dropdownPageMap = {
    'resources': ['faq.html', 'terms_of_use.html', 'privacy_policy.html'],
    'sapphire-smart': ['analytics.html', 'intelligence.html', 'mobileUSP.html'],
  };

  Object.keys(dropdownPageMap).forEach(dropdownId => {
    const pages = dropdownPageMap[dropdownId];

    if (pages.includes(currentPage)) {
      const dropdownTrigger = document.querySelector(`[data-dropdown-id="${dropdownId}"]`);

      if (dropdownTrigger) {
        dropdownTrigger.classList.add('s-has-active-child');

        const dropdownMenu = dropdownTrigger.closest('.s-nav-dropdown-internal')?.querySelector('.s-internal-dropdown-menu');

        if (dropdownMenu) {
          const menuItems = dropdownMenu.querySelectorAll('.s-internal-menu-item');
          menuItems.forEach(item => {
            const itemPage = item.getAttribute('data-page');
            if (itemPage === currentPage) {
              item.classList.add('s-active-page');
            }
          });
        }
      }

      // Remove active class from main nav links when in dropdown
      navLinksAll.forEach(l => l.classList.remove('active'));
    }
  });
  console.log('✅ Dropdown active child detection initialized');

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. INTERNAL DROPDOWN MENU ITEM NUDGE (DROPDOWN-SAFE)
  // ═══════════════════════════════════════════════════════════════════════════

  const internalItems = document.querySelectorAll('.s-internal-menu-item');
  internalItems.forEach(item => {
    item.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Only prevent default if on same page
      // This keeps dropdown open and nudges without navigation
      if (this.classList.contains('s-active-page') || isSamePage(href)) {
        e.preventDefault();
        e.stopPropagation();
        nudgeActive(this);
        console.log('🔔 Nudged active dropdown item (no navigation)');
      }
      // If different page, allow normal navigation (dropdown will close naturally)
    });
  });
  console.log('✅ Internal dropdown menu item nudge initialized');

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. CLICK/PRESS-BASED DROPDOWN TOGGLE SYSTEM (TR-2) - PRD v2.1
  // ═══════════════════════════════════════════════════════════════════════════

  const dropdowns = $$('.s-nav-dropdown-internal, .s-sapphire-dropdown');

  // Helper to close all dropdowns
  const closeAllDropdowns = () => {
    document.querySelectorAll('.s-internal-dropdown-menu, .s-sapphire-menu').forEach(menu => {
      menu.classList.remove('show');
    });
    document.querySelectorAll('.dropdown-toggle, .s-sapphire-trigger').forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.classList.remove('show'); // Ensure caret resets
    });
  };

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-toggle, .s-sapphire-trigger');
    const menu = dropdown.querySelector('.s-internal-dropdown-menu, .s-sapphire-menu');

    if (!trigger || !menu) return;

    // 🛑 CRITICAL: Remove Bootstrap's data attribute to prevent conflict
    // This allows our manual click handler to have full control
    if (trigger.hasAttribute('data-bs-toggle')) {
      trigger.removeAttribute('data-bs-toggle');
    }

    // Click to toggle
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); // Ensure no other listeners fire

      const isOpen = menu.classList.contains('show');

      // Close others first
      closeAllDropdowns();

      // Toggle current
      if (!isOpen) {
        menu.classList.add('show');
        trigger.setAttribute('aria-expanded', 'true');
        trigger.classList.add('show');
      } else {
        // If it was open, closeAllDropdowns() already closed it, so we're good.
        // But for clarity/active-toggle behavior, clicking open closes it.
      }
    });

    // Keyboard Accessibility
    trigger.addEventListener('keydown', (e) => {
      // Enter or Space to toggle
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }

      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        closeAllDropdowns();
        trigger.focus();
      }
    });
  });

  // Click Outside to Close
  document.addEventListener('click', (e) => {
    const isDropdownClick = e.target.closest('.s-nav-dropdown-internal, .s-sapphire-dropdown');
    if (!isDropdownClick) {
      closeAllDropdowns();
    }
  });

  // Global Escape to Close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });

  console.log('✅ Click-based dropdown system initialized (TR-2)');

  console.log('🎉 Navigation Manager fully initialized');
}

// ═══════════════════════════════════════════════════════════════════════════
// SMOOTH SCROLL FOR ANCHOR LINKS
// ═══════════════════════════════════════════════════════════════════════════

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);

      // Skip empty anchors
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  console.log('✅ Smooth scroll initialized');
}
