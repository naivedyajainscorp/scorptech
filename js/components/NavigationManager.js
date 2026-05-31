/* ════════════════════════════════════════════════════════════════════════════
   NAVIGATION MANAGER COMPONENT - REVISED
   Path-safe active states with exact-match top-level highlighting
   Dropdown parent behavior preserved intentionally
   ════════════════════════════════════════════════════════════════════════════ */

// Helper functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const normalizePath = (input) => {
  if (!input) return '/';

  const url = new URL(input, window.location.origin);
  let path = url.pathname;

  // Normalize index.html to folder root
  path = path.replace(/index\.html$/i, '');

  // Remove trailing slash except for root
  path = path.replace(/\/+$/, '') || '/';

  return path;
};

const isInternalNavigableLink = (href) => {
  if (!href) return false;
  if (href.startsWith('#')) return false;
  if (href.startsWith('http://') || href.startsWith('https://')) return false;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  if (href === 'javascript:void(0)') return false;
  return true;
};

const isSamePage = (href) => {
  if (!isInternalNavigableLink(href)) return false;
  return normalizePath(href) === normalizePath(window.location.pathname);
};

const isExactPageMatch = (href) => {
  if (!isInternalNavigableLink(href)) return false;
  return normalizePath(href) === normalizePath(window.location.pathname);
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

    console.log('🫡 Navbar scroll effect initialized');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. NAV LINK CLICK HANDLERS (Page transition + Same-page nudge)
  // ═══════════════════════════════════════════════════════════════════════════

  if (navLinksAll.length > 0) {
    navLinksAll.forEach(link => {
      link.addEventListener('click', function (e) {
        // Allow Ctrl+Click / Meta+Click / middle click behavior
        if (e.ctrlKey || e.metaKey || e.button === 1) return;

        const href = this.getAttribute('href');

        if (isInternalNavigableLink(href)) {
          const isBookDemo = this.classList.contains('book-demo-button');

          // If already on this exact page, nudge instead of navigate
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

    console.log('🫡 Nav link click handlers initialized');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ACTIVE PAGE HIGHLIGHTING (EXACT MATCH ONLY)
  // ═══════════════════════════════════════════════════════════════════════════

  if (navLinksAll.length > 0) {
    navLinksAll.forEach(link => link.classList.remove('active'));

    navLinksAll.forEach(link => {
      const linkHref = link.getAttribute('href');
      const isBookDemo = link.classList.contains('book-demo-button');

      if (!isBookDemo && isExactPageMatch(linkHref)) {
        link.classList.add('active');
      }
    });

    console.log('🫡 Active page highlighting initialized');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. DROPDOWN ACTIVE CHILD DETECTION
  // ═══════════════════════════════════════════════════════════════════════════

  const dropdownPageMap = {
    'resources': ['faq.html', 'terms_of_use.html', 'privacy_policy.html'],
    'sapphire-smart': ['analytics.html', 'intelligence.html', 'sapphire_mobile.html', 'how-do-I-use-sapphire.html'],
  };

  Object.keys(dropdownPageMap).forEach(dropdownId => {
    const pages = dropdownPageMap[dropdownId];

    if (pages.includes(currentPage)) {
      const dropdownTrigger = document.querySelector(`[data-dropdown-id="${dropdownId}"]`);

      if (dropdownTrigger) {
        dropdownTrigger.classList.add('s-has-active-child');

        const dropdownMenu = dropdownTrigger
          .closest('.s-nav-dropdown-internal')
          ?.querySelector('.s-internal-dropdown-menu');

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

      // Remove top-level active class when current page belongs to dropdown group
      navLinksAll.forEach(l => l.classList.remove('active'));
    }
  });

  console.log('🫡 Dropdown active child detection initialized');

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. INTERNAL DROPDOWN MENU ITEM NUDGE (DROPDOWN-SAFE)
  // ═══════════════════════════════════════════════════════════════════════════

  const internalItems = document.querySelectorAll('.s-internal-menu-item');

  internalItems.forEach(item => {
    item.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Only prevent default if on same page
      if (this.classList.contains('s-active-page') || isSamePage(href)) {
        e.preventDefault();
        e.stopPropagation();
        nudgeActive(this);
        console.log('🔔 Nudged active dropdown item (no navigation)');
      }
      // If different page, allow normal navigation
    });
  });

  console.log('🫡 Internal dropdown menu item nudge initialized');

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. CLICK/PRESS-BASED DROPDOWN TOGGLE SYSTEM (TR-2)
  // ═══════════════════════════════════════════════════════════════════════════

  const dropdowns = $$('.s-nav-dropdown-internal, .s-sapphire-dropdown');

  const closeAllDropdowns = () => {
    document.querySelectorAll('.s-internal-dropdown-menu, .s-sapphire-menu').forEach(menu => {
      menu.classList.remove('show');
    });

    document.querySelectorAll('.dropdown-toggle, .s-sapphire-trigger').forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.classList.remove('show');
    });
  };

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-toggle, .s-sapphire-trigger');
    const menu = dropdown.querySelector('.s-internal-dropdown-menu, .s-sapphire-menu');

    if (!trigger || !menu) return;

    // Remove Bootstrap's data attribute to prevent conflict
    if (trigger.hasAttribute('data-bs-toggle')) {
      trigger.removeAttribute('data-bs-toggle');
    }

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const isOpen = menu.classList.contains('show');

      closeAllDropdowns();

      if (!isOpen) {
        menu.classList.add('show');
        trigger.setAttribute('aria-expanded', 'true');
        trigger.classList.add('show');
      }
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeAllDropdowns();
        trigger.focus();
      }
    });
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    const isDropdownClick = e.target.closest('.s-nav-dropdown-internal, .s-sapphire-dropdown');
    if (!isDropdownClick) {
      closeAllDropdowns();
    }
  });

  // Global Escape to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });

  console.log('🫡 Click-based dropdown system initialized (TR-2)');
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

  console.log('🫡 Smooth scroll initialized');
}