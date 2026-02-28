/* ════════════════════════════════════════════════════════════════════════════
   ANALYTICS HERO CANVAS ANIMATION - SCORP BRAND COLORS
   ════════════════════════════════════════════════════════════════════════════ */

export class AnalyticsCanvasAnimation {
  constructor(canvasId = 'analyticsNetworkCanvas') {
    this.canvas = document.getElementById(canvasId);
    
    if (!this.canvas) {
      console.warn(`⚠️ AnalyticsCanvasAnimation: Canvas "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.animationId = null;
    this.time = 0;
    
    // SCORP Brand Color Palettes (from your CSS root)
    this.lineColors = [
      'rgba(0, 102, 204, 0.8)',      // --s-primary
      'rgba(0, 153, 255, 0.7)',      // --s-primary-vibrant
      'rgba(52, 144, 250, 0.75)',    // --s-primary-500
      'rgba(6, 182, 212, 0.7)',      // --s-cyan-500
      'rgba(20, 184, 166, 0.7)',     // --s-teal-500
      'rgba(99, 102, 241, 0.7)',     // --s-indigo-500
    ];

    this.barColors = [
      'rgba(0, 102, 204, 0.75)',     // --s-primary (Blue)
      'rgba(34, 197, 94, 0.75)',     // --s-green-600 (Green)
      'rgba(249, 115, 22, 0.75)',    // --s-attention-light (Orange)
      'rgba(220, 38, 38, 0.75)',     // --s-danger (Red)
      'rgba(139, 92, 246, 0.75)',    // --s-purple-600 (Purple)
      'rgba(234, 179, 8, 0.75)',     // --s-warning (Yellow)
      'rgba(14, 165, 233, 0.75)',    // --s-info (Sky Blue)
      'rgba(168, 85, 247, 0.75)',    // --s-royal (Royal Purple)
      'rgba(236, 72, 153, 0.75)',    // --s-pop (Pink)
      'rgba(6, 182, 212, 0.75)',     // --s-cyan-500 (Cyan)
      'rgba(20, 184, 166, 0.75)',    // --s-teal-600 (Teal)
      'rgba(99, 102, 241, 0.75)',    // --s-indigo-500 (Indigo)
      'rgba(22, 163, 74, 0.75)',     // --s-success (Forest Green)
      'rgba(245, 158, 11, 0.75)',    // --s-amber (Amber)
    ];

    console.log('🎨 Analytics Canvas Animation Constructor Initialized (SCORP Colors)');
  }

  init() {
    if (!this.canvas || !this.ctx) {
      console.warn('⚠️ Canvas or context not available');
      return;
    }

    this.resizeCanvas();
    this.createAnimatedLines();
    this.createBarRail();
    this.createDots();
    this.animate();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createAnimatedLines();
      this.createBarRail();
      this.createDots();
    }, { passive: true });
    
    console.log('✅ Analytics canvas animation started with enhanced SCORP palette');
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  getRandomColor(previousColor) {
    let newColor;
    do {
      newColor = this.barColors[Math.floor(Math.random() * this.barColors.length)];
    } while (newColor === previousColor && this.barColors.length > 1);
    return newColor;
  }

  // Create gradient for bars (optional enhancement)
  createBarGradient(x, y, height, color) {
    const gradient = this.ctx.createLinearGradient(x, y + height, x, y);
    
    // Extract RGB values from rgba string
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
    if (match) {
      const r = match[1];
      const g = match[2];
      const b = match[3];
      const a = match[4] || 1;
      
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a * 0.4})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${a * 0.7})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${a})`);
    }
    
    return gradient;
  }

  createAnimatedLines() {
    this.lines = [];
    
    for (let i = 0; i < 6; i++) { // Increased from 5 to 6 lines
      const line = {
        points: [],
        color: this.lineColors[i % this.lineColors.length],
        speed: Math.random() * 0.5 + 0.3,
        amplitude: Math.random() * 40 + 30,
        frequency: Math.random() * 0.01 + 0.005,
        yOffset: this.height * 0.15 + Math.random() * this.height * 0.7,
        phase: Math.random() * Math.PI * 2
      };

      for (let x = 0; x < this.width; x += 10) {
        line.points.push({ x: x, y: 0 });
      }

      this.lines.push(line);
    }
  }

