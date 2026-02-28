// ═══════════════════════════════════════════════════════════════════════════
// NET COST AFTER RECOVERY - LIVE TRACKER VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════
class NetCostRecovery {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = {
            purchaseCost: 5200000,
            protectionPremiums: 125000,
            serviceOperations: 340000,
            insuranceClaims: 180000,
            extendedWarrantyClaims: 65000,
            maintenanceContractClaims: 42000
        };
        this.incrementIntervals = [];
        this.init();
    }

    init() {
        this.render();
        this.startLiveUpdates();
    }

    formatINR(value) {
        return `₹${value.toLocaleString('en-IN')}`;
    }

    calculateTotals() {
        const grossTotal = this.data.purchaseCost + this.data.protectionPremiums + this.data.serviceOperations;
        const recoveriesTotal = this.data.insuranceClaims + this.data.extendedWarrantyClaims + this.data.maintenanceContractClaims;
        const netTotal = grossTotal - recoveriesTotal;
        const recoveryRate = ((recoveriesTotal / grossTotal) * 100).toFixed(1);

        const operationalCosts = this.data.protectionPremiums + this.data.serviceOperations;
        const netSavings = recoveriesTotal - operationalCosts;

        return {
            grossTotal,
            recoveriesTotal,
            netTotal,
            recoveryRate,
            netSavings,
            operationalCosts
        };
    }

    render() {
        const totals = this.calculateTotals();
        const isGain = totals.netSavings >= 0;

        this.container.innerHTML = `
            <div class="s-ncr-tracker">
                <!-- Gross Burden -->
                <div class="s-ncr-section s-border-xs s-border-attention s-bg-gradient-attention">
                    <div class="s-ncr-header">
                        <i class="fas fa-coins"></i>
                        <span class="s-ncr-title">Gross Operational Cost</span>
                        <strong class="s-ncr-total" data-total="gross">${this.formatINR(totals.grossTotal)}</strong>
                    </div>
                    <div class="s-ncr-items">
                        <div class="s-ncr-item">
                            <div class="s-icon s-icon-sm s-icon-primary">
                                <i class="fa-solid fa-file-invoice"></i>
                            </div>                        
                            <span class="s-text-gradient-primary s-ncr-label">Purchase Cost</span>
                            <span class="s-ncr-value s-static s-text-gradient-primary" data-field="purchaseCost">${this.formatINR(this.data.purchaseCost)}</span>
                        </div>
                        <div class="s-ncr-item">
                            <div class="s-icon s-icon-sm s-icon-green">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <span class="s-text-gradient-green s-ncr-label">Protection Premiums</span>
                            <span class="s-ncr-value s-live s-text-gradient-green" data-field="protectionPremiums">${this.formatINR(this.data.protectionPremiums)}</span>
                        </div>
                        <div class="s-ncr-item">
                            <div class="s-icon s-icon-sm s-icon-amber">
                                <i class="fas fa-wrench"></i>
                            </div>
                            <span class="s-text-gradient-amber s-ncr-label">Service & Operations</span>
                            <span class="s-ncr-value s-live s-text-gradient-amber" data-field="serviceOperations">${this.formatINR(this.data.serviceOperations)}</span>
                        </div>
                    </div>
                </div>

                <!-- Recoveries -->
                <div class="s-ncr-section s-border-xs s-border-success s-bg-gradient-success">
                    <div class="s-ncr-header">
                        <i class="fa-solid fa-file-invoice"></i>
                        <span class="s-ncr-title">Total Recoveries</span>
                        <strong class="s-ncr-total" data-total="recoveries">${this.formatINR(totals.recoveriesTotal)}</strong>
                    </div>
                    <div class="s-ncr-items">
                        <div class="s-ncr-item">
                            <div class="s-icon s-icon-sm s-icon-success">
                                <i class="fa-solid fa-file-circle-check"></i>
                            </div>
                            <span class="s-text-gradient-success s-ncr-label">Insurance Claims</span>
                            <span class="s-ncr-value s-text-gradient-success s-live" data-field="insuranceClaims">${this.formatINR(this.data.insuranceClaims)}</span>
                        </div>
                        <div class="s-ncr-item">
                            <div class="s-icon s-icon-sm s-icon-success">
                                <i class="fa-solid fa-file-circle-check"></i>
                            </div>
                            <span class="s-text-gradient-success s-ncr-label">Extended Warranty</span>
                            <span class="s-ncr-value s-text-gradient-success s-live" data-field="extendedWarrantyClaims">${this.formatINR(this.data.extendedWarrantyClaims)}</span>
                        </div>
                        <div class="s-ncr-item">
                            <div class="s-icon s-icon-sm s-icon-success">
                                <i class="fa-solid fa-file-circle-check"></i>
                            </div>
                            <span class="s-text-gradient-success s-ncr-label">Maintenance Contract</span>
                            <span class="s-ncr-value s-text-gradient-success s-live" data-field="maintenanceContractClaims">${this.formatINR(this.data.maintenanceContractClaims)}</span>
                        </div>
                    </div>
                </div>

                <!-- Net Result -->
                <div class="s-ncr-section s-bg-gradient-primary">
                    <div class="s-ncr-header s-ncr-net">
                        <i class="fa-solid fa-money-bills"></i>
                        <span class="s-ncr-title">Net Operational Expense</span>
                        <strong class="s-ncr-total s-ncr-total-large" data-total="net">${this.formatINR(totals.netTotal)}</strong>
                    </div>
                </div>

                <!-- Metrics -->
                <div class="s-ncr-metrics">
                    <div class="s-ncr-metric s-label-primary-soft">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="bi bi-graph-up"></i>
                        </div>
                        <div class="s-ncr-metric-content">
                            <span class="s-ncr-metric-label s-text-gradient-primary">Recovery Rate</span>
                            <span class="s-ncr-metric-value" data-metric="recoveryRate">${totals.recoveryRate}%</span>
                        </div>
                    </div>
                    <div class="s-ncr-metric ${isGain ? 's-label-success-soft' : 's-label-danger-soft'}" data-metric-state="${isGain ? 'gain' : 'loss'}">
                        <div class="s-icon s-icon-sm ${isGain ? 's-icon-success' : 's-icon-danger'}">
                            <i class="${isGain ? 'bi bi-piggy-bank-fill' : 'bi bi-exclamation-triangle-fill'}"></i>
                        </div>
                        <div class="s-ncr-metric-content">
                            <span class="s-ncr-metric-label ${isGain ? 's-text-gradient-success' : 's-text-gradient-danger'}">${isGain ? 'Net Savings' : 'Net Loss'}</span>
                            <span class="s-ncr-metric-value" data-metric="netSavings">${this.formatINR(Math.abs(totals.netSavings))}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    startLiveUpdates() {
        const fields = [
            { key: 'protectionPremiums', increment: 500, interval: 8000 },
            { key: 'serviceOperations', increment: 1200, interval: 5000 },
            { key: 'insuranceClaims', increment: 800, interval: 12000 },
            { key: 'extendedWarrantyClaims', increment: 300, interval: 15000 },
            { key: 'maintenanceContractClaims', increment: 200, interval: 10000 }
        ];

        fields.forEach(field => {
            const intervalId = setInterval(() => {
                this.data[field.key] += field.increment;
                this.updateDisplay(field.key, field.increment);
            }, field.interval);
            this.incrementIntervals.push(intervalId);
        });
    }

    updateDisplay(fieldKey, increment) {
        const totals = this.calculateTotals();

        const fieldElement = this.container.querySelector(`[data-field="${fieldKey}"]`);
        if (fieldElement) {
            fieldElement.textContent = this.formatINR(this.data[fieldKey]);
            this.triggerFlash(fieldElement);
        }

        // Update totals
        const grossElement = this.container.querySelector('[data-total="gross"]');
        const recoveriesElement = this.container.querySelector('[data-total="recoveries"]');
        const netElement = this.container.querySelector('[data-total="net"]');
        const rateElement = this.container.querySelector('[data-metric="recoveryRate"]');
        const savingsElement = this.container.querySelector('[data-metric="netSavings"]');

        if (grossElement) {
            grossElement.textContent = this.formatINR(totals.grossTotal);
            this.triggerFlash(grossElement);
        }
        if (recoveriesElement) {
            recoveriesElement.textContent = this.formatINR(totals.recoveriesTotal);
            this.triggerFlash(recoveriesElement);
        }
        if (netElement) {
            netElement.textContent = this.formatINR(totals.netTotal);
            this.triggerFlash(netElement);
        }
        if (rateElement) rateElement.textContent = `${totals.recoveryRate}%`;
        if (savingsElement) {
            savingsElement.textContent = this.formatINR(Math.abs(totals.netSavings));
            this.triggerFlash(savingsElement);
        }

        const metricElement = savingsElement?.closest('.s-ncr-metric');
        if (metricElement) {
            const isGain = totals.netSavings >= 0;
            const currentState = metricElement.getAttribute('data-metric-state');
            const newState = isGain ? 'gain' : 'loss';

            // Only update if state changed
            if (currentState !== newState) {
                metricElement.setAttribute('data-metric-state', newState);

                // Update label classes
                metricElement.classList.remove('s-label-success-soft', 's-label-danger-soft');
                metricElement.classList.add(isGain ? 's-label-success-soft' : 's-label-danger-soft');

                // Update icon wrapper
                const iconWrapper = metricElement.querySelector('.s-icon');
                if (iconWrapper) {
                    iconWrapper.classList.remove('s-icon-success', 's-icon-danger');
                    iconWrapper.classList.add(isGain ? 's-icon-success' : 's-icon-danger');
                }

                // Update icon itself
                const iconElement = metricElement.querySelector('.s-icon i');
                if (iconElement) {
                    iconElement.className = isGain ? 'bi bi-piggy-bank-fill' : 'bi bi-exclamation-triangle-fill';
                }

                // Update label text and gradient
                const labelElement = metricElement.querySelector('.s-ncr-metric-label');
                if (labelElement) {
                    labelElement.textContent = isGain ? 'Net Savings' : 'Net Loss';
                    labelElement.classList.remove('s-text-gradient-success', 's-text-gradient-danger');
                    labelElement.classList.add(isGain ? 's-text-gradient-success' : 's-text-gradient-danger');
                }
            }
        }
    }

    triggerFlash(element) {
        element.classList.remove('s-flash');
        void element.offsetWidth; // Force reflow
        element.classList.add('s-flash');
        setTimeout(() => element.classList.remove('s-flash'), 600);
    }

    destroy() {
        this.incrementIntervals.forEach(clearInterval);
        this.incrementIntervals = [];
    }
}

export { NetCostRecovery };
