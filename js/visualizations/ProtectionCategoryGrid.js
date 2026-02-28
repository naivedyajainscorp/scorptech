/**
 * ProtectionCategoryGrid.js (Carousel Edition - Enhanced with Design System)
 * 
 * Visualization: Auto-Carousel of Protection Analytics
 * Categories: Tools -> Machinery -> Vehicles (3s Loop)
 * Features: Auto-slide, Manual Dots, Independent Active Math, Full Design System Integration
 */

export class ProtectionCategoryGrid {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        // Configuration with proper semantic data
        this.categories = [
            {
                id: 'tools',
                label: 'Tools',
                icon: 'fa-screwdriver-wrench',
                totalBase: 400000,
                variance: 50000,
                iconColor: 'primary',
                itemCount: 45
            },
            {
                id: 'machinery',
                label: 'Machinery',
                icon: 'fa-gears',
                totalBase: 1200000,
                variance: 150000,
                iconColor: 'royal',
                itemCount: 28
            },
            {
                id: 'vehicles',
                label: 'Vehicles',
                icon: 'fa-truck',
                totalBase: 800000,
                variance: 80000,
                iconColor: 'info-special',
                itemCount: 67
            }
        ];

        this.currentIndex = 0;
        this.interval = null;
        this.states = {};

        // Initialize state
        this.categories.forEach(cat => {
            this.states[cat.id] = {
                current: {
                    warranty: 33,
                    insurance: 33,
                    maintenance: 34,
                    warrantyAmount: 0,
                    insuranceAmount: 0,
                    maintenanceAmount: 0,
                    total: 0
                },
                ranges: {
                    totalMin: cat.totalBase,
                    totalMax: cat.totalBase + cat.variance
                }
            };
        });

