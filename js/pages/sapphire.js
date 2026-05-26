/* ════════════════════════════════════════════════════════════════════════════
   SAPPHIRE PAGE INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */
import { initInfiniteScroll } from '../components/InfiniteScroll.js';
import { fetchStageBank, pickPair, normalizePair } from '../builders/SapphireHeroDataAdapters.js';
import { renderHeroPair } from '../builders/SapphireHeroCardBuilders.js';
let sapphireStageData = null; // Cache for fetched data

console.log('💎 Sapphire page initialization started');

/* ═══════════════════════════════════════════════════════════════
PLACEHOLDER FILLER FOR INFINITE VARIETY
═══════════════════════════════════════════════════════════════ */
function fillPlaceholders(text) {
    if (!text || typeof text !== 'string') return text;
    const mocks = {
        personName: ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Neha', 'Rajesh', 'Pooja'][Math.floor(Math.random() * 8)],
        assetName: ['Generator-04', 'Drill Press-12', 'Forklift-B2', 'Compressor-X', 'CNC Machine-7', 'Laptop-IT-45'][Math.floor(Math.random() * 6)],
        assetCode: ['AST-2847', 'AST-9012', 'AST-5634', 'AST-7821'][Math.floor(Math.random() * 4)],
        materialName: ['Cement', 'Steel Rods', 'Lubricant Oil', 'Safety Gloves', 'Welding Electrodes', 'Paint Buckets'][Math.floor(Math.random() * 6)],
        quantity: ['12', '50', '8', '150', '25', '200'][Math.floor(Math.random() * 6)],
        unit: ['bags', 'units', 'litres', 'pcs', 'boxes', 'kg'][Math.floor(Math.random() * 6)],
        location: ['Bay 3', 'Store A', 'Floor 2', 'Workshop', 'Site B', 'Warehouse C'][Math.floor(Math.random() * 6)],
        fromLocation: ['Bay 1', 'Store B', 'Floor 1', 'Reception'][Math.floor(Math.random() * 4)],
        time: new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'}),
        date: new Date().toLocaleDateString('en-IN'),
        days: ['3', '7', '14', '30', '5'][Math.floor(Math.random() * 5)],
        status: ['Good', 'Damaged', 'Under Review', 'Pending', 'Approved'][Math.floor(Math.random() * 5)],
        role: ['Technician', 'Supervisor', 'Store Keeper', 'Manager'][Math.floor(Math.random() * 4)],
        itemCount: ['24', '15', '8', '42', '10'][Math.floor(Math.random() * 5)],
        batchNo: ['BATCH-2024-001', 'BATCH-2024-045', 'BATCH-2024-112'][Math.floor(Math.random() * 3)],
        vendorName: ['ABC Suppliers', 'XYZ Services', 'Metro Vendors'][Math.floor(Math.random() * 3)]
    };
    return text.replace(/\{(\w+)\}/g, (match, key) => mocks[key] || match);
}

function fillPlaceholdersInPair(pair) {
    return {
        ...pair,
        chaos: { ...pair.chaos, title: fillPlaceholders(pair.chaos.title), text: fillPlaceholders(pair.chaos.text) },
        sapphire: { ...pair.sapphire, title: fillPlaceholders(pair.sapphire.title), text: fillPlaceholders(pair.sapphire.text) }
    };
}

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
SAPPHIRE HERO
═══════════════════════════════════════════════════════════════ */
function initSapphireStageViz() {
    function animCount(el, target, suffix, duration) {
        const start = performance.now();
        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    let count = 1284;
    const procEl = document.getElementById('proc-count');
    const m1 = document.getElementById('m1');
    const m2 = document.getElementById('m2');
    const m3 = document.getElementById('m3');
    if (!procEl || !m1 || !m2 || !m3) return;

    function tickCount() { count += Math.floor(Math.random() * 3) + 1; procEl.textContent = count.toLocaleString(); }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        m1.textContent = '2,400+'; m2.textContent = '890+'; m3.textContent = '5,100+'; procEl.textContent = '1,284';
        return;
    }
    setTimeout(() => {
        animCount(m1, 2400, '+', 1800); animCount(m2, 890, '+', 1600); animCount(m3, 5100, '+', 2000);
        procEl.textContent = count.toLocaleString(); setInterval(tickCount, 1800);
    }, 1600);
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
   HERO PAIR INITIALIZATION & ROTATION
   ═══════════════════════════════════════════════════════════════ */

async function initSapphireHeroPair() {
    const container = document.querySelector('.s-stage');
    if (!container) return;

    try {
        // 1. Fetch data only once
        if (!sapphireStageData) {
            sapphireStageData = await fetchStageBank();
        }

        const category = container.dataset.category || 'default';
        let pair;

        // 2. If 'default', pick a random pair to enable rotation
        if (category === 'default' && sapphireStageData.pairs) {
            const randomIndex = Math.floor(Math.random() * sapphireStageData.pairs.length);
            pair = sapphireStageData.pairs[randomIndex];
        } else {
            // 3. Otherwise, use the adapter to find the specific category
            pair = pickPair(sapphireStageData, category);
        }

        const normalized = normalizePair(pair, sapphireStageData);
        const populated = fillPlaceholdersInPair(normalized);
        
        // 4. Render (triggers the CSS fade-in animation)
        renderHeroPair(container, populated);
        return true;
    } catch (error) {
        console.error(' Failed to update Sapphire hero pair:', error);
        return false;
    }
}

// Rotation Loop Logic
function startHeroRotation(intervalMs = 6000) {
    console.log('🔄 Starting Sapphire hero card rotation...');
    
    // Wait 1.5s after load so the user sees the first card before it flips
    setTimeout(() => {
        setInterval(async () => {
            await initSapphireHeroPair();
        }, intervalMs);
    }, 1500);
}

/* ═══════════════════════════════════════════════════════════════
DOM
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
    initAOS();
    initializeSapphireHeroGrid();
    
    // Initial render
    await initSapphireHeroPair();
    
    // Start the automatic rotation
    startHeroRotation(6000); 

    initCmNav();
    initSapphireCapabilityCards();
    initIndustryPillRails();
    initSapphireStageViz();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initializeSapphireHeroGrid, 250);
    }, { passive: true });
});

window.addEventListener('load', () => document.body.classList.remove('loading'), { passive: true });