/**
 * SAPPHIRE ASSESSMENT REPORT GENERATOR
 * Generates a multi-page A4 assessment report from localStorage data.
 * Falls back to sample data for preview/dev purposes.
 */

import { SFloatingButton } from '../components/SFloatingButton.js';

/* ─────────────────────────────────────────────────────
   SECTION CONFIG — color themes per section
───────────────────────────────────────────────────── */
const SECTION_THEME = {
    section1: { color: 'var(--s-primary)', icon: 'fa-boxes-stacking', label: 'Asset Procurement & Tracking' },
    section2: { color: 'var(--s-success)', icon: 'fa-clipboard-check', label: 'Inspection & Documentation' },
    section3: { color: 'var(--s-pop)', icon: 'fa-screwdriver-wrench', label: 'Maintenance & Compliance' },
    section4: { color: 'var(--s-royal)', icon: 'fa-ticket', label: 'Request & Issue Custody' },
    section5: { color: 'var(--s-amber-500)', icon: 'fa-chart-line', label: 'Analytics & Optimization' }
};

/* ─────────────────────────────────────────────────────
   GRADE → s-pill mapping
───────────────────────────────────────────────────── */
function gradeToPill(grade) {
    const map = {
        'A': 's-pill s-pill-round-sm s-pill-success',
        'B': 's-pill s-pill-round-sm s-pill-primary',
        'C': 's-pill s-pill-round-sm s-pill-warning',
        'D': 's-pill s-pill-round-sm s-pill-danger',
        'F': 's-pill s-pill-round-sm s-pill-danger'
    };
    return map[grade] || 's-pill s-pill-round-sm s-pill-primary';
}

/* ─────────────────────────────────────────────────────
   MATURITY GRADE CALCULATOR
───────────────────────────────────────────────────── */
function calcGrade(pct) {
    if (pct >= 90) return 'A';
    if (pct >= 75) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
}

function calcMaturity(pct) {
    if (pct >= 90) return { name: 'World-Class', description: 'Exceptional performance. Your organization demonstrates world-class asset management across all dimensions.' };
    if (pct >= 75) return { name: 'Advanced', description: 'Strong performance with robust processes and clear accountability. Fine-tune specific areas to reach excellence.' };
    if (pct >= 60) return { name: 'Established', description: 'Solid foundation with room to grow. Key fundamentals implemented but gaps remain in consistency and automation.' };
    if (pct >= 40) return { name: 'Developing', description: 'Developing maturity with significant opportunities. Implementation is inconsistent — targeted improvements will unlock efficiency.' };
    return { name: 'Initial', description: 'Critical development needed. Fundamental gaps require immediate attention to reduce costs, risks, and compliance issues.' };
}

/* ─────────────────────────────────────────────────────
   SAMPLE DATA — used when localStorage is empty
───────────────────────────────────────────────────── */
function getSampleData() {
    return {
        responses: {
            profile: {
                fullName: 'Sample Organisation',
                industry: 'Manufacturing',
                assetCount: '500-2000',
                jobLevel: 'executive',
                locations: '2-5',
                operatingSchedule: 'two-shift'
            },
            sections: {
                section1: { q1_1: { value: 'partial' }, q1_2: { value: 'spreadsheet' }, q1_3: { value: 'manual' } },
                section2: { q2_1: { value: 'paper' }, q2_2: { value: 'reactive' }, q2_3: { value: 'none' } },
                section3: { q3_1: { value: 'informal' }, q3_2: { value: 'ad-hoc' }, q3_3: { value: 'none' } },
                section4: { q4_1: { value: 'email' }, q4_2: { value: 'manual' }, q4_3: { value: 'none' } },
                section5: { q5_1: { value: 'none' }, q5_2: { value: 'none' }, q5_3: { value: 'none' } }
            },
            bonus: {
                wishes: ['real_time_visibility', 'predictive_maintenance', 'cost_reduction'],
                pains: ['manual_processes', 'data_silos', 'reactive_maintenance']
            }
        },
        scores: {
            total: 52,
            maxTotal: 100,
            percentage: 52,
            bySection: {
                section1: { name: 'Asset Procurement & Tracking', score: 14, maxPossible: 25, percentage: 56 },
                section2: { name: 'Inspection & Documentation', score: 10, maxPossible: 25, percentage: 40 },
                section3: { name: 'Maintenance & Compliance', score: 12, maxPossible: 20, percentage: 60 },
                section4: { name: 'Request & Issue Custody', score: 8, maxPossible: 20, percentage: 40 },
                section5: { name: 'Analytics & Optimization', score: 8, maxPossible: 10, percentage: 80 }
            }
        }
    };
}

/* ─────────────────────────────────────────────────────
   MAIN CLASS
───────────────────────────────────────────────────── */
class AssessmentReport {

