/* ═══════════════════════════════════════════════════════════════════════════
   DISPOSAL WATERFALL ANALYSIS - PROPER ACCOUNTING MATH
   Purpose: Simulate real asset lifecycle with incremental purchase & disposal
   
   Formula: Book Value = Purchase Cost - Accumulated Depreciation
            Net Loss = Book Value - Recovered Amount
            Recovery Rate = (Recovered / Book Value) × 100
═══════════════════════════════════════════════════════════════════════════ */

export class DisposalWaterfallAnalysis {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container ${containerId} not found`);
      return;
    }

    this.current = {
      purchase: 850000,
      depreciation: 600000,
      book: 250000,
      recovered: 50000,
      netLoss: 200000,
      recoveryRate: 20
    };

    this.depreciationRate = 15000;
    this.recoveryPerDisposal = 8000;

    this.init();
  }

  formatINR(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateNewValues() {
    const shouldAddPurchase = Math.random() > 0.7;
    let newPurchase = this.current.purchase;
    let newDepreciation = this.current.depreciation;
    let newRecovered = this.current.recovered;

    if (shouldAddPurchase) {
      const purchaseIncrement = this.randomInRange(50000, 150000);
      newPurchase += purchaseIncrement;
      newDepreciation += this.randomInRange(10000, 30000);
    } else {
      const depIncrease = this.randomInRange(10000, 25000);
      newDepreciation = Math.min(newDepreciation + depIncrease, newPurchase * 0.95);

      const shouldDispose = Math.random() > 0.6;
      if (shouldDispose) {
        const recoveryIncrement = this.randomInRange(5000, 15000);
        newRecovered += recoveryIncrement;
      }
    }

    const newBook = newPurchase - newDepreciation;
    const newNetLoss = newBook - newRecovered;
    const newRecoveryRate = Math.max(15, Math.min(35, Math.round((newRecovered / newBook) * 100)));

    return {
      purchase: newPurchase,
      depreciation: newDepreciation,
      book: newBook,
      recovered: newRecovered,
      netLoss: newNetLoss,
      recoveryRate: newRecoveryRate
    };
  }

  showArrow(elementId, isIncrease) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const parent = element.parentElement;
    if (!parent) return;

    const existing = parent.querySelector('.value-arrow');
    if (existing) existing.remove();

    const arrow = document.createElement('span');
    arrow.className = `value-arrow ${isIncrease ? 'arrow-up' : 'arrow-down'}`;
    arrow.innerHTML = `<i class="fas fa-arrow-${isIncrease ? 'up' : 'down'}"></i>`;

    parent.style.position = 'relative';
    parent.appendChild(arrow);

    setTimeout(() => arrow.remove(), 1500);
  }

  animateValue(elementId, oldValue, newValue, isCurrency = true) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const difference = newValue - oldValue;

    if (Math.abs(difference) > 1000) {
      this.showArrow(elementId, difference > 0);
    }

    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = oldValue + (difference * easeOut);

      element.textContent = isCurrency
        ? this.formatINR(Math.round(current))
        : `${Math.round(current)}%`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = isCurrency
          ? this.formatINR(newValue)
          : `${newValue}%`;
      }
    };

    requestAnimationFrame(animate);
  }

  animateProgress(barId, oldPct, newPct) {
    const bar = document.getElementById(barId);
    if (!bar) return;

    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = oldPct + ((newPct - oldPct) * easeOut);

      bar.style.width = `${current}%`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  updateValues() {
    const old = { ...this.current };
    const newVals = this.generateNewValues();

    this.animateValue('val-purchase', old.purchase, newVals.purchase);
    this.animateValue('val-depreciation', old.depreciation, newVals.depreciation);
    this.animateValue('val-book', old.book, newVals.book);
    this.animateValue('val-recovered', old.recovered, newVals.recovered);
    this.animateValue('val-net-loss', old.netLoss, newVals.netLoss);
    this.animateValue('val-recovery-rate', old.recoveryRate, newVals.recoveryRate, false);

    const maxValue = newVals.purchase;
    this.animateProgress('bar-depreciation', (old.depreciation / old.purchase) * 100, (newVals.depreciation / maxValue) * 100);
    this.animateProgress('bar-book', (old.book / old.purchase) * 100, (newVals.book / maxValue) * 100);
    this.animateProgress('bar-recovered', (old.recovered / old.book) * 100, (newVals.recovered / newVals.book) * 100);

    this.current = newVals;
  }

  render() {
    const maxValue = this.current.purchase;
    const depPct = (this.current.depreciation / maxValue) * 100;
    const bookPct = (this.current.book / maxValue) * 100;
    const recoveredPct = (this.current.recovered / this.current.book) * 100;

    this.container.innerHTML = `
      <div class="s-card-compact bg-transparent p-0">
        <!-- Total Purchase Value -->
        <div class="s-bg-gradient-primary s-rounded-lg s-shadow-sm p-3 mb-4 d-flex align-items-center gap-3">
          <div class="s-icon s-icon-frost s-icon-lg">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="flex-grow-1 position-relative">
            <div class="s-text-white s-font-semibold s-text-sm mb-1">Original Purchase Value</div>
            <div class="s-text-white s-font-black s-text-2xl" id="val-purchase" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
              ${this.formatINR(this.current.purchase)}
            </div>
          </div>
        </div>

