/* ════════════════════════════════════════════════════════════════════════════
   CAROUSEL HOVER PAUSE COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */

export function initCarouselHoverPause() {
  const carousels = document.querySelectorAll('[data-bs-ride="carousel"]');
  
  if (carousels.length === 0) {
    console.log('⚠️ No carousels found');
    return;
  }

  carousels.forEach(carousel => {
    let carouselInstance = bootstrap.Carousel.getInstance(carousel);
    
    if (!carouselInstance) {
      carouselInstance = new bootstrap.Carousel(carousel);
    }

    carousel.addEventListener('mouseenter', () => {
      carouselInstance.pause();
    }, { passive: true });

    carousel.addEventListener('mouseleave', () => {
      carouselInstance.cycle();
    }, { passive: true });
  });

  console.log('✅ Carousel hover pause initialized for', carousels.length, 'carousels');
}
