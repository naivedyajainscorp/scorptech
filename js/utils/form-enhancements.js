/**
 * SAPPHIRE FORM ENHANCEMENTS
 * Universal form utilities for all pages
 */

const FormEnhancements = {
    
    /**
     * Initialize dropdown icon toggle
     */
    initDropdownToggle: function() {
        const selectElements = document.querySelectorAll('.form-select, select');
        
        selectElements.forEach(select => {
            // Skip if already initialized
            if (select.dataset.dropdownInitialized === 'true') return;
            select.dataset.dropdownInitialized = 'true';
            
            let dropdownOpen = false;
            
            // Toggle on mousedown
            select.addEventListener('mousedown', function(e) {
                if (document.activeElement === this) {
                    dropdownOpen = !dropdownOpen;
                } else {
                    dropdownOpen = true;
                }
                
                this.classList.toggle('is-open', dropdownOpen);
            });
            
            // Close on selection
            select.addEventListener('change', function() {
                this.classList.remove('is-open');
                dropdownOpen = false;
            });
            
            // Close on blur
            select.addEventListener('blur', function() {
                this.classList.remove('is-open');
                dropdownOpen = false;
            });
            
            // Detect close without selection
            select.addEventListener('click', function() {
                setTimeout(() => {
                    if (!this.matches(':focus')) {
                        this.classList.remove('is-open');
                        dropdownOpen = false;
                    }
                }, 50);
            });
        });
    },
    
    /**
     * Initialize all form enhancements
     */
    init: function() {
        this.initDropdownToggle();
        // Add more form enhancements here in the future
    },
    
    /**
     * Refresh for dynamically added content
     */
    refresh: function() {
        this.initDropdownToggle();
    }
};

// Expose globally
window.FormEnhancements = FormEnhancements;

// ✅ ES6 Module Export (for main.js)
export { FormEnhancements };
