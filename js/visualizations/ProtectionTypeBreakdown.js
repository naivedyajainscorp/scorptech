/**
 * ProtectionTypeBreakdown.js
 * 
 * Visualization: Horizontal Stacked Bar Chart with Budget Limit
 * Context: Protection Type Breakdown (Tools, Machinery, Vehicles)
 */

export class ProtectionTypeBreakdown {
    constructor(containerId) {
        this.containerId = containerId;
        this.categories = [
            { id: 'tools', label: 'Tools', icon: 'fa-screwdriver-wrench', iconColor: 'primary', gradientClass: 's-text-gradient-primary', totalBase: 400000, variance: 100000 },
            { id: 'machinery', label: 'Machinery', icon: 'fa-gears', iconColor: 'royal', gradientClass: 's-text-gradient-royal', totalBase: 1200000, variance: 300000 },
            { id: 'vehicles', label: 'Vehicles', icon: 'fa-truck', iconColor: 'info-special', gradientClass: 's-gradient-text-info-special', totalBase: 800000, variance: 150000 }
        ];

        this.updateInterval = null;
        this.currentData = null;
        this.init();
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Initial render
        this.currentData = this.generateData();
        this.render();

        // Start auto-refresh every 4-5 seconds
        this.startAutoUpdate();
    }

    startAutoUpdate() {
        if (this.updateInterval) clearInterval(this.updateInterval);

        this.updateInterval = setInterval(() => {
            this.currentData = this.generateData();
            this.updateValues();
        }, 4000 + Math.random() * 1000); // 4-5 seconds
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    formatIndianCurrency(amount) {
        // Indian numbering system: 12,34,567
        const numStr = Math.floor(amount).toString();
        const lastThree = numStr.substring(numStr.length - 3);
        const otherNumbers = numStr.substring(0, numStr.length - 3);

        if (otherNumbers !== '') {
            return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
        } else {
            return '₹' + lastThree;
        }
    }

    generateData() {
        // Calculate max value for proportional sizing
        const maxVal = Math.max(...this.categories.map(c => c.totalBase + c.variance)) * 1.1;

        // Minimum bar width constraint (38% of container)
        const minBarWidthPct = 38;
        const minTotal = (minBarWidthPct / 100) * maxVal;

        // Ensure at least one category exceeds limit
        const data = this.categories.map((cat, index) => {
            // Generate percentages with minimum 15% constraint
            let warrantyPct, insurancePct, maintenancePct;

            do {
                warrantyPct = 15 + Math.floor(Math.random() * 40); // 15-54%
                insurancePct = 15 + Math.floor(Math.random() * 40); // 15-54%
                maintenancePct = 100 - warrantyPct - insurancePct;
            } while (maintenancePct < 15); // Ensure all are >= 15%

            // Generate total ensuring it meets minimum width
            let total = cat.totalBase + Math.floor(Math.random() * cat.variance);

            // Ensure total is at least minTotal
            if (total < minTotal) {
                total = minTotal + Math.floor(Math.random() * (cat.totalBase * 0.2));
            }

            let budget;

            // Force at least one to exceed (first category always exceeds)
            if (index === 0) {
                budget = total * (0.75 + Math.random() * 0.15); // 75-90% of total (will exceed)
            } else {
                budget = total * (0.85 + Math.random() * 0.3); // Random
            }

            // Calculate individual costs
            const warrantyCost = Math.floor(total * (warrantyPct / 100));
            const insuranceCost = Math.floor(total * (insurancePct / 100));
            const maintenanceCost = total - warrantyCost - insuranceCost;

            return {
                ...cat,
                warrantyPct,
                insurancePct,
                maintenancePct,
                warrantyCost,
                insuranceCost,
                maintenanceCost,
                total,
                budget
            };
        });

        return data;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Reset Container
        container.innerHTML = "";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "1.5rem";
        container.style.padding = "1rem 0.5rem";

        // 1. Render Category Rows
        this.currentData.forEach(d => {
            const row = this.createCategoryRow(d);
            container.appendChild(row);
        });

        // 2. Render Legend (Bottom)
        const legend = this.createLegend();
        container.appendChild(legend);
    }

    updateValues() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const maxVal = Math.max(...this.categories.map(c => c.totalBase + c.variance)) * 1.1;

        this.currentData.forEach((data, index) => {
            const row = container.children[index];
            if (!row) return;

            const totalPctOfContainer = (data.total / maxVal) * 100;
            const budgetPctOfContainer = (data.budget / maxVal) * 100;
            const isExceeded = data.total > data.budget;

            // Update Limit Exceeded Pill
            const header = row.querySelector('.ptb-header');
            const existingPill = header.querySelector('.s-pill');

            if (isExceeded && !existingPill) {
                const pill = document.createElement('span');
                pill.className = 's-pill s-pill-danger s-pill-round-sm pulse-animation';
                pill.style.marginLeft = 'auto';
                pill.innerHTML = `
                    <i class="fas fa-triangle-exclamation"></i>
                    <span>Limit Exceeded</span>
                `;
                header.appendChild(pill);
            } else if (!isExceeded && existingPill) {
                existingPill.remove();
            }

            // Update Progress Bar Container Width
            const barContainer = row.querySelector('.ptb-bar-container');
            if (barContainer) {
                barContainer.style.width = `${totalPctOfContainer}%`;
            }

            // Update Segment Widths
            const segments = row.querySelectorAll('.ptb-segment');
            if (segments.length === 3) {
                segments[0].style.width = `${data.warrantyPct}%`;
                segments[0].querySelector('.ptb-segment-text').textContent = `${data.warrantyPct}%`;

                segments[1].style.width = `${data.insurancePct}%`;
                segments[1].querySelector('.ptb-segment-text').textContent = `${data.insurancePct}%`;

                segments[2].style.width = `${data.maintenancePct}%`;
                segments[2].querySelector('.ptb-segment-text').textContent = `${data.maintenancePct}%`;
            }

            // Update Budget Notch Position
            const budgetNotch = row.querySelector('.ptb-budget-notch');
            if (budgetNotch) {
                budgetNotch.style.left = `${budgetPctOfContainer}%`;
            }

            // Update Cost Values
            const costTexts = row.querySelectorAll('.ptb-cost');
            if (costTexts.length === 3) {
                costTexts[0].textContent = this.formatIndianCurrency(data.warrantyCost);
                costTexts[1].textContent = this.formatIndianCurrency(data.insuranceCost);
                costTexts[2].textContent = this.formatIndianCurrency(data.maintenanceCost);
            }
        });
    }

