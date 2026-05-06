/* ════════════════════════════════════════════════════════════════════════════
   S-FLOATING BUTTON COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */

export class SFloatingButton {
  constructor() {
    console.log('🔵 SFloatingButton: Constructor called');
    this.button   = document.querySelector('.s-fab-trigger');
    this.menu     = document.querySelector('.s-fab-menu');
    this.backdrop = document.querySelector('.s-fab-backdrop');
    this.menuItems = document.querySelectorAll('.s-fab-menu-item');
    this.isOpen   = false;

    // ── Core Modules dropdown refs ──
    this.cmToggle   = document.getElementById('cmDropdownToggle');
    this.cmDropdown = document.getElementById('cmDropdown');

    console.log('🔍 Elements found:', {
      button: !!this.button,
      menu: !!this.menu,
      backdrop: !!this.backdrop,
      menuItemsCount: this.menuItems.length,
      cmToggle: !!this.cmToggle,
      cmDropdown: !!this.cmDropdown
    });

    if (this.button && this.menu) {
      console.log('✅ Initializing floating button...');
      this.init();
    } else {
      console.error('❌ Floating button or menu not found');
    }
  }


  init() {
    this.handleButtonClick = (e) => {
      e.stopPropagation();
      console.log('🖱️ Button clicked');
      this.toggle();
    };

    this.handleBackdropClick = () => {
      console.log('🖱️ Backdrop clicked');
      this.close();
    };

    this.handleMenuItemClick = (e) => {
      console.log('🖱️ Menu item clicked');
      const item       = e.currentTarget;
      const dataTarget = item.dataset.target;

      if (dataTarget) {
        // ── Section scroll (no hash, no URL change) ──────────────────────
        e.preventDefault();
        this.close();
        const target = document.getElementById(dataTarget);
        if (target) {
          const navbar = document.querySelector('.s-navbar') ||
                         document.querySelector('.navbar') ||
                         document.querySelector('[class*="navbar"]');
          let navbarHeight = 80;
          if (navbar) {
            const cs = window.getComputedStyle(navbar);
            navbarHeight = navbar.offsetHeight
              + parseFloat(cs.marginTop    || 0)
              + parseFloat(cs.marginBottom || 0);
          }
          const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
          console.log('📍 Scroll target:', dataTarget, 'navbarHeight:', navbarHeight, 'targetTop:', targetTop);
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }

      } else {
        // ── External page link — close menu, let navigation happen ───────
        this.close();
      }
    };

    this.handleMenuClick = (e) => {
      e.stopPropagation();
    };

    this.handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        console.log('⌨️ Escape key pressed');
        this.close();
      }
    };

    this.handleMenuScroll = () => {
      this.updateScrollIndicators();
    };

    // ── Core listeners ────────────────────────────────────────────────────
    this.button.addEventListener('click', this.handleButtonClick, { passive: false });

    if (this.backdrop) {
      this.backdrop.addEventListener('click', this.handleBackdropClick, { passive: true });
    }

    this.menuItems.forEach(item => {
      item.addEventListener('click', this.handleMenuItemClick, { passive: true });
    });

    this.menu.addEventListener('click', this.handleMenuClick, { passive: false });

    const menuBody = this.menu.querySelector('.s-fab-menu-body');
    if (menuBody) {
      menuBody.addEventListener('scroll', this.handleMenuScroll, { passive: true });
      this._menuBody = menuBody;
    }

    // ── Core Modules dropdown toggle ──────────────────────────────────────
    if (this.cmToggle && this.cmDropdown) {
      this.cmToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = this.cmDropdown.classList.toggle('open');
        this.cmToggle.classList.toggle('open', isOpen);
        this.cmToggle.setAttribute('aria-expanded', isOpen);
      });

      // Sub-item clicks — scroll + close FAB
      this.cmDropdown.querySelectorAll('.s-fab-cm-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          this.close();
          const target = document.getElementById(item.dataset.target);
          if (target) {
            const navbar = document.querySelector('.s-navbar') ||
                           document.querySelector('.navbar') ||
                           document.querySelector('[class*="navbar"]');
            let navbarHeight = 80;
            if (navbar) {
              const cs = window.getComputedStyle(navbar);
              navbarHeight = navbar.offsetHeight
                + parseFloat(cs.marginTop    || 0)
                + parseFloat(cs.marginBottom || 0);
            }
            const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      });
    }

    console.log('✅ Floating button initialized successfully');
  }


  updateScrollIndicators() {
    if (!this._menuBody) return;

    const { scrollTop, scrollHeight, clientHeight } = this._menuBody;
    const topIndicator    = this.menu.querySelector('.s-fab-scroll-indicator-top');
    const bottomIndicator = this.menu.querySelector('.s-fab-scroll-indicator-bottom');

    if (topIndicator) {
      topIndicator.classList.toggle('visible', scrollTop > 0);
    }
    if (bottomIndicator) {
      bottomIndicator.classList.toggle('visible', scrollTop + clientHeight < scrollHeight - 5);
    }
  }


  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }


  open() {
    console.log('📂 Opening menu...');
    this.isOpen = true;
    this.button.classList.add('active');
    this.menu.classList.add('active');
    if (this.backdrop) this.backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.handleEscapeKey, { passive: true });
  }


  close() {
    console.log('📁 Closing menu...');
    this.isOpen = false;
    this.button.classList.remove('active');
    this.menu.classList.remove('active');
    if (this.backdrop) this.backdrop.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleEscapeKey);

    // ── Collapse cm dropdown on FAB close ─────────────────────────────
    if (this.cmDropdown) this.cmDropdown.classList.remove('open');
    if (this.cmToggle)   this.cmToggle.classList.remove('open');
  }


  destroy() {
    this.button.removeEventListener('click', this.handleButtonClick);
    if (this.backdrop) {
      this.backdrop.removeEventListener('click', this.handleBackdropClick);
    }
    this.menuItems.forEach(item => {
      item.removeEventListener('click', this.handleMenuItemClick);
    });
    this.menu.removeEventListener('click', this.handleMenuClick);
    document.removeEventListener('keydown', this.handleEscapeKey);
  }
}