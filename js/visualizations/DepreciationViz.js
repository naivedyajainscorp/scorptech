/**
 * DUAL-DEPRECIATION VISUALIZATION
 * Straight Line Method (IT Act 1961) vs Written Down Value (Company Act 2013)
 * Side-by-side animated bar charts showing book value and depreciation patterns
 */

class DepreciationViz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        this.animationInterval = null;
        this.init();
    }

    /**
     * Data for Straight Line Method (IT Act 1961)
     * Constant 9% depreciation per period
     */
    getStraightLineData() {
        return [
            { book: 100, dep: 9 },
            { book: 91, dep: 9 },
            { book: 82, dep: 9 },
            { book: 73, dep: 9 },
            { book: 64, dep: 9 },
            { book: 55, dep: 9 },
            { book: 46, dep: 9 },
            { book: 37, dep: 9 },
            { book: 28, dep: 9 },
            { book: 19, dep: 9 }
        ];
    }

    /**
     * Data for Written Down Value Method (Company Act 2013)
     * Decreasing depreciation on reducing balance
     */
    getWDVData() {
        return [
            { book: 100, dep: 15 },
            { book: 85, dep: 12.75 },
            { book: 72.25, dep: 10.84 },
            { book: 61.41, dep: 9.21 },
            { book: 52.2, dep: 7.83 },
            { book: 44.37, dep: 6.66 },
            { book: 37.71, dep: 5.66 },
            { book: 32.05, dep: 4.81 },
            { book: 27.24, dep: 4.09 },
            { book: 23.15, dep: 3.47 }
        ];
    }

    /**
     * Initialize and render the visualization
     */
    init() {
        this.render();
        this.startAnimationLoop(8000);
    }

    /**
     * Render the complete dual-chart visualization
     */
    render() {
this.container.innerHTML = `
    <div class="depreciation-header s-shadow-lg s-bg-gradient-primary">
        <div class="depreciation-header-content">
            <i class="fas fa-chart-line"></i>
            <div>
                <h4 class="s-text-xl">Dual-Depreciation Intelligence</h4>
                <p>IT Act 1961 vs Company Act 2013</p>
            </div>
        </div>
    </div>

    <div class="depreciation-chart-wrapper">
        
        <div class="depreciation-chart-card">
            <div class="depreciation-chart-header">
                <h4>Straight Line Method</h4>
                <span class="s-pill s-pill-round-sm s-pill-sm s-pill-attention">IT Act 1961</span>
            </div>
            
            <div class="depreciation-chart-container">
                <div class="depreciation-y-label s-font-semibold s-text-sm">Value (₹)</div>
                <div class="depreciation-chart" id="depreciation-straight-line"></div>
                <div class="depreciation-x-label s-font-semibold s-text-sm">Years</div>
            </div>
        </div>

        <div class="depreciation-chart-card">
            <div class="depreciation-chart-header">
                <h4>Written Down Value Method</h4>
                <span class="s-pill s-pill-round-sm s-pill-sm s-pill-attention">Company Act 2013</span>
            </div>
            
            <div class="depreciation-chart-container">
                <div class="depreciation-y-label s-font-semibold s-text-sm">Value (₹)</div>
                <div class="depreciation-chart" id="depreciation-wdv"></div>
                <div class="depreciation-x-label s-font-semibold s-text-sm">Years</div>
            </div>
        </div>

    </div>
`;




        // Generate charts after DOM is ready
        setTimeout(() => {
            this.createChart('depreciation-straight-line', this.getStraightLineData());
            this.createChart('depreciation-wdv', this.getWDVData());
            this.playAnimation();
        }, 100);
    }

    /**
     * Create animated bar chart
     * @param {string} chartId - ID of the chart container
     * @param {Array} data - Array of {book, dep} objects
     */
    createChart(chartId, data) {
        const chart = document.getElementById(chartId);
        if (!chart) return;

        data.forEach((item, index) => {
            // Create bar pair container
            const barPair = document.createElement('div');
            barPair.className = 'depreciation-bar-pair';

            // Create book value bar (blue)
            const bookBar = document.createElement('div');
            bookBar.className = 'depreciation-bar s-bg-primary s-shadow-sm';
            bookBar.style.height = `${item.book}%`;
            bookBar.dataset.delay = index * 0.15;

            // Create depreciation bar (orange)
            const depBar = document.createElement('div');
            depBar.className = 'depreciation-bar s-bg-attention s-shadow-sm';
            depBar.style.height = `${item.dep}%`;
            depBar.dataset.delay = index * 0.15 + 0.075;

            // Append bars to pair
            barPair.appendChild(bookBar);
            barPair.appendChild(depBar);

            // Append pair to chart
            chart.appendChild(barPair);
        });
    }

    /**
     * Play animation by adding 'animate' class with delays
     */
    playAnimation() {
        const allBars = this.container.querySelectorAll('.depreciation-bar');
        
        allBars.forEach(bar => {
            const delay = parseFloat(bar.dataset.delay) * 1000;
            setTimeout(() => {
                bar.classList.add('animate');
            }, delay);
        });
    }

    /**
     * Reset animation by removing 'animate' class
     */
    resetAnimation() {
        const allBars = this.container.querySelectorAll('.depreciation-bar');
        allBars.forEach(bar => {
            bar.classList.remove('animate');
        });
    }

    /**
     * Start animation loop
     * @param {number} interval - Loop interval in milliseconds (default: 5000ms = 5s)
     */
    startAnimationLoop(interval = 5000) {
        // Clear existing interval if any
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        // Set up loop
        this.animationInterval = setInterval(() => {
            this.resetAnimation();
            setTimeout(() => {
                this.playAnimation();
            }, 100); // Small delay before replaying
        }, interval);
    }

    /**
     * Stop animation loop
     */
    stopAnimationLoop() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Destroy instance and clean up
     */
    destroy() {
        this.stopAnimationLoop();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export for module usage
export { DepreciationViz };
