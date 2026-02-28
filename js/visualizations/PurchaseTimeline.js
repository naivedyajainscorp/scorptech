/**
 * PURCHASE TIMELINE & SEASONALITY VISUALIZATION
 * Refined for Scorp Brand Palette (Harmonized with Blue #0066cc)
 * Palettized Green -> Amber -> Red transition
 * CALIBRATED FOR: 2000×400 viewBox
 */

class PurchaseTimeline {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        // Palette harmonized with Scorp Blue (#0066cc)
        this.palette = {
            blue: '#0066cc',
            green: '#22c55e', // Success Green
            amber: '#f59e0b', // Amber
            red: '#e11d48'    // Vibrant Rose/Red
        };

        this.currentYear = new Date().getFullYear();
        this.currentMonth = 0;
        this.animationInterval = null;
        this.monthlyData = this.generateMonthlyData();
        this.init();
    }

    generateMonthlyData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Base values
        const baseSpend = 550000;
        const baseItems = 25;

        // Realistic randomness logic: Mixing seasonal trends with higher volatility
        const seasonalCurve = [0.7, 0.85, 1.4, 1.25, 0.9, 0.8, 0.7, 0.85, 1.1, 1.05, 1.2, 1.35];

        const data = months.map((month, index) => {
            const curve = seasonalCurve[index];
            // Higher variance for "realistic" jagged look
            const variance = 0.75 + Math.random() * 0.5;

            // Occasional "spikes" to show all color ranges
            const randomSpike = Math.random() > 0.8 ? 1.3 : 1.0;

            const spend = Math.round(baseSpend * curve * variance * randomSpike);
            const items = Math.round(baseItems * curve * (0.8 + Math.random() * 0.4));

            return {
                month,
                monthIndex: index,
                spend,
                items,
                avgPrice: Math.round(spend / items)
            };
        });

        return data;
    }

    calculateYearTotals() {
        const totalSpend = this.monthlyData.reduce((sum, month) => sum + month.spend, 0);
        const totalItems = this.monthlyData.reduce((sum, month) => sum + month.items, 0);
        const peakMonth = this.monthlyData.reduce((max, month) =>
            month.spend > max.spend ? month : max
        );

        return { totalSpend, totalItems, peakMonth: peakMonth.month };
    }

    formatINR(amount) {
        if (amount >= 10000000) {
            const val = amount / 10000000;
            return `₹${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2)} Cr`;
        } else if (amount >= 100000) {
            const val = amount / 100000;
            return `₹${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2)} L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(0)}k`;
        }
        return `₹${amount.toLocaleString('en-IN')}`;
    }

    generateYAxisLabels(maxValue) {
        const niceMax = Math.ceil(maxValue / 100000) * 100000;
        const steps = 5;
        const stepValue = niceMax / steps;
        const labels = [];

        for (let i = steps; i >= 0; i--) {
            const value = Math.round(stepValue * i);
            labels.push({
                value,
                label: this.formatINR(value).replace('₹', ''),
                // Simplified percentage matching the SVG logic: (top padding / total) to (1 - bottom padding / total)
                yPosition: ((steps - i) / steps) * 100
            });
        }

        return { labels, niceMax };
    }

    getGradientColor(value, minValue, maxValue) {
        const t = (value - minValue) / (maxValue - minValue);

        // Precise HSL color ranges: Green(140) -> Amber(40) -> Red(340)
        // Harmonized to pop against blue dashboard
        let hue;
        if (t <= 0.5) {
            // Green to Amber (140 to 40)
            hue = 140 - (t * 2 * 100);
        } else {
            // Amber to Red (40 to -20/340)
            hue = 40 - ((t - 0.5) * 2 * 60);
        }

        return `hsl(${hue.toFixed(1)}, 75%, 55%)`;
    }

    generateGradientStops(minSpend, maxSpend, niceMax) {
        const stops = [];
        const numStops = 10; // Fewer stops for smoother transition

        for (let i = 0; i <= numStops; i++) {
            const t = i / numStops;
            const value = minSpend + (maxSpend - minSpend) * t;
            const color = this.getGradientColor(value, minSpend, maxSpend);

            // Positional mapping in gradient
            const percent = (1 - t) * 100;
            stops.push(`<stop offset="${percent.toFixed(2)}%" stop-color="${color}" stop-opacity="0.8"/>`);
        }

        return stops.reverse().join('');
    }

    generatePath(niceMax) {
        const width = 2000;
        const height = 400;
        const padding = 50;

        const xStep = (width - padding * 2) / (this.monthlyData.length - 1);

        const points = this.monthlyData.map((data, index) => {
            const x = padding + index * xStep;
            const normalized = data.spend / niceMax;
            // Precise Y logic: height minus bottom padding, minus actual data scaled to the INNER height
            const y = (height - padding) - (normalized * (height - padding * 2));
            return { x, y, spend: data.spend };
        });

        const areaPath = `
            M ${points[0].x},${height - padding}
            L ${points.map(p => `${p.x},${p.y}`).join(' L ')}
            L ${points[points.length - 1].x},${height - padding}
            Z
        `;

        const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

        return { areaPath, linePath, points };
    }

    init() {
        this.render();
        this.startAnimation();
    }

    render() {
        const actualMinSpend = Math.min(...this.monthlyData.map(d => d.spend));
        const actualMaxSpend = Math.max(...this.monthlyData.map(d => d.spend));
        const { labels: yAxisLabels, niceMax } = this.generateYAxisLabels(actualMaxSpend);
        const { areaPath, linePath, points } = this.generatePath(niceMax);
        const gradientStops = this.generateGradientStops(actualMinSpend, actualMaxSpend, niceMax);
        const yearTotals = this.calculateYearTotals();

        this.container.innerHTML = `                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--s-space-3); background: var(--s-gradient-primary); border-radius: var(--s-radius-md); margin-bottom: var(--s-space-3);">
                    <div style="display: flex; align-items: center; gap: var(--s-space-2); flex: 1; min-width: 0;">
                        <i class="fas fa-chart-area" style="font-size: 1.25rem; color: white; flex-shrink: 0;"></i>
                        <div style="min-width: 0;">
                            <h4 style="margin: 0; font-size: var(--s-text-base); font-weight: var(--s-font-bold); color: white;">Purchase Timeline</h4>
                            <p style="margin: 0; font-size: var(--s-text-xs); color: rgba(255, 255, 255, 0.8);">Monthly seasonality</p>
                        </div>
                    </div>
                    <span class="s-pill s-pill-lg s-pill-round-xs" style="font-family: 'Science Gothic', sans-serif; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); color: white; font-weight: var(--s-font-black); font-style: italic;">
                        ${this.currentYear}
                    </span>
                </div>

                <div class="pt-chart-area">
                    <!-- HTML Y-Axis (Precise Alignment) -->
                    <div class="pt-y-axis" style="position: absolute; left: 0; top: 0; height: 140px; width: 52px; display: block;">
                        ${yAxisLabels.map(label => {
            // Map SVG (50-350) range to HTML (0-140)
            const topPercent = ((50 + (label.yPosition / 100) * 300) / 400) * 100;
            return `<div class="pt-y-label" style="position: absolute; right: 6px; top: ${topPercent}%; transform: translateY(-50%); margin: 0;">${label.label}</div>`;
        }).join('')}
                    </div>

                    <div class="pt-svg-container">
                        <svg width="100%" height="100%" viewBox="0 0 2000 400" preserveAspectRatio="xMidYMid meet">
                            <defs>
                                <linearGradient id="ptGrad-${this.currentYear}" x1="0%" y1="0%" x2="0%" y2="100%">
                                    ${gradientStops}
                                </linearGradient>
                                <filter id="ptGlow-${this.currentYear}">
                                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            <!-- Grid Lines: Perfectly matched to data plotting area (50-350) -->
                            ${yAxisLabels.map(label => `
                                <line x1="50" y1="${50 + (label.yPosition / 100) * 300}" 
                                      x2="1950" y2="${50 + (label.yPosition / 100) * 300}" 
                                      stroke="rgba(0, 102, 204, 0.08)" stroke-width="2"/>
                            `).join('')} 

                            <!-- Area Path -->
                            <path d="${areaPath}" 
                                  fill="url(#ptGrad-${this.currentYear})" 
                                  opacity="0.7"/>
                            
                            <!-- Line Path -->
                            <path d="${linePath}" 
                                  fill="none" 
                                  stroke="url(#ptGrad-${this.currentYear})" 
                                  stroke-width="10"
                                  filter="url(#ptGlow-${this.currentYear})"/>

                            <!-- Data Points: Color-coded by value -->
                            ${points.map((point, index) => {
            const color = this.getGradientColor(point.spend, actualMinSpend, actualMaxSpend);
            return `
                                    <circle cx="${point.x}" cy="${point.y}" r="22" 
                                            fill="${color}"
                                            stroke="white" 
                                            stroke-width="6"
                                            class="pt-point"
                                            data-month="${index}"
                                            style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3)); cursor: pointer;"/>
                                `;
        }).join('')}
                            
                            <!-- Highlight System -->
                            <g id="pt-highlight-${this.currentYear}" style="opacity: 0; transition: opacity 0.3s; pointer-events: none;">
                                <line x1="0" y1="50" x2="0" y2="350" 
                                      stroke="${this.palette.blue}" stroke-width="5" stroke-dasharray="10,10"/>
                                <circle cx="0" cy="0" r="28" 
                                        fill="${this.palette.blue}" 
                                        stroke="white" 
                                        stroke-width="8"
                                        style="filter: drop-shadow(0 6px 15px rgba(0,102,204,0.4))"/>
                            </g>
                        </svg>
                    </div>

                    <!-- HTML X-Axis (Precise Alignment) -->
                    <div class="pt-x-axis" style="position: relative; margin-left: 52px; margin-right: 8px; height: 30px; display: block;">
                        ${this.monthlyData.map((data, index) => {
            // Map SVG point.x (50-1950) to percentage of 2000 width
            const leftPercent = ((50 + index * ((2000 - 100) / 11)) / 2000) * 100;
            return `
                                <div class="pt-x-label" data-month="${index}" 
                                     style="position: absolute; left: ${leftPercent}%; transform: translateX(-50%); white-space: nowrap;">
                                    ${data.month}
                                </div>
                            `;
        }).join('')}
                    </div>
                </div>

                <div class="purchase-timeline-stats-grid" style="margin-top: var(--s-space-3);">
                    <div class="timeline-stat-card monthly-stat">
                        <div class="s-icon-royal s-icon-sm">
                            <i class="fas fa-calendar-day"></i>
                        </div>
                        <div class="stat-content">
                            <div class="pt-stat-label">Month</div>
                            <div class="pt-stat-value" id="pt-month-${this.currentYear}">Jan</div>
                        </div>
                    </div>

                    <div class="timeline-stat-card monthly-stat">
                        <div class="s-icon-primary s-icon-sm">
                            <i class="fa-solid fa-indian-rupee-sign"></i>
                        </div>
                        <div class="stat-content">
                            <div class="pt-stat-label">Spend</div>
                            <div class="pt-stat-value" id="pt-spend-${this.currentYear}">₹0</div>
                        </div>
                    </div>

                    <div class="timeline-stat-card monthly-stat">
                        <div class="s-icon-info s-icon-sm">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="stat-content">
                            <div class="pt-stat-label">Items</div>
                            <div class="pt-stat-value" id="pt-items-${this.currentYear}">0</div>
                        </div>
                    </div>

                    <div class="timeline-stat-card yearly-stat">
                        <div class="s-icon-attention s-icon-sm">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-content">
                            <div class="pt-stat-label">Annual ${this.currentYear}</div>
                            <div class="pt-stat-value">${this.formatINR(yearTotals.totalSpend)}</div>
                        </div>
                    </div>

                    <div class="timeline-stat-card yearly-stat">
                        <div class="s-icon-info-special s-icon-sm">
                            <i class="fas fa-boxes"></i>
                        </div>
                        <div class="stat-content">
                            <div class="pt-stat-label">Total</div>
                            <div class="pt-stat-value">${yearTotals.totalItems}</div>
                        </div>
                    </div>

                    <div class="timeline-stat-card peak-month">
                        <div class="s-icon-amber s-icon-sm">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <div class="stat-content">
                            <div class="pt-stat-label">Peak</div>
                            <div class="pt-stat-value">${yearTotals.peakMonth}</div>
                        </div>
                    </div>
                </div>
        `;

        this.niceMax = niceMax;
        this.actualMinSpend = actualMinSpend;
        this.actualMaxSpend = actualMaxSpend;
        this.attachEventListeners();
    }

    updateMonthlyStats(monthIndex) {
        const data = this.monthlyData[monthIndex];
        const { points } = this.generatePath(this.niceMax);
        const point = points[monthIndex];

        const highlight = document.getElementById(`pt-highlight-${this.currentYear}`);
        if (highlight) {
            highlight.style.opacity = '1';
            highlight.querySelector('line').setAttribute('x1', point.x);
            highlight.querySelector('line').setAttribute('x2', point.x);
            highlight.querySelector('circle').setAttribute('cx', point.x);
            highlight.querySelector('circle').setAttribute('cy', point.y);
        }

        document.querySelectorAll('.pt-x-label').forEach((el, index) => {
            el.classList.toggle('active', index === monthIndex);
        });

        document.getElementById(`pt-month-${this.currentYear}`).textContent = data.month;
        this.animateValue(`pt-spend-${this.currentYear}`, 0, data.spend, 400, this.formatINR.bind(this));
        this.animateValue(`pt-items-${this.currentYear}`, 0, data.items, 400);

        document.querySelectorAll('.timeline-stat-card.monthly-stat').forEach(card => {
            card.classList.add('pulse');
            setTimeout(() => card.classList.remove('pulse'), 400);
        });
    }

    animateValue(elementId, start, end, duration, formatter = null) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuad = progress * (2 - progress);
            const current = Math.round(start + (end - start) * easeOutQuad);
            element.textContent = formatter ? formatter(current) : current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    attachEventListeners() {
        document.querySelectorAll('.pt-point').forEach(point => {
            point.addEventListener('click', (e) => {
                const monthIndex = parseInt(e.target.dataset.month);
                this.stopAnimation();
                this.updateMonthlyStats(monthIndex);
                this.currentMonth = monthIndex;
            });
        });

        document.querySelectorAll('.pt-x-label').forEach(label => {
            label.addEventListener('click', (e) => {
                const monthIndex = parseInt(e.target.dataset.month);
                this.stopAnimation();
                this.updateMonthlyStats(monthIndex);
                this.currentMonth = monthIndex;
            });
        });
    }

    startAnimation() {
        this.updateMonthlyStats(0);

        this.animationInterval = setInterval(() => {
            this.currentMonth = (this.currentMonth + 1) % 12;
            this.updateMonthlyStats(this.currentMonth);
        }, 3000);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
}

export { PurchaseTimeline };
