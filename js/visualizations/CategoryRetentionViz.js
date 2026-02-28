/* ═══════════════════════════════════════════════════════════════════════════
   CATEGORY RESALE VALUE RETENTION VISUALIZATION
   Purpose: Show how different asset categories retain their resale value
═══════════════════════════════════════════════════════════════════════════ */



export class CategoryRetentionViz {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container ${containerId} not found`);
      return;
    }



    this.categories = [
      { name: 'Vehicles', min: 65, max: 78, icon: 'fa-truck', current: 72 },
      { name: 'Machinery', min: 50, max: 65, icon: 'fa-cogs', current: 58 },
      { name: 'IT Equipment', min: 38, max: 52, icon: 'fa-laptop', current: 45 },
      { name: 'Office Furniture', min: 22, max: 35, icon: 'fa-chair', current: 28 },
      { name: 'Tools & Equipment', min: 10, max: 22, icon: 'fa-tools', current: 15 }
    ];



    this.init();
  }



  randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  getRetentionType(value) {
    if (value >= 60) return 'good';
    if (value >= 30) return 'moderate';
    return 'poor';
  }



  getRetentionColor(value) {
    if (value >= 60) return 'var(--s-gradient-success)';
    if (value >= 30) return 'var(--s-gradient-amber)';
    return 'var(--s-gradient-danger)';
  }



  animateValue(element, oldValue, newValue) {
    const duration = 1200;
    const startTime = performance.now();



    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = oldValue + ((newValue - oldValue) * easeOut);



      element.textContent = `${Math.round(current)}%`;


      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = `${newValue}%`;
      }
    };


    requestAnimationFrame(animate);
  }


  animateBar(bar, oldValue, newValue) {
    const duration = 1200;
    const startTime = performance.now();


    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = oldValue + ((newValue - oldValue) * easeOut);


      bar.style.width = `${current}%`;



      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        bar.style.width = `${newValue}%`;
      }
    };



    requestAnimationFrame(animate);
  }



  updateValues() {
    this.categories.forEach((cat, index) => {
      const oldValue = cat.current;
      const newValue = this.randomInRange(cat.min, cat.max);
      cat.current = newValue;



      const valueEl = document.getElementById(`retention-value-${index}`);
      const barEl = document.getElementById(`retention-bar-${index}`);



      if (valueEl && barEl) {
        this.animateValue(valueEl, oldValue, newValue);
        this.animateBar(barEl, oldValue, newValue);


        barEl.style.background = this.getRetentionColor(newValue);
      }
    });
  }



render() {
  const headerHtml = `
    <div class="s-bg-gradient-primary" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem;">
      <div class="s-icon s-icon-frost">
        <i class="fas fa-chart-line"></i>
      </div>
      <span class="s-font-black s-text-base" style="font-family: 'Science Gothic', sans-serif; color: white;">
        Resale Value Retention
      </span>
    </div>
  `;

  const html = this.categories.map((cat, index) => `
    <div class="crv-row-refactored">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <div class="d-flex align-items-center gap-2">
          <div class="s-icon s-icon-sm s-icon-primary">
            <i class="fas ${cat.icon}"></i>
          </div>
          <span class="s-text-primary s-font-semibold s-text-sm">${cat.name}</span>
        </div>
        <div class="s-text-primary s-font-black s-text-lg" id="retention-value-${index}" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
          ${cat.current}%
        </div>
      </div>
      <div class="s-progress-bg s-bg-gray-100 s-rounded-full overflow-hidden" style="height: 10px; position: relative; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
        <div class="s-progress-fill h-100 s-rounded-full" id="retention-bar-${index}" 
             style="width: ${cat.current}%; background: ${this.getRetentionColor(cat.current)}; transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
        </div>
      </div>
    </div>
  `).join('');


  this.container.innerHTML = `${headerHtml}<div class="d-flex flex-column gap-4">${html}</div>`;
}




  init() {
    this.render();
    setInterval(() => this.updateValues(), 5000);
  }
}
