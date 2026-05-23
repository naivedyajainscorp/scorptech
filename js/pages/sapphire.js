/* ════════════════════════════════════════════════════════════════════════════
   SAPPHIRE PAGE INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */

import { initInfiniteScroll } from '../components/InfiniteScroll.js';

console.log('💎 Sapphire page initialization started');


/* ════════════════════════════════════════════════════════════════════════════
   SAPPHIRE CAPABILITY CARDS ANIMATIONS
   Migrated from capabilities.html
   ════════════════════════════════════════════════════════════════════════════ */


// ─────────────────────────────────────────────────────────────────────────────
// 1. Guides Card - Step Indicators Animation
// ─────────────────────────────────────────────────────────────────────────────

function initGuidesStepAnimation() {
    const steps = document.querySelectorAll('.s-cpblts-step-indicators .s-cpblts-step');
    const playIcon = document.querySelector('.s-cpblts-play-anim .s-cpblts-play-circle i');
    const progFill = document.querySelector('.s-cpblts-progress .s-cpblts-progress-fill');

    if (!steps.length || !playIcon || !progFill) {
        console.log('ℹ️ Guides card animation elements not found');
        return;
    }

    const phases = [
        { icon: 'fas fa-book-open', progress: '25%' },
        { icon: 'bi bi-ui-checks', progress: '50%' },
        { icon: 'fas fa-magnifying-glass-chart', progress: '75%' },
        { icon: 'fas fa-crown', progress: '100%' },
    ];

    let current = 0;

    function activateStep(index) {
        steps.forEach((step, i) => step.classList.toggle('active', i === index));

        playIcon.style.opacity = '0';
        playIcon.style.transform = 'scale(0.4) rotate(-15deg)';

        setTimeout(() => {
            playIcon.className = phases[index].icon;
            playIcon.style.opacity = '1';
            playIcon.style.transform = 'scale(1) rotate(0deg)';
        }, 180);

        progFill.style.width = phases[index].progress;
    }

    activateStep(0);

    setInterval(() => {
        current = (current + 1) % phases.length;
        activateStep(current);
    }, 2200);

    console.log('✅ Guides step animation initialized');
}


// ─────────────────────────────────────────────────────────────────────────────
// 2. Analytics Card - Pie Chart Animation
// ─────────────────────────────────────────────────────────────────────────────