    constructor() {
        this.responses = null;
        this.scores = null;
        this.pages = [];
        this.totalPages = 0;
        this.pageRegistry = [];  // { key, pageIndex } — populated during renderReport
        this.A4_HEIGHT = 1123;   // exact A4 height in px; usable = A4_HEIGHT - header - footer
        this.fab = null;
        this.init();
    }

    init() {
        try {
            const storedResponses = localStorage.getItem('sapphire_assessment_responses');
            const storedScores = localStorage.getItem('sapphire_assessment_scores');

            if (storedResponses && storedScores) {
                this.responses = JSON.parse(storedResponses);
                this.scores = JSON.parse(storedScores);
            } else {
                // Use sample data for development / preview
                const sample = getSampleData();
                this.responses = sample.responses;
                this.scores = sample.scores;
                console.info('[Report] No localStorage data — using sample data for preview.');
            }
        } catch (e) {
            console.error('[Report] Data parse error:', e);
            const sample = getSampleData();
            this.responses = sample.responses;
            this.scores = sample.scores;
        }

        // A4 responsive scale
        this.setA4Scale();
        window.addEventListener('resize', () => this.setA4Scale());

        this.renderReport();

        this.attachEventListeners();
    }

    setA4Scale() {
        const A4_PX = 794; // 210mm at 96dpi
        const vw = window.innerWidth;
        if (vw < A4_PX + 40) {
            const scale = (vw - 16) / A4_PX;
            document.documentElement.style.setProperty('--a4-scale', scale.toFixed(4));
        } else {
            document.documentElement.style.setProperty('--a4-scale', '1');
        }
    }

    /* ───── RENDER PIPELINE ──────────────────────────── */
    renderReport() {
        const container = document.getElementById('report-container');
        container.innerHTML = '';
        this.pageRegistry = [];

        const pages = [];

        // Cover (page 1)
        pages.push(this.renderCoverPage());
        this.pageRegistry.push({ key: 'cover', pageIndex: 0 });

        // TOC placeholder — will have page numbers injected after all pages built
        const tocPage = this.renderTOCPage();
        pages.push(tocPage);
        this.pageRegistry.push({ key: 'toc', pageIndex: 1 });

        // Performance (page 3) - add anchor ID
        const perfPage = this.renderPerformancePage();
        perfPage.id = 'toc-performance';
        pages.push(perfPage);
        this.pageRegistry.push({ key: 'performance', pageIndex: 2 });

        // Insight pages — one measured group per section
        const sectionKeys = Object.keys(SECTION_THEME);
        sectionKeys.forEach(key => {
            const startIndex = pages.length;
            const sectionPages = this.renderInsightPages(key);
            sectionPages.forEach(p => {
                p.id = 'toc-' + key;
                pages.push(p);
            });
            if (sectionPages.length > 0) {
                this.pageRegistry.push({ key, pageIndex: startIndex });
            }
        });

        // Action plan pages - add anchor ID
        const actionStart = pages.length;
        const actionPages = this.renderActionPage();
        actionPages.forEach(p => {
            p.id = 'toc-action';
            pages.push(p);
        });
        if (actionPages.length > 0) {
            this.pageRegistry.push({ key: 'action', pageIndex: actionStart });
        }

        // Bonus pages - add anchor ID
        const bonusStart = pages.length;
        const bonusPages = this.renderBonusPage();
        bonusPages.forEach(p => {
            p.id = 'toc-bonus';
            pages.push(p);
        });
        if (bonusPages.length > 0) {
            this.pageRegistry.push({ key: 'bonus', pageIndex: bonusStart });
        }

        // Closing
        pages.push(this.renderClosingPage());
        this.pageRegistry.push({ key: 'closing', pageIndex: pages.length - 1 });

        this.totalPages = pages.length;

        // Inject page numbers into footers
        pages.forEach((page, i) => {
            const pn = page.querySelector('.page-number');
            if (pn) pn.textContent = `${i + 1} / ${this.totalPages}`;
        });

        // Phase 2 — apply real page numbers to TOC
        this.updateTOCPageNumbers(tocPage);

        // Phase 3 — enforce print page boundaries
        this.injectPrintCSS();

        pages.forEach(p => container.appendChild(p));
    }

    /* ─── TOC UPDATE (Phase 2) ───────────────────────── */
    updateTOCPageNumbers(tocPage) {
        tocPage.querySelectorAll('[data-toc-key]').forEach(el => {
            const key = el.dataset.tocKey;
            const entry = this.pageRegistry.find(r => r.key === key);
            if (entry) {
                el.textContent = entry.pageIndex + 1; // 1-based
            }
        });
    }

