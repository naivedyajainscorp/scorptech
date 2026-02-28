/* ═══════════════════════════════════════════════════════════════════════════
   FUEL ECONOMY ANALYSIS - VISUALIZATION LAYER
   Purpose: Render the Fuel Market Index and Pricing Summary
   ═══════════════════════════════════════════════════════════════════════════ */

import { initializeFuelPrices, getCurrentFuelPrice, formatINR } from '../utils/helpers.js';

export class FuelEconomy {
   constructor(containerId = 'viz-fuel-economy') {
      this.container = document.getElementById(containerId);
      if (!this.container) {
         console.warn(`⚠️ FuelEconomy: Container "${containerId}" not found`);
         return;
      }

      this.init();
   }

   async init() {
      try {
         await initializeFuelPrices();
         this.render();
         console.log('✅ Fuel Economy system initialized (Bulletproof Interpolation Active)');
      } catch (error) {
         console.error('❌ Failed to initialize Fuel Economy Visualization:', error);
      }
   }

   render() {
      const petrol = getCurrentFuelPrice('Petrol');
      const diesel = getCurrentFuelPrice('Diesel');
      const electricCom = getCurrentFuelPrice('Electric', 'commercial');
      const electricGrid = getCurrentFuelPrice('Electric', 'grid');

      this.container.innerHTML = `
      <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1)); border-radius: 12px; border: 1px solid var(--s-gray-200); position: relative; overflow: hidden;">
        <!-- Background Decoration -->
        <div style="position: absolute; top: -10px; right: -10px; font-size: 5rem; opacity: 0.05; transform: rotate(-15deg);">
            <i class="fas fa-gas-pump"></i>
        </div>

        <!-- Header -->
        <div style="margin-bottom: 1.5rem; position: relative; z-index: 1;">
          <h4 class="s-text-primary s-font-black" style="font-family: 'Science Gothic', sans-serif; font-style: italic; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-chart-network"></i> Jaipur Fuel Market Index
          </h4>
        </div>
        
        <!-- 2x2 Grid of Fuel Cards -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; position: relative; z-index: 1;">
          
          <!-- Petrol Card -->
          <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-top: 4px solid var(--s-info-special);">
             <div class="s-text-gray-500 s-font-bold s-text-xs" style="text-transform: uppercase; margin-bottom: 0.25rem;">Petrol (Jaipur)</div>
             <div style="display: flex; align-items: baseline; gap: 0.25rem;">
                <span class="s-text-info-special s-font-black s-text-2xl" style="font-family: 'Science Gothic', sans-serif;">₹${petrol}</span>
                <span class="s-text-gray-400 s-font-bold s-text-xs">/L</span>
             </div>
             <div style="margin-top: 0.5rem;">
                <span class="s-pill s-pill-success s-pill-xs s-pill-round-sm">
                  <i class="fas fa-caret-up"></i> <span>0.12% vs Prev Week</span>
                </span>
             </div>
          </div>

          <!-- Diesel Card -->
          <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-top: 4px solid var(--s-amber);">
             <div class="s-text-gray-500 s-font-bold s-text-xs" style="text-transform: uppercase; margin-bottom: 0.25rem;">Diesel (Jaipur)</div>
             <div style="display: flex; align-items: baseline; gap: 0.25rem;">
                <span class="s-text-amber s-font-black s-text-2xl" style="font-family: 'Science Gothic', sans-serif;">₹${diesel}</span>
                <span class="s-text-gray-400 s-font-bold s-text-xs">/L</span>
             </div>
             <div style="margin-top: 0.5rem;">
                <span class="s-pill s-pill-danger s-pill-xs s-pill-round-sm">
                  <i class="fas fa-caret-down"></i> <span>0.05% vs Prev Week</span>
                </span>
             </div>
          </div>

          <!-- Electric Commercial -->
          <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-top: 4px solid var(--s-success);">
             <div class="s-text-gray-500 s-font-bold s-text-xs" style="text-transform: uppercase; margin-bottom: 0.25rem;">EV Commercial</div>
             <div style="display: flex; align-items: baseline; gap: 0.25rem;">
                <span class="s-text-success s-font-black s-text-2xl" style="font-family: 'Science Gothic', sans-serif;">₹${electricCom}</span>
                <span class="s-text-gray-400 s-font-bold s-text-xs">/kWh</span>
             </div>
             <div style="margin-top: 0.5rem;">
                <span class="s-pill s-pill-success s-pill-xs s-pill-round-sm">
                  <i class="fas fa-shield-check"></i> <span>Regulated Rate</span>
                </span>
             </div>
          </div>

          <!-- Electric Grid -->
          <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-top: 4px solid var(--s-royal);">
             <div class="s-text-gray-500 s-font-bold s-text-xs" style="text-transform: uppercase; margin-bottom: 0.25rem;">In-House Grid</div>
             <div style="display: flex; align-items: baseline; gap: 0.25rem;">
                <span class="s-text-royal s-font-black s-text-2xl" style="font-family: 'Science Gothic', sans-serif;">₹${electricGrid}</span>
                <span class="s-text-gray-400 s-font-bold s-text-xs">/kWh</span>
             </div>
             <div style="margin-top: 0.5rem;">
                <span class="s-pill s-pill-info s-pill-xs s-pill-round-sm">
                  <i class="fas fa-leaf"></i> <span>Eco Synergy Benefit</span>
                </span>
             </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="s-content-label s-content-label-primary" style="margin-top: 1.5rem;">
           <i class="fas fa-shield-halved"></i> 
           <div style="flex: 1;">
             <div class="s-content-label-description">
               Values are calculated using Sapphire's <strong>Bulletproof Interpolation Engine</strong>, ensuring ROI accuracy even with incomplete historical records.
             </div>
           </div>
        </div>
      </div>
    `;
   }
}
