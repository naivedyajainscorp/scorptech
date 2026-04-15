document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────
  // 🔹 TOC INTERSECTION OBSERVER
  // ─────────────────────────────
  (function () {
    const sections     = Array.from(document.querySelectorAll('.s-blog-section[id]'));
    const desktopItems = document.querySelectorAll('#sBlogTocDesktop li');
    const mobileItems  = document.querySelectorAll('#sBlogTocMobile  li');
    if (!sections.length) return;

    function setActive(idx) {
      [desktopItems, mobileItems].forEach(list =>
        list.forEach((li, i) => li.classList.toggle('is-active', i === idx))
      );
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target);
          if (idx !== -1) setActive(idx);
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
  })();


  // ─────────────────────────────
  // 🔹 TOC DRAWER CONTROLLER
  // ─────────────────────────────
  (function () {
    const fab       = document.getElementById('sBlogTocFab');
    const drawer    = document.getElementById('sBlogTocDrawer');
    const backdrop  = document.getElementById('sBlogDrawerBackdrop');
    const closeBtn  = document.getElementById('sBlogDrawerClose');
    const closeBtn2 = document.getElementById('sBlogDrawerClose2');
    const navbar    = document.getElementById('scorpNavbar');
    const links     = drawer.querySelectorAll('.s-drawer-link');
    if (!fab || !drawer) return;

    const isMobile = () => window.innerWidth < 992;

    function openDrawer() {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      fab.setAttribute('aria-expanded', 'true');
      drawer._bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      navHide();
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = drawer._bodyOverflow || '';
      navShow();
    }

    function navHide() {
      if (!isMobile()) return;
      navbar.classList.remove('s-nav-showing', 's-nav-hidden');
      navbar.classList.add('s-nav-hiding');
      navbar.addEventListener('animationend', function h(e) {
        if (e.animationName !== 's-nav-hide') return;
        navbar.removeEventListener('animationend', h);
        navbar.classList.remove('s-nav-hiding');
        navbar.classList.add('s-nav-hidden');
      });
    }

    function navShow() {
      if (!isMobile()) return;
      navbar.classList.remove('s-nav-hiding', 's-nav-hidden');
      navbar.classList.add('s-nav-showing');
      navbar.addEventListener('animationend', function s(e) {
        if (e.animationName !== 's-nav-show') return;
        navbar.removeEventListener('animationend', s);
        navbar.classList.remove('s-nav-showing');
      });
    }

    fab.addEventListener('click', openDrawer);
    backdrop.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    closeBtn2.addEventListener('click', closeDrawer);
    links.forEach(link => link.addEventListener('click', () => closeDrawer()));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  })();


  // ─────────────────────────────
  // 🔹 TABLE → CARD LABELS
  // ─────────────────────────────
  document.querySelectorAll('.s-blog-table table').forEach(table => {
    const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
    if (!headers.length) return;

    table.querySelectorAll('tbody tr').forEach(row => {
      [...row.querySelectorAll('td')].forEach((td, i) => {
        if (!td.querySelector('.s-td-label')) {
          const span = document.createElement('span');
          span.className = 's-td-label';
          span.textContent = headers[i] || '';
          td.prepend(span);
        }
      });
    });
  });

});