    /* ─── PRINT CSS (Phase 3) ────────────────────────── */
    injectPrintCSS() {
        if (document.getElementById('report-print-css')) return;
        const style = document.createElement('style');
        style.id = 'report-print-css';
        style.textContent = `
            .a4-page { overflow: hidden; }
            @media print {
                .a4-page {
                    page-break-after: always !important;
                    break-after: page !important;
                    overflow: hidden !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /* ───── HELPERS ─────────────────────────────────── */
    makePageHeader(title = '') {
        const el = document.createElement('div');
        el.className = 'page-header';
        el.innerHTML = `
            <div class="header-brand">
                <img src="assets/images/scorp-sapphire-cropped.png" alt="Sapphire" class="header-logo">
                <span class="header-title">Asset Management Maturity Report</span>
            </div>
            <span class="header-meta">${title || (this.responses?.profile?.fullName || '')}</span>
        `;
        return el;
    }

    makePageFooter(pageNum) {
        const el = document.createElement('div');
        el.className = 'page-footer';
        el.innerHTML = `
            <span class="footer-disclaimer">This report is generated based on responses submitted during the assessment. Insights are for informational purposes only.</span>
            <div class="footer-meta">
                <span class="footer-copyright">© ${new Date().getFullYear()} Scorptech Technologies</span>
                <span class="page-number">${pageNum} / ?</span>
            </div>
        `;
        return el;
    }

    makeContentPage(pageNum, headerTitle = '') {
        const page = document.createElement('div');
        page.className = 'a4-page';
        page.appendChild(this.makePageHeader(headerTitle));
        const content = document.createElement('div');
        content.className = 'page-content';
        page.appendChild(content);
        page.appendChild(this.makePageFooter(pageNum));
        return { page, content };
    }

    /* ───── COVER ───────────────────────────────────── */
    renderCoverPage() {
        const page = document.createElement('div');
        page.className = 'a4-page cover-page';

        const org = this.responses?.profile?.fullName || 'Your Organisation';
        const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

        page.innerHTML = `
            <div class="cover-content">
                <div class="cover-brand">
                    <img src="assets/images/scorp-logo.png" alt="Scorp" class="cover-logo">
                    <div class="cover-logo-divider"></div>
                    <img src="assets/images/scorp-sapphire-cropped.png" alt="Sapphire" class="cover-logo">
                </div>
                <div class="cover-title-block">
                    <div class="cover-doc-type">Asset Management</div>
                    <h1 class="cover-title">Maturity<br>Assessment<br>Report</h1>
                    <div class="cover-divider"></div>
                    <p class="cover-subtitle">
                        A comprehensive, personalised evaluation of your organisation's
                        asset management practices — with actionable insights to elevate maturity.
                    </p>
                </div>
                <div class="cover-footer">
                    <div class="cover-footer-info">
                        <strong>${org}</strong>
                        Assessment Date: ${date}
                    </div>
                    <div class="cover-confidential">Confidential</div>
                </div>
            </div>
        `;
        return page;
    }

    /* ───── TOC ─────────────────────────────────────── */
    renderTOCPage() {
        const { page, content } = this.makeContentPage(2, 'Table of Contents');

        const pct = this.scores.percentage;
        const mat = calcMaturity(pct);

        // data-toc-key will be updated by updateTOCPageNumbers() after all pages are built
        const entries = [
            { num: '1', label: 'Overall Performance', sub: 'Maturity score & section analysis', key: 'performance' },
            { num: '2', label: 'Asset Procurement & Tracking', sub: 'Personalised insights', key: 'section1' },
            { num: '3', label: 'Inspection & Documentation', sub: 'Personalised insights', key: 'section2' },
            { num: '4', label: 'Maintenance & Compliance', sub: 'Personalised insights', key: 'section3' },
            { num: '5', label: 'Request & Issue Custody', sub: 'Personalised insights', key: 'section4' },
            { num: '6', label: 'Analytics & Optimization', sub: 'Personalised insights', key: 'section5' },
            { num: '7', label: 'Action Plan', sub: 'Top 3 priority recommendations', key: 'action' },
            { num: '8', label: 'Bonus Insights', sub: 'Aspirations & challenges', key: 'bonus' }
        ];

        content.innerHTML = `
            <div class="section-title">
                <i class="fas fa-list-ul"></i>
                Table of Contents
            </div>
            <p class="section-intro">
                This report covers your organisation's assessment across ${Object.keys(this.scores.bySection).length} key dimensions
                of asset management. Overall maturity: <strong>${mat.name}</strong> (${pct}%).
            </p>
            <ul class="toc-list">
                ${entries.map(e => `
                <li class="toc-item toc-level-1">
                    <a href="#toc-${e.key}" class="toc-link">
                        <span class="toc-label">
                            <span class="toc-number">${e.num}.</span>${e.label}
                        </span>
                    </a>
                    <span class="toc-dots"></span>
                    <span class="toc-page-num" data-toc-key="${e.key}">—</span>
                </li>
                ${e.sub ? `
                <li class="toc-item toc-level-2">
                    <span class="toc-label">${e.sub}</span>
                    <span class="toc-dots"></span>
                    <span class="toc-page-num"></span>
                </li>` : ''}
                `).join('')}
            </ul>
        `;
        return page;
    }

    /* ───── PERFORMANCE PAGE (score + 5 section cards) ── */
    renderPerformancePage() {
        const { page, content } = this.makeContentPage(3, 'Overall Performance');

        const pct = this.scores.percentage;
        const mat = calcMaturity(pct);
        const dash = Math.round(534 * (1 - pct / 100));

        content.innerHTML = `
            <div class="section-title">
                <i class="fas fa-chart-pie"></i>
                Overall Performance
            </div>

            <div class="score-summary">
                <div class="score-primary">
                    <div class="score-circle">
                        <svg viewBox="0 0 180 180">
                            <circle class="score-bg" cx="90" cy="90" r="85"></circle>
                            <circle class="score-fill" cx="90" cy="90" r="85"
                                style="stroke-dashoffset:${dash}"></circle>
                        </svg>
                        <div class="score-value">
                            <span class="score-number">${pct}</span>
                            <span class="score-percent">%</span>
                        </div>
                    </div>
                    <div class="score-label">
                        <strong>${mat.name}</strong>
                        <span>Maturity Level</span>
                    </div>
                </div>
                <div class="score-interpretation">
                    <h3>${mat.name} — Score Interpretation</h3>
                    <p>${mat.description}</p>
                </div>
            </div>

            <div class="section-title" style="margin-top:14px;">
                <i class="fas fa-layer-group"></i>
                Section-by-Section Analysis
            </div>

            <div class="sections-stack">
                ${Object.entries(this.scores.bySection).map(([key, sec]) => {
            const theme = Object.values(SECTION_THEME).find(t => t.label === sec.name) || Object.values(SECTION_THEME)[0];
            const themeKey = Object.keys(SECTION_THEME).find(k => SECTION_THEME[k].label === sec.name) || 'section1';
            const tColor = SECTION_THEME[themeKey]?.color || 'var(--s-primary)';
            const grade = calcGrade(sec.percentage);
            const pill = gradeToPill(grade);
            return `
                    <div class="section-card" style="--section-color:${tColor}">
                        <div class="section-header">
                            <div class="section-icon">
                                <i class="fas ${SECTION_THEME[themeKey]?.icon || 'fa-circle'}"></i>
                            </div>
                            <div class="section-info">
                                <h3>${sec.name}</h3>
                                <span class="section-score">${sec.score} / ${sec.maxPossible} points</span>
                            </div>
                        </div>
                        <div class="section-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width:${sec.percentage}%"></div>
                            </div>
                            <span class="progress-label">${sec.percentage}%</span>
                        </div>
                        <div class="section-maturity">
                            <span class="${pill}">${grade}</span>
                            <p>${calcMaturity(sec.percentage).name}</p>
                        </div>
                    </div>`;
        }).join('')}
            </div>
        `;
        return page;
    }

    /* ───── INSIGHT PAGES — per section ─────────────── */
    renderInsightPages(sectionKey) {
        const pages = [];
        const theme = SECTION_THEME[sectionKey];
        const sectionData = this.scores.bySection[sectionKey];
        if (!sectionData) return pages;

        const sectionResponses = this.responses?.sections?.[sectionKey] || {};

        // Get questions from assessmentData if available
        let questions = [];
        if (typeof window.assessmentData !== 'undefined') {
            const sec = window.assessmentData.assessmentSections?.find(s => s.id === sectionKey);
            if (sec) questions = sec.questions || [];
        }

        // If no assessmentData, create generic questions from response keys
        if (questions.length === 0) {
            questions = Object.keys(sectionResponses).map((qid, i) => ({
                id: qid,
                text: `Assessment Question ${i + 1}`,
                type: 'radio'
            }));
        }

        // Build insight item DOM elements (not strings — needed for DOM-measure loop)
        const itemEls = questions.map(q => {
            const resp = sectionResponses[q.id];
            if (!resp) return null;

            const insights = this.getResponseInsights(q, resp);
            const userAnswer = this.formatAnswer(q, resp);

            const el = document.createElement('div');
            el.className = 'insight-item';
            el.innerHTML = `
                <div class="insight-question">
                    <i class="fas fa-circle-question"></i>
                    <span>${q.text}</span>
                </div>
                </div>
                <div class="insight-response">
                <div class="insight-primary">
                <h4><i class="fas fa-lightbulb"></i>Your assessment</h4>
                    <p>${insights?.primary || this.getDefaultSapphireHelp(sectionKey)}</p>
                </div>
                    <div class="insight-secondary">
                        <h4><i class="fa-solid fa-diamond" style="color:var(--s-primary)"></i> How Sapphire Helps</h4>
                        <p>${insights?.secondary || this.getDefaultSapphireHelp(sectionKey)}</p>
                    </div>
                </div>
            `;  
            return el;
        }).filter(Boolean);

        if (itemEls.length === 0) return pages;

        // Phase 1 + 2 — Dynamic measured pagination with accurate usable-height tracking
        // Measurement host: fixed, off-screen, exactly 794px wide so CSS computes correctly.
        // Not display:none — must be in the live render tree for offsetHeight to work.
        const measureHost = document.createElement('div');
        measureHost.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;visibility:hidden;pointer-events:none;';
        document.body.appendChild(measureHost);

        let isFirst = true;
        let currentPage = null;
        let currentContent = null; // reference to .page-content div
        let currentItemsEl = null; // reference to .insight-items within content

        const startNewPage = () => {
            if (currentPage) {
                measureHost.removeChild(currentPage);
                pages.push(currentPage);
            }
            const { page, content } = this.makeContentPage(99, theme.label);
            if (isFirst) {
                content.innerHTML = `
                    <div class="section-title" style="border-color:${theme.color}">
                        <i class="fas ${theme.icon}" style="color:${theme.color}"></i>
                        ${theme.label}
                    </div>
                    <div class="insight-section">
                        <div class="insight-header" style="--section-color:${theme.color}">
                            <i class="fas ${theme.icon}"></i>
                            <h3>Personalised Insights</h3>
                        </div>
                        <div class="insight-items"></div>
                    </div>
                `;
                isFirst = false;
            } else {
                content.innerHTML = `
                    <p class="section-intro" style="color:var(--s-gray-500);font-size:8pt;margin-bottom:10px;">${theme.label} — continued</p>
                    <div class="insight-section">
                        <div class="insight-header" style="--section-color:${theme.color}">
                            <i class="fas ${theme.icon}"></i>
                            <h3>Personalised Insights</h3>
                        </div>
                        <div class="insight-items"></div>
                    </div>
                `;
            }
            currentPage = page;
            currentContent = content; // .page-content element
            currentItemsEl = content.querySelector('.insight-items');
            measureHost.appendChild(currentPage);
        };

        startNewPage();

        for (const itemEl of itemEls) {
            currentItemsEl.appendChild(itemEl);

            // Measure only .page-content against usable height (A4 minus header and footer)
            const hdr = currentPage.querySelector('.page-header');
            const ftr = currentPage.querySelector('.page-footer');
            const usable = this.A4_HEIGHT - (hdr?.offsetHeight || 0) - (ftr?.offsetHeight || 0);

            if (currentContent.scrollHeight > usable) {
                // Item caused content overflow — pull it to a fresh page
                currentItemsEl.removeChild(itemEl);
                startNewPage();
                currentItemsEl.appendChild(itemEl);
            }
        }

        // Finalize last page
        if (currentPage) {
            measureHost.removeChild(currentPage);
            pages.push(currentPage);
        }

        document.body.removeChild(measureHost);
        return pages;
    }

    /* ───── ACTION PLAN ─────────────────────────────── */
    renderActionPage() {
        const pages = [];
        const priorities = this.identifyPriorities();
        if (priorities.length === 0) return pages;

        // Build action card DOM elements for measured pagination
        const itemEls = priorities.map((p, idx) => {
            const el = document.createElement('div');
            el.className = `action-card priority-${idx + 1}`;
            el.innerHTML = `
                <div class="action-rank">${idx + 1}</div>
                <div class="action-content">
                    <h3>${p.title}</h3>
                    <p class="action-why"><strong>Why it matters:</strong> ${p.why}</p>
                    <p class="action-impact"><strong>Expected impact:</strong> ${p.impact}</p>
                    <div class="action-steps">
                        <strong>Recommended steps:</strong>
                        <ul>${p.steps.map(s => `<li>${s}</li>`).join('')}</ul>
                    </div>
                </div>
            `;
            return el;
        });

        // Phase 1 + 2 — Dynamic measured pagination with accurate usable-height tracking
        const measureHost = document.createElement('div');
        measureHost.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;visibility:hidden;pointer-events:none;';
        document.body.appendChild(measureHost);

        let isFirst = true;
        let currentPage = null;
        let currentContent = null; // reference to .page-content div
        let currentItemsEl = null;

        const startNewPage = () => {
            if (currentPage) {
                measureHost.removeChild(currentPage);
                pages.push(currentPage);
            }
            const { page, content } = this.makeContentPage(99, 'Action Plan');
            if (isFirst) {
                content.innerHTML = `
                    <div class="section-title">
                        <i class="fas fa-bullseye-arrow"></i>
                        Priority Action Plan
                    </div>
                    <p class="section-intro">
                        Based on your assessment results, these are the top three areas requiring immediate attention to elevate your asset management maturity.
                    </p>
                    <div class="action-priorities"></div>
                `;
                isFirst = false;
            } else {
                content.innerHTML = `
                    <p class="section-intro" style="color:var(--s-gray-500);font-size:8pt;margin-bottom:10px;">Priority Action Plan — continued</p>
                    <div class="action-priorities"></div>
                `;
            }
            currentPage = page;
            currentContent = content; // .page-content element
            currentItemsEl = content.querySelector('.action-priorities');
            measureHost.appendChild(currentPage);
        };

        startNewPage();

        for (const itemEl of itemEls) {
            currentItemsEl.appendChild(itemEl);

            // Measure only .page-content against usable height (A4 minus header and footer)
            const hdr = currentPage.querySelector('.page-header');
            const ftr = currentPage.querySelector('.page-footer');
            const usable = this.A4_HEIGHT - (hdr?.offsetHeight || 0) - (ftr?.offsetHeight || 0);

            if (currentContent.scrollHeight > usable) {
                currentItemsEl.removeChild(itemEl);
                startNewPage();
                currentItemsEl.appendChild(itemEl);
            }
        }

        if (currentPage) {
            measureHost.removeChild(currentPage);
            pages.push(currentPage);
        }

        document.body.removeChild(measureHost);
        return pages;
    }

    /* ───── BONUS PAGE ──────────────────────────────── */
    renderBonusPage() {
        const pages = [];
        const bonus = this.responses?.bonus || {};
        const wishes = bonus.wishes || [];
        const pains = bonus.pains || [];

        // Combine items for chunking if needed, or just handle manually
        // Let's put wishes and pains on separate pages if they are both present

        if (wishes.length) {
            const { page, content } = this.makeContentPage(99, 'Bonus Insights');
            content.innerHTML = `
                <div class="section-title">
                    <i class="fas fa-star"></i>
                    Aspirations & Challenges
                </div>
                <div class="bonus-card wishes-card">
                    <h3><i class="fas fa-rocket"></i> Your Aspirations</h3>
                    <ul class="bonus-list">
                        ${wishes.map(w => `<li>${this.formatBonusItem(w)}</li>`).join('')}
                    </ul>
                </div>
            `;
            pages.push(page);
        }

        if (pains.length || true) { // Always show solution
            const { page, content } = this.makeContentPage(99, 'Bonus Insights');
            content.innerHTML = `
                ${!wishes.length ? `
                <div class="section-title">
                    <i class="fas fa-star"></i>
                    Aspirations & Challenges
                </div>` : '<p class="section-intro" style="color:var(--s-gray-500);font-size:8pt;margin-bottom:10px;">Bonus Insights — continued</p>'}
                ${pains.length ? `
                <div class="bonus-card pains-card">
                    <h3><i class="fas fa-triangle-exclamation"></i> Current Pain Points</h3>
                    <ul class="bonus-list">
                        ${pains.map(p => `<li>${this.formatBonusItem(p)}</li>`).join('')}
                    </ul>
                </div>` : ''}
                <div class="bonus-solution">
                    <h3><i class="fas fa-circle-check"></i> How Sapphire Addresses These</h3>
                    <p>${this.getBonusSolution()}</p>
                </div>
            `;
            pages.push(page);
        }

        return pages;
    }

    /* ───── CLOSING PAGE ────────────────────────────── */
    renderClosingPage() {
        const page = document.createElement('div');
        page.className = 'a4-page closing-page';

        page.innerHTML = `
            <div class="closing-content">
                <div class="closing-brand">
                    <img src="assets/images/scorp-sapphire-cropped.png" alt="Sapphire" class="closing-logo">
                    <div class="closing-logo-divider"></div>
                    <img src="assets/images/scorp-logo.png" alt="Scorp" class="closing-logo">
                </div>
                <div class="closing-title-block">
                    <h2 class="closing-title">Transform Your<br>Asset Management</h2>
                    <div class="closing-divider"></div>
                    <p class="closing-subtitle">
                        Sapphire by Scorptech empowers organisations to achieve operational excellence
                        through intelligent, connected asset management — from procurement to disposal.
                        Let's take the next step together.
                    </p>
                </div>
                <div class="closing-contact-grid">
                    <div class="closing-contact-item">
                        <i class="fas fa-globe"></i>
                        <label>Website</label>
                        <a href="https://www.scorptech.in" target="_blank">www.scorptech.in</a>
                    </div>
                    <div class="closing-contact-item">
                        <i class="fas fa-envelope"></i>
                        <label>Email</label>
                        <span>support@scorptech.in</span>
                    </div>
                    <div class="closing-contact-item">
                        <i class="fas fa-location-dot"></i>
                        <label>Headquartered in</label>
                        <span>Jaipur, Rajasthan, India</span>
                    </div>
                </div>
                <div class="closing-footer">
                    <div class="closing-links">
                        <a href="https://www.scorptech.in/sapphire">Sapphire Platform</a>
                        <a href="https://www.scorptech.in/contact">Book a Demo</a>
                        <a href="https://www.scorptech.in/privacy">Privacy Policy</a>
                    </div>
                    <div class="closing-copyright">
                        © ${new Date().getFullYear()} Scorptech Technologies Private Limited. All rights reserved. &nbsp;·&nbsp; Sapphire is a product of Scorptech.
                    </div>
                </div>
            </div>
        `;
        return page;
    }

    /* ───── INSIGHTS HELPERS ────────────────────────── */
    getResponseInsights(question, response) {
        if (typeof window.ASSESSMENT_RESPONSES === 'undefined') return null;

        // For radio (single choice)
        if (question.type === 'radio' && response?.value) {
            const key = `${question.id}_${response.value}`;
            return window.ASSESSMENT_RESPONSES[key] || null;
        }

        // For checkbox (multiple choice)
        if (question.type === 'checkbox' && response?.values?.length) {
            // Aggregate secondary feedback from all selected options
            const secondaries = response.values.map(v => {
                const val = v.value || v;
                const key = `${question.id}_${val}`;
                return window.ASSESSMENT_RESPONSES[key]?.secondary;
            }).filter(Boolean);

            if (secondaries.length === 0) return null;

            return {
                primary: 'Multiple responses recorded.', // Primary is usually option-specific, better to keep generic or pick first
                secondary: secondaries.join(' ')
            };
        }

        return null;
    }

    formatAnswer(question, response) {
        if (!response) return 'No response recorded.';

        /**
         * Finds the human-readable label for a given value based on question options.
         * Falls back to a formatted version of the raw value if mapping fails.
         */
        const getLabel = (val) => {
            if (question && question.options && Array.isArray(question.options)) {
                const option = question.options.find(o => String(o.value) === String(val));
                if (option && option.label) return option.label;
            }
            return this.formatBonusItem(val);
        };

        // Handle single-select (radio/select)
        if (response.value) {
            return getLabel(response.value);
        }

        // Handle multi-select (checkbox)
        if (response.values && Array.isArray(response.values)) {
            const labels = response.values.map(v => {
                const val = (typeof v === 'object' && v !== null) ? (v.value || v.id) : v;
                return getLabel(val);
            });
            return labels.filter(Boolean).join(', ');
        }

        // Fallback for text responses
        if (response.text) return response.text;

        return 'Response recorded.';
    }

    getDefaultSapphireHelp(sectionKey) {
        const defaults = {
            section1: 'Sapphire provides a centralised asset register with real-time tracking, automated procurement workflows, and duplicate-check alerts — eliminating waste and improving budget accuracy.',
            section2: 'Sapphire\'s mobile inspection suite digitises checklists, enables photo capture, and automates work-order generation from findings — creating a defensible audit trail.',
            section3: 'Sapphire\'s preventive maintenance scheduler, compliance dashboard, and automated escalation engine eliminate reactive firefighting and reduce unplanned downtime by up to 60%.',
            section4: 'Sapphire\'s request & custody module centralises issue tracking, automates approvals, and provides real-time visibility into asset location and custodian history.',
            section5: 'Sapphire\'s analytics suite delivers real-time dashboards, failure cost tracking, TCO analysis, and predictive maintenance scoring — turning data into actionable decisions.'
        };
        return defaults[sectionKey] || 'Sapphire provides purpose-built tools to address this gap with automation, real-time visibility, and actionable analytics.';
    }

    /* ───── ACTION PLAN ─────────────────────────────── */
    identifyPriorities() {
        const sections = Object.entries(this.scores.bySection)
            .sort((a, b) => a[1].percentage - b[1].percentage)
            .slice(0, 3);

        return sections.map(([key, sec], i) => this.generateActionPlan(key, sec, i + 1));
    }

    generateActionPlan(key, section, rank) {
        const plans = {
            section1: {
                title: 'Establish Centralised Asset Procurement & Tracking',
                why: 'Duplicate purchases and lack of inventory visibility waste capital and inflate costs unnecessarily.',
                impact: 'Reduce duplicate purchases by 45%, improve budget accuracy by 50%, and gain real-time asset visibility.',
                steps: ['Implement centralised asset register with real-time inventory tracking', 'Integrate procurement workflows with inventory system', 'Establish automated duplicate-check alerts before purchase approvals']
            },
            section2: {
                title: 'Implement a Structured Inspection Programme',
                why: 'Paper-based or informal documentation prevents trend analysis and creates compliance risks.',
                impact: 'Eliminate data entry errors, enable real-time visibility, and create defensible audit trails.',
                steps: ['Migrate paper forms to digital mobile-enabled checklists', 'Implement photo capture requirements for critical findings', 'Establish automated work-order generation from inspection findings']
            },
            section3: {
                title: 'Digitise Maintenance & Compliance Workflows',
                why: 'Reactive maintenance costs 3–5× more than preventive approaches and creates unnecessary downtime.',
                impact: 'Reduce unplanned downtime by 60%, extend asset life by 40%, and achieve predictable maintenance budgets.',
                steps: ['Create inspection schedules for all critical assets', 'Deploy mobile inspection apps with digital checklists', 'Establish automated reminder and escalation workflows']
            },
            section4: {
                title: 'Centralise Request & Custody Management',
                why: 'Informal or email-based request handling creates bottlenecks, delays, and loss of asset accountability.',
                impact: 'Improve request resolution time by 70% and achieve complete custodian visibility.',
                steps: ['Implement a structured request ticketing system', 'Establish custody-change audit trails for all assets', 'Deploy automated approvals and SLA tracking']
            },
            section5: {
                title: 'Deploy Performance Analytics & Reporting',
                why: 'Without data-driven insights, you cannot identify improvement opportunities or measure ROI.',
                impact: 'Gain visibility into cost drivers, identify high-risk assets, and quantify improvement results.',
                steps: ['Implement automated dashboards for key asset metrics', 'Establish failure cost tracking and TCO analysis', 'Deploy predictive analytics for maintenance optimisation']
            }
        };

        return plans[key] || {
            title: `Improve ${section.name}`,
            why: `This area scored ${section.percentage}% and represents a key improvement opportunity.`,
            impact: 'Addressing these gaps will significantly enhance operational efficiency and reduce costs.',
            steps: ['Conduct detailed assessment of current practices', 'Establish standardised processes and accountability', 'Implement digital tools for automation and visibility']
        };
    }

    /* ───── FORMATTING ──────────────────────────────── */
    formatBonusItem(value) {
        if (!value) return '';
        return String(value).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    getBonusSolution() {
        return `Sapphire's comprehensive asset management platform directly addresses all your aspirations and challenges through integrated workflows, real-time visibility, automated alerts, and powerful analytics. Our solution transforms reactive operations into proactive, data-driven asset stewardship that delivers measurable ROI.`;
    }

