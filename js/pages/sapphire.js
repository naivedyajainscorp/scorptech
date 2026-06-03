/* ════════════════════════════════════════════════════════════════════════════
   SAPPHIRE PAGE INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */
import { initInfiniteScroll } from '../components/InfiniteScroll.js';

console.log('💎 Sapphire page initialization started');

/* ═══════════════════════════════════════════════════════════════
CAPABILITY CARDS ANIMATIONS
═══════════════════════════════════════════════════════════════ */
function initGuidesStepAnimation() {
    const steps = document.querySelectorAll('.s-cpblts-step-indicators .s-cpblts-step');
    const playIcon = document.querySelector('.s-cpblts-play-anim .s-cpblts-play-circle i');
    const progFill = document.querySelector('.s-cpblts-progress .s-cpblts-progress-fill');
    if (!steps.length || !playIcon || !progFill) return;

    const phases = [
        { icon: 'fas fa-book-open', progress: '25%' },
        { icon: 'bi bi-ui-checks', progress: '50%' },
        { icon: 'fas fa-magnifying-glass-chart', progress: '75%' },
        { icon: 'fas fa-crown', progress: '100%' }
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
    setInterval(() => { current = (current + 1) % phases.length; activateStep(current); }, 2200);
}

function initAnalyticsPieChart() {
    const C = 251.33;
    const pie1 = document.querySelector('.s-cpblts-pie-chart .s-cpblts-pie-1');
    const pie2 = document.querySelector('.s-cpblts-pie-chart .s-cpblts-pie-2');
    const pie3 = document.querySelector('.s-cpblts-pie-chart .s-cpblts-pie-3');
    if (!pie1 || !pie2 || !pie3) return;

    function getSlices() {
        let a = 25 + Math.floor(Math.random() * 35);
        let b = 15 + Math.floor(Math.random() * 30);
        let c = 100 - a - b;
        if (c < 10) { a -= (10 - c); c = 10; }
        return [a, b, c];
    }
    function resetAll() {
        [pie1, pie2, pie3].forEach(el => { el.style.transition = 'none'; el.setAttribute('stroke-dasharray', `0 ${C}`); });
    }
    function cycle() {
        resetAll();
        setTimeout(() => {
            const [p1, p2, p3] = getSlices();
            pie1.setAttribute('transform', 'rotate(-90 50 50)');
            pie2.setAttribute('transform', `rotate(${(-90 + (p1 / 100) * 360).toFixed(2)} 50 50)`);
            pie3.setAttribute('transform', `rotate(${(-90 + ((p1 + p2) / 100) * 360).toFixed(2)} 50 50)`);
            requestAnimationFrame(() => {
                pie1.style.transition = 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)';
                pie1.setAttribute('stroke-dasharray', `${(p1/100*C).toFixed(2)} ${(C-(p1/100*C)).toFixed(2)}`);
                setTimeout(() => {
                    pie2.style.transition = 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)';
                    pie2.setAttribute('stroke-dasharray', `${(p2/100*C).toFixed(2)} ${(C-(p2/100*C)).toFixed(2)}`);
                }, 320);
                setTimeout(() => {
                    pie3.style.transition = 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)';
                    pie3.setAttribute('stroke-dasharray', `${(p3/100*C).toFixed(2)} ${(C-(p3/100*C)).toFixed(2)}`);
                }, 640);
            });
            setTimeout(cycle, 3600);
        }, 80);
    }
    setTimeout(cycle, 600);
}

function initMobileUSPWorkOrder() {
    const inner = document.querySelector('.s-cpblts-mob-wo-inner');
    if (!inner) return;
    const palette = ['#fb923c','#f97316','#ea580c','#c2410c','#4ade80','#22c55e','#16a34a','#15803d','#f472b6','#ec4899','#db2777','#be185d','#f87171','#ef4444','#dc2626','#b91c1c','#facc15','#eab308','#ca8a04','#22d3ee','#0ea5e9','#38bdf8','#0891b2','#2563eb','#0066cc'];
    const ITEM_H = 28, MAX = 8;
    let pool = [];

    function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function makeItem(color) {
        const d = document.createElement('div');
        d.className = 's-cpblts-mob-wo-item';
        const lineW = Math.random() > 0.5 ? 'long' : 'medium';
        d.innerHTML = `<div class="s-cpblts-wo-dot" style="background:${color};box-shadow:0 0 6px ${color}cc,0 0 12px ${color}55;"></div><div class="s-cpblts-wo-lines"><div class="s-cpblts-wo-line ${lineW}"></div><div class="s-cpblts-wo-line short"></div></div>`;
        return d;
    }
    for (let i = 0; i < 6; i++) { const item = makeItem(rnd(palette)); inner.appendChild(item); pool.push(item); }

    function scrollIn(color) {
        const item = makeItem(color);
        item.style.opacity = '0'; item.style.transform = 'translateY(10px)';
        inner.appendChild(item); pool.push(item);
        inner.style.transition = 'transform 0.52s cubic-bezier(0.4,0,0.2,1)';
        inner.style.transform = `translateY(-${ITEM_H}px)`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.38s ease, transform 0.38s ease';
            item.style.opacity = '1'; item.style.transform = 'translateY(0)';
        }));
        setTimeout(() => {
            inner.style.transition = 'none'; inner.style.transform = 'translateY(0)';
            if (pool.length > MAX) { const old = pool.shift(); if (old && old.parentNode === inner) inner.removeChild(old); }
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
            setTimeout(cycle, 2400 + count * 520 + Math.random() * 600);
        } catch (e) { setTimeout(cycle, 3000); }
    }
    setTimeout(cycle, 1400);
}