  createBarRail() {
    this.barRail = {
      bars: [],
      barWidth: 29,
      barGap: 3.39,
      speed: 0.41
    };

    const numBars = Math.ceil(this.width / (this.barRail.barWidth + this.barRail.barGap)) + 20;
    let previousColor = null;

    for (let i = 0; i < numBars; i++) {
      const color = this.getRandomColor(previousColor);
      this.barRail.bars.push({
        x: i * (this.barRail.barWidth + this.barRail.barGap),
        height: Math.random() * 120 + 60,
        targetHeight: Math.random() * 120 + 60,
        animationSpeed: Math.random() * 0.03 + 0.02,
        color: color,
        useGradient: Math.random() > 0.5 // 50% chance of gradient
      });
      previousColor = color;
    }
  }

  createDots() {
    this.dots = [];
    const dotSpacing = 40;

    for (let x = 0; x < this.width; x += dotSpacing) {
      for (let y = 0; y < this.height; y += dotSpacing) {
        if (Math.random() > 0.7) {
          this.dots.push({
            x: x,
            y: y,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            pulse: Math.random() * Math.PI * 2,
            // Use SCORP primary blue for dots
            color: 'rgba(0, 102, 204, '
          });
        }
      }
    }
  }

  updateLines() {
    this.lines.forEach(line => {
      for (let i = 0; i < line.points.length; i++) {
        const x = line.points[i].x;
        line.points[i].y = line.yOffset + Math.sin(x * line.frequency + this.time * line.speed + line.phase) * line.amplitude;
      }
    });
  }

  drawLines() {
    this.lines.forEach(line => {
      this.ctx.beginPath();
      this.ctx.strokeStyle = line.color;
      this.ctx.lineWidth = 2.5; // Slightly thicker lines
      this.ctx.moveTo(line.points[0].x, line.points[0].y);

      for (let i = 1; i < line.points.length; i++) {
        this.ctx.lineTo(line.points[i].x, line.points[i].y);
      }

      this.ctx.stroke();
    });
  }

  updateBarRail() {
    this.barRail.bars.forEach(bar => {
      bar.x -= this.barRail.speed;
      
      if (Math.abs(bar.height - bar.targetHeight) < 2) {
        bar.targetHeight = Math.random() * 120 + 60;
      }
      bar.height += (bar.targetHeight - bar.height) * bar.animationSpeed;
    });

    // Remove bars that moved off-screen
    this.barRail.bars = this.barRail.bars.filter(bar => bar.x > -(this.barRail.barWidth + 0));

    // Add new bars on the right
    const lastBar = this.barRail.bars[this.barRail.bars.length - 1];
    if (lastBar && lastBar.x < this.width + 50) {
      const newColor = this.getRandomColor(lastBar.color);
      this.barRail.bars.push({
        x: lastBar.x + this.barRail.barWidth + this.barRail.barGap,
        height: Math.random() * 120 + 60,
        targetHeight: Math.random() * 120 + 60,
        animationSpeed: Math.random() * 0.03 + 0.02,
        color: newColor,
        useGradient: Math.random() > 0.5
      });
    }
  }

  drawBarRail() {
    this.barRail.bars.forEach(bar => {
      const y = this.height - bar.height;
      
      // Use gradient or solid color
      if (bar.useGradient) {
        this.ctx.fillStyle = this.createBarGradient(bar.x, y, bar.height, bar.color);
      } else {
        this.ctx.fillStyle = bar.color;
      }
      
      this.ctx.fillRect(bar.x, y, this.barRail.barWidth, bar.height);
    });
  }

  drawDots() {
    this.dots.forEach(dot => {
      const pulseOpacity = dot.opacity + Math.sin(this.time * 0.02 + dot.pulse) * 0.2;
      this.ctx.fillStyle = `${dot.color}${pulseOpacity})`;
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw all elements in order
    this.drawDots();
    this.updateLines();
    this.drawLines();
    this.updateBarRail();
    this.drawBarRail();

    this.time += 0.02;
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', () => this.resizeCanvas());
    console.log('🛑 Analytics canvas animation destroyed');
  }
}