    /* ───── PDF EXPORT ──────────────────────────────── */
downloadPDF() {
    const btn = document.getElementById('ar-download-pdf');

    if (btn) {
        btn.disabled = true;
        const span = btn.querySelector('span');
        if (span) span.textContent = 'Preparing PDF…';
    }

    // Ensure 1:1 A4 scaling before printing
    const prevScale = getComputedStyle(document.documentElement)
        .getPropertyValue('--a4-scale')
        .trim();

    document.documentElement.style.setProperty('--a4-scale', '1');

    // Small delay ensures layout stabilizes
    setTimeout(() => {
        window.print();

        // Restore scale after print dialog closes
        document.documentElement.style.setProperty('--a4-scale', prevScale || '1');

        if (btn) {
            btn.disabled = false;
            const span = btn.querySelector('span');
            if (span) span.textContent = 'Download PDF';
        }
    }, 150);
}


    /* ───── REDIRECT MODAL ──────────────────────────── */
    async downloadAndRedirect(redirectUrl) {
        await this.downloadPDF();
        this.showRedirectModal(redirectUrl);
    }

    showRedirectModal(redirectUrl) {
        const modal = document.getElementById('ar-redirect-modal');
        const countdownEl = document.getElementById('ar-modal-countdown');
        const fill = document.getElementById('ar-modal-progress-fill');
        const skipBtn = document.getElementById('ar-modal-skip');
        const overlay = document.getElementById('ar-modal-overlay');

        modal.classList.add('active');
        let seconds = 5;
        countdownEl.textContent = seconds;
        fill.style.width = '100%';

        const tick = setInterval(() => {
            seconds--;
            countdownEl.textContent = seconds;
            fill.style.width = `${(seconds / 5) * 100}%`;
            if (seconds <= 0) { clearInterval(tick); go(); }
        }, 1000);

        const go = () => {
            modal.classList.remove('active');
            window.location.href = redirectUrl;
        };

        skipBtn.onclick = () => { clearInterval(tick); go(); };
        overlay.onclick = () => { clearInterval(tick); modal.classList.remove('active'); };
    }

    /* ───── EMAIL ───────────────────────────────────── */
    openEmailClient() {
        const mat = calcMaturity(this.scores.percentage);
        const subject = encodeURIComponent('Sapphire Assessment Report');
        const body = encodeURIComponent(
            `Hi,\n\nPlease find my Sapphire Asset Management Maturity Assessment Report.\n\nOverall Score: ${this.scores.percentage}%\nMaturity Level: ${mat.name}\n\nBest regards,\n${this.responses?.profile?.fullName || ''}`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
        this.downloadPDF();
    }

    /* ───── FAB ─────────────────────────────────────── */
    attachEventListeners() {
        // Option handlers — match the new .s-fab-menu-item structure
        const handlers = {
            'ar-download-pdf': () => this.downloadPDF(),
            'ar-print': () => window.print(),
            'ar-email': () => this.openEmailClient(),
            'ar-book-demo': () => this.downloadAndRedirect('book-demo.html'),
            'ar-contact': () => this.downloadAndRedirect('contact.html')
        };

        Object.entries(handlers).forEach(([id, fn]) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', (e) => {
                e.preventDefault();
                this.fab?.close();
                fn();
            });
        });
    }
}

/* ─────────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    window.reportApp = new AssessmentReport();
});