        this.init();
    }

    randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    formatCurrency(amount) {
        return `₹${amount.toLocaleString('en-IN')}`;
    }

    formatPercent(value) {
        return `${value}%`;
    }

    generateData(catId) {
        const state = this.states[catId];
        let warranty = this.randomInRange(20, 45);
        let insurance = this.randomInRange(20, 45);
        let maintenance = 100 - warranty - insurance;

        if (maintenance < 10) {
            const diff = 10 - maintenance;
            warranty -= diff;
            maintenance = 10;
        }

        const total = this.randomInRange(state.ranges.totalMin, state.ranges.totalMax);
        const warrantyAmount = Math.floor((warranty / 100) * total);
        const insuranceAmount = Math.floor((insurance / 100) * total);
        const maintenanceAmount = total - warrantyAmount - insuranceAmount;

        return { warranty, insurance, maintenance, warrantyAmount, insuranceAmount, maintenanceAmount, total };
    }

    animateValue(element, start, end, duration = 1000, formatter = null, step = 1) {
        if (!element) return;
        const startTime = performance.now();
        const difference = end - start;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress * (2 - progress);

            const rawValue = start + difference * eased;
            const current = Math.round(rawValue / step) * step;

            element.textContent = formatter ? formatter(current) : current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = formatter ? formatter(end) : end;
            }
        };
        requestAnimationFrame(animate);
    }

    render() {
        this.container.innerHTML = "";
        this.container.style.position = "relative";
        this.container.style.overflow = "hidden";
        this.container.style.minHeight = "420px";
        this.container.style.background = "none";
        this.container.style.display = "block";

        // Create Container for Slides
        const track = document.createElement("div");
        track.style.position = "relative";
        track.style.width = "100%";
        track.style.height = "100%";
        this.container.appendChild(track);

        // Render each category as an absolute slide
        this.categories.forEach((cat, index) => {
            const slide = document.createElement("div");
            slide.id = `slide-${cat.id}`;
            slide.style.position = "absolute";
            slide.style.top = "0";
            slide.style.left = "0";
            slide.style.width = "100%";
            slide.style.height = "100%";
            slide.style.opacity = index === 0 ? "1" : "0";
            slide.style.transform = index === 0 ? "translateX(0)" : "translateX(20px)";
            slide.style.transition = "all 1s cubic-bezier(0.25, 0.8, 0.25, 1)";
            slide.style.pointerEvents = index === 0 ? "auto" : "none";
            slide.style.zIndex = index === 0 ? "2" : "1";

            const innerHTML = `
                                                <!-- HEADER ZONE (Rule 2) -->
                                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                                                    <!-- LEFT: Icon + Name -->
                                                    <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                                                        <div class="s-icon s-icon-md s-icon-${cat.iconColor}">
                                                            <i class="fas ${cat.icon}"></i>
                                                        </div>
                                                        <span class="s-text-${cat.iconColor} s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">
                                                            ${cat.label}
                                                        </span>
                                                    </div>
                                                    <!-- RIGHT: Item Count Pill -->
                                                    <span class="s-pill s-pill-${cat.iconColor} s-pill-sm s-pill-round-sm">
                                                        <i class="fas fa-layer-group"></i>
                                                        <span>${cat.itemCount} Items</span>
                                                    </span>
                                                </div>

                                                <!-- DIVIDER -->
                                                <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>

                                                <!-- PROGRESS BAR (Thicker with Percentages) -->
                                                <div style="height: 28px; margin-bottom: 1rem; border-radius: 8px; overflow: hidden; display: flex; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
                                                    <div id="seg-${cat.id}-warranty" class="protection-segment s-bg-info s-font-bold s-text-xs" style="width: 0%; display: flex; align-items: center; justify-content: center; transition: width 1s ease; color: white;">
                                                        <span id="pct-${cat.id}-warranty">0%</span>
                                                    </div>
                                                    <div id="seg-${cat.id}-insurance" class="protection-segment s-bg-green s-font-bold s-text-xs" style="width: 0%; display: flex; align-items: center; justify-content: center; transition: width 1s ease; color: white;">
                                                        <span id="pct-${cat.id}-insurance">0%</span>
                                                    </div>
                                                    <div id="seg-${cat.id}-maintenance" class="protection-segment s-bg-amber s-font-bold s-text-xs" style="width: 0%; display: flex; align-items: center; justify-content: center; transition: width 1s ease; color: white;">
                                                        <span id="pct-${cat.id}-maintenance">0%</span>
                                                    </div>
                                                </div>

                                                <!-- STAT GRID (Rule 5) -->
                                                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem;">
                                
                                <!-- Extended Warranty -->
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                                        <div class="s-icon s-icon-xs s-icon-info">
                                            <i class="fas fa-shield-alt"></i>
                                        </div>
                                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Extended warranty</span>
                                    </div>
                                    <span id="amt-${cat.id}-warranty" class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">₹0</span>
                                </div>

                                <!-- Insurance Policy -->
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                                        <div class="s-icon s-icon-xs s-icon-green">
                                            <i class="fas fa-file-contract"></i>
                                        </div>
                                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Insurance policy</span>
                                    </div>
                                    <span id="amt-${cat.id}-insurance" class="s-text-success s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">₹0</span>
                                </div>

                                <!-- Maintenance Contract -->
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                                        <div class="s-icon s-icon-xs s-icon-amber">
                                            <i class="fas fa-tools"></i>
                                        </div>
                                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Maintenance contract</span>
                                    </div>
                                    <span id="amt-${cat.id}-maintenance" class="s-text-amber s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">₹0</span>
                                </div>

                            </div>

                    <!-- DIVIDER -->
                    <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>

                    <!-- HERO METRIC - Total (Rule 4) -->
                    <div style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, rgba(0, 102, 204, 0.03), rgba(0, 102, 204, 0.08)); border-radius: 8px; padding: 0.75rem 1rem;">
                        <span class="s-font-bold s-text-primary s-text-lg">Total</span>
                        <span id="total-${cat.id}" class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">₹0</span>
                    </div>
            `;
            slide.innerHTML = innerHTML;
            track.appendChild(slide);
        });

        // Indicators (Dots)
        const indicators = document.createElement("div");
        indicators.style.position = "absolute";
        indicators.style.bottom = "12px";
        indicators.style.left = "50%";
        indicators.style.transform = "translateX(-50%)";
        indicators.style.display = "flex";
        indicators.style.gap = "8px";
        indicators.style.zIndex = "10";

        this.categories.forEach((_, i) => {
            const dot = document.createElement("div");
            dot.id = `indicator-${i}`;
            dot.style.width = "24px";
            dot.style.height = "4px";
            dot.style.borderRadius = "2px";
            dot.style.background = i === 0 ? "var(--s-primary)" : "var(--s-gray-300)";
            dot.style.transition = "all 0.3s ease";
            dot.style.cursor = "pointer";

            dot.onclick = () => {
                this.stopCarousel();
                this.showSlide(i);
                this.startCarousel();
            };

            indicators.appendChild(dot);
        });
        this.container.appendChild(indicators);

        // Pause on Hover
        this.container.addEventListener('mouseenter', () => this.stopCarousel());
        this.container.addEventListener('mouseleave', () => this.startCarousel());

        // Start Math updates
        this.updateAllData();
        setInterval(() => this.updateAllData(), 5000);

        // Start Carousel
        this.startCarousel();
    }

    showSlide(index) {
        this.categories.forEach((cat, i) => {
            const slide = document.getElementById(`slide-${cat.id}`);
            const dot = document.getElementById(`indicator-${i}`);

            if (i === index) {
                slide.style.opacity = "1";
                slide.style.transform = "translateX(0)";
                slide.style.zIndex = "2";
                slide.style.pointerEvents = "auto";
                if (dot) dot.style.background = "var(--s-primary)";
            } else {
                slide.style.opacity = "0";
                slide.style.transform = "translateX(20px)";
                slide.style.zIndex = "1";
                slide.style.pointerEvents = "none";
                if (dot) dot.style.background = "var(--s-gray-300)";
            }
        });
        this.currentIndex = index;
    }

    nextSlide() {
        const next = (this.currentIndex + 1) % this.categories.length;
        this.showSlide(next);
    }

    startCarousel() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.nextSlide(), 3000);
    }

    stopCarousel() {
        if (this.interval) clearInterval(this.interval);
    }

    updateAllData() {
        this.categories.forEach(cat => {
            this.updateCategoryData(cat.id);
        });
    }

    updateCategoryData(catId) {
        const newData = this.generateData(catId);
        const currentState = this.states[catId].current;

        const segWarranty = document.getElementById(`seg-${catId}-warranty`);
        const segInsurance = document.getElementById(`seg-${catId}-insurance`);
        const segMaintenance = document.getElementById(`seg-${catId}-maintenance`);

        if (!segWarranty) return;

        // Animate progress bar widths
        segWarranty.style.width = `${newData.warranty}%`;
        segInsurance.style.width = `${newData.insurance}%`;
        segMaintenance.style.width = `${newData.maintenance}%`;

        // Animate percentages inside progress bars
        this.animateValue(document.getElementById(`pct-${catId}-warranty`), currentState.warranty, newData.warranty, 1000, this.formatPercent, 1);
        this.animateValue(document.getElementById(`pct-${catId}-insurance`), currentState.insurance, newData.insurance, 1000, this.formatPercent, 1);
        this.animateValue(document.getElementById(`pct-${catId}-maintenance`), currentState.maintenance, newData.maintenance, 1000, this.formatPercent, 1);

        // Animate amounts with prime steps
        this.animateValue(document.getElementById(`amt-${catId}-warranty`), currentState.warrantyAmount, newData.warrantyAmount, 1000, this.formatCurrency, 1327);
        this.animateValue(document.getElementById(`amt-${catId}-insurance`), currentState.insuranceAmount, newData.insuranceAmount, 1000, this.formatCurrency, 1597);
        this.animateValue(document.getElementById(`amt-${catId}-maintenance`), currentState.maintenanceAmount, newData.maintenanceAmount, 1000, this.formatCurrency, 1787);
        this.animateValue(document.getElementById(`total-${catId}`), currentState.total, newData.total, 1000, this.formatCurrency, 2003);

        this.states[catId].current = newData;
    }

    init() {
        this.render();
    }
}
