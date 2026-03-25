/* ════════════════════════════════════════════════════════════════════════════
   S-FLOATING BUTTON COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */

export class SFloatingButton {
  constructor() {
    console.log('🔵 SFloatingButton: Constructor called');
    this.button = document.querySelector('.s-fab-trigger');
    this.menu = document.querySelector('.s-fab-menu');
    this.backdrop = document.querySelector('.s-fab-backdrop');
    this.menuItems = document.querySelectorAll('.s-fab-menu-item');
    this.isOpen = false;

    console.log('🔍 Elements found:', {
      button: !!this.button,
      menu: !!this.menu,
      backdrop: !!this.backdrop,
      menuItemsCount: this.menuItems.length
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
      const item = e.currentTarget;
      const href = item.getAttribute('href');

      if (href && href.startsWith('#')) {
        e.preventDefault();
        this.close();
        const target = document.querySelector(href);
        if (target) {
          // Get all possible navbar elements - check multiple selectors for compatibility
          const navbar = document.querySelector('.s-navbar') || 
                       document.querySelector('.navbar') ||
                       document.querySelector('[class*="navbar"]');
          
          // Calculate navbar height with fallback
          let navbarHeight = 80; // default fallback
          if (navbar) {
            const computedStyle = window.getComputedStyle(navbar);
            const height = parseFloat(computedStyle.height) || navbar.offsetHeight;
            const marginTop = parseFloat(computedStyle.marginTop) || 0;
            const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
            navbarHeight = height + marginTop + marginBottom;
          }
          
          // Additional offset for smooth scrolling (16px as before)
          const additionalOffset = 16;
          
          // Calculate target position
          const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - additionalOffset;
          
          console.log('📍 Scroll target:', href, 'navbarHeight:', navbarHeight, 'targetTop:', targetTop);
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      } else {
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

    // Scroll handler for scroll indicators
    this.handleMenuScroll = () => {
      this.updateScrollIndicators();
    };

    this.button.addEventListener('click', this.handleButtonClick, { passive: false });

    if (this.backdrop) {
      this.backdrop.addEventListener('click', this.handleBackdropClick, { passive: true });
    }

    this.menuItems.forEach(item => {
      item.addEventListener('click', this.handleMenuItemClick, { passive: true });
    });

    this.menu.addEventListener('click', this.handleMenuClick, { passive: false });

    // Add scroll listener to menu body for scroll indicators
    const menuBody = this.menu.querySelector('.s-fab-menu-body');
    if (menuBody) {
      menuBody.addEventListener('scroll', this.handleMenuScroll, { passive: true });
      // Initial check after menu opens
      this._menuBody = menuBody;
    }

    console.log('✅ Floating button initialized successfully');
  }

  updateScrollIndicators() {
    if (!this._menuBody) return;
    
    const { scrollTop, scrollHeight, clientHeight } = this._menuBody;
    const topIndicator = this.menu.querySelector('.s-fab-scroll-indicator-top');
    const bottomIndicator = this.menu.querySelector('.s-fab-scroll-indicator-bottom');
    
    // Show top indicator when scrolled down (has content above)
    if (topIndicator) {
      if (scrollTop > 0) {
        topIndicator.classList.add('visible');
      } else {
        topIndicator.classList.remove('visible');
      }
    }
    
    // Show bottom indicator when not at bottom (has more content below)
    if (bottomIndicator) {
      if (scrollTop + clientHeight < scrollHeight - 5) {
        bottomIndicator.classList.add('visible');
      } else {
        bottomIndicator.classList.remove('visible');
      }
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

  document.body.style.overflow = 'hidden'; // lock scroll — no paddingRight needed

  document.addEventListener('keydown', this.handleEscapeKey, { passive: true });
}

close() {
  console.log('📁 Closing menu...');
  this.isOpen = false;
  this.button.classList.remove('active');
  this.menu.classList.remove('active');
  if (this.backdrop) this.backdrop.classList.remove('active');

  document.body.style.overflow = ''; // restore — page position untouched

  document.removeEventListener('keydown', this.handleEscapeKey);
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
