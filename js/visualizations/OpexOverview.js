/* ════════════════════════════════════════════════════════════════════════════
   OPEX OVERVIEW VISUALIZATION
   ════════════════════════════════════════════════════════════════════════════ */

export class OpexOverview {
  constructor(containerId = 'viz-opex-overview') {
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      console.warn(`⚠️ OpexOverview: Container "${containerId}" not found`);
      return;
    }

    this.data = {
      labor: { min: 30, max: 45 },
      misc: { min: 10, max: 20 },
      totalMin: 100000,
      totalMax: 200000
    };

    // Store current values for smooth transitions
    this.currentValues = {
      labor: 35,
      parts: 50,
      misc: 15,
      laborAmount: 50000,
      partsAmount: 75000,
      miscAmount: 25000,
      total: 150000
    };

    this.init();
  }

  randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Indian number format: 1,23,456
  formatIndianCurrency(num) {
    const str = num.toString();
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== '') {
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
    }
    return lastThree;
  }

  generateValues() {
    const labor = this.randomInRange(this.data.labor.min, this.data.labor.max);
    const misc = this.randomInRange(this.data.misc.min, this.data.misc.max);
    const parts = 100 - labor - misc;
    
    const total = this.randomInRange(this.data.totalMin, this.data.totalMax);
    const laborAmount = Math.floor((labor / 100) * total);
    const partsAmount = Math.floor((parts / 100) * total);
    const miscAmount = total - laborAmount - partsAmount;
    
    return { labor, parts, misc, laborAmount, partsAmount, miscAmount, total };
  }

  // Smooth number count animation with adaptive step sizes
  animateValue(elementId, start, end, duration = 1000, isPercentage = false, isCurrency = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startTime = performance.now();
    const difference = end - start;
    
    // Define step size based on the range
    let stepSize;
    if (isCurrency) {
      // For currency: adaptive steps based on amount range
      const range = Math.abs(difference);
      if (range > 50000) stepSize = 8684;      // Jump by 1000 for large amounts
      else if (range > 10000) stepSize = 5187;  // Jump by 500 for medium amounts
      else stepSize = 99;                      // Jump by 100 for small amounts
    } else if (isPercentage) {
      stepSize = 1;  // Percentages increment by 1
    }

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = progress * (2 - progress);
      let current = start + difference * easeOutQuad;
      
      // Round to nearest step
      if (stepSize) {
        current = Math.round(current / stepSize) * stepSize;
      } else {
        current = Math.round(current);
      }

      if (isCurrency) {
        element.textContent = `₹${this.formatIndianCurrency(current)}`;
      } else if (isPercentage) {
        element.textContent = `${Math.round(current)}%`;
      } else {
        element.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final value is exact
        if (isCurrency) {
          element.textContent = `₹${this.formatIndianCurrency(end)}`;
        } else if (isPercentage) {
          element.textContent = `${end}%`;
        } else {
          element.textContent = end;
        }
      }
    };

    requestAnimationFrame(animate);
  }

  render() {
    const data = this.generateValues();
    
this.container.innerHTML = `
  <div class="s-bg-white s-rounded-lg" style="padding: 4px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
    
    <!-- Progress Bar -->
    <div class="s-rounded-md s-shadow-sm" style="width: 100%; height: 40px; overflow: hidden; display: flex; margin-bottom: 2rem;">
      <div id="progress-labor" class="s-bg-gradient-primary" style="width: 0%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem; font-family: 'Science Gothic', sans-serif; transition: width 1.2s ease-in-out;">
        <span id="percent-labor">0%</span>
      </div>
      <div id="progress-parts" class="s-bg-gradient-success" style="width: 0%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem; font-family: 'Science Gothic', sans-serif; transition: width 1.2s ease-in-out;">
        <span id="percent-parts">0%</span>
      </div>
      <div id="progress-misc" class="s-bg-gradient-amber" style="width: 0%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem; font-family: 'Science Gothic', sans-serif; transition: width 1.2s ease-in-out;">
        <span id="percent-misc">0%</span>
      </div>
    </div>

      <!-- Legend -->
    <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
      
      <!-- Labor -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div class="s-icon s-icon-sm s-icon-primary">
            <i class="fas fa-wrench"></i>
          </div>
          <span class="s-font-semibold s-text-gradient-primary s-font-bold">Labor Costs</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span id="amount-labor" class="s-text-xl s-font-semibold s-text-primary" style="font-family: 'Science Gothic', sans-serif;">₹0</span>
          <span id="percent-labor-legend" class="s-text-gray-500 s-text-xs s-font-semibold">0%</span>
        </div>
      </div>
      <!-- Parts -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div class="s-icon s-icon-sm s-icon-green">
            <i class="fas fa-puzzle-piece"></i>
          </div>
          <span class="s-font-semibold s-text-gradient-green s-font-bold">Spare Parts & Materials</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span id="amount-parts" class="s-text-xl s-font-semibold s-text-primary" style="font-family: 'Science Gothic', sans-serif;">₹0</span>
          <span id="percent-parts-legend" class="s-text-gray-500 s-text-xs s-font-semibold">0%</span>
        </div>
      </div>
      <!-- Misc -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div class="s-icon s-icon-sm s-icon-amber">
            <i class="fas fa-file-fragment"></i>
          </div>
          <span class="s-font-semibold s-text-gradient-amber s-font-bold">Miscellaneous</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span id="amount-misc" class="s-text-xl s-font-semibold s-text-primary" style="font-family: 'Science Gothic', sans-serif;">₹0</span>
          <span id="percent-misc-legend" class="s-text-gray-500 s-text-xs s-font-semibold">0%</span>
        </div>
      </div>
    </div>
    <!-- Total -->
    <div class="s-text-center" style="padding-top: 1.5rem;">
      <div id="total-amount" class="s-text-primary s-font-black" style="font-size: 2.5rem; font-family: 'Science Gothic', sans-serif; letter-spacing: 1px;">
        ₹0
      </div>
      <div class="s-text-gray-500 s-text-sm s-font-semibold" style="margin-top: 0.5rem; letter-spacing: 0.5px;">
        Total Operational Expenditure
      </div>
    </div>
  </div>
`;


    // Animate everything after render
    setTimeout(() => {
      // Progress bars
      document.getElementById('progress-labor').style.width = `${data.labor}%`;
      document.getElementById('progress-parts').style.width = `${data.parts}%`;
      document.getElementById('progress-misc').style.width = `${data.misc}%`;
      
      // Animate percentages
      this.animateValue('percent-labor', this.currentValues.labor, data.labor, 1000, true);
      this.animateValue('percent-parts', this.currentValues.parts, data.parts, 1000, true);
      this.animateValue('percent-misc', this.currentValues.misc, data.misc, 1000, true);
      this.animateValue('percent-labor-legend', this.currentValues.labor, data.labor, 1000, true);
      this.animateValue('percent-parts-legend', this.currentValues.parts, data.parts, 1000, true);
      this.animateValue('percent-misc-legend', this.currentValues.misc, data.misc, 1000, true);
      
      // Animate currency amounts
      this.animateValue('amount-labor', this.currentValues.laborAmount, data.laborAmount, 1000, false, true);
      this.animateValue('amount-parts', this.currentValues.partsAmount, data.partsAmount, 1000, false, true);
      this.animateValue('amount-misc', this.currentValues.miscAmount, data.miscAmount, 1000, false, true);
      this.animateValue('total-amount', this.currentValues.total, data.total, 1000, false, true);
      
      // Update stored values
      this.currentValues = data;
    }, 500);
  }

  update() {
    const data = this.generateValues();
    
    // Smooth progress bar transitions
    document.getElementById('progress-labor').style.width = `${data.labor}%`;
    document.getElementById('progress-parts').style.width = `${data.parts}%`;
    document.getElementById('progress-misc').style.width = `${data.misc}%`;
    
    // Animate all values
    this.animateValue('percent-labor', this.currentValues.labor, data.labor, 1000, true);
    this.animateValue('percent-parts', this.currentValues.parts, data.parts, 1000, true);
    this.animateValue('percent-misc', this.currentValues.misc, data.misc, 1000, true);
    this.animateValue('percent-labor-legend', this.currentValues.labor, data.labor, 1000, true);
    this.animateValue('percent-parts-legend', this.currentValues.parts, data.parts, 1000, true);
    this.animateValue('percent-misc-legend', this.currentValues.misc, data.misc, 1000, true);
    
    this.animateValue('amount-labor', this.currentValues.laborAmount, data.laborAmount, 1000, false, true);
    this.animateValue('amount-parts', this.currentValues.partsAmount, data.partsAmount, 1000, false, true);
    this.animateValue('amount-misc', this.currentValues.miscAmount, data.miscAmount, 1000, false, true);
    this.animateValue('total-amount', this.currentValues.total, data.total, 1000, false, true);
    
    // Update stored values
    this.currentValues = data;
  }

  init() {
    this.render();
    setInterval(() => this.update(), 5000);
  }
}
