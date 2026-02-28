/* ═══════════════════════════════════════════════════════════════════════════
   DISPOSAL METHODS DONUT - CALIBRATED (single coordinate space)
   Fixes:
   - No mixed <g translate(...)> coordinate systems (leaders/dots align correctly)
   - foreignObject has extra room for pill shadows/hover scale
   - Labels/pills clamped to SVG viewBox so nothing gets cropped
═══════════════════════════════════════════════════════════════════════════ */

export class DisposalMethodsDonut {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container ${containerId} not found`);
      return;
    }

    const root = getComputedStyle(document.documentElement);
    const getColor = (varName) => root.getPropertyValue(varName).trim();

    this.config = {
      lost: {
        color: getColor('--s-danger'),
        gradient: [getColor('--s-danger-light'), getColor('--s-danger')],
        pillClass: 's-pill-danger',
        iconClass: 'fas fa-triangle-exclamation',
        label: 'Lost'
      },
      eol: {
        color: getColor('--s-amber'),
        gradient: [getColor('--s-amber'), getColor('--s-amber-600')],
        pillClass: 's-pill-amber',
        iconClass: 'fas fa-hourglass-end',
        label: 'End of Life'
      },
      sold: {
        color: getColor('--s-success'),
        gradient: [getColor('--s-success-soft'), getColor('--s-success')],
        pillClass: 's-pill-success',
        iconClass: 'fas fa-file-invoice',
        label: 'Sold'
      },
      discarded: {
        color: getColor('--s-neutral-600'),
        gradient: [getColor('--s-neutral-500'), getColor('--s-neutral-600')],
        pillClass: 's-pill-neutral',
        iconClass: 'fas fa-trash-can',
        label: 'Trashed'
      },
      replaced: {
        color: getColor('--s-primary'),
        gradient: [getColor('--s-primary-600'), getColor('--s-primary-700')],
        pillClass: 's-pill-primary',
        iconClass: 'fas fa-arrows-rotate',
        label: 'Replaced'
      }
    };

    // SVG layout (absolute positions in the SVG viewBox coordinate system)
    this.layout = {
      viewBoxW: 650,
      viewBoxH: 280,

      // where the donut's local (0,0) used to be translated to
      donutTx: 225,
      donutTy: 40,

      // donut geometry (local)
      localCenterX: 100,
      localCenterY: 100,
      radius: 80,
      outerRadius: 115,
      labelDistance: 155,

      // stroke
      strokeWidth: 40
    };

    // Pill geometry; foreignObject gets extra room for shadow + hover scale
    this.pillBox = {
      pillW: 140,
      pillH: 28,
      foExtraX: 18,
      foExtraY: 18,
      offset: 5,
      margin: 2
    };

    this.animationDuration = 1500;
    this.updateInterval = null;

    this.init();
    this.startAutoUpdate();
  }

  // ---------- data ----------
  generateRandomData() {
    return {
      lost: Math.floor(Math.random() * 20) + 5,
      eol: Math.floor(Math.random() * 30) + 20,
      sold: Math.floor(Math.random() * 25) + 10,
      discarded: Math.floor(Math.random() * 20) + 8,
      replaced: Math.floor(Math.random() * 18) + 5
    };
  }

  init() {
    this.data = this.generateRandomData();
    this.total = Object.values(this.data).reduce((a, b) => a + b, 0);

    this.percentages = {};
    this.exactPercentages = {};

    Object.keys(this.data).forEach((key) => {
      this.exactPercentages[key] = (this.data[key] / this.total) * 100;
      this.percentages[key] = Math.round(this.exactPercentages[key]);
    });

    this.render();
    this.animate();
  }

  startAutoUpdate() {
    this.updateInterval = setInterval(() => {
      this.updateData();
    }, 8000);
  }

  updateData() {
    this.data = this.generateRandomData();
    this.total = Object.values(this.data).reduce((a, b) => a + b, 0);

    Object.keys(this.data).forEach((key) => {
      this.exactPercentages[key] = (this.data[key] / this.total) * 100;
      this.percentages[key] = Math.round(this.exactPercentages[key]);
    });

    this.updateChart();
  }

  updateChart() {
    const totalEl = this.container.querySelector('.donut-total-text');
    if (totalEl) this.animateCounterUpdate(totalEl, this.total);

    Object.keys(this.data).forEach((key) => {
      const pillEl = this.container.querySelector(`#pill-${key}`);
      if (pillEl) {
        pillEl.innerHTML = `<i class="${this.config[key].iconClass}"></i> ${this.config[key].label}: ${this.data[key]} (${this.percentages[key]}%)`;
      }
    });

    this.animateArcTransitions();
  }

  // ---------- math/helpers ----------
  clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  calculateArcLength(radius, percentage) {
    return (2 * Math.PI * radius * percentage) / 100;
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // All geometry is computed in SVG user space
  getChartGeometry() {
    const L = this.layout;
    const centerX = L.donutTx + L.localCenterX;
    const centerY = L.donutTy + L.localCenterY;

    return {
      centerX,
      centerY,
      radius: L.radius,
      outerRadius: L.outerRadius,
      labelDistance: L.labelDistance,
      strokeWidth: L.strokeWidth
    };
  }

  getLeaderPillMetrics() {
    const { pillW, pillH, foExtraX, foExtraY, offset, margin } = this.pillBox;
    const foW = pillW + foExtraX;
    const foH = pillH + foExtraY;

    const { viewBoxW, viewBoxH } = this.layout;

    // Clamp bendY so the entire foreignObject (pill + extra room) stays inside viewBox
    const minBendY = (foH / 2) + margin;
    const maxBendY = viewBoxH - (foH / 2) - margin;

    // Clamp FO x so it stays inside viewBox
    const minFoX = margin;
    const maxFoX = viewBoxW - foW - margin;

    return {
      pillW,
      pillH,
      foExtraX,
      foExtraY,
      offset,
      margin,
      foW,
      foH,
      minBendY,
      maxBendY,
      minFoX,
      maxFoX
    };
  }

  getClampedLabelX(labelX, isRight, metrics) {
    const { pillW, foExtraX, offset, minFoX, maxFoX } = metrics;

    // labelX is where the 2nd leader line ends; pillX is derived from it.
    // We clamp labelX so the resulting foreignObject stays inside minFoX..maxFoX.
    const labelXMin = isRight
      ? (minFoX - offset + (foExtraX / 2))
      : (minFoX + pillW + offset + (foExtraX / 2));

    const labelXMax = isRight
      ? (maxFoX - offset + (foExtraX / 2))
      : (maxFoX + pillW + offset + (foExtraX / 2));

    return this.clamp(labelX, labelXMin, labelXMax);
  }

  // ---------- render ----------
  render() {
    const { viewBoxW, viewBoxH, donutTx, donutTy, localCenterX, localCenterY } = this.layout;
    const { centerX, centerY } = this.getChartGeometry();

    this.container.innerHTML = `
      <div class="disposal-donut-wrapper-leader">
        <svg viewBox="0 0 ${viewBoxW} ${viewBoxH}" class="donut-svg-leader">
          <defs>
            ${this.createGradients()}
          </defs>

          ${this.createArcs()}

          <circle cx="${centerX}" cy="${centerY}" r="60" fill="white" class="donut-center-bg"/>
          <text x="${centerX}" y="${centerY - 5}" text-anchor="middle" class="donut-total-text">${this.total}</text>
          <text x="${centerX}" y="${centerY + 10}" text-anchor="middle" class="donut-label-text">Assets</text>
          <text x="${centerX}" y="${centerY + 22}" text-anchor="middle" class="donut-label-text">Disposed</text>

          ${this.createLeaderLines()}
        </svg>
      </div>
    `;
  }

  createGradients() {
    return Object.keys(this.config).map((key) => `
      <linearGradient id="grad-${key}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${this.config[key].gradient[0]};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${this.config[key].gradient[1]};stop-opacity:1" />
      </linearGradient>
    `).join('');
  }

  createArcs() {
    const { centerX, centerY, radius, strokeWidth } = this.getChartGeometry();

    let cumulative = 0;

    return Object.keys(this.data).map((key, index) => {
      const exactPercentage = this.exactPercentages[key];
      const startAngle = (cumulative / 100) * 360 - 90;
      const endAngle = ((cumulative + exactPercentage) / 100) * 360 - 90;

      const start = this.polarToCartesian(centerX, centerY, radius, endAngle);
      const end = this.polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArc = exactPercentage > 50 ? 1 : 0;

      const pathData = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;

      cumulative += exactPercentage;

      const arcLen = this.calculateArcLength(radius, exactPercentage);

      return `
        <path
          d="${pathData}"
          fill="none"
          stroke="url(#grad-${key})"
          stroke-width="${strokeWidth}"
          class="donut-arc donut-arc-${key}"
          data-key="${key}"
          data-percentage="${this.percentages[key]}"
          data-old-percentage="${this.exactPercentages[key]}"
          style="
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08));
            stroke-dasharray: ${arcLen};
            stroke-dashoffset: ${arcLen};
            animation: drawArc 1s ease-out ${index * 0.1}s forwards;
          "
        />
      `;
    }).join('');
  }

  createLeaderLines() {
    const { centerX, centerY, radius, outerRadius, labelDistance } = this.getChartGeometry();
    const metrics = this.getLeaderPillMetrics();

    let cumulative = 0;

    return Object.keys(this.data).map((key) => {
      const exactPercentage = this.exactPercentages[key];
      const midAngle = ((cumulative + exactPercentage / 2) / 100) * 360 - 90;
      const midAngleRad = (midAngle * Math.PI) / 180;

      const arcX = centerX + (radius * Math.cos(midAngleRad));
      const arcY = centerY + (radius * Math.sin(midAngleRad));

      const bendX = centerX + (outerRadius * Math.cos(midAngleRad));
      const bendYRaw = centerY + (outerRadius * Math.sin(midAngleRad));

      const isRight = midAngle > -90 && midAngle < 90;

      const bendY = this.clamp(bendYRaw, metrics.minBendY, metrics.maxBendY);

      let labelX = centerX + (labelDistance * (isRight ? 1 : -1));
      labelX = this.getClampedLabelX(labelX, isRight, metrics);

      const pillX = isRight ? (labelX + metrics.offset) : (labelX - metrics.pillW - metrics.offset);

      const foXRaw = pillX - (metrics.foExtraX / 2);
      const foY = bendY - (metrics.foH / 2);
      const foX = this.clamp(foXRaw, metrics.minFoX, metrics.maxFoX);

      cumulative += exactPercentage;

      return `
        <g class="disposal-leader-line" data-key="${key}">
          <line
            x1="${arcX}" y1="${arcY}"
            x2="${bendX}" y2="${bendY}"
            stroke="${this.config[key].color}"
            stroke-width="2"
            class="leader-connector"
          />
          <line
            x1="${bendX}" y1="${bendY}"
            x2="${labelX}" y2="${bendY}"
            stroke="${this.config[key].color}"
            stroke-width="2"
            class="leader-connector"
          />
          <circle
            cx="${arcX}" cy="${arcY}"
            r="4"
            fill="${this.config[key].color}"
            stroke="white"
            stroke-width="2"
            class="leader-dot"
          />

          <foreignObject x="${foX}" y="${foY}" width="${metrics.foW}" height="${metrics.foH}" style="overflow: visible;">
            <div xmlns="http://www.w3.org/1999/xhtml"
                 style="width:100%;height:100%;display:flex;align-items:center;overflow:visible;">
              <span
                class="s-pill s-pill-sm ${this.config[key].pillClass} s-pill-round-sm"
                id="pill-${key}"
                style="white-space:nowrap;font-size:10px;padding:4px 8px;display:inline-flex;gap:4px;"
              >
                <i class="${this.config[key].iconClass}"></i> ${this.config[key].label}: ${this.data[key]} (${this.percentages[key]}%)
              </span>
            </div>
          </foreignObject>
        </g>
      `;
    }).join('');
  }

  // ---------- animation ----------
  animateArcTransitions() {
    const arcs = this.container.querySelectorAll('.donut-arc');
    const leaders = this.container.querySelectorAll('.disposal-leader-line');

    const { centerX, centerY, radius, outerRadius, labelDistance } = this.getChartGeometry();
    const metrics = this.getLeaderPillMetrics();

    const duration = 1000;
    const startTime = performance.now();

    const oldData = [];
    arcs.forEach((arc, index) => {
      const key = Object.keys(this.data)[index];
      const currentDashArray =
        arc.style.strokeDasharray || this.calculateArcLength(radius, this.exactPercentages[key]);

      oldData.push({
        key,
        arc,
        leader: leaders[index],
        oldLength: parseFloat(currentDashArray),
        newLength: this.calculateArcLength(radius, this.exactPercentages[key]),
        oldPercentage:
          parseFloat(arc.dataset.oldPercentage || arc.dataset.percentage) || this.exactPercentages[key],
        newPercentage: this.exactPercentages[key]
      });
    });

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = this.easeInOutCubic(progress);

      let cumulative = 0;

      oldData.forEach((item) => {
        const interpolatedPercentage =
          item.oldPercentage + (item.newPercentage - item.oldPercentage) * easeProgress;

        const startAngle = (cumulative / 100) * 360 - 90;
        const endAngle = ((cumulative + interpolatedPercentage) / 100) * 360 - 90;

        const start = this.polarToCartesian(centerX, centerY, radius, endAngle);
        const end = this.polarToCartesian(centerX, centerY, radius, startAngle);
        const largeArc = interpolatedPercentage > 50 ? 1 : 0;

        const pathData = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
        const interpolatedLength = item.oldLength + (item.newLength - item.oldLength) * easeProgress;

        item.arc.setAttribute('d', pathData);
        item.arc.style.strokeDasharray = interpolatedLength;
        item.arc.style.strokeDashoffset = 0;
        item.arc.dataset.percentage = Math.round(interpolatedPercentage);

        const midAngle = ((cumulative + (interpolatedPercentage / 2)) / 100) * 360 - 90;
        const midAngleRad = (midAngle * Math.PI) / 180;

        const arcX = centerX + (radius * Math.cos(midAngleRad));
        const arcY = centerY + (radius * Math.sin(midAngleRad));

        const bendX = centerX + (outerRadius * Math.cos(midAngleRad));
        const bendYRaw = centerY + (outerRadius * Math.sin(midAngleRad));

        const isRight = midAngle > -90 && midAngle < 90;

        const bendY = this.clamp(bendYRaw, metrics.minBendY, metrics.maxBendY);

        let labelX = centerX + (labelDistance * (isRight ? 1 : -1));
        labelX = this.getClampedLabelX(labelX, isRight, metrics);

        const pillX = isRight ? (labelX + metrics.offset) : (labelX - metrics.pillW - metrics.offset);

        const foXRaw = pillX - (metrics.foExtraX / 2);
        const foY = bendY - (metrics.foH / 2);
        const foX = this.clamp(foXRaw, metrics.minFoX, metrics.maxFoX);

        if (item.leader) {
          const lines = item.leader.querySelectorAll('.leader-connector');
          const dot = item.leader.querySelector('.leader-dot');
          const foreignObj = item.leader.querySelector('foreignObject');

          if (lines[0]) {
            lines[0].setAttribute('x1', arcX);
            lines[0].setAttribute('y1', arcY);
            lines[0].setAttribute('x2', bendX);
            lines[0].setAttribute('y2', bendY);
          }

          if (lines[1]) {
            lines[1].setAttribute('x1', bendX);
            lines[1].setAttribute('y1', bendY);
            lines[1].setAttribute('x2', labelX);
            lines[1].setAttribute('y2', bendY);
          }

          if (dot) {
            dot.setAttribute('cx', arcX);
            dot.setAttribute('cy', arcY);
          }

          if (foreignObj) {
            foreignObj.setAttribute('x', foX);
            foreignObj.setAttribute('y', foY);
            foreignObj.setAttribute('width', metrics.foW);
            foreignObj.setAttribute('height', metrics.foH);
            if (!foreignObj.getAttribute('style')) {
              foreignObj.setAttribute('style', 'overflow: visible;');
            }
          }
        }

        cumulative += interpolatedPercentage;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        oldData.forEach((item) => {
          item.arc.dataset.oldPercentage = item.newPercentage;
        });
      }
    };

    requestAnimationFrame(animate);
  }

  // ---------- counters ----------
  animate() {
    this.animateCounter(this.container.querySelector('.donut-total-text'), this.total);
    this.addInteractivity();
  }

  animateCounter(element, target) {
    if (!element) return;

    const duration = this.animationDuration;
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeOutQuart);

      element.textContent = current;

      if (progress < 1) requestAnimationFrame(update);
      else element.textContent = target;
    };

    requestAnimationFrame(update);
  }

  animateCounterUpdate(element, target) {
    if (!element) return;

    const current = parseInt(element.textContent, 10) || 0;
    const duration = 1200;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(current + (target - current) * easeOutQuart);

      element.textContent = value;

      if (progress < 1) requestAnimationFrame(update);
      else element.textContent = target;
    };

    requestAnimationFrame(update);
  }

  // ---------- hover ----------
  addInteractivity() {
    const leaderGroups = this.container.querySelectorAll('.disposal-leader-line');
    const arcs = this.container.querySelectorAll('.donut-arc');

    leaderGroups.forEach((group, index) => {
      group.addEventListener('mouseenter', () => {
        const arc = arcs[index];
        if (arc) {
          arc.style.filter = 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.22))';
          arc.style.transform = 'scale(1.06)';
          // rely on CSS: transform-box: fill-box; transform-origin: center;
        }

        const connectors = group.querySelectorAll('.leader-connector');
        const dot = group.querySelector('.leader-dot');
        connectors.forEach((line) => (line.style.strokeWidth = '3'));
        if (dot) dot.setAttribute('r', '6');
      });

      group.addEventListener('mouseleave', () => {
        const arc = arcs[index];
        if (arc) {
          arc.style.filter = 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08))';
          arc.style.transform = 'scale(1)';
        }

        const connectors = group.querySelectorAll('.leader-connector');
        const dot = group.querySelector('.leader-dot');
        connectors.forEach((line) => (line.style.strokeWidth = '2'));
        if (dot) dot.setAttribute('r', '4');
      });
    });
  }

  destroy() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  }
}
