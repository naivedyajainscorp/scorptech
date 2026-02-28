/**
 * Floating Element Card Component
 * Handles floating icon animations and interactive hover effects
 * Generic component - can be used anywhere
 */

class FloatingElementCard {
    constructor(selector = '.philosophy-card-floating') {
        this.cards = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        if (this.cards.length === 0) return;

        this.setupHoverEffects();
        this.setupParallaxEffect();
        this.setupAccessibility();
    }

    /**
     * Enhanced hover effects with scale and shadow
     */
    setupHoverEffects() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.onCardHover(card);
            });

            card.addEventListener('mouseleave', () => {
                this.onCardLeave(card);
            });
        });
    }

    /**
     * Card hover handler
     */
    onCardHover(card) {
        const floatIcons = card.querySelectorAll('.float-icon-top, .float-icon-bottom');
        
        floatIcons.forEach(icon => {
            icon.style.animation = 'float-up-down 1.5s ease-in-out infinite';
        });
    }

    /**
     * Card leave handler
     */
    onCardLeave(card) {
        const floatIcons = card.querySelectorAll('.float-icon-top, .float-icon-bottom');
        
        floatIcons.forEach(icon => {
            icon.style.animation = 'float-up-down 3s ease-in-out infinite';
        });
    }

    /**
     * Parallax effect on mouse move
     */
    setupParallaxEffect() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                const floatTop = card.querySelector('.float-icon-top');
                const floatBottom = card.querySelector('.float-icon-bottom');
                
                if (floatTop) {
                    floatTop.style.transform = `translate(${rotateY}px, ${rotateX}px)`;
                }
                
                if (floatBottom) {
                    floatBottom.style.transform = `translate(${-rotateY}px, ${-rotateX}px)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                const floatTop = card.querySelector('.float-icon-top');
                const floatBottom = card.querySelector('.float-icon-bottom');
                
                if (floatTop) {
                    floatTop.style.transform = 'translate(0, 0)';
                }
                
                if (floatBottom) {
                    floatBottom.style.transform = 'translate(0, 0)';
                }
            });
        });
    }

    /**
     * Accessibility enhancements
     */
    setupAccessibility() {
        this.cards.forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', `Card ${index + 1}`);
            card.setAttribute('tabindex', '0');

            // Keyboard navigation
            card.addEventListener('focus', () => {
                card.style.transform = 'scale(1.02) translateY(-5px)';
            });

            card.addEventListener('blur', () => {
                card.style.transform = '';
            });
        });
    }

    /**
     * Destroy instance and cleanup
     */
    destroy() {
        this.cards.forEach(card => {
            card.replaceWith(card.cloneNode(true));
        });
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.floatingElementCard = new FloatingElementCard();
    });
} else {
    window.floatingElementCard = new FloatingElementCard();
}

export default FloatingElementCard;
