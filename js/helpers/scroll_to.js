const nativeScrollTo = window.scrollTo.bind(window);

function getNavbarHeight() {
  const navbar = document.querySelector('.s-navbar') ||
                 document.querySelector('.navbar') ||
                 document.querySelector('[class*="navbar"]');
  if (!navbar) return 80;
  const cs = window.getComputedStyle(navbar);
  return navbar.offsetHeight
    + parseFloat(cs.marginTop    || 0)
    + parseFloat(cs.marginBottom || 0);
}

function getTop(el) {
  console.log('🟢 NEW getTop running');
  let top = 0;
  while (el) { top += el.offsetTop; el = el.offsetParent; }
  return top;
}

export function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navH = getNavbarHeight();
  const top = getTop(el) - navH - 16;
  console.log({ id, getTop: getTop(el), navH, finalTop: top, windowScrollY: window.scrollY });
  nativeScrollTo({ top, behavior: 'smooth' });
}
export function initScrollTo() {
  document.querySelectorAll('[data-scroll-to]').forEach(el => {
    el.addEventListener('click', () => {
      scrollTo(el.dataset.scrollTo);
    });
  });
}