        <!-- Progress Metrics -->
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div class="d-flex align-items-center gap-2">
              <div class="s-icon s-icon-danger s-icon-xs">
                <i class="bi bi-bar-chart-fill" style="transform: scaleX(-1); display:inline-block;"></i>
              </div>
              <span class="s-text-gray-600 s-font-semibold s-text-sm">Accumulated Depreciation</span>
            </div>
            <div class="s-text-danger s-font-bold s-text-sm" id="val-depreciation">${this.formatINR(this.current.depreciation)}</div>
          </div>
          <div class="s-progress-bg s-bg-gray-100 s-rounded-full overflow-hidden" style="height: 8px;">
            <div class="s-progress-fill s-bg-gradient-danger h-100" id="bar-depreciation" style="width: ${depPct}%; transition: width 1.2s ease;"></div>
          </div>
        </div>

        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div class="d-flex align-items-center gap-2">
              <div class="s-icon s-icon-amber s-icon-xs">
                <i class="fas fa-book"></i>
              </div>
              <span class="s-text-gray-600 s-font-semibold s-text-sm">Book Value at Disposal</span>
            </div>
            <div class="s-text-amber s-font-bold s-text-sm" id="val-book">${this.formatINR(this.current.book)}</div>
          </div>
          <div class="s-progress-bg s-bg-gray-100 s-rounded-full overflow-hidden" style="height: 8px;">
            <div class="s-progress-fill s-bg-gradient-amber h-100" id="bar-book" style="width: ${bookPct}%; transition: width 1.2s ease;"></div>
          </div>
        </div>

        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div class="d-flex align-items-center gap-2">
              <div class="s-icon s-icon-green s-icon-xs">
                <i class="fa-solid fa-file-invoice"></i>
              </div>
              <span class="s-text-gray-600 s-font-semibold s-text-sm">Amount Recovered</span>
            </div>
            <div class="s-text-success s-font-bold s-text-sm" id="val-recovered">${this.formatINR(this.current.recovered)}</div>
          </div>
          <div class="s-progress-bg s-bg-gray-100 s-rounded-full overflow-hidden" style="height: 8px;">
            <div class="s-progress-fill s-bg-gradient-success h-100" id="bar-recovered" style="width: ${recoveredPct}%; transition: width 1.2s ease;"></div>
          </div>
        </div>

        <!-- Chips Row -->
        <div class="d-flex gap-2">
          <div class="s-label-danger-soft flex-grow-1 d-flex align-items-center gap-2 s-pill-round-sm p-2">
            <div class="s-icon s-icon-danger s-icon-sm">
              <i class="fas fa-minus-circle"></i>
            </div>
            <div class="flex-grow-1">
              <div class="s-text-xs s-font-semibold opacity-75">Net Loss</div>
              <div class="s-text-sm s-font-bold" id="val-net-loss">${this.formatINR(this.current.netLoss)}</div>
            </div>
          </div>

          <div class="s-label-primary-soft flex-grow-1 d-flex align-items-center gap-2 s-pill-round-sm p-2">
            <div class="s-icon s-icon-primary s-icon-sm">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="flex-grow-1">
              <div class="s-text-xs s-font-semibold opacity-75">Recovery Rate</div>
              <div class="s-text-sm s-font-bold" id="val-recovery-rate">${this.current.recoveryRate}%</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  init() {
    this.render();
    // Changed from 4000ms to 5000ms (5 seconds)
    setInterval(() => this.updateValues(), 5000);
  }
}