    createLegend() {
        const legendDiv = document.createElement("div");
        legendDiv.style.display = "flex";
        legendDiv.style.justifyContent = "flex-end";
        legendDiv.style.gap = "1rem";
        legendDiv.style.marginBottom = "0.5rem";

        const items = [
            { label: 'Warranty', icon: 'fa-shield-halved', class: 's-icon-info' },
            { label: 'Insurance', icon: 'fa-file-shield', class: 's-icon-success' },
            { label: 'Maintenance', icon: 'fa-screwdriver-wrench', class: 's-icon-amber' }
        ];

        items.forEach(it => {
            const item = document.createElement("div");
            item.style.display = "flex";
            item.style.alignItems = "center";
            item.style.gap = "0.4rem";
            item.innerHTML = `
                <div class="s-icon s-icon-xs ${it.class}">
                    <i class="fa-solid ${it.icon}"></i>
                </div>
                <span class="s-text-gray-600 s-font-semibold" style="font-size: 0.75rem;">${it.label}</span>
            `;
            legendDiv.appendChild(item);
        });

        return legendDiv;
    }

    createCategoryRow(data) {
        const row = document.createElement("div");
        row.className = "ptb-row";
        row.style.width = "100%";

        const maxVal = Math.max(...this.categories.map(c => c.totalBase + c.variance)) * 1.1;
        const totalPctOfContainer = (data.total / maxVal) * 100;
        const budgetPctOfContainer = (data.budget / maxVal) * 100;

        const isExceeded = data.total > data.budget;

        row.innerHTML = `
            <!-- Category Header -->
            <div class="ptb-header" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div class="s-icon s-icon-sm s-icon-${data.iconColor}">
                    <i class="fas ${data.icon}"></i>
                </div>
                <span class="${data.gradientClass} s-font-black s-text-base" style="font-family: 'Science Gothic', sans-serif;">
                    ${data.label}
                </span>
                
                ${isExceeded ? `
                    <span class="s-pill s-pill-danger s-pill-round-sm pulse-animation" style="margin-left: auto;">
                        <i class="fas fa-triangle-exclamation"></i>
                        <span>Limit Exceeded</span>
                    </span>
                ` : ''}
            </div>

            <!-- Progress Bar Area -->
            <div style="position: relative; height: 28px; width: 100%; background: var(--s-gray-100); border-radius: 6px; overflow: visible; margin-bottom: 0.5rem;">
                <!-- Stacked Segments -->
                <div class="ptb-bar-container" style="display: flex; height: 100%; width: ${totalPctOfContainer}%; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);">
                    <div class="ptb-segment" style="width: ${data.warrantyPct}%; background: var(--s-gradient-info); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem; font-weight: 800; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);">
                        <span class="ptb-segment-text">${data.warrantyPct}%</span>
                    </div>
                    <div class="ptb-segment" style="width: ${data.insurancePct}%; background: var(--s-gradient-green); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem; font-weight: 800; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);">
                        <span class="ptb-segment-text">${data.insurancePct}%</span>
                    </div>
                    <div class="ptb-segment" style="width: ${data.maintenancePct}%; background: var(--s-gradient-amber); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem; font-weight: 800; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);">
                        <span class="ptb-segment-text">${data.maintenancePct}%</span>
                    </div>
                </div>

                <!-- Budget Notch (Chevron Down) -->
                <div class="ptb-budget-notch" style="position: absolute; left: ${budgetPctOfContainer}%; top: -6px; transform: translateX(-50%); z-index: 10; pointer-events: none; transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);">
                    <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid var(--s-danger); filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));"></div>
                </div>
            </div>
            
            <!-- Cost Breakdown Below Bar -->
            <div style="display: flex; gap: 1rem; font-size: 0.75rem; margin-top: 0.25rem;">
                <span class="s-text-info s-font-bold">
                    <i class="fa-solid fa-shield-halved" style="font-size: 0.7rem; opacity: 0.7;"></i>
                    <span class="ptb-cost">${this.formatIndianCurrency(data.warrantyCost)}</span>
                </span>
                <span class="s-text-success s-font-bold">
                    <i class="fas fa-file-shield" style="font-size: 0.7rem; opacity: 0.7;"></i>
                    <span class="ptb-cost">${this.formatIndianCurrency(data.insuranceCost)}</span>
                </span>
                <span class="s-text-amber s-font-bold">
                    <i class="fas fa-screwdriver-wrench" style="font-size: 0.7rem; opacity: 0.7;"></i>
                    <span class="ptb-cost">${this.formatIndianCurrency(data.maintenanceCost)}</span>
                </span>
            </div>
        `;

        return row;
    }
}
