class ConsolidatedProtection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container ${containerId} not found`);
      return;
    }

    this.ranges = {
      warranty: { min: 15, max: 45 },
      insurance: { min: 15, max: 50 },
      maintenance: { min: 15, max: 35 },
      totalMin: 800000,
      totalMax: 1500000
    };

    this.current = {
      warranty: 34,
      insurance: 44,
      maintenance: 22,
      warrantyAmount: 400000,
      insuranceAmount: 500000,
      maintenanceAmount: 300000,
      total: 1200000
    };

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

  generateData() {
    let warranty = this.randomInRange(this.ranges.warranty.min, this.ranges.warranty.max);
    let insurance = this.randomInRange(this.ranges.insurance.min, this.ranges.insurance.max);
    let maintenance = 100 - warranty - insurance;

    if (maintenance < 15) {
      const excess = 15 - maintenance;
      warranty >= insurance ? (warranty -= excess) : (insurance -= excess);
      maintenance = 15;
    }

    const total = this.randomInRange(this.ranges.totalMin, this.ranges.totalMax);
    const warrantyAmount = Math.floor((warranty / 100) * total);
    const insuranceAmount = Math.floor((insurance / 100) * total);
    const maintenanceAmount = total - warrantyAmount - insuranceAmount;

    return {
      warranty,
      insurance,
      maintenance,
      warrantyAmount,
      insuranceAmount,
      maintenanceAmount,
      total
    };
  }

  // UPDATED: Added step parameter
  animateValue(element, start, end, duration = 1000, formatter = null, step = 1) {
    if (!element) return;
    const startTime = performance.now();
    const difference = end - start;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * (2 - progress);

      // Round to nearest step
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
    const data = this.generateData();

    this.container.innerHTML = `
      <div class="protection-viz-wrapper">
        <div class="protection-progress">
          <div id="seg-warranty" class="protection-segment s-bg-info s-font-bold s-text-sm" style="width: 0%">
            <span id="pct-warranty">0%</span>
          </div>
          <div id="seg-insurance" class="protection-segment s-bg-green s-font-bold s-text-sm" style="width: 0%">
            <span id="pct-insurance">0%</span>
          </div>
          <div id="seg-maintenance" class="protection-segment s-bg-amber s-font-bold s-text-sm" style="width: 0%">
            <span id="pct-maintenance">0%</span>
          </div>
        </div>

        <div class="protection-legend">
          <div class="protection-legend-item">
            <div class="s-icon s-icon-info s-icon-md">
              <i class="fas fa-shield-alt"></i>
            </div>
            <div class="protection-legend-title s-font-bold s-gradient-text-info">Extended Warranties</div>
            <div class="protection-legend-amount" id="amt-warranty">₹0</div>
            <div class="protection-legend-percent" id="pct2-warranty">0%</div>
          </div>

          <div class="protection-legend-item">
            <div class="s-icon s-icon-green s-icon-md">
              <i class="fas fa-file-contract"></i>
            </div>
            <div class="protection-legend-title s-font-bold s-gradient-text-green">Insurance Policies</div>
            <div class="protection-legend-amount" id="amt-insurance">₹0</div>
            <div class="protection-legend-percent" id="pct2-insurance">0%</div>
          </div>

          <div class="protection-legend-item">
            <div class="s-icon s-icon-amber s-icon-md">
              <i class="fas fa-tools"></i>
            </div>
            <div class="protection-legend-title s-font-bold s-gradient-text-amber">Maintenance Contracts</div>
            <div class="protection-legend-amount" id="amt-maintenance">₹0</div>
            <div class="protection-legend-percent" id="pct2-maintenance">0%</div>
          </div>
        </div>
        <div class="protection-total">
          <div class="protection-total-amount" id="p-total">₹0</div>
          <div class="protection-total-label">Total Protection Cost</div>
        </div>
      </div>
    `;

    this.attachInteractions();

    setTimeout(() => {
      // Animate progress bars
      document.getElementById('seg-warranty').style.width = `${data.warranty}%`;
      document.getElementById('seg-insurance').style.width = `${data.insurance}%`;
      document.getElementById('seg-maintenance').style.width = `${data.maintenance}%`;

      // Animate progress bar percentages (by 1s)
      this.animateValue(document.getElementById('pct-warranty'), 0, data.warranty, 1000, this.formatPercent, 1);
      this.animateValue(document.getElementById('pct-insurance'), 0, data.insurance, 1000, this.formatPercent, 1);
      this.animateValue(document.getElementById('pct-maintenance'), 0, data.maintenance, 1000, this.formatPercent, 1);

      // Animate legend percentages (by 1s)
      this.animateValue(document.getElementById('pct2-warranty'), 0, data.warranty, 1000, this.formatPercent, 1);
      this.animateValue(document.getElementById('pct2-insurance'), 0, data.insurance, 1000, this.formatPercent, 1);
      this.animateValue(document.getElementById('pct2-maintenance'), 0, data.maintenance, 1000, this.formatPercent, 1);

      // Animate amounts with 4-DIGIT PRIME STEPS
      this.animateValue(document.getElementById('amt-warranty'), 0, data.warrantyAmount, 1000, this.formatCurrency.bind(this), 1327);
      this.animateValue(document.getElementById('amt-insurance'), 0, data.insuranceAmount, 1000, this.formatCurrency.bind(this), 1597);
      this.animateValue(document.getElementById('amt-maintenance'), 0, data.maintenanceAmount, 1000, this.formatCurrency.bind(this), 1787);
      this.animateValue(document.getElementById('p-total'), 0, data.total, 1000, this.formatCurrency.bind(this), 2003);

      this.current = data;
    }, 100);
  }

  attachInteractions() {
    const segments = this.container.querySelectorAll('.protection-segment');
    const items = this.container.querySelectorAll('.protection-legend-item');

    segments.forEach((seg, i) => {
      seg.addEventListener('mouseenter', () => {
        if (items[i]) items[i].style.transform = 'translateY(-4px) scale(1.05)';
      });
      seg.addEventListener('mouseleave', () => {
        if (items[i]) items[i].style.transform = '';
      });
    });
  }

  update = () => {
    const data = this.generateData();

    document.getElementById('seg-warranty').style.width = `${data.warranty}%`;
    document.getElementById('seg-insurance').style.width = `${data.insurance}%`;
    document.getElementById('seg-maintenance').style.width = `${data.maintenance}%`;

    // Percentages by 1
    this.animateValue(document.getElementById('pct-warranty'), this.current.warranty, data.warranty, 1000, this.formatPercent, 1);
    this.animateValue(document.getElementById('pct-insurance'), this.current.insurance, data.insurance, 1000, this.formatPercent, 1);
    this.animateValue(document.getElementById('pct-maintenance'), this.current.maintenance, data.maintenance, 1000, this.formatPercent, 1);

    this.animateValue(document.getElementById('pct2-warranty'), this.current.warranty, data.warranty, 1000, this.formatPercent, 1);
    this.animateValue(document.getElementById('pct2-insurance'), this.current.insurance, data.insurance, 1000, this.formatPercent, 1);
    this.animateValue(document.getElementById('pct2-maintenance'), this.current.maintenance, data.maintenance, 1000, this.formatPercent, 1);

    // Amounts with prime steps
    this.animateValue(document.getElementById('amt-warranty'), this.current.warrantyAmount, data.warrantyAmount, 1000, this.formatCurrency.bind(this), 1327);
    this.animateValue(document.getElementById('amt-insurance'), this.current.insuranceAmount, data.insuranceAmount, 1000, this.formatCurrency.bind(this), 1597);
    this.animateValue(document.getElementById('amt-maintenance'), this.current.maintenanceAmount, data.maintenanceAmount, 1000, this.formatCurrency.bind(this), 1787);
    this.animateValue(document.getElementById('p-total'), this.current.total, data.total, 1000, this.formatCurrency.bind(this), 2003);

    this.current = data;
  };

  init() {
    this.render();
    setInterval(this.update, 5000);
  }

  refresh() {
    this.update();
  }
}

export { ConsolidatedProtection };
