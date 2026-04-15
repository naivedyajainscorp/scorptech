/* ════════════════════════════════════════════════════════════════════════════
   MOBILE USP PAGE INITIALIZATION - FIXED SYNTAX
   ════════════════════════════════════════════════════════════════════════════ */


import { initMobilePhoneTilt } from '../components/MobilePhoneTilt.js';
import { initCarouselHoverPause } from '../components/CarouselHoverPause.js';


console.log('📱 Mobile USP page initialization started');


document.addEventListener('DOMContentLoaded', () => {
  console.log('🔵 Mobile USP page DOMContentLoaded');

  // Initialize 3D phone tilt parallax
  initMobilePhoneTilt();

  // Initialize carousel hover pause
  initCarouselHoverPause();

  console.log('🎉 Mobile USP page fully initialized');

  // ─────────────────────────────────────────────────────────────────────────
  // UNIFIED MOBILE PHONE TITLES POPULATION & EFFECTS
  // ─────────────────────────────────────────────────────────────────────────
  function initPhoneTitles() {
    console.log('📱 Initializing mobile phone titles...');

    const phoneTitles = {
      carousel: [
        'Workplaces', 'User Management', 'Master Data Management',
        'Smart Inventories', 'Item Requisition', 'Inspection and Reports',
        'Service and Maintenance', 'Employee Workstations', 'Sapphire'
      ],
      features: [
        '1-Touch Operations', 'Quick Data Logging', 'Smart Inventories',
        'On-The-Go Inspections', 'Instant Approvals', 'Live Tracking & Updates'
      ]
    };

    // 1. Carousel phones
    const carouselItems = document.querySelectorAll('#phoneCarousel .carousel-item');
    carouselItems.forEach((item, index) => {
      const screen = item.querySelector('.phonev2-screen');
      if (!screen) return; // ← FIXED: skip items without a phone screen

      let titleDiv = screen.querySelector('.mobile-phone-title');
      if (!titleDiv) {
        titleDiv = document.createElement('div');
        titleDiv.className = 'mobile-phone-title';
        screen.appendChild(titleDiv);
      }
      titleDiv.textContent = phoneTitles.carousel[index] || '';
      item.dataset.title = phoneTitles.carousel[index] || '';
    });

    // 2. Feature section phones
    const featurePhones = document.querySelectorAll('#mobile-usp-sections .phone-parallax-container');
    featurePhones.forEach((phone, index) => {
      const screen = phone.querySelector('.phonev2-screen');
      if (!screen) return; // ← FIXED: skip containers without a phone screen

      let titleDiv = screen.querySelector('.mobile-phone-title');
      if (!titleDiv) {
        titleDiv = document.createElement('div');
        titleDiv.className = 'mobile-phone-title';
        screen.appendChild(titleDiv);
      }
      titleDiv.textContent = phoneTitles.features[index] || '';
      phone.dataset.title = phoneTitles.features[index] || '';
    });

    // Hover effects sync
    document.querySelectorAll('.phone-parallax-container, .phonev2-screen').forEach(phone => {
      phone.addEventListener('mouseenter', () => {
        const title = phone.querySelector('.mobile-phone-title');
        if (title) title.classList.add('glow');
      });
      phone.addEventListener('mouseleave', () => {
        const title = phone.querySelector('.mobile-phone-title');
        if (title) title.classList.remove('glow');
      });
    });

    console.log(`✅ Initialized ${carouselItems.length + featurePhones.length} phone titles`);
  }

  initPhoneTitles();
});