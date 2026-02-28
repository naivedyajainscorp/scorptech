// ═══════════════════════════════════════════════════════════════════════════
// OPEX TREND TIMELINE VISUALIZATION
// Multi-line chart showing operational spending patterns over 12 months
// ═══════════════════════════════════════════════════════════════════════════

class OpexTrendTimeline {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container #${containerId} not found`);
            return;
        }
        
        // Get current year dynamically
        this.currentYear = new Date().getFullYear();
        
        // Sample data for 12 months (Jan - Dec)
        this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Data in INR
        this.data = {
            totalCost: [95000, 102000, 108000, 98000, 115000, 122000, 118000, 125000, 132000, 128000, 135000, 140000],
            labor: [32000, 35000, 38000, 34000, 40000, 42000, 41000, 43000, 45000, 44000, 45000, 47000],
            spares: [50000, 53000, 56000, 51000, 60000, 65000, 62000, 67000, 71000, 68000, 73000, 78000],
            miscellaneous: [13000, 14000, 14000, 13000, 15000, 15000, 15000, 15000, 16000, 16000, 17000, 15000]
        };
        
        // Chart dimensions
        this.chartWidth = 550;
        this.chartHeight = 280;
        this.padding = { top: 20, right: 20, bottom: 40, left: 60 };
        this.plotWidth = this.chartWidth - this.padding.left - this.padding.right;
        this.plotHeight = this.chartHeight - this.padding.top - this.padding.bottom;
        this.maxValue = 160000;
        
        this.init();
    }
    
    init() {
        this.render();
    }
    
    buildPathWithPoints(data, color) {
        const xStep = this.plotWidth / (data.length - 1);
        const points = data.map((val, i) => {
            const x = this.padding.left + (i * xStep);
            const y = this.padding.top + (this.plotHeight - (val / this.maxValue) * this.plotHeight);
            return { x, y, value: val };
        });
        
        const path = points.map((p, i) => 
            `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
        ).join(' ');
        
        const circles = points.map(p => 
            `<circle cx="${p.x}" cy="${p.y}" class="opex-trend-point" stroke="${color}" />`
        ).join('');
        
        return { path, circles };
    }
    
    render() {
        // Build paths for all data series
        const totalPath = this.buildPathWithPoints(this.data.totalCost, '#0066cc');
        const laborPath = this.buildPathWithPoints(this.data.labor, '#f59e0b');
        const sparesPath = this.buildPathWithPoints(this.data.spares, '#10b981');
        const miscPath = this.buildPathWithPoints(this.data.miscellaneous, '#facc15');
        
        // Y-axis labels
        const yLabels = [0, 40000, 80000, 120000, 160000].map((val, i) => {
            const y = this.padding.top + this.plotHeight - (i * this.plotHeight / 4);
            return `<text x="${this.padding.left - 10}" y="${y}" text-anchor="end" class="opex-axis-label">₹${(val/1000)}k</text>`;
        }).join('');
        
        // X-axis labels
        const xLabels = this.months.map((month, i) => {
            const x = this.padding.left + (i * this.plotWidth / (this.months.length - 1));
            const y = this.chartHeight - this.padding.bottom + 20;
            return `<text x="${x}" y="${y}" text-anchor="middle" class="opex-axis-label">${month}</text>`;
        }).join('');
        
        this.container.innerHTML = `
            <div class="opex-trend-chart">
<div class="opex-trend-header s-bg-primary">
    <div class="opex-trend-title">
        <i class="fas fa-chart-area"></i>
        <span>Cost Trend Analysis</span>
    </div>
    <span class="s-pill s-pill-lg s-pill-round-sm s-pill-frost" style="font-family: 'Science Gothic', Arial, sans-serif; font-style: italic; ">${this.currentYear}</span>
</div>

                
                <div class="opex-trend-canvas">
                    <svg class="opex-trend-svg" viewBox="0 0 ${this.chartWidth} ${this.chartHeight}" preserveAspectRatio="xMidYMid meet">
                        <!-- Grid Lines -->
                        ${[0, 0.25, 0.5, 0.75, 1].map(pct => 
                            `<line x1="${this.padding.left}" y1="${this.padding.top + this.plotHeight * pct}" 
                                x2="${this.chartWidth - this.padding.right}" y2="${this.padding.top + this.plotHeight * pct}" 
                                stroke="rgba(0,0,0,0.08)" stroke-width="1"/>`
                        ).join('')}
                        
                        <!-- Axes -->
                        <line x1="${this.padding.left}" y1="${this.padding.top}" 
                            x2="${this.padding.left}" y2="${this.chartHeight - this.padding.bottom}" 
                            stroke="#333" stroke-width="2"/>
                        <line x1="${this.padding.left}" y1="${this.chartHeight - this.padding.bottom}" 
                            x2="${this.chartWidth - this.padding.right}" y2="${this.chartHeight - this.padding.bottom}" 
                            stroke="#333" stroke-width="2"/>
                        
                        <!-- Y-axis labels -->
                        ${yLabels}
                        
                        <!-- X-axis labels -->
                        ${xLabels}
                        
                        <!-- Lines (draw in reverse order so Total is on top) -->
                        <path d="${miscPath.path}" stroke="#facc15" stroke-width="2" fill="none" class="opex-line-path"/>
                        <path d="${sparesPath.path}" stroke="#10b981" stroke-width="2" fill="none" class="opex-line-path"/>
                        <path d="${laborPath.path}" stroke="#f59e0b" stroke-width="2" fill="none" class="opex-line-path"/>
                        <path d="${totalPath.path}" stroke="#0066cc" stroke-width="3" fill="none" class="opex-line-path opex-line-total"/>
                        
                        <!-- Points -->
                        ${miscPath.circles}
                        ${sparesPath.circles}
                        ${laborPath.circles}
                        ${totalPath.circles}
                    </svg>
                </div>
                
                <div class="opex-trend-legend">
                    <div class="opex-trend-legend-item">
                        <div class="opex-trend-line-icon opex-line-total"></div>
                        <span>Total Cost</span>
                    </div>
                    <div class="opex-trend-legend-item">
                        <div class="opex-trend-line-icon opex-line-labor"></div>
                        <span>Labor</span>
                    </div>
                    <div class="opex-trend-legend-item">
                        <div class="opex-trend-line-icon opex-line-parts"></div>
                        <span>Spares & Materials</span>
                    </div>
                    <div class="opex-trend-legend-item">
                        <div class="opex-trend-line-icon opex-line-misc"></div>
                        <span>Miscellaneous</span>
                    </div>
                </div>
            </div>
        `;
    }
}

export { OpexTrendTimeline };