/* ════════════════════════════════════════════════════════════════════════════
   CAPITAL ALLOCATION DYNAMIC HEATMAP
   ════════════════════════════════════════════════════════════════════════════ */

export class CapitalAllocationHeatmap {
  constructor(containerId = 'viz-capital-allocation') {
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      console.warn(`⚠️ CapitalAllocationHeatmap: Container "${containerId}" not found`);
      return;
    }

    this.categories = [
      { 
        name: 'Tools & Equipment', 
        minIncrement: 5000, 
        maxIncrement: 80000, 
        baseValue: 250000, 
        minValue: 150000, 
        maxValue: 350000 
      },
      { 
        name: 'Vehicle & Parts', 
        minIncrement: 8000, 
        maxIncrement: 120000, 
        baseValue: 280000, 
        minValue: 180000, 
        maxValue: 380000 
      },
      { 
        name: 'Consumables', 
        minIncrement: 3000, 
        maxIncrement: 60000, 
        baseValue: 200000, 
        minValue: 120000, 
        maxValue: 280000 
      },
      { 
        name: 'Maintenance', 
        minIncrement: 2000, 
        maxIncrement: 70000, 
        baseValue: 220000, 
        minValue: 140000, 
        maxValue: 300000 
      },
      { 
        name: 'Infrastructure', 
        minIncrement: 4000, 
        maxIncrement: 90000, 
        baseValue: 180000, 
        minValue: 100000, 
        maxValue: 270000 
      },
      { 
        name: 'Safety & Compliance', 
        minIncrement: 2000, 
        maxIncrement: 50000, 
        baseValue: 170000, 
        minValue: 90000, 
        maxValue: 250000 
      }
    ];

    this.maxValue = 400000;
    this.currentValues = this.categories.map(cat => cat.baseValue);
    this.changeInterval = 3000;
    this.updateCounter = 0;
    this.animationId = null;
    this.previousRanking = null;
    this.previousSortedOrder = null;

    // Cycle tracking for ensuring each category increments fairly
    this.cycleStartIndex = 0;
    this.cycleIncrementCount = 0;
    this.cycleIncrements = [];
    this.rankChangeCounter = 0;
    this.lastIncrementedIndex = null;

    console.log('💰 Initializing Realistic Car Service Station Budget Tracker');
    console.log('📊 Base range: ₹1,50,000 - ₹3,50,000 per category (monthly)');
    console.log('🔄 Frequent rank changes expected due to close value convergence');
    console.log('♻️ New cycle logic: Fair rotation with paired increments');