function initAnalyticsPieChart() {
    const C = 251.33;

    const pie1 = document.querySelector('.s-cpblts-pie-chart .s-cpblts-pie-1');
    const pie2 = document.querySelector('.s-cpblts-pie-chart .s-cpblts-pie-2');
    const pie3 = document.querySelector('.s-cpblts-pie-chart .s-cpblts-pie-3');

    if (!pie1 || !pie2 || !pie3) {
        console.log('ℹ️ Analytics pie chart elements not found');
        return;
    }

    function getSlices() {
        let a = 25 + Math.floor(Math.random() * 35);
        let b = 15 + Math.floor(Math.random() * 30);
        let c = 100 - a - b;
        if (c < 10) {
            a -= (10 - c);
            c = 10;
        }
        return [a, b, c];
    }

    function resetAll() {
        [pie1, pie2, pie3].forEach(el => {
            el.style.transition = 'none';
            el.setAttribute('stroke-dasharray', `0 ${C}`);
        });
    }

    function cycle() {
        resetAll();

        setTimeout(() => {
            const [p1, p2, p3] = getSlices();
            const s1 = (p1 / 100) * C;
            const s2 = (p2 / 100) * C;
            const s3 = (p3 / 100) * C;

            pie1.setAttribute('transform', 'rotate(-90 50 50)');
            pie2.setAttribute('transform', `rotate(${(-90 + (p1 / 100) * 360).toFixed(2)} 50 50)`);
            pie3.setAttribute('transform', `rotate(${(-90 + ((p1 + p2) / 100) * 360).toFixed(2)} 50 50)`);

            requestAnimationFrame(() => {
                pie1.style.transition = 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                pie1.setAttribute('stroke-dasharray', `${s1.toFixed(2)} ${(C - s1).toFixed(2)}`);

                setTimeout(() => {
                    pie2.style.transition = 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    pie2.setAttribute('stroke-dasharray', `${s2.toFixed(2)} ${(C - s2).toFixed(2)}`);
                }, 320);

                setTimeout(() => {
                    pie3.style.transition = 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    pie3.setAttribute('stroke-dasharray', `${s3.toFixed(2)} ${(C - s3).toFixed(2)}`);
                }, 640);
            });

            setTimeout(cycle, 3600);
        }, 80);
    }

    setTimeout(cycle, 600);

    console.log('✅ Analytics pie chart animation initialized');
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. Mobile USP Card - Work Order List Animation
// ─────────────────────────────────────────────────────────────────────────────

function initMobileUSPWorkOrder() {
    const inner = document.querySelector('.s-cpblts-mob-wo-inner');
    if (!inner) {
        console.log('ℹ️ Mobile USP work order elements not found');
        return;
    }

    const palette = [
        '#fb923c', '#f97316', '#ea580c', '#c2410c',
        '#4ade80', '#22c55e', '#16a34a', '#15803d',
        '#f472b6', '#ec4899', '#db2777', '#be185d',
        '#f87171', '#ef4444', '#dc2626', '#b91c1c',
        '#facc15', '#eab308', '#ca8a04',
        '#22d3ee', '#0ea5e9', '#38bdf8', '#0891b2', '#2563eb', '#0066cc',
    ];

    const ITEM_H = 28;
    const MAX = 8;
    let pool = [];

    function rnd(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function makeItem(color) {
        const d = document.createElement('div');
        d.className = 's-cpblts-mob-wo-item';
        const lineW = Math.random() > 0.5 ? 'long' : 'medium';
        d.innerHTML = `
            <div class="s-cpblts-wo-dot"
                style="background:${color};
                       box-shadow:0 0 6px ${color}cc,0 0 12px ${color}55;">
            </div>
            <div class="s-cpblts-wo-lines">
                <div class="s-cpblts-wo-line ${lineW}"></div>
                <div class="s-cpblts-wo-line short"></div>
            </div>`;
        return d;
    }

    for (let i = 0; i < 6; i++) {
        const item = makeItem(rnd(palette));
        inner.appendChild(item);
        pool.push(item);
    }

    function scrollIn(color) {
        const item = makeItem(color);
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        inner.appendChild(item);
        pool.push(item);

        inner.style.transition = 'transform 0.52s cubic-bezier(0.4,0,0.2,1)';
        inner.style.transform = `translateY(-${ITEM_H}px)`;

        requestAnimationFrame(() => requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.38s ease, transform 0.38s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }));

        setTimeout(() => {
            inner.style.transition = 'none';
            inner.style.transform = 'translateY(0)';
            if (pool.length > MAX) {
                const old = pool.shift();
                if (old && old.parentNode === inner) inner.removeChild(old);
            }
        }, 540);
    }

    function cycle() {
        try {
            const count = Math.random() > 0.45 ? 1 : 2;
            const anchor = rnd(palette);

            for (let i = 0; i < count; i++) {
                const color = Math.random() > 0.38 ? rnd(palette) : anchor;
                setTimeout(() => scrollIn(color), i * 520);
            }

            const pause = 2400 + count * 520 + Math.random() * 600;
            setTimeout(cycle, pause);
        } catch (e) {
            console.log('WO cycle error:', e);
            setTimeout(cycle, 3000);
        }
    }

    setTimeout(cycle, 1400);

    console.log('✅ Mobile USP work order animation initialized');
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. Sapphire Hero Stage Visualization Counters
// ─────────────────────────────────────────────────────────────────────────────

function initSapphireStageViz() {
    function animCount(el, target, suffix, duration) {
        const start = performance.now();

        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * target) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    let count = 1284;

    const procEl = document.getElementById('proc-count');
    const m1 = document.getElementById('m1');
    const m2 = document.getElementById('m2');
    const m3 = document.getElementById('m3');

    if (!procEl || !m1 || !m2 || !m3) {
        console.log('ℹ️ Sapphire stage visualization elements not found');
        return;
    }

    function tickCount() {
        count += Math.floor(Math.random() * 3) + 1;
        procEl.textContent = count.toLocaleString();
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        m1.textContent = '2,400+';
        m2.textContent = '890+';
        m3.textContent = '5,100+';
        procEl.textContent = '1,284';
        console.log('✅ Sapphire stage visualization initialized (reduced motion)');
        return;
    }

    setTimeout(() => {
        animCount(m1, 2400, '+', 1800);
        animCount(m2, 890, '+', 1600);
        animCount(m3, 5100, '+', 2000);
        procEl.textContent = count.toLocaleString();
        setInterval(tickCount, 1800);
    }, 1600);

    console.log('✅ Sapphire stage visualization initialized');
}


// ─────────────────────────────────────────────────────────────────────────────
// Main initializer for all capability card animations
// ─────────────────────────────────────────────────────────────────────────────

function initSapphireCapabilityCards() {
    console.log('💎 Initializing Sapphire capability card animations...');
    initGuidesStepAnimation();
    initAnalyticsPieChart();
    initMobileUSPWorkOrder();
}


// ─────────────────────────────────────────────────────────────────────────────
// 1. AOS (Animate On Scroll) Initialization
// ─────────────────────────────────────────────────────────────────────────────

function initAOS() {
    if (typeof AOS === 'undefined') {
        console.warn('⚠️ AOS library not loaded');
        return;
    }

    AOS.init({
        duration: 300,
        once: true,
        offset: 50
    });

    console.log('✅ AOS initialized');
}


// ─────────────────────────────────────────────────────────────────────────────
// 2. Sapphire Hero Grid Generator
// ─────────────────────────────────────────────────────────────────────────────

function initializeSapphireHeroGrid() {
    const sapphireGrid = document.getElementById('sapphireCorporateGrid');
    if (!sapphireGrid) {
        console.log('ℹ️ Sapphire hero grid container not found');
        return;
    }

    sapphireGrid.innerHTML = '';

    let gridCols = 10;
    let gridRows = 10;

    if (window.innerWidth < 576) {
        gridCols = 5;
        gridRows = 6;
    } else if (window.innerWidth < 768) {
        gridCols = 6;
        gridRows = 8;
    } else if (window.innerWidth < 992) {
        gridCols = 8;
        gridRows = 9;
    }

    const totalCells = gridCols * gridRows;

    for (let i = 0; i < totalCells; i++) {
        const gridCell = document.createElement('div');
        gridCell.className = 'sapphire-grid-cell';

        const gridPulse = document.createElement('div');
        gridPulse.className = 'sapphire-grid-pulse';

        const randomDelay = Math.random() * 2;
        gridCell.style.animationDelay = `${randomDelay}s`;
        gridPulse.style.animationDelay = `${randomDelay + 1}s`;

        gridCell.appendChild(gridPulse);
        sapphireGrid.appendChild(gridCell);
    }

    console.log(`✅ Sapphire hero grid initialized (${gridCols}x${gridRows} = ${totalCells} cells)`);
}


/* ═══════════════════════════════════════════════════════════════
   CORE MODULES STICKY NAV
═══════════════════════════════════════════════════════════════ */

function initCmNav() {
    const cmSectionIds = [
        'cm-workplace_management',
        'cm-user_management',
        'cm-master_data_management',
        'cm-inventory_management',
        'cm-request_handling',
        'cm-inspection_reporting',
        'cm-report_resolution',
        'cm-service_maintenance',
        'cm-my_workstation'
    ];

    const cmNavItems = document.querySelectorAll('.cm-nav-item');
    const cmNav = document.querySelector('.cm-nav');
    const cmNavStart = document.getElementById('cm-workplace_management');
    const cmNavEnd = document.getElementById('cm-my_workstation');

    function cmGetTop(el) {
        let top = 0;
        while (el) {
            top += el.offsetTop;
            el = el.offsetParent;
        }
        return top;
    }

    cmNavItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById(item.dataset.target);
            if (target) {
                const navbar = document.querySelector('.s-navbar') ||
                    document.querySelector('.navbar') ||
                    document.querySelector('[class*="navbar"]');

                let navbarHeight = 88;
                if (navbar) {
                    const cs = window.getComputedStyle(navbar);
                    navbarHeight = navbar.offsetHeight
                        + parseFloat(cs.marginTop || 0)
                        + parseFloat(cs.marginBottom || 0);
                }

                const cmNavHeight = cmNav ? cmNav.offsetHeight : 0;
                const top = cmGetTop(target) - navbarHeight - cmNavHeight - 0;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    if (cmNav && cmNavStart && cmNavEnd) {
        function checkCmNavVisibility() {
            const scrollY = window.scrollY;
            const startTop = cmGetTop(cmNavStart);
            const endBottom = cmGetTop(cmNavEnd) + cmNavEnd.offsetHeight - 200;
            cmNav.classList.toggle('cm-nav-visible', scrollY >= startTop && scrollY < endBottom);
        }

        window.addEventListener('scroll', checkCmNavVisibility, { passive: true });
        checkCmNavVisibility();
    }

    function scrollCmNavToActive() {
        const navInner = document.querySelector('.cm-nav-inner');
        const activeItem = navInner?.querySelector('.cm-nav-item.active');
        if (!navInner || !activeItem) return;

        navInner.scrollTo({
            left: activeItem.offsetLeft - navInner.offsetWidth / 2 + activeItem.offsetWidth / 2,
            behavior: 'smooth',
        });
    }

    function updateCmNav() {
        const navbar = document.querySelector('.s-navbar') ||
            document.querySelector('.navbar') ||
            document.querySelector('[class*="navbar"]');

        const navH = (navbar ? navbar.offsetHeight : 88) + (cmNav ? cmNav.offsetHeight : 0) + 48;
        const scrollY = window.scrollY + navH;
        let current = '';

        cmSectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && cmGetTop(el) <= scrollY) current = id.replace('cm-', '');
        });

        cmNavItems.forEach(item => item.classList.toggle('active', item.dataset.domain === current));
        scrollCmNavToActive();
    }

    window.addEventListener('scroll', updateCmNav, { passive: true });
    updateCmNav();

    console.log('✅ cm-nav initialized');
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. Industry Card Pill Rails — Infinite Scroll
// ─────────────────────────────────────────────────────────────────────────────

function initIndustryPillRails() {
    const rails = document.querySelectorAll('.s-cm-feature-subrail');
    if (!rails.length) {
        console.log('ℹ️ Industry pill rail containers not found');
        return;
    }

    let count = 0;
    rails.forEach((rail, i) => {
        rail.id = `industry-pill-rail-${i}`;
        const result = initInfiniteScroll(`#${rail.id}`, {
            direction: 'left',
            speed: 'normal',
            cloneMultiplier: 2
        });
        if (result) count++;
    });

    console.log(`✅ Industry pill rails initialized: ${count}/${rails.length}`);
}


// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initializeSapphireHeroGrid();
    initCmNav();
    initSapphireCapabilityCards();
    initIndustryPillRails();
    initSapphireStageViz();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initializeSapphireHeroGrid();
        }, 250);
    }, { passive: true });

    console.log('✅ Sapphire page fully initialized');
});


// Remove loading class when page fully loads
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
}, { passive: true });