function initSapphireCapabilityCards() {
    initGuidesStepAnimation(); initAnalyticsPieChart(); initMobileUSPWorkOrder();
}

/* ═══════════════════════════════════════════════════════════════
UI & NAV INITIALIZERS
═══════════════════════════════════════════════════════════════ */
function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({ duration: 300, once: true, offset: 50 });
}

function initializeSapphireHeroGrid() {
    const sapphireGrid = document.getElementById('sapphireCorporateGrid');
    if (!sapphireGrid) return;
    sapphireGrid.innerHTML = '';
    let gridCols = 10, gridRows = 10;
    if (window.innerWidth < 576) { gridCols = 5; gridRows = 6; }
    else if (window.innerWidth < 768) { gridCols = 6; gridRows = 8; }
    else if (window.innerWidth < 992) { gridCols = 8; gridRows = 9; }
    const totalCells = gridCols * gridRows;
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div'); cell.className = 'sapphire-grid-cell';
        const pulse = document.createElement('div'); pulse.className = 'sapphire-grid-pulse';
        const delay = Math.random() * 2;
        cell.style.animationDelay = `${delay}s`; pulse.style.animationDelay = `${delay + 1}s`;
        cell.appendChild(pulse); sapphireGrid.appendChild(cell);
    }
}

function initCmNav() {
    const ids = ['cm-workplace_management','cm-user_management','cm-master_data_management','cm-inventory_management','cm-request_handling','cm-inspection_reporting','cm-report_resolution','cm-service_maintenance','cm-my_workstation'];
    const items = document.querySelectorAll('.cm-nav-item');
    const nav = document.querySelector('.cm-nav');
    const start = document.getElementById('cm-workplace_management');
    const end = document.getElementById('cm-my_workstation');
    function getTop(el) { let t = 0; while(el) { t += el.offsetTop; el = el.offsetParent; } return t; }

    items.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById(item.dataset.target);
            if (!target) return;
            const navbar = document.querySelector('.s-navbar') || document.querySelector('.navbar');
            let navH = 88;
            if (navbar) { const cs = window.getComputedStyle(navbar); navH = navbar.offsetHeight + parseFloat(cs.marginTop||0) + parseFloat(cs.marginBottom||0); }
            const cmH = nav ? nav.offsetHeight : 0;
            window.scrollTo({ top: getTop(target) - navH - cmH, behavior: 'smooth' });
        });
    });

    if (nav && start && end) {
        function checkVis() {
            const y = window.scrollY;
            nav.classList.toggle('cm-nav-visible', y >= getTop(start) && y < getTop(end) + end.offsetHeight - 200);
        }
        window.addEventListener('scroll', checkVis, { passive: true }); checkVis();
    }

    function scrollToActive() {
        const inner = document.querySelector('.cm-nav-inner');
        const active = inner?.querySelector('.cm-nav-item.active');
        if (!inner || !active) return;
        inner.scrollTo({ left: active.offsetLeft - inner.offsetWidth/2 + active.offsetWidth/2, behavior: 'smooth' });
    }

    function update() {
        const navbar = document.querySelector('.s-navbar') || document.querySelector('.navbar');
        const navH = (navbar ? navbar.offsetHeight : 88) + (nav ? nav.offsetHeight : 0) + 48;
        const y = window.scrollY + navH;
        let cur = '';
        ids.forEach(id => { const el = document.getElementById(id); if (el && getTop(el) <= y) cur = id.replace('cm-',''); });
        items.forEach(i => i.classList.toggle('active', i.dataset.domain === cur));
        scrollToActive();
    }
    window.addEventListener('scroll', update, { passive: true }); update();
}

function initIndustryPillRails() {
    const rails = document.querySelectorAll('.s-cm-feature-subrail');
    if (!rails.length) return;
    let count = 0;
    rails.forEach((rail, i) => {
        rail.id = `industry-pill-rail-${i}`;
        if (initInfiniteScroll(`#${rail.id}`, { direction: 'left', speed: 'normal', cloneMultiplier: 2 })) count++;
    });
}

/* ═══════════════════════════════════════════════════════════════
DOM
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
    initAOS();
    initializeSapphireHeroGrid();

    initCmNav();
    initSapphireCapabilityCards();
    initIndustryPillRails();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initializeSapphireHeroGrid, 250);
    }, { passive: true });
});

window.addEventListener('load', () => document.body.classList.remove('loading'), { passive: true });