    this.init();
  }

  init() {
    this.render(false);
    this.startAnimation();
  }

  getHeatLevelByRank(rank) {
    return 7 - rank;
  }

  formatINRFull(value) {
    return '₹' + Math.floor(value).toLocaleString('en-IN');
  }

  getRealisticIncrement(category, isIncrease) {
    if (isIncrease) {
      const randomFactor = Math.random();
      if (randomFactor < 0.55) {
        return category.minIncrement * (0.8 + Math.random() * 0.4);
      } else if (randomFactor < 0.80) {
        const range = category.maxIncrement - category.minIncrement;
        return category.minIncrement + range * 0.3;
      } else {
        const range = category.maxIncrement - category.minIncrement;
        return category.minIncrement + range * (0.4 + Math.random() * 0.3);
      }
    } else {
      return category.minIncrement * (0.6 + Math.random() * 0.8);
    }
  }

  getNextIndicesToIncrement() {
    const totalCategories = this.categories.length;

    // If cycle is complete, start new cycle
    if (this.cycleIncrements.length >= totalCategories) {
      console.log(`🔄 Cycle complete! ${totalCategories} categories incremented. Starting new cycle...`);
      
      let newStartIndex = Math.floor(Math.random() * totalCategories);
      while (newStartIndex === this.lastIncrementedIndex && totalCategories > 1) {
        newStartIndex = Math.floor(Math.random() * totalCategories);
      }

      this.cycleStartIndex = newStartIndex;
      this.cycleIncrements = [];
      console.log(`🎯 New cycle started at category ${newStartIndex}`);
    }

    // Get remaining categories in this cycle
    const remaining = [];
    for (let i = 0; i < totalCategories; i++) {
      if (!this.cycleIncrements.includes(i)) {
        remaining.push(i);
      }
    }

    // Increment 1-2 categories
    const incrementCnt = remaining.length === 1 ? 1 : (Math.random() < 0.5 ? 1 : 2);
    const selectedIndices = [];

    for (let i = 0; i < incrementCnt && remaining.length > 0; i++) {
      const randomPos = Math.floor(Math.random() * remaining.length);
      const selectedIdx = remaining[randomPos];
      selectedIndices.push(selectedIdx);
      
      // Mark as incremented in this cycle
      this.cycleIncrements.push(selectedIdx);
      this.lastIncrementedIndex = selectedIdx;
      
      // Remove from remaining
      remaining.splice(randomPos, 1);
    }

    return selectedIndices;
  }

  render(shouldAnimate = true) {
    const sorted = this.currentValues.map((val, idx) => ({
      name: this.categories[idx].name,
      value: val,
      index: idx,
      rank: 0
    })).sort((a, b) => b.value - a.value);

    sorted.forEach((item, rankIndex) => {
      item.rank = rankIndex + 1;
    });

    const currentRanking = sorted.map(item => item.index).join(',');
    const rankingChanged = this.previousRanking !== currentRanking && this.previousRanking !== null;

    if (rankingChanged) {
      this.rankChangeCounter++;
      console.log(`🔀 RANK CHANGE #${this.rankChangeCounter}! New order:`);
      sorted.forEach(item => {
        console.log(`   ${item.rank}. ${item.name}: ${this.formatINRFull(item.value)}`);
      });
    }

    this.previousRanking = currentRanking;

    // Get cell dimensions
    const containerWidth = this.container.parentElement?.offsetWidth || 300;
    const cellWidth = (containerWidth / 3) - 20;
    const cellHeight = 120;

    const html = sorted.map((item, position) => {
      const heatLevel = this.getHeatLevelByRank(item.rank);
      
      // Get original position of this item
      const originalPos = this.categories.findIndex(cat => cat.name === item.name);
      const row = Math.floor(originalPos / 3);
      const col = originalPos % 3;
      
      const newRow = Math.floor(position / 3);
      const newCol = position % 3;

      // ONLY apply transform if ranking changed & shouldAnimate=true
      let transform = 'translate(0, 0)';
      if (rankingChanged && shouldAnimate) {
        const translateX = (col - newCol) * (cellWidth + 20);
        const translateY = (row - newRow) * (cellHeight + 20);
        transform = `translate(${translateX}px, ${translateY}px)`;
      }

      return `
        <div class="capital-heatmap-cell capital-heat-${heatLevel}" 
             data-index="${item.index}" 
             data-rank="${item.rank}" 
             style="order: ${position}; transform: ${transform}">
          <div class="capital-heatmap-label">${item.name}</div>
          <div class="capital-heatmap-value">${this.formatINRFull(item.value)}</div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = html;

    // ONLY animate to final position if ranking changed
    if (rankingChanged && shouldAnimate) {
      void this.container.offsetHeight; // Force reflow
      requestAnimationFrame(() => {
        const cells = this.container.querySelectorAll('.capital-heatmap-cell');
        cells.forEach(cell => {
          cell.style.transform = 'translate(0, 0)';
        });
      });
    }
  }

  startAnimation() {
    this.animationId = setInterval(() => {
      this.updateCounter++;

      // Use cycle-based increment selection
      const indicesToChange = this.getNextIndicesToIncrement();

      indicesToChange.forEach(idx => {
        const category = this.categories[idx];
        const isIncrease = Math.random() > 0.4;
        const increment = this.getRealisticIncrement(category, isIncrease);

        if (isIncrease) {
          this.currentValues[idx] += increment;
        } else {
          this.currentValues[idx] -= increment;
        }

        // Enforce hard boundaries
        if (this.currentValues[idx] > category.maxValue) {
          this.currentValues[idx] = category.baseValue + (Math.random() - 0.5) * 50000;
        }
        if (this.currentValues[idx] < category.minValue) {
          this.currentValues[idx] = category.baseValue - Math.random() * 40000;
        }
      });

      this.cycleIncrementCount += indicesToChange.length;
      this.render(true);

      // Reset after 30-40 cycles
      if (this.updateCounter >= (30 + Math.floor(Math.random() * 10))) {
        this.updateCounter = 0;
        this.currentValues = this.categories.map(cat => cat.baseValue);
        this.previousRanking = null;
        this.cycleIncrements = [];
        this.cycleStartIndex = 0;
        this.cycleIncrementCount = 0;
        this.lastIncrementedIndex = null;
        this.rankChangeCounter = 0;
        this.render(false);
        console.log('🔄 Budget cycle reset to base allocation');
      }
    }, this.changeInterval);

    console.log('✅ Service Station Budget Animation Started');
  }

  destroy() {
    if (this.animationId) {
      clearInterval(this.animationId);
    }
    console.log('🛑 Budget Tracker destroyed');
  }
}
