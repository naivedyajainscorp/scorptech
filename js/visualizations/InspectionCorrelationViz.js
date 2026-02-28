export class InspectionCorrelationViz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }
        this.data = this.generateInitialData();
        this.updateInterval = null;
        this.init();
    }

    // --- DATA GENERATION ---
    generateInitialData() {
        const totalInspections = Math.floor(Math.random() * 500) + 1200; // 1200-1700
        const totalReports = Math.floor(Math.random() * 300) + 400; // 400-700
        return this.calculateMetrics(totalInspections, totalReports);
    }

    calculateMetrics(inspections, reports) {
        const totalActivities = inspections + reports;
        const inspectionPercentage = Math.round((inspections / totalActivities) * 100);
        const reportPercentage = Math.round((reports / totalActivities) * 100);
        const ratio = (inspections / reports).toFixed(2);

        return {
            totalActivities,
            inspections: {
                count: inspections,
                percentage: inspectionPercentage
            },
            reports: {
                count: reports,
                percentage: reportPercentage
            },
            ratio,
            interpretation: this.getInterpretation(ratio)
        };
    }

    getInterpretation(ratio) {
        if (ratio >= 2.5) return "Proactive maintenance dominates";
        if (ratio >= 1.5) return "Balanced maintenance approach";
        if (ratio >= 1.0) return "Reactive patterns emerging";
        return "Critical: More reports than inspections";
    }

    // --- DYNAMIC UPDATES ---
    startAutoUpdate() {
        if (this.updateInterval) clearInterval(this.updateInterval);

        this.updateInterval = setInterval(() => {
            const increment = Math.floor(Math.random() * 12) + 4; // 4-15 activities

            // Randomly distribute increment between inspections and reports (favoring inspections)
            const inspectionInc = Math.floor(increment * (0.6 + Math.random() * 0.25));
            const reportInc = increment - inspectionInc;

            this.data.inspections.count += inspectionInc;
            this.data.reports.count += reportInc;
            this.data.totalActivities += increment;

            // Check limit and reset
            if (this.data.totalActivities > 5000) {
                const currentRatio = this.data.inspections.count / this.data.reports.count;
                const newTotal = 1960 + Math.floor(Math.random() * 100);

                // Preserve ratio during reset: newTotal = R*newReports + newReports
                const newReports = Math.round(newTotal / (currentRatio + 1));
                const newInspections = newTotal - newReports;

                this.data.inspections.count = newInspections;
                this.data.reports.count = newReports;
                this.data.totalActivities = newTotal;
            }

            // Recalculate percentages and ratio
            this.data = this.calculateMetrics(this.data.inspections.count, this.data.reports.count);

            this.updateUI();
        }, 1000);
    }

    updateUI() {
        const totalEl = document.getElementById('viz-total-activities');
        const inspectCountEl = document.getElementById('viz-inspection-count');
        const reportCountEl = document.getElementById('viz-report-count');
        const inspectPctEl = document.getElementById('viz-inspection-percentage');
        const reportPctEl = document.getElementById('viz-report-percentage');
        const inspectBarEl = document.getElementById('viz-inspection-bar');
        const reportBarEl = document.getElementById('viz-report-bar');
        const ratioEl = document.getElementById('viz-ratio-text');
        const interpretEl = document.getElementById('viz-interpretation-text');

        if (totalEl) totalEl.textContent = this.data.totalActivities.toLocaleString();
        if (inspectCountEl) inspectCountEl.textContent = this.data.inspections.count.toLocaleString();
        if (reportCountEl) reportCountEl.textContent = this.data.reports.count.toLocaleString();

        if (inspectPctEl) inspectPctEl.textContent = `${this.data.inspections.percentage}% of total`;
        if (reportPctEl) reportPctEl.textContent = `${this.data.reports.percentage}% of total`;

        if (inspectBarEl) inspectBarEl.style.width = `${this.data.inspections.percentage}%`;
        if (reportBarEl) reportBarEl.style.width = `${this.data.reports.percentage}%`;

        if (ratioEl) ratioEl.textContent = `${this.data.ratio}:1`;
        if (interpretEl) interpretEl.textContent = this.data.interpretation;
    }

    // --- RENDER ---
    render() {
        const data = this.data;

        this.container.innerHTML = `
            <div class="scroll-card" data-tilt>
                
                <!-- HERO TOTAL ACTIVITIES -->
                <div style="text-align: center; margin-bottom: 1.25rem;">
                    <div id="viz-total-activities" class="s-text-primary s-font-black" style="font-family: 'Science Gothic', sans-serif; font-size: 3rem; line-height: 1; transition: all 0.3s ease;">
                        ${data.totalActivities.toLocaleString()}
                    </div>
                    <div class="s-text-gray-600 s-font-bold s-text-xs" style="letter-spacing: 0.08em; text-transform: uppercase; margin-top: 0.5rem;">
                        Total Activities
                    </div>
                </div>
                
                <!-- INSPECTIONS SECTION -->
                <div style="width: 100%; margin-bottom: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div class="s-icon s-icon-xs s-icon-info-special">
                                <i class="fas fa-clipboard-check"></i>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span class="s-text-gray-700 s-font-bold s-text-sm">Inspections</span>
                                <span id="viz-inspection-percentage" class="s-text-info-special s-font-black s-text-xs" style="font-family: 'Science Gothic', sans-serif; letter-spacing: 0.02em;">
                                    ${data.inspections.percentage}% of total
                                </span>
                            </div>
                        </div>
                        <span id="viz-inspection-count" class="s-text-info-special s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; line-height: 1;">
                            ${data.inspections.count.toLocaleString()}
                        </span>
                    </div>
                    
                    <div style="width: 100%; height: 0.75rem; background: var(--s-gray-100); border-radius: 1rem; overflow: hidden; position: relative; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);">
                        <div id="viz-inspection-bar" style="position: absolute; top: 0; left: 0; height: 100%; width: ${data.inspections.percentage}%; background: var(--s-info-special); border-radius: 1rem; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
                    </div>
                </div>
                
                <!-- REPORTS SECTION -->
                <div style="width: 100%; margin-bottom: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div class="s-icon s-icon-xs s-icon-attention">
                                <i class="fas fa-flag"></i>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span class="s-text-gray-700 s-font-bold s-text-sm">Reports</span>
                                <span id="viz-report-percentage" class="s-text-attention s-font-black s-text-xs" style="font-family: 'Science Gothic', sans-serif; letter-spacing: 0.02em;">
                                    ${data.reports.percentage}% of total
                                </span>
                            </div>
                        </div>
                        <span id="viz-report-count" class="s-text-attention s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; line-height: 1;">
                            ${data.reports.count.toLocaleString()}
                        </span>
                    </div>
                    
                    <div style="width: 100%; height: 0.75rem; background: var(--s-gray-100); border-radius: 1rem; overflow: hidden; position: relative; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);">
                        <div id="viz-report-bar" style="position: absolute; top: 0; left: 0; height: 100%; width: ${data.reports.percentage}%; background: var(--s-attention); border-radius: 1rem; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
                    </div>
                </div>
                
                <!-- RATIO INTERPRETATION -->
                <div style="width: 100%; background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(52, 152, 219, 0.05)); border: 1px solid var(--s-info-light); border-radius: 0.5rem; padding: 0.75rem; text-align: center;">
                    <div class="s-text-info s-font-bold s-text-sm" style="margin-bottom: 0.25rem;">
                        <i class="fas fa-chart-line"></i> Inspection-to-Report Ratio: <span id="viz-ratio-text" style="font-family: 'Science Gothic', sans-serif;">${data.ratio}:1</span>
                    </div>
                    <div id="viz-interpretation-text" class="s-text-info s-font-semibold s-text-xs">
                        ${data.interpretation}
                    </div>
                </div>
                
            </div>
        `;
    }

    init() {
        this.render();
        this.startAutoUpdate();
    }
}
