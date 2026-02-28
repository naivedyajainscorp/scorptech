/* ════════════════════════════════════════════════════════════════════════════
   SCROLL CARD BUILDERS - CLEAN HTML TEMPLATES ONLY
   Purpose: Pure presentation layer - imports data from CardDataGenerators
   ════════════════════════════════════════════════════════════════════════════ */

import {
  formatINR
} from '../utils/helpers.js';

import {
  // Helper functions
  formatDate,
  // Data generators
  generatePriceBenchmarkData,
  generatePurchaseLedgerData,
  generateProtectionIndividualData,
  generateOpexAssetsData,
  generateDisposalTimelineData,
  generatePurchaseTrackingData,
  generateEmployeeConsumptionData,
  generateEquipmentAllocationData,
  generateWasteAccountingData,
  generateDemandFrequencyData,
  generateRequesterProfilingData,
  generateReturnConditionData,
  generateFloorTimeData,
  generateRejectionPatternsData,
  generateVolumetricTrackingData,
  generateConsumptionAnalysisData,
  generateReturnAssessmentData,
  generateRequesterDemandData,
  generatePeakDemandData,
  generateIssueFrequencyData,
  generateRequesterConsumptionData,
  generateTimeframeDemandData,
  generateVolumeOptimizationData,
  generateRealtimeInspectionData,
  generateInspectionMonitoringData,
  generateReportSubmissionsData,
  generateVehicleMileageData,
  generateRefuelingActivityData,
  generateFuelEconomyData,
  generateResolutionData
} from './CardDataGenerators.js';


// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: COST ANALYSIS (2 builders)
// ═══════════════════════════════════════════════════════════════════════════

export const PriceBenchmarkingCardBuilder = (index) => {
  const data = generatePriceBenchmarkData();

  return `
<div class="scroll-card" data-tilt>
  <!-- HEADER ZONE -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
    <!-- LEFT: Name + Code -->
    <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
      <span class="s-item-name">${data.asset.name}</span>
      <span class="s-item-code">${data.asset.code}</span>
    </div>
    
    <!-- RIGHT: Status Pill (Trend) -->
    <span class="s-pill s-pill-round-sm ${data.trendClass} s-pill-sm">
      <i class="fas fa-arrow-${data.variance >= 0 ? 'up' : 'down'}"></i>
      <span>${Math.abs(data.variance)}%</span>
    </span>
  </div>
  
  <!-- DIVIDER -->
  <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
  
  <!-- HERO METRIC (Average Price) -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
    <span class="s-text-gray-700 s-font-bold s-text-sm">Average price</span>
    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
      ${formatINR(data.avgPrice)}
    </span>
  </div>
  
  <!-- DIVIDER -->
  <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
  
  <!-- MIN/MAX LABELS (2-column grid) -->
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 0.75rem;">
    <span class="s-label s-label-success s-label-sm">
      <i class="fas fa-arrow-down"></i>
      Min ${formatINR(data.asset.priceRange.min)}
    </span>
    
    <span class="s-label s-label-amber s-label-sm">
      <i class="fas fa-arrow-up"></i>
      Max ${formatINR(data.asset.priceRange.max)}
    </span>
  </div>
  
  <!-- DIVIDER -->
  <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
  
  <!-- FOOTER ZONE -->
  <span class="s-pill s-pill-round-sm s-pill-info s-pill-sm">
    <i class="fas fa-box"></i>
    <span>${data.purchaseCount} Orders</span>
  </span>
</div>
  `;
};


// Purchase ledger individual entry
export const PurchaseLedgerCardBuilder = (index) => {
  const data = generatePurchaseLedgerData();
  const dateStr = formatDate(data.purchaseDate);

  return `
<div class="scroll-card" data-tilt>
  <!-- Header: Asset Name + Code + Price Badge -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.75rem;">
    <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
      <span class="s-item-name">${data.asset.name}</span>
      <span class="s-item-code">${data.asset.code}</span>
    </div>
    <span class="s-pill s-pill-round-sm ${data.priceClass} s-pill-sm">
      <i class="fas fa-${data.priceIcon}"></i>
      <span>${data.priceType}</span>
    </span>
  </div>
  
  <!-- Purchase Info -->
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
    <div style="display: flex; align-items: center; gap: 0.35rem;">
      <span class="s-meta-info-label">
        <i class="bi bi-calendar-plus"></i>
        Purchased on
      </span>
      <span class="s-meta-info-value">${dateStr}</span>
    </div>
    ${data.quantity ? `
    <div style="display: flex; align-items: center; gap: 0.35rem;">
      <span class="s-meta-info-label">
        <i class="bi bi-box"></i>
        Quantity
      </span>
      <span class="s-meta-info-value">${data.quantity} ${data.unit}</span>
    </div>
    ` : ''}
  </div>
  
  <div style="height: 1px; background: var(--s-gray-500); margin: 0.1rem 0; box-shadow: var(--s-shadow-sm);"></div>
  
  <!-- Price Row - Prominent -->
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0;">
    <span class="s-text-gray-800 s-font-extrabold" style="font-size: 0.9rem;">Price</span>
    <span class="s-text-primary s-font-black" style="font-size: 1.15rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic;">
      ${formatINR(data.price)}
    </span>
  </div>
  
  <div style="height: 1px; background: var(--s-gray-500); margin: 0.1rem 0; box-shadow: var(--s-shadow-sm);"></div>
  
  <!-- Vendor Pill -->
  <span class="s-pill s-pill-round-sm s-pill-info-special s-pill-sm">
    <i class="fas fa-store"></i>
    <span>${data.vendor.name}</span>
  </span>
</div>
  `;
};


// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: MAINTENANCE & PROTECTION (1 builder)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// PROTECTION - INDIVIDUAL ITEM TRACKING CARD (REFACTORED)
// ═══════════════════════════════════════════════════════════════════════════

export const ProtectionIndividualCardBuilder = (index) => {
  const data = generateProtectionIndividualData();

  return `
<div class="scroll-card" data-tilt>
  <!-- Header: Name + Code + Pill -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.75rem;">
    <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
      <span class="s-item-name">${data.assetName}</span>
      <span class="s-item-code">${data.code}</span>
    </div>
    <span class="s-pill ${data.typeClass} s-pill-round-sm s-pill-md">
      <i class="fas ${data.type === 'Vehicle' ? 'fa-car' : data.type === 'Machinery' ? 'fa-cogs' : 'fa-tools'}"></i>
      <span>${data.type}</span>
    </span>
  </div>
  
  <!-- Progress Bar (Clean - No Text) -->
  <div style="display: flex; width: 100%; height: 10px; border-radius: 1rem; overflow: hidden; margin-bottom: 1rem; background: rgba(0, 102, 204, 0.05); box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);">
    <div style="flex-basis: ${data.extendedWarrantyBarPct}%; height: 100%; background: var(--s-gradient-info); transition: flex-basis 0.3s ease;"></div>
    <div style="flex-basis: ${data.insuranceBarPct}%; height: 100%; background: var(--s-gradient-green); transition: flex-basis 0.3s ease;"></div>
    <div style="flex-basis: ${data.maintenanceBarPct}%; height: 100%; background: var(--s-gradient-amber); transition: flex-basis 0.3s ease;"></div>
  </div>
  
  <!-- Purchase Info -->
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
    <div style="display: flex; align-items: center; gap: 0.35rem;">
      <span class="s-meta-info-label">
        <i class="bi bi-calendar-plus"></i>
        Purchased on
      </span>
      <span class="s-meta-info-value">${data.purchaseDate}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 0.35rem;">
      <span class="s-meta-info-label">
        <i class="bi bi-receipt"></i>
        Purchase Cost
      </span>
      <span class="s-meta-info-value primary">${formatINR(data.purchaseCost)}</span>
    </div>
  </div>

  <div class="s-divider"></div>
  
  <!-- Protection Details -->
  <div style="display: flex; flex-direction: column; gap: 0.5rem; margin: 0.5rem 0;">
    
    <!-- Extended Warranty -->
    <div class="s-detail-row">
      <div class="s-detail-label">
        <div class="s-icon s-icon-sm s-icon-info">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.1rem;">
          <span>Extended Warranty</span>
          <span style="font-size: 0.625rem; color: var(--s-gray-500); font-weight: 400;">Valid till ${data.extendedWarrantyExpiry}</span>
        </div>
      </div>
      <span class="s-detail-value" style="color: var(--s-info-light);">
        ${formatINR(data.extendedWarrantyCost)}
      </span>
    </div>
    
    <!-- Insurance Policy -->
    <div class="s-detail-row">
      <div class="s-detail-label">
        <div class="s-icon s-icon-sm s-icon-green">
          <i class="fa-solid fa-file-shield"></i>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.1rem;">
          <span>Insurance Policy</span>
          <span style="font-size: 0.625rem; color: var(--s-gray-500); font-weight: 400;">Valid till ${data.insuranceExpiry}</span>
        </div>
      </div>
      <span class="s-detail-value" style="color: var(--s-green-500);">
        ${formatINR(data.insuranceCost)}
      </span>
    </div>
    
    <!-- Maintenance Contract -->
    <div class="s-detail-row">
      <div class="s-detail-label">
        <div class="s-icon s-icon-sm s-icon-amber">
          <i class="fas fa-tools"></i>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.1rem;">
          <span>Maintenance Contract</span>
          <span style="font-size: 0.625rem; color: var(--s-gray-500); font-weight: 400;">Valid till ${data.maintenanceExpiry}</span>
        </div>
      </div>
      <span class="s-detail-value" style="color: var(--s-amber-500);">
        ${formatINR(data.maintenanceCost)}
      </span>
    </div>
    
  </div>
  
  <div class="s-divider"></div>
  
  <!-- Total -->
  <div class="s-total-row">
    <span class="s-total-label">Total</span>
    <span class="s-total-value">${formatINR(data.totalProtection)}</span>
  </div>
  
  <div class="s-divider"></div>
  
  <!-- Footer -->
  <div style="margin-top: 0.2rem; padding-top: 0.2rem; border-top: 1px solid rgba(0, 102, 204, 0.1); display: flex; align-items: center; gap: 0.5rem;">
    <span class="s-pill s-pill-info-special s-pill-round-sm">
      <i class="bi bi-card-text"></i>
      Product Warranty: Valid till ${data.productWarrantyExpiry}
    </span>
  </div>
</div>
  `;
};







// ═══════════════════════════════════════════════════════════════════════════
// OPEX CARD BUILDER - OPEX INDIVIDUAL ASSET CARD
// ═══════════════════════════════════════════════════════════════════════════

export const OpexAssetsCardBuilder = (index) => {
  const data = generateOpexAssetsData();

  return `
        <div class="scroll-card" data-index="${index}">
            <!-- Header: Name + Code (left), Type Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-item-name">${data.asset.name}</span>
                    <span class="s-item-code">${data.asset.code}</span>
                </div>
                <span class="s-pill ${data.assetTypeClass} s-pill-round-sm s-pill-md">${data.assetType}</span>
            </div>
            
            <!-- Progress Bar (Clean - No Text) -->
            <div style="display: flex; width: 100%; height: 10px; border-radius: 1rem; overflow: hidden; margin-bottom: 1rem; background: rgba(0, 102, 204, 0.05); box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);">
                <div style="flex-basis: ${data.laborPct}%; height: 100%; background: var(--s-gradient-primary); transition: flex-basis 0.3s ease;"></div>
                <div style="flex-basis: ${data.partsPct}%; height: 100%; background: var(--s-gradient-success); transition: flex-basis 0.3s ease;"></div>
                <div style="flex-basis: ${data.miscPct}%; height: 100%; background: var(--s-gradient-amber); transition: flex-basis 0.3s ease;"></div>
            </div>
            
            <!-- Cost Details -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin: 0.5rem 0;">
                
                <!-- Labor Cost -->
                <div class="s-detail-row">
                    <div class="s-detail-label">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-wrench"></i>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span>Labor Cost</span>
                            <span style="font-size: 0.65rem; font-weight: 700; color: var(--s-primary); opacity: 0.8;">${data.laborPct}% of total</span>
                        </div>
                    </div>
                    <span class="s-detail-value" style="color: var(--s-primary);">
                        ${formatINR(data.laborCost)}
                    </span>
                </div>
                
                <!-- Spare Parts & Materials Cost -->
                <div class="s-detail-row">
                    <div class="s-detail-label">
                        <div class="s-icon s-icon-sm s-icon-green">
                            <i class="fas fa-puzzle-piece"></i>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span>Spare Parts & Materials</span>
                            <span style="font-size: 0.65rem; font-weight: 700; color: var(--s-success); opacity: 0.8;">${data.partsPct}% of total</span>
                        </div>
                    </div>
                    <span class="s-detail-value" style="color: var(--s-success);">
                        ${formatINR(data.partsCost)}
                    </span>
                </div>
                
                <!-- Miscellaneous Cost -->
                <div class="s-detail-row">
                    <div class="s-detail-label">
                        <div class="s-icon s-icon-sm s-icon-amber">
                            <i class="fas fa-file-fragment"></i>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span>Miscellaneous Cost</span>
                            <span style="font-size: 0.65rem; font-weight: 700; color: var(--s-amber-600); opacity: 0.8;">${data.miscPct}% of total</span>
                        </div>
                    </div>
                    <span class="s-detail-value" style="color: var(--s-amber-600);">
                        ${formatINR(data.miscCost)}
                    </span>
                </div>
                
            </div>
            
            <div class="s-divider"></div>
            
            <!-- Total -->
            <div class="s-total-row">
                <span class="s-total-label">Total Operational Cost</span>
                <span class="s-total-value">${formatINR(data.totalOpex)}</span>
            </div>
            
            <div class="s-divider"></div>
            
            <!-- Footer Pills -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                <span class="s-pill s-pill-info-special s-pill-round-sm s-pill-md">
                    <i class="bi bi-clock"></i>
                    Last: ${formatDate(data.lastService)}
                </span>
                <span class="s-pill s-pill-attention s-pill-round-sm s-pill-md">
                    <i class="fas fa-triangle-exclamation"></i>
                    MTTB: ${data.mttb.days}d (${data.mttb.converted})
                </span>
            </div>
        </div>
    `;
};







// ═══════════════════════════════════════════════════════════════════════════
// RESOLUTION STATUS TRACKING - UNIFIED CARD BUILDER
// ═══════════════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════════════
// INDIVIDUAL CARD BUILDERS - FINAL CORRECTIONS
// ═══════════════════════════════════════════════════════════════════════════


const buildRepairedCard = (data) => {
  const totalBenefits =
    (data.benefits?.maintenanceContract || 0) +
    (data.benefits?.insurancePolicy || 0) +
    (data.benefits?.productWarranty?.amount || 0) +
    (data.benefits?.extendedWarranty?.amount || 0);

  return `
    <div class="scroll-card" data-tilt>
      <!-- Header: Name + Code + Item Type Pill -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
          <span class="s-item-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${data.name || data.assetName}</span>
          <span class="s-item-code" style="white-space: nowrap; flex-shrink: 0;">${data.code || data.assetCode}</span>
        </div>
        ${data.itemType ? `<span class="s-pill s-pill-round-sm ${data.itemTypeClass || 's-pill-primary'} s-pill-sm" style="flex-shrink: 0;">${data.itemType}</span>` : ''}
      </div>
      
      <!-- Resolution Status Banner -->
      <div style="margin-bottom: 0.75rem;">
        <span class="s-label s-label-success" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
          <i class="fas fa-wrench"></i>
          REPAIRED
        </span>
      </div>
      
      <!-- Date Grid (2-column) -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <span class="s-label s-label-danger-soft" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Reported</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${formatDate(data.reportedDate || data.reportDate)}</div>
          </span>
        </div>
        <div>
          <span class="s-label s-label-success-soft" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Resolved</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${formatDate(data.resolvedDate || data.completionDate)}</div>
          </span>
        </div>
      </div>
      
      <!-- Technician (Full Width) -->
      ${data.technician ? `
        <div style="margin-bottom: 0.75rem;">
          <span class="s-label s-label-info-soft" style="display: flex; align-items: center; width: 100%; padding: 0.5rem; gap: 0.35rem;">
            <i class="fas fa-user-cog"></i>
            <span style="font-size: 0.85rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${data.technician?.name || data.technician}
              ${data.technician?.type || data.technicianType ? `<span style="font-size: 0.75rem; opacity: 0.7; margin-left: 0.25rem;">(${(data.technician?.type || data.technicianType).toLowerCase()})</span>` : ''}
            </span>
          </span>
        </div>
      ` : ''}
      
      ${data.inCharge ? `
        <div style="margin-bottom: 0.75rem;">
          <span class="s-label s-label-primary-soft" style="display: flex; align-items: center; width: 100%; padding: 0.5rem; gap: 0.35rem;">
            <i class="fas fa-user-tie"></i>
            <span style="font-size: 0.85rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${typeof data.inCharge === 'object' ? `${data.inCharge.name} (${data.inCharge.designation})` : data.inCharge}</span>
          </span>
        </div>
      ` : ''}
      
      <div style="height: 1px; background: var(--s-gray-300); margin: 0.75rem 0;"></div>
      
      <!-- Cost Breakdown -->
      <div style="margin-bottom: 0.75rem;">
        <div style="font-size: 0.9rem; font-weight: 800; color: var(--s-gray-800); margin-bottom: 0.5rem;">Cost Breakdown</div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; min-width: 0;">
            <div class="s-icon s-icon-sm s-icon-primary">
              <i class="fas fa-wrench"></i>
            </div>
            <span style="font-size: 0.85rem; color: var(--s-gray-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Labor Cost</span>
          </div>
          <strong style="font-size: 0.85rem; color: var(--s-gray-900); flex-shrink: 0;">${formatINR(data.costs?.labor || data.opexCost?.labor || 0)}</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; min-width: 0;">
            <div class="s-icon s-icon-sm s-icon-success">
              <i class="fas fa-puzzle-piece"></i>
            </div>
            <span style="font-size: 0.85rem; color: var(--s-gray-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Spare Parts & Material</span>
          </div>
          <strong style="font-size: 0.85rem; color: var(--s-gray-900); flex-shrink: 0;">${formatINR(data.costs?.sparePartsMaterial || data.opexCost?.parts || 0)}</strong>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; min-width: 0;">
            <div class="s-icon s-icon-sm s-icon-amber">
              <i class="fas fa-file-invoice"></i>
            </div>
            <span style="font-size: 0.85rem; color: var(--s-gray-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Miscellaneous</span>
          </div>
          <strong style="font-size: 0.85rem; color: var(--s-gray-900); flex-shrink: 0;">${formatINR(data.costs?.miscellaneous || data.opexCost?.miscellaneous || 0)}</strong>
        </div>
        
        <div style="height: 1px; background: var(--s-gray-300); margin: 0.5rem 0;"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.9rem; font-weight: 800; color: var(--s-gray-800);">Total Cost</span>
          <strong class="s-text-primary s-font-black" style="font-size: 1rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic; flex-shrink: 0;">${formatINR(data.costs?.total || data.opexCost?.total || 0)}</strong>
        </div>
      </div>
      
      <div style="height: 1px; background: var(--s-gray-300); margin: 0.75rem 0;"></div>
      
      <!-- Benefits Footer (White Label Wrapper - Full Width) -->
      <div class="s-label s-label-white" style="display: block; width: 100%; padding: 0.75rem; margin: 0;">
        <div style="font-size: 0.9rem; font-weight: 800; color: var(--s-gray-800); margin-bottom: 0.5rem;">Benefits Redeemed</div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; min-width: 0;">
            <div class="s-icon s-icon-sm s-icon-info">
              <i class="fas fa-wrench"></i>
            </div>
            <span style="font-size: 0.85rem; color: var(--s-gray-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Maintenance Contract</span>
          </div>
          <span class="s-text-info s-font-black" style="font-size: 0.9rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic; flex-shrink: 0;">${formatINR(data.benefits?.maintenanceContract || 0)}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; min-width: 0;">
            <div class="s-icon s-icon-sm s-icon-info">
              <i class="fas fa-shield-alt"></i>
            </div>
            <span style="font-size: 0.85rem; color: var(--s-gray-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Insurance Policy</span>
          </div>
          <span class="s-text-info s-font-black" style="font-size: 0.9rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic; flex-shrink: 0;">${formatINR(data.benefits?.insurancePolicy || data.benefits?.insurance || 0)}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; min-width: 0;">
            <div class="s-icon s-icon-sm s-icon-success">
              <i class="bi bi-card-text"></i>
            </div>
            <span style="font-size: 0.85rem; color: var(--s-gray-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Product Warranty</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.35rem; flex-shrink: 0;">
            <span class="s-text-success s-font-black" style="font-size: 0.9rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic;">${formatINR(data.benefits?.productWarranty?.amount || 0)}</span>
            ${data.benefits?.productWarranty?.expired ? '<span class="s-pill s-pill-round-sm s-pill-danger s-pill-xs"><i class="fas fa-times"></i> Expired</span>' : ''}
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; min-width: 0;">
            <div class="s-icon s-icon-sm s-icon-royal">
              <i class="fas fa-check-circle"></i>
            </div>
            <span style="font-size: 0.85rem; color: var(--s-gray-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Extended Warranty</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.35rem; flex-shrink: 0;">
            <span class="s-text-royal s-font-black" style="font-size: 0.9rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic;">${formatINR(data.benefits?.extendedWarranty?.amount || data.benefits?.warranty || 0)}</span>
            ${data.benefits?.extendedWarranty?.active ? '<span class="s-pill s-pill-round-sm s-pill-success s-pill-xs"><i class="fas fa-check"></i> Active</span>' : ''}
          </div>
        </div>
        
        <div style="height: 1px; background: var(--s-gray-300); margin: 0.5rem 0;"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.9rem; font-weight: 800; color: var(--s-gray-800);">Total Benefits</span>
          <span class="s-text-primary s-font-black" style="font-size: 1rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic; flex-shrink: 0;">${formatINR(data.benefits?.total || totalBenefits)}</span>
        </div>
      </div>
      
      <!-- Bottom Pills -->
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
        <span class="s-pill s-pill-round-sm s-pill-secondary s-pill-sm">
          <i class="fas fa-hashtag"></i>
          TXN-${(data.code || data.assetCode || '').replace('AST-', '')}
        </span>
        ${data.timeTakenToFix || data.resolutionTime ? `
          <span class="s-pill s-pill-round-sm s-pill-info s-pill-sm">
            <i class="fas fa-clock"></i>
            Time to Fix: ${data.timeTakenToFix || data.resolutionTime} day${(data.timeTakenToFix || data.resolutionTime) > 1 ? 's' : ''}
          </span>
        ` : ''}
      </div>
    </div>
  `;
};



const buildDiscardedCard = (data) => {
  return `
    <div class="scroll-card" data-tilt>
      <!-- Header: Name + Code + Item Type Pill -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
          <span class="s-item-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${data.name || data.assetName}</span>
          <span class="s-item-code" style="white-space: nowrap; flex-shrink: 0;">${data.code || data.assetCode}</span>
        </div>
        ${data.itemType ? `<span class="s-pill s-pill-round-sm ${data.itemTypeClass || 's-pill-primary'} s-pill-sm" style="flex-shrink: 0;">${data.itemType}</span>` : ''}
      </div>
      
      <!-- Resolution Status Banner -->
      <div style="margin-bottom: 0.75rem;">
        <span class="s-label s-label-danger" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
          <i class="fas fa-trash-alt"></i>
          DISCARDED
        </span>
      </div>
      
      <!-- Date Grid (2-column) -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <span class="s-label s-label-danger-soft" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Reported</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${formatDate(data.reportedDate || data.reportDate) || 'N/A'}</div>
          </span>
        </div>
        <div>
          <span class="s-label s-label-success-soft" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Resolved</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${formatDate(data.resolvedDate || data.completionDate)}</div>
          </span>
        </div>
      </div>
      
      ${data.inCharge ? `
        <div style="margin-bottom: 0.75rem;">
          <span class="s-label s-label-primary-soft" style="display: flex; align-items: center; width: 100%; padding: 0.5rem; gap: 0.35rem;">
            <i class="fas fa-user-tie"></i>
            <span style="font-size: 0.85rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${typeof data.inCharge === 'object' ? `${data.inCharge.name} (${data.inCharge.designation})` : data.inCharge}</span>
          </span>
        </div>
      ` : ''}
      
      <div style="height: 1px; background: var(--s-gray-300); margin: 0.75rem 0;"></div>
      
      <!-- Insurance Claim Footer (White Label Wrapper - Full Width) -->
      ${data.insuranceClaim || data.insuranceClaimed ? `
        <div class="s-label s-label-white" style="display: block; width: 100%; padding: 0.75rem; margin: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${data.endOfLife ? '0.5rem' : '0'}; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; min-width: 0;">
              <div class="s-icon s-icon-sm s-icon-info">
                <i class="fas fa-shield-alt"></i>
              </div>
              <span style="font-size: 0.9rem; font-weight: 700; color: var(--s-gray-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Insurance Claim</span>
            </div>
            <span class="s-text-info s-font-black" style="font-size: 1.1rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic; flex-shrink: 0;">${formatINR(data.insuranceClaim?.amount || data.insuranceClaimed || 0)}</span>
          </div>
          
          ${data.endOfLife ? `
            <span class="s-pill s-pill-round-sm s-pill-secondary s-pill-sm">
              <i class="fas fa-hourglass-end"></i>
              End of Life
            </span>
          ` : ''}
        </div>
      ` : data.endOfLife ? `
        <div class="s-label s-label-white" style="display: block; width: 100%; padding: 0.75rem; margin: 0;">
          <span class="s-pill s-pill-round-sm s-pill-secondary s-pill-sm">
            <i class="fas fa-hourglass-end"></i>
            End of Life
          </span>
        </div>
      ` : ''}
    </div>
  `;
};



const buildReplacedCard = (data) => {
  const warrantyCovered = data.replacement?.coveredUnderWarranty || data.warrantyCovered;
  const replacementCost = data.replacement?.cost || data.replacementCost || 0;
  const warrantyType = data.replacement?.warrantyType;

  return `
    <div class="scroll-card" data-tilt>
      <!-- Header: Name + Code + Item Type Pill -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
          <span class="s-item-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${data.name || data.assetName}</span>
          <span class="s-item-code" style="white-space: nowrap; flex-shrink: 0;">${data.code || data.assetCode}</span>
        </div>
        ${data.itemType ? `<span class="s-pill s-pill-round-sm ${data.itemTypeClass || 's-pill-primary'} s-pill-sm" style="flex-shrink: 0;">${data.itemType}</span>` : ''}
      </div>
      
      <!-- Resolution Status Banner -->
      <div style="margin-bottom: 0.75rem;">
        <span class="s-label s-label-info" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
          <i class="fas fa-exchange-alt"></i>
          REPLACED
        </span>
      </div>
      
      <!-- Date Grid (2-column) -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <span class="s-label s-label-danger-soft" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Reported</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${formatDate(data.reportedDate || data.reportDate)}</div>
          </span>
        </div>
        <div>
          <span class="s-label s-label-success-soft" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Resolved</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${formatDate(data.resolvedDate || data.completionDate)}</div>
          </span>
        </div>
      </div>
      
      ${data.inCharge ? `
        <div style="margin-bottom: 0.75rem;">
          <span class="s-label s-label-primary-soft" style="display: flex; align-items: center; width: 100%; padding: 0.5rem; gap: 0.35rem;">
            <i class="fas fa-user-tie"></i>
            <span style="font-size: 0.85rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${typeof data.inCharge === 'object' ? `${data.inCharge.name} (${data.inCharge.designation})` : data.inCharge}</span>
          </span>
        </div>
      ` : ''}
      
      <div style="height: 1px; background: var(--s-gray-300); margin: 0.75rem 0;"></div>
      
      <!-- Replacement Footer (White Label Wrapper - Full Width) -->
      <div class="s-label s-label-white" style="display: block; width: 100%; padding: 0.75rem; margin: 0;">
        ${warrantyCovered ? `
          <div style="display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.5rem;">
            <div class="s-icon s-icon-sm s-icon-success">
              <i class="fas fa-shield-alt"></i>
            </div>
            <span class="s-text-success s-font-bold" style="font-size: 0.95rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Covered Under ${warrantyType === 'PRODUCT_WARRANTY' ? 'Product' : 'Extended'} Warranty</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.9rem; font-weight: 700; color: var(--s-gray-800);">Replacement Cost</span>
            <span class="s-text-success s-font-black" style="font-size: 1.1rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic; flex-shrink: 0;">₹0</span>
          </div>
        ` : `
          <div style="display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.5rem;">
            <div class="s-icon s-icon-sm s-icon-warning">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <span class="s-text-warning s-font-bold" style="font-size: 0.95rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Out of Warranty</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.9rem; font-weight: 700; color: var(--s-gray-800);">Replacement Cost</span>
            <span class="s-text-primary s-font-black" style="font-size: 1.1rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic; flex-shrink: 0;">${formatINR(replacementCost)}</span>
          </div>
        `}
      </div>
    </div>
  `;
};



const buildSoldCard = (data) => {
  const salePrice = data.sale?.price || data.salePrice || 0;

  return `
    <div class="scroll-card" data-tilt>
      <!-- Header: Name + Code + Item Type Pill -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
          <span class="s-item-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${data.name || data.assetName}</span>
          <span class="s-item-code" style="white-space: nowrap; flex-shrink: 0;">${data.code || data.assetCode}</span>
        </div>
        ${data.itemType ? `<span class="s-pill s-pill-round-sm ${data.itemTypeClass || 's-pill-primary'} s-pill-sm" style="flex-shrink: 0;">${data.itemType}</span>` : ''}
      </div>
      
      <!-- Resolution Status Banner -->
      <div style="margin-bottom: 0.75rem;">
        <span class="s-label s-label-success" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
          <i class="fa-solid fa-file-invoice"></i>
          SOLD
        </span>
      </div>
      
      <!-- Date Grid (2-column) -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <span class="s-label s-label-danger-soft" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Reported</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${formatDate(data.reportedDate || data.reportDate) || 'N/A'}</div>
          </span>
        </div>
        <div>
          <span class="s-label s-label-success-soft" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Resolved</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${formatDate(data.resolvedDate || data.completionDate)}</div>
          </span>
        </div>
      </div>
      
      ${data.inCharge ? `
        <div style="margin-bottom: 0.75rem;">
          <span class="s-label s-label-primary-soft" style="display: flex; align-items: center; width: 100%; padding: 0.5rem; gap: 0.35rem;">
            <i class="fas fa-user-tie"></i>
            <span style="font-size: 0.85rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${typeof data.inCharge === 'object' ? `${data.inCharge.name} (${data.inCharge.designation})` : data.inCharge}</span>
          </span>
        </div>
      ` : ''}
      
      <div style="height: 1px; background: var(--s-gray-300); margin: 0.75rem 0;"></div>
      
      <!-- Sale Footer (White Label Wrapper - Full Width) -->
      <div class="s-label s-label-white" style="display: block; width: 100%; padding: 0.75rem; margin: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${data.endOfLife ? '0.5rem' : '0'}; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; min-width: 0;">
            <div class="s-icon s-icon-sm s-icon-success">
              <i class="fas fa-coins"></i>
            </div>
            <span style="font-size: 0.9rem; font-weight: 700; color: var(--s-gray-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Sale Revenue</span>
          </div>
          <span class="s-text-success s-font-black" style="font-size: 1.1rem; font-family: 'Science Gothic', Arial, sans-serif; font-style: italic; flex-shrink: 0;">${formatINR(salePrice)}</span>
        </div>
        
        ${data.endOfLife ? `
          <span class="s-pill s-pill-round-sm s-pill-secondary s-pill-sm">
            <i class="fas fa-hourglass-end"></i>
            End of Life
          </span>
        ` : ''}
      </div>
    </div>
  `;
};



const buildPermanentlyLostCard = (data) => {
  return `
    <div class="scroll-card" data-tilt>
      <!-- Header: Name + Code + Item Type Pill -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; overflow: hidden;">
          <span class="s-item-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${data.name || data.assetName}</span>
          <span class="s-item-code" style="white-space: nowrap; flex-shrink: 0;">${data.code || data.assetCode}</span>
        </div>
        ${data.itemType ? `<span class="s-pill s-pill-round-sm ${data.itemTypeClass || 's-pill-primary'} s-pill-sm" style="flex-shrink: 0;">${data.itemType}</span>` : ''}
      </div>
      
      <!-- Resolution Status Banner -->
      <div style="margin-bottom: 0.75rem;">
        <span class="s-label s-label-amber" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
          <i class="fas fa-exclamation-triangle"></i>
          PERMANENTLY LOST
        </span>
      </div>
      
      <!-- Date Grid (2-column) -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <span class="s-label s-label-danger-soft" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Reported</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${formatDate(data.reportedDate || data.reportDate)}</div>
          </span>
        </div>
        <div>
          <span class="s-label s-label-success-soft" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
            <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Resolved</div>
            <div style="font-size: 0.85rem; font-weight: 600;">${formatDate(data.resolvedDate || data.completionDate)}</div>
          </span>
        </div>
      </div>
      
      ${data.inCharge ? `
        <div style="margin-bottom: 0.75rem;">
          <span class="s-label s-label-primary-soft" style="display: flex; align-items: center; width: 100%; padding: 0.5rem; gap: 0.35rem;">
            <i class="fas fa-user-tie"></i>
            <span style="font-size: 0.85rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${typeof data.inCharge === 'object' ? `${data.inCharge.name} (${data.inCharge.designation})` : data.inCharge}</span>
          </span>
        </div>
      ` : ''}
      
      <div style="height: 1px; background: var(--s-gray-300); margin: 0.75rem 0;"></div>
      
      <!-- Lost Message Footer -->
      <div class="s-content-label s-content-label-danger">
        <i class="fas fa-exclamation-triangle"></i>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 700; margin-bottom: 0.25rem;">Unrecoverable Asset</div>
          <div class="s-content-label-description">
            Item officially deemed unrecoverable. No cost or benefits applicable. Financial loss recorded in disposal ledger.
          </div>
        </div>
      </div>
    </div>
  `;
};





// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT - RESOLUTION CARD BUILDER
// ═══════════════════════════════════════════════════════════════════════════


export const ResolutionCardBuilder = (index) => {
  const data = generateResolutionData(index);
  const resolutionType = (data.resolutionType || data.resolutionMethod || '').toUpperCase().replace(/\s+/g, '_');

  switch (resolutionType) {
    case 'REPAIRED':
      return buildRepairedCard(data);
    case 'DISCARDED':
      return buildDiscardedCard(data);
    case 'REPLACED':
      return buildReplacedCard(data);
    case 'SOLD':
      return buildSoldCard(data);
    case 'PERMANENTLY_LOST':
    case 'PERMANENTLY LOST':
      return buildPermanentlyLostCard(data);
    default:
      console.error('Unknown resolution type:', data.resolutionType || data.resolutionMethod, '→ Normalized to:', resolutionType);
      return buildRepairedCard(data);
  }
};






// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: ASSET DISPOSAL - S- Core Rebuild
// ═══════════════════════════════════════════════════════════════════════════
export const DisposalTimelineCardBuilder = (index) => {
  const data = generateDisposalTimelineData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER ZONE: Name + Code (left), Disposal Method (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.asset.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.asset.code}</span>
                </div>
                <span class="s-pill s-pill-round-sm ${data.disposalClass} s-pill-sm">
                    <i class="${data.disposalIcon}"></i>
                    <span>${data.disposalMethod}</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Net Gain/Loss -->
            ${data.showProfit ? `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <span class="s-text-gray-700 s-font-bold s-text-sm">Net ${data.isProfit ? 'gain' : 'loss'}</span>
                    <span class="${data.isProfit ? 's-text-success' : 's-text-danger'} s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                        ${data.isProfit ? '+' : ''}${formatINR(Math.abs(data.netGainLoss))}
                        <i class="fas fa-${data.isProfit ? 'arrow-up' : 'arrow-down'}"></i>
                    </span>
                </div>
                
                <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            ` : ''}
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Purchase Cost -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Purchase cost</span>
                    </div>
                    <span class="s-text-primary s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${formatINR(data.purchaseCost)}</span>
                </div>
                
                <!-- Book Value / Quantity -->
                ${!data.isMaterial ? `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div class="s-icon s-icon-sm s-icon-info-special">
                                <i class="fas fa-book"></i>
                            </div>
                            <span class="s-text-gray-600 s-font-semibold s-text-sm">Book value</span>
                        </div>
                        <span class="s-text-info-special s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${formatINR(data.bookValue)}</span>
                    </div>
                ` : `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div class="s-icon s-icon-sm s-icon-cyan">
                                <i class="fas fa-cubes"></i>
                            </div>
                            <span class="s-text-gray-600 s-font-semibold s-text-sm">Quantity</span>
                        </div>
                        <span class="s-text-cyan s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.quantity} ${data.unit}</span>
                    </div>
                `}
                
                <!-- Recovered Amount -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-success">
                            <i class="fa-solid fa-file-invoice"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Recovered</span>
                    </div>
                    <span class="s-text-success s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">
                        ${data.recoveredAmount > 0 ? formatINR(data.recoveredAmount) : '—'}
                    </span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER ZONE: Metadata Pills (All Filled) -->
            <div style="display: flex; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-round-sm s-pill-info s-pill-sm">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(data.disposalDate)}</span>
                </span>
            </div>
        </div>
    `;
};




// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5: MATERIAL INTELLIGENCE (4 builders)
// ═══════════════════════════════════════════════════════════════════════════

export const PurchaseTrackingCardBuilder = (index) => {
  const data = generatePurchaseTrackingData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Material Name + Code (left), Variance Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.material.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">MAT-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill s-pill-round-sm ${data.variance < 0 ? 's-pill-success' : data.variance === 0 ? 's-pill-primary' : 's-pill-attention'} s-pill-sm">
                    <i class="fas fa-${data.variance < 0 ? 'arrow-down' : data.variance === 0 ? 'equals' : 'arrow-up'}"></i>
                    <span>${data.variance > 0 ? '+' : ''}${data.variance}%</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Total Cost -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Total purchase cost</span>
                <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${formatINR(data.totalCost)}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Unit Price -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                          <i class="fa-solid fa-indian-rupee-sign"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Unit price</span>
                    </div>
                    <span class="s-text-primary s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${formatINR(data.unitPrice)}</span>
                </div>
                
                <!-- Quantity -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-cyan">
                            <i class="fas fa-cubes"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Quantity</span>
                    </div>
                    <span class="s-text-cyan s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.quantity} ${data.material.unit}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-round-sm s-pill-info s-pill-sm">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(data.purchaseDate)}</span>
                </span>
                <span class="s-pill s-pill-round-sm s-pill-secondary s-pill-sm">
                    <i class="fas fa-chart-bar"></i>
                    <span>Purchase Analytics</span>
                </span>
            </div>
        </div>
    `;
};



export const EmployeeConsumptionCardBuilder = (index) => {
  const data = generateEmployeeConsumptionData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Material Name + Code (left), Purpose Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.material.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">EMP-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill s-pill-round-sm s-pill-info s-pill-sm">
                    <i class="fas fa-clipboard-list"></i>
                    <span>${data.purpose}</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Quantity Issued -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Quantity issued</span>
                <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.quantity} ${data.material.unit}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Employee -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Employee</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.employee}</span>
                </div>
                
                <!-- Department -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-building"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Department</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.department}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-round-sm s-pill-info s-pill-sm">
                    <i class="fas fa-clock"></i>
                    <span>${formatDate(data.issueDate)}</span>
                </span>
                <span class="s-pill s-pill-round-sm s-pill-secondary s-pill-sm">
                    <i class="fas fa-user-check"></i>
                    <span>Employee Issue</span>
                </span>
            </div>
        </div>
    `;
};



export const EquipmentAllocationCardBuilder = (index) => {
  const data = generateEquipmentAllocationData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Material Name + Work Order (left), Status Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.material.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.workOrder}</span>
                </div>
                <span class="s-pill s-pill-round-sm s-pill-success s-pill-sm">
                    <i class="fas fa-check-circle"></i>
                    <span>Installed</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Quantity Installed -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Quantity installed</span>
                <span class="s-text-success s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.quantity} ${data.material.unit}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Asset -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-royal">
                            <i class="fas fa-cog"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Asset</span>
                    </div>
                    <span class="s-text-royal s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.asset.name}</span>
                </div>
                
                <!-- Technician -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-amber">
                            <i class="fas fa-user-cog"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Technician</span>
                    </div>
                    <span class="s-text-amber s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.technician}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-round-sm s-pill-info s-pill-sm">
                    <i class="fas fa-tools"></i>
                    <span>${formatDate(data.installDate)}</span>
                </span>
                <span class="s-pill s-pill-round-sm s-pill-secondary s-pill-sm">
                    <i class="fas fa-wrench"></i>
                    <span>Equipment Service</span>
                </span>
            </div>
        </div>
    `;
};



export const WasteAccountingCardBuilder = (index) => {
  const data = generateWasteAccountingData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Material Name + Code (left), Reason Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.material.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">WST-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill s-pill-round-sm s-pill-danger s-pill-sm">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${data.reason}</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Waste Cost -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Waste cost</span>
                <span class="s-text-danger s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${formatINR(data.wasteCost)}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Reported By -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Reported by</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.reportedBy}</span>
                </div>
                
                <!-- Quantity -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-danger">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Quantity</span>
                    </div>
                    <span class="s-text-danger s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.quantity} ${data.material.unit}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-round-sm s-pill-danger s-pill-sm">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(data.wasteDate)}</span>
                </span>
                <span class="s-pill s-pill-round-sm s-pill-secondary s-pill-sm">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Waste Report</span>
                </span>
            </div>
        </div>
    `;
};



// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6: REQUEST ANALYTICS (5 builders)
// ═══════════════════════════════════════════════════════════════════════════

export const DemandFrequencyCardBuilder = (index) => {
  const data = generateDemandFrequencyData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Asset Name + Code (left), Demand Level (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.asset.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.asset.code}</span>
                </div>
                <span class="s-pill s-pill-round-sm ${data.demandClass} s-pill-sm">
                    <i class="fas fa-chart-line"></i>
                    <span>${data.demandLevel} Demand</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Total Requests -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Total requests</span>
                <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.requestCount}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Average Duration -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-clock"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Avg duration</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.avgDuration} days</span>
                </div>
                
                <!-- Last Request -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-cyan">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Last request</span>
                    </div>
                    <span class="s-text-cyan s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${formatDate(data.lastRequest)}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-round-sm s-pill-info s-pill-sm">
                    <i class="fas fa-history"></i>
                    <span>Demand Tracking</span>
                </span>
                <span class="s-pill s-pill-round-sm s-pill-secondary s-pill-sm">
                    <i class="fas fa-chart-bar"></i>
                    <span>Request Analytics</span>
                </span>
            </div>
        </div>
    `;
};



export const RequesterProfilingCardBuilder = (index) => {
  const data = generateRequesterProfilingData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Asset Name + Code (left), User Type (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.asset.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.asset.code}</span>
                </div>
                ${data.isFrequentUser
      ? '<span class="s-pill s-pill-round-sm s-pill-pop s-pill-sm"><i class="fas fa-star"></i><span>Power User</span></span>'
      : '<span class="s-pill s-pill-round-sm s-pill-info s-pill-sm"><i class="fas fa-user"></i><span>Regular</span></span>'
    }
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Total Requests -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Total requests</span>
                <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.requestCount}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Requester -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Requester</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.employee}</span>
                </div>
                
                <!-- Department -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-building"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Department</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.department}</span>
                </div>
                
                <!-- Return Rate -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-success">
                            <i class="fas fa-undo"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Return rate</span>
                    </div>
                    <span class="s-text-success s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.returnRate}%</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-round-sm s-pill-info s-pill-sm">
                    <i class="fas fa-user-check"></i>
                    <span>User Profile</span>
                </span>
                <span class="s-pill s-pill-round-sm s-pill-secondary s-pill-sm">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Requester Analytics</span>
                </span>
            </div>
        </div>
    `;
};



export const ReturnConditionCardBuilder = (index) => {
  const data = generateReturnConditionData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Asset Name + Code (left), Condition Status (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.asset.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.asset.code}</span>
                </div>
                <span class="${data.condition.cssClass} s-pill-sm ">
                    <i class="${data.condition.icon}"></i>
                    <span>${data.condition.label}</span>
                </span>
            </div>
            
            ${data.damageNote ? `
                <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
                
                <!-- DAMAGE NOTE as Content Label -->
                <div style="margin-bottom: 0.75rem;">
                    <span class="${data.condition.labelClass}">
                        <i class="${data.condition.icon}"></i>
                        ${data.damageNote}
                    </span>
                </div>
            ` : ''}
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Returned By -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Employee</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.employee}</span>
                </div>
                
                <!-- Return Date -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Return date</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${formatDate(data.returnDate)}</span>
                </div>
                
                <!-- Issued By -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-cyan">
                            <i class="fas fa-user-check"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Issuer</span>
                    </div>
                    <span class="s-text-cyan s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.issuer}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-round-sm s-pill-success s-pill-sm ">
                    <i class="fas fa-clipboard-check"></i>
                    <span>Verified</span>
                </span>
            </div>
        </div>
    `;
};




export const FloorTimeCardBuilder = (index) => {
  const data = generateFloorTimeData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Asset Name + Code (left), Utilization Rate (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.asset.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.asset.code}</span>
                </div>
                <span class="s-pill s-pill-round-sm ${data.isHighUtilization ? 's-pill-success' : 's-pill-attention'} s-pill-sm">
                    <i class="fas fa-${data.isHighUtilization ? 'check-circle' : 'exclamation-circle'}"></i>
                    <span>${data.utilizationRate}% Utilized</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Floor Time -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Floor time</span>
                <span class="s-text-success s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.floorDays} days
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Shelf Time -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-warning">
                            <i class="fas fa-pause"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Shelf time</span>
                    </div>
                    <span class="s-text-warning s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.shelfDays} days</span>
                </div>
                
                <!-- Total Period -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Total period</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.totalDays} days</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-round-sm s-pill-${data.isHighUtilization ? 'success' : 'warning'} s-pill-sm">
                    <i class="fas fa-clock"></i>
                    <span>${data.isHighUtilization ? 'High Use' : 'Low Use'}</span>
                </span>
            </div>
        </div>
    `;
};


export const RejectionPatternsCardBuilder = (index) => {
  const data = generateRejectionPatternsData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Asset Name + Code (left), Rejection Rate (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.asset.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.asset.code}</span>
                </div>
                <span class="s-pill s-pill-round-sm ${data.isHighRejection ? 's-pill-danger' : 's-pill-info'} s-pill-sm ">
                    <i class="fas fa-${data.isHighRejection ? 'times-circle' : 'check-circle'}"></i>
                    <span>${data.rejectionRate}% Rejected</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Rejection Count -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Total rejections</span>
                <span class="s-text-danger s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.rejectionCount}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Total Requests -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Total requests</span>
                    </div>
                    <span class="s-text-primary s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.totalRequests}</span>
                </div>
                
                <!-- Top Reason - Now with Tailored Pill -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-warning">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Top reason</span>
                    </div>
                    <span class="s-pill s-pill-round-sm ${data.topReasonPill} s-pill-round-sm">
                        <i class="${data.topReasonIcon}"></i>
                        <span>${data.topReason}</span>
                    </span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-round-sm s-pill-${data.isHighRejection ? 'danger' : 'success'} s-pill-sm ">
                    <i class="fas fa-${data.isHighRejection ? 'exclamation-triangle' : 'thumbs-up'}"></i>
                    <span>${data.isHighRejection ? 'Review Required' : 'Normal'}</span>
                </span>
            </div>
        </div>
    `;
};



// ═══════════════════════════════════════════════════════════════════════════
// SECTION 7: MATERIAL REQUEST INTELLIGENCE (5 builders)
// ═══════════════════════════════════════════════════════════════════════════

export const VolumetricTrackingCardBuilder = (index) => {
  const data = generateVolumetricTrackingData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Material Name + Code (left), Purpose Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.material.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">VOL-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill s-pill-info s-pill-sm s-pill-round-sm">
                    <i class="fas fa-clipboard-list"></i>
                    <span>${data.purpose}</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Quantity Issued -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Quantity issued</span>
                <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.quantityIssued} ${data.material.unit}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Requester -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Requester</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.requester}</span>
                </div>
                
                <!-- Issue Date -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Issue date</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${formatDate(data.issueDate)}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-info s-pill-sm s-pill-round-sm">
                    <i class="fas fa-box-open"></i>
                    <span>Tracked</span>
                </span>
                <span class="s-pill s-pill-secondary s-pill-sm s-pill-round-sm">
                    <i class="fas fa-chart-bar"></i>
                    <span>Volume Tracking</span>
                </span>
            </div>
        </div>
    `;
};



export const ConsumptionAnalysisCardBuilder = (index) => {
  const data = generateConsumptionAnalysisData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Material Name + Code (left), Consumption Rate (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.material.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">CON-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill ${data.fullyConsumed ? 's-pill-success' : 's-pill-info'} s-pill-sm s-pill-round-sm">
                    <i class="fas fa-${data.fullyConsumed ? 'check-circle' : 'info-circle'}"></i>
                    <span>${data.consumptionRate}% Used</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Status -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Status</span>
                <span class="s-text-${data.fullyConsumed ? 'success' : 'info'} s-font-black s-text-base" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.fullyConsumed ? 'Fully Consumed' : 'Partial Return'}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Issued -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Issued</span>
                    </div>
                    <span class="s-text-primary s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.quantityIssued} ${data.material.unit}</span>
                </div>
                
                <!-- Returned -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-${data.fullyConsumed ? 'success' : 'info'}">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Returned</span>
                    </div>
                    <span class="s-text-${data.fullyConsumed ? 'success' : 'info'} s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.quantityReturned} ${data.material.unit}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-${data.fullyConsumed ? 'success' : 'info'} s-pill-sm s-pill-round-sm">
                    <i class="fas fa-chart-pie"></i>
                    <span>Analyzed</span>
                </span>
                <span class="s-pill s-pill-secondary s-pill-sm s-pill-round-sm">
                    <i class="fas fa-percentage"></i>
                    <span>Consumption Rate</span>
                </span>
            </div>
        </div>
    `;
};



export const ReturnAssessmentCardBuilder = (index) => {
  const data = generateReturnAssessmentData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Material Name + Code (left), Condition Status (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.material.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">RET-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill ${data.conditionClass} s-pill-sm s-pill-round-sm">
                    <i class="fas fa-${data.returnCondition === 'Unused' ? 'check-circle' : data.returnCondition === 'Partially Used' ? 'info-circle' : 'exclamation-triangle'}"></i>
                    <span>${data.returnCondition}</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Quantity Returned -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Quantity returned</span>
                <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.quantityReturned} ${data.material.unit}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Condition -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-clipboard-check"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Condition</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.returnCondition}</span>
                </div>
                
                <!-- Return Date -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-cyan">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Return date</span>
                    </div>
                    <span class="s-text-cyan s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${formatDate(data.returnDate)}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-success s-pill-sm s-pill-round-sm">
                    <i class="fas fa-check-circle"></i>
                    <span>Assessed</span>
                </span>
                <span class="s-pill s-pill-secondary s-pill-sm s-pill-round-sm">
                    <i class="fas fa-undo"></i>
                    <span>Return Report</span>
                </span>
            </div>
        </div>
    `;
};



export const RequesterDemandCardBuilder = (index) => {
  const data = generateRequesterDemandData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Material Name + Code (left), Department Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.material.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">REQ-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill s-pill-pop s-pill-sm s-pill-round-sm">
                    <i class="fas fa-building"></i>
                    <span>${data.department}</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Total Requests -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Total requests</span>
                <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.requestCount}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Requester -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Requester</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.requester}</span>
                </div>
                
                <!-- Total Quantity -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-cubes"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Total quantity</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.totalQuantity} ${data.material.unit}</span>
                </div>
                
                <!-- Avg per Request -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-cyan">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Avg per request</span>
                    </div>
                    <span class="s-text-cyan s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.avgQuantity} ${data.material.unit}</span>
                </div>
            </div>
        </div>
    `;
};



export const PeakDemandCardBuilder = (index) => {
  const data = generatePeakDemandData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Material Name + Code (left), Peak Multiplier (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.material.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">PEAK-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill s-pill-attention s-pill-sm s-pill-round-sm">
                    <i class="fas fa-arrow-trend-up"></i>
                    <span>${data.peakMultiplier}x Peak</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Peak Month -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Peak month</span>
                <span class="s-text-attention s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.peakMonth}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Peak Requests -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-danger">
                            <i class="fas fa-fire"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Peak requests</span>
                    </div>
                    <span class="s-text-danger s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.requestsInMonth}</span>
                </div>
                
                <!-- Avg Monthly -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Avg monthly</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.avgMonthly}</span>
                </div>
            </div>
        </div>
    `;
};


// ═══════════════════════════════════════════════════════════════════════════
// SECTION 8: BLEND CONSUMPTION (4 builders)
// ═══════════════════════════════════════════════════════════════════════════

export const IssueFrequencyCardBuilder = (index) => {
  const data = generateIssueFrequencyData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Blend Name + Code (left), Issue Count Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.blend.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">BLEND-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill s-pill-info s-pill-sm s-pill-round-sm">
                    <i class="fas fa-layer-group"></i>
                    <span>${data.issueCount} Issues</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Total Quantity Issued -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Total quantity issued</span>
                <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.totalQuantity} ${data.blend.unit}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Avg per Issue -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Avg per issue</span>
                    </div>
                    <span class="s-text-primary s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.avgPerIssue} ${data.blend.unit}</span>
                </div>
                
                <!-- Last Issue -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Last issue</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${formatDate(data.lastIssue)}</span>
                </div>
                
                <!-- Avg Batch Size (calculated) -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-cyan">
                            <i class="fas fa-vial"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Avg batch size</span>
                    </div>
                    <span class="s-text-cyan s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${Math.round(data.totalQuantity / data.issueCount)} ${data.blend.unit}</span>
                </div>
            </div>
        </div>
    `;
};



export const RequesterConsumptionCardBuilder = (index) => {
  const data = generateRequesterConsumptionData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Blend Name + Code (left), Department Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.blend.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">BREQ-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill s-pill-pop s-pill-sm s-pill-round-sm">
                    <i class="fas fa-building"></i>
                    <span>${data.department}</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Total Issues -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Total issues</span>
                <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.issueCount}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Requester -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Requester</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.requester}</span>
                </div>
                
                <!-- Total Quantity -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-cubes"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Total quantity</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.totalQuantity} ${data.blend.unit}</span>
                </div>
            </div>
        </div>
    `;
};



export const TimeframeDemandCardBuilder = (index) => {
  const data = generateTimeframeDemandData();

  return `
    <div class="scroll-card" data-tilt>
      <!-- HEADER: Blend Name + Code (left), Timeframe Pill (right) -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
          <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.blend.name}</span>
          <span class="s-chip s-chip-primary s-chip-xs">TIME-${index.toString().padStart(3, '0')}</span>
        </div>
        <span class="s-pill s-pill-${data.timeframeColor} s-pill-sm s-pill-round-sm">
          <i class="fas ${data.timeframeIcon}"></i>
          <span>${data.timeframe}</span>
        </span>
      </div>
      
      <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
      
      <!-- HERO METRIC: Issue Count -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span class="s-text-gray-700 s-font-bold s-text-sm">Issue count</span>
        <span class="s-text-${data.timeframeColor} s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
          ${data.issueCount}
        </span>
      </div>
      
      <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
      
      <!-- STAT GRID: Secondary Metrics with Icons -->
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <!-- Peak Hour -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="s-icon s-icon-sm s-icon-danger">
              <i class="fas fa-fire"></i>
            </div>
            <span class="s-text-gray-600 s-font-semibold s-text-sm">Peak hour</span>
          </div>
          <span class="s-text-danger s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.peakHour}</span>
        </div>
        
        <!-- Timeframe (reinforced) -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="s-icon s-icon-sm s-icon-${data.timeframeColor}">
              <i class="fas ${data.timeframeIcon}"></i>
            </div>
            <span class="s-text-gray-600 s-font-semibold s-text-sm">Timeframe</span>
          </div>
          <span class="s-text-${data.timeframeColor} s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.timeframe}</span>
        </div>
      </div>
    </div>
  `;
};


export const VolumeOptimizationCardBuilder = (index) => {
  const data = generateVolumeOptimizationData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Blend Name + Code (left), Waste Percentage (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.blend.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">OPT-${index.toString().padStart(3, '0')}</span>
                </div>
                <span class="s-pill ${data.isOptimized ? 's-pill-success' : 's-pill-attention'} s-pill-sm s-pill-round-sm">
                    <i class="fas fa-${data.isOptimized ? 'check-circle' : 'exclamation-triangle'}"></i>
                    <span>${data.wastePercentage}% Waste</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Status -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Status</span>
                <span class="s-text-${data.isOptimized ? 'success' : 'attention'} s-font-black s-text-base" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.isOptimized ? 'Optimized' : 'Review Required'}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Standard Batch -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-flask"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Standard batch</span>
                    </div>
                    <span class="s-text-primary s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.standardBatch} ${data.blend.unit}</span>
                </div>
                
                <!-- Actual Usage -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-${data.isOptimized ? 'success' : 'warning'}">
                            <i class="fas fa-vial"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Actual usage</span>
                    </div>
                    <span class="s-text-${data.isOptimized ? 'success' : 'warning'} s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.actualUsage} ${data.blend.unit}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill s-pill-${data.isOptimized ? 'success' : 'warning'} s-pill-sm s-pill-round-sm">
                    <i class="fas fa-balance-scale"></i>
                    <span>Analyzed</span>
                </span>
            </div>
        </div>
    `;
};


// ═══════════════════════════════════════════════════════════════════════════
// SECTION 9: INSPECTION & REPORTING (3 builders)
// ═══════════════════════════════════════════════════════════════════════════

export const RealtimeInspectionCardBuilder = (index) => {
  const data = generateRealtimeInspectionData();

  // Format date with time in 12-hour format
  const formatDateTime = (date) => {
    if (date === 'N/A') return 'N/A';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Asset Name + Code (left), Status Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.asset.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.asset.code}</span>
                </div>
                <span class="s-pill ${data.statusClass} s-pill-sm s-pill-round-sm">
                    <i class="fas ${data.statusIcon}"></i>
                    <span>${data.status}</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Findings Pill -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Findings</span>
                <span class="s-pill ${data.findingsClass} s-pill-sm s-pill-round-sm">
                    <i class="fas ${data.findingsIcon}"></i>
                    <span>${data.findings}</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Inspector -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Employee</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.inspector}</span>
                </div>
                
                <!-- Scheduled Date & Time -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fa-solid fa-calendar-day"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Scheduled</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-sm" style="font-family: 'Science Gothic', sans-serif;">${formatDateTime(data.scheduledDate)}</span>
                </div>
                
                <!-- Completed Date & Time -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-${data.isIncomplete ? 'danger' : data.isUnderMaintenance ? 'info' : data.status === 'On-Time' ? 'success' : data.status === 'Delayed' ? 'attention' : 'danger'}">
                            <i class="fa-solid ${data.isIncomplete ? 'fa-calendar-xmark' : 'fa-calendar-check'}"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Completed</span>
                    </div>
                    <span class="s-text-${data.isIncomplete ? 'danger' : data.isUnderMaintenance ? 'gray-500' : data.status === 'On-Time' ? 'success' : data.status === 'Delayed' ? 'attention' : 'danger'} s-font-bold s-text-sm" style="font-family: 'Science Gothic', sans-serif;">${data.completedDate === 'N/A' ? 'N/A' : formatDateTime(data.completedDate)}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                ${!data.isUnderMaintenance ? `
                    <span class="s-pill ${data.conditionClass} s-pill-sm s-pill-round-sm">
                        <i class="fas ${data.conditionIcon}"></i>
                        <span>${data.condition}</span>
                    </span>
                ` : ''}
                <span class="s-pill s-pill-secondary s-pill-sm s-pill-round-sm">
                    <i class="fas fa-clipboard-check"></i>
                    <span>Inspection</span>
                </span>
            </div>
        </div>
    `;
};


export const InspectionMonitoringCardBuilder = (index) => {
  const data = generateInspectionMonitoringData();

  // Build report pills based on item type
  const buildReportPills = () => {
    if (data.isToolkit) {
      return `
        ${data.reportTypes.damagedKit > 0 ? `
          <span class="s-pill s-pill-danger s-pill-sm s-pill-round-sm">
            <i class="fas fa-xmark"></i>
            <span>Damaged Kit: ${data.reportTypes.damagedKit}</span>
          </span>
        ` : ''}
        
        ${data.reportTypes.incompleteKit > 0 ? `
          <span class="s-pill s-pill-attention s-pill-sm s-pill-round-sm">
            <i class="fas fa-triangle-exclamation"></i>
            <span>Incomplete Kit: ${data.reportTypes.incompleteKit}</span>
          </span>
        ` : ''}
        
        ${data.reportTypes.missingKit > 0 ? `
          <span class="s-pill s-pill-amber s-pill-sm s-pill-round-sm">
            <i class="fas fa-question"></i>
            <span>Missing Kit: ${data.reportTypes.missingKit}</span>
          </span>
        ` : ''}
        
        ${data.reportTypes.ok > 0 ? `
          <span class="s-pill s-pill-success s-pill-sm s-pill-round-sm">
            <i class="fas fa-thumbs-up"></i>
            <span>OK: ${data.reportTypes.ok}</span>
          </span>
        ` : ''}
      `;
    } else {
      return `
        ${data.reportTypes.damaged > 0 ? `
          <span class="s-pill s-pill-danger s-pill-sm s-pill-round-sm">
            <i class="fas fa-xmark"></i>
            <span>Damaged: ${data.reportTypes.damaged}</span>
          </span>
        ` : ''}
        
        ${data.reportTypes.partiallyDamaged > 0 ? `
          <span class="s-pill s-pill-attention s-pill-sm s-pill-round-sm">
            <i class="fas fa-triangle-exclamation"></i>
            <span>Partially Damaged: ${data.reportTypes.partiallyDamaged}</span>
          </span>
        ` : ''}
        
        ${data.reportTypes.missing > 0 ? `
          <span class="s-pill s-pill-amber s-pill-sm s-pill-round-sm">
            <i class="fas fa-question"></i>
            <span>Missing: ${data.reportTypes.missing}</span>
          </span>
        ` : ''}
        
        ${data.reportTypes.ok > 0 ? `
          <span class="s-pill s-pill-success s-pill-sm s-pill-round-sm">
            <i class="fas fa-thumbs-up"></i>
            <span>OK: ${data.reportTypes.ok}</span>
          </span>
        ` : ''}
      `;
    }
  };

  return `
<div class="scroll-card" data-tilt>
  
  <!-- HEADER ZONE (Rule 2) -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
    <!-- LEFT: Name + Code -->
    <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
      <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">
        ${data.name}
      </span>
      <span class="s-chip s-chip-primary s-chip-xs">${data.code}</span>
    </div>
    
    <!-- RIGHT: Type Pill -->
    <span class="s-pill ${data.itemTypeClass} s-pill-sm s-pill-round-sm">
      <span>${data.itemType}</span>
    </span>
  </div>
  
  <!-- DIVIDER -->
  <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
  
  <!-- SECTION: INSPECTION STATISTICS -->
  <div style="margin-bottom: 0.75rem;">
    <!-- Section Heading -->
    <div class="s-text-primary s-font-black s-text-base" style="font-family: 'Science Gothic', sans-serif; margin-bottom: 0.65rem;">
      <i class="fas fa-chart-bar"></i> Inspection Statistics
    </div>
    
    <!-- Stats as Labels (2x2 Grid) -->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.25rem;">
      
      <!-- Scheduled -->
      <span class="s-label s-label-primary s-label-sm">
        <i class="fas fa-calendar-check"></i>
        Scheduled: ${data.scheduled}
      </span>
      
      <!-- Conducted -->
      <span class="s-label s-label-success s-label-sm">
        <i class="fas fa-clipboard-check"></i>
        Conducted: ${data.conducted}
      </span>
      
      <!-- Incomplete -->
      <span class="s-label s-label-danger s-label-sm">
        <i class="fas fa-exclamation-circle"></i>
        Incomplete: ${data.incomplete}
      </span>
      
      <!-- Skipped (Maintenance) -->
      <span class="s-label s-label-pop s-label-sm" style="height: auto; padding: 0.4rem 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="fa-solid fa-angles-right"></i>
        <span style="display: block;">
          <span style="display: block;">Skipped: ${data.skippedDueMaintenance}</span>
          <span style="font-size: 0.7rem; font-weight: 500; opacity: 0.9; display: block;">(under maintenance)</span>
        </span>
      </span>
      
    </div>
  </div>
  
  <!-- DIVIDER -->
  <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
  
  <!-- SECTION: INSPECTION PUNCTUALITY -->
  <div style="margin-bottom: 0.75rem;">
    <!-- Section Heading -->
    <div class="s-text-primary s-font-black s-text-base" style="font-family: 'Science Gothic', sans-serif; margin-bottom: 0.65rem;">
      <i class="fas fa-clock"></i> Inspection Punctuality
    </div>
    
    <!-- Punctual vs Delayed Pills -->
    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
      <span class="s-pill s-pill-success s-pill-sm s-pill-round-sm">
        <i class="fas fa-check"></i>
        <span>Punctual: ${data.punctual}</span>
      </span>
      
      <span class="s-pill s-pill-attention s-pill-sm s-pill-round-sm">
        <i class="fas fa-clock"></i>
        <span>Delayed: ${data.delayed}</span>
      </span>
    </div>
    
    <!-- Efficiency Metric (Compact) -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="s-text-gray-700 s-font-bold s-text-sm">
        Efficiency <span style="font-size: 0.7rem; color: var(--s-gray-500); font-weight: 600;">(${data.punctual}/${data.conducted})</span>
      </span>
      <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
        ${data.punctualityEfficiency}%
      </span>
    </div>
  </div>
  
  <!-- DIVIDER -->
  <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
  
  <!-- SECTION: INSPECTION FINDINGS -->
<div style="margin-bottom: 0.75rem;">
  <!-- Section Heading -->
  <div class="s-text-primary s-font-black s-text-base" style="font-family: 'Science Gothic', sans-serif; margin-bottom: 0.65rem;">
    <i class="fas fa-file-lines"></i> Inspection Findings
  </div>
  
  <!-- Summary Stats with Icons (VERTICAL) -->
  <div style="display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 0.65rem;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 0.35rem;">
        <div class="s-icon s-icon-sm s-icon-danger">
          <i class="fas fa-flag"></i>
        </div>
        <span class="s-text-danger s-font-semibold s-text-sm">Total reported</span>
      </div>
      <span class="s-text-danger s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.totalReported}</span>
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 0.35rem;">
        <div class="s-icon s-icon-sm s-icon-teal">
          <i class="fas fa-grip-lines"></i>
        </div>
        <span class="s-text-teal s-font-semibold s-text-sm">Condition unchanged</span>
      </div>
      <span class="s-text-teal s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.conditionUnchanged}</span>
    </div>
  </div>
  
  <!-- Report Breakdown Label -->
  <div class="s-text-primary s-font-bold s-text-sm" style="font-family: 'Science Gothic', sans-serif; margin-bottom: 0.45rem;">
    <i class="bi bi-file-earmark-spreadsheet-fill"></i> Report Breakdown
  </div>
  
  <!-- Report Pills -->
  <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
    ${buildReportPills()}
  </div>
</div>

  
  <!-- DIVIDER -->
  <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
  
  <!-- FOOTER: Next Scheduled -->
  <span class="s-pill s-pill-info s-pill-md s-pill-round-sm" style="width: 100%; display: flex; justify-content: center;">
    <i class="fas fa-calendar-alt"></i>
    <span>Next Scheduled: ${data.nextScheduled}</span>
  </span>
  
</div>
  `;
};




export const ReportSubmissionsCardBuilder = (index) => {
  const data = generateReportSubmissionsData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Asset Name + Code (left), Severity Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.asset.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.asset.code}</span>
                </div>
                <span class="s-pill ${data.severityClass} s-pill-sm s-pill-round-sm">
                    <i class="fas fa-${data.severity === 'Critical' ? 'exclamation-circle' :
      data.severity === 'High' ? 'exclamation-triangle' :
        data.severity === 'Medium' ? 'info-circle' :
          'check-circle'
    }"></i>
                    <span>${data.severity}</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Issue Type -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Issue type</span>
                <span class="s-text-primary s-font-black s-text-base" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.issueType}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Reporter -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Employee</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.reporter}</span>
                </div>
                
                <!-- Report Date -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Report date</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${formatDate(data.reportDate)}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Metadata Pills (All Filled) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <span class="s-pill ${data.severityClass} s-pill-sm s-pill-round-sm">
                    <i class="fas fa-file-alt"></i>
                    <span>Submitted</span>
                </span>
                <span class="s-pill s-pill-secondary s-pill-sm s-pill-round-sm">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Inspection Report</span>
                </span>
            </div>
        </div>
    `;
};


// ═══════════════════════════════════════════════════════════════════════════
// SECTION 10: VEHICLE MILEAGE & REFUELING (2 builders)
// ═══════════════════════════════════════════════════════════════════════════

export const VehicleMileageCardBuilder = (index) => {
  const data = generateVehicleMileageData();

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Vehicle Name + Code (left), Distance Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.vehicle.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.vehicle.code}</span>
                </div>
                <span class="s-pill s-pill-info s-pill-sm s-pill-round-sm">
                    <i class="fas fa-route"></i>
                    <span>${data.distance} km</span>
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Distance -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Distance traveled</span>
                <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.distance} km
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- SIDE-BY-SIDE: Trip Start & Trip End (Blue + Green Labels) -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 0.75rem;">
                <!-- Trip Start (Blue) -->
                <div>
                    <span class="s-label s-label-primary s-label-sm" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
                        <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Trip Start</div>
                        <div style="font-size: 0.85rem; font-weight: 600;">${data.startOdometer.toLocaleString('en-IN')} km</div>
                    </span>
                </div>
                
                <!-- Trip End (Green) -->
                <div>
                    <span class="s-label s-label-success s-label-sm" style="display: block; text-align: center; width: 100%; padding: 0.5rem;">
                        <div style="font-size: 0.7rem; font-weight: 700; margin-bottom: 0.2rem;">Trip End</div>
                        <div style="font-size: 0.85rem; font-weight: 600;">${data.endOdometer.toLocaleString('en-IN')} km</div>
                    </span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Driver & Department with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Driver -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Driver</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.driver}</span>
                </div>
                
                <!-- Department -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-building"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Department</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.department}</span>
                </div>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Status Pill + Date Pill (Both Teal) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <!-- Status Pill (Both Teal) -->
                <span class="s-pill s-pill-success s-pill-sm s-pill-round-sm">
                    <i class="fas ${data.status === 'Issued' ? 'fa-check-circle' : 'fa-clipboard-check'}"></i>
                    <span>${data.status}</span>
                </span>
                
                <!-- Date Pill (Single pill with range for Issued, single date for Assigned) -->
                <span class="s-pill s-pill-info  s-pill-sm s-pill-round-sm">
                    <i class="fas fa-calendar"></i>
                    <span>
                        ${data.status === 'Issued'
      ? `${formatDate(data.issueDate)} - ${formatDate(data.returnDate)}`
      : formatDate(data.issueDate)
    }
                    </span>
                </span>
            </div>
        </div>
    `;
};




export const RefuelingActivityCardBuilder = (index) => {
  const data = generateRefuelingActivityData();

  // Dynamic fuel type icon and color
  let fuelIcon, fuelClass;

  if (data.fuelType === 'Electric') {
    fuelIcon = 'fa-leaf';
    fuelClass = 's-pill-success';
  } else if (data.fuelType === 'Petrol') {
    fuelIcon = 'fa-gas-pump';
    fuelClass = 's-pill-teal';
  } else { // Diesel
    fuelIcon = 'fa-gas-pump';
    fuelClass = 's-pill-amber';
  }

  return `
        <div class="scroll-card" data-tilt>
            <!-- HEADER: Vehicle Name + Code (left), Fuel Type Pill (right) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
                    <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif;">${data.vehicle.name}</span>
                    <span class="s-chip s-chip-primary s-chip-xs">${data.vehicle.code}</span>
                </div>
                <span class="s-pill ${fuelClass} s-pill-sm s-pill-round-sm">
                    <i class="fas ${fuelIcon}"></i>
                    <span>${data.fuelType}</span>
                </span>
            </div>
            
            ${data.isInHouseGrid ? `
            <!-- IN-HOUSE GRID BADGE (Large, Primary, only for Electric) -->
            <div style="margin-bottom: 0.75rem;">
                <span class="s-pill s-pill-primary s-pill-lg s-pill-round-sm" style="display: inline-flex; width: 100%; justify-content: center;">
                    <i class="fas fa-star"></i>
                    <span>In-House Grid</span>
                </span>
            </div>
            ` : ''}
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- HERO METRIC: Total Cost (or Calculate Later) -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="s-text-gray-700 s-font-bold s-text-sm">Total cost</span>
                <span class="s-text-${data.costStatus === 'Calculate Later' ? 'gray-500' : 'primary'} s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
                    ${data.totalCost ? formatINR(data.totalCost) : 'Calculate Later'}
                </span>
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- STAT GRID: Secondary Metrics with Icons -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Station -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-primary">
                            <i class="fas ${data.isInHouseGrid ? 'fa-plug' : 'fa-store'}"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Station</span>
                    </div>
                    <span class="s-text-gray-900 s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.station}</span>
                </div>
                
                <!-- Energy/Quantity -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-${data.fuelType === 'Electric' ? 'success' : data.fuelType === 'Petrol' ? 'teal' : 'amber'}">
                            <i class="fas ${data.fuelType === 'Electric' ? 'fa-bolt' : 'fa-droplet'}"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">${data.fuelType === 'Electric' ? 'Energy' : 'Quantity'}</span>
                    </div>
                    <span class="s-text-${data.fuelType === 'Electric' ? 'success' : data.fuelType === 'Petrol' ? 'teal' : 'amber'} s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${data.quantity} ${data.unit}</span>
                </div>
                
                <!-- Price per Unit (hide if Calculate Later) -->
                ${data.pricePerUnit ? `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="s-icon s-icon-sm s-icon-info">
                            <i class="fas fa-tag"></i>
                        </div>
                        <span class="s-text-gray-600 s-font-semibold s-text-sm">Price per ${data.unit}</span>
                    </div>
                    <span class="s-text-info s-font-bold s-text-base" style="font-family: 'Science Gothic', sans-serif;">${formatINR(data.pricePerUnit)}</span>
                </div>
                ` : ''}
            </div>
            
            <div style="height: 1px; background: var(--s-gray-200); margin: 0.75rem 0;"></div>
            
            <!-- FOOTER: Date + Refuel Log + Invoice (if cost exists) -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <!-- Date Pill -->
                <span class="s-pill s-pill-info s-pill-sm s-pill-round-sm">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(data.refuelDate)}</span>
                </span>
                
                <!-- Refuel Log Pill -->
                <span class="s-pill s-pill-secondary s-pill-sm s-pill-round-sm">
                    <i class="fas ${fuelIcon}"></i>
                    <span>Refuel Log</span>
                </span>
                
                <!-- Invoice Pill (only if cost is calculated) -->
                ${data.costStatus === 'Invoiced' ? `
                <span class="s-pill s-pill-primary s-pill-sm s-pill-round-sm">
                    <i class="fas fa-file-invoice"></i>
                    <span>Invoice</span>
                </span>
                ` : ''}
            </div>
        </div>
    `;
};



// ═══════════════════════════════════════════════════════════════════════════
// SECTION 10: FUEL ECONOMY ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

// ============================================================================
// SECTION 10B: FUEL ECONOMY CARD - COMPLETE WITH ALL REQUIREMENTS
// ============================================================================

export const FuelEconomyCardBuilder = (index) => {
  const data = generateFuelEconomyData();

  // Dynamic Fuel Icon
  let fuelIcon = 'fa-gas-pump';
  if (data.fuelType === 'Electric') fuelIcon = 'fa-leaf';
  else if (data.fuelType === 'Diesel') fuelIcon = 'fa-gas-pump';
  else fuelIcon = 'fa-gas-pump'; // Petrol

  return `
    <div class="scroll-card" data-tilt>
      <!-- HEADER: Vehicle Icon + Name + Code (inline), Fuel Type Pill -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
          <div class="s-icon s-icon-md s-icon-${data.fuelBadgeColor}">
            <i class="fas fa-car"></i>
          </div>
          <span class="s-text-primary s-font-black s-text-base" style="font-family: 'Science Gothic', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${data.vehicleName}</span>
          <span class="s-chip s-chip-primary s-chip-xs">${data.vehicleCode}</span>
        </div>
        <span class="s-pill s-pill-${data.fuelBadgeColor} s-pill-round-sm s-pill-sm" style="flex-shrink: 0;">
          <i class="fas ${fuelIcon}"></i>
          <span>${data.fuelType}</span>
        </span>
      </div>
      
      <div class="s-divider"></div>
      
      <!-- Last Trip Section -->
      <div style="margin-bottom: 0.75rem;">
        <div class="s-text-gray-700 s-font-bold s-text-sm" style="margin-bottom: 0.5rem;">Last Trip</div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="s-label s-label-primary s-label-sm">
            <i class="fas fa-route"></i> Distance: ${data.lastTripDistance} km
          </span>
          <span class="s-label s-label-info s-label-sm">
            <i class="fas fa-user"></i> ${data.employeeName}
          </span>
        </div>
      </div>
      
      <div class="s-divider"></div>
      
      <!-- Since Purchase Section -->
      <div style="margin-bottom: 0.75rem;">
        <div class="s-text-gray-700 s-font-bold s-text-sm" style="margin-bottom: 0.5rem;">Since Purchase</div>
        
        <!-- Mileage and Total Cost side by side -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
          <span class="s-label s-label-primary s-label-sm">
            Mileage: ${data.totalMileage.toLocaleString('en-IN')} km
          </span>
          <span class="s-label s-label-success s-label-sm">
            Total Cost: ${formatINR(data.totalCostSincePurchase)}
          </span>
        </div>
        
        <!-- Average cost per unit (small text) -->
        <div class="s-text-gray-600 s-text-xs" style="margin-top: 0.25rem;">
          Average: ${formatINR(data.pricePerUnit || 0)} per ${data.fuelUnit}
        </div>
      </div>
      
      <div class="s-divider"></div>
      
      <!-- Current Year Section -->
      <div style="margin-bottom: 0.75rem;">
        <div class="s-text-gray-700 s-font-bold s-text-sm" style="margin-bottom: 0.5rem;">${data.currentYear}</div>
        
        <!-- Mileage and Cost side by side -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="s-label s-label-primary s-label-sm">
            Mileage: ${data.thisYearMileage.toLocaleString('en-IN')} km
          </span>
          ${data.hasGridException ? `
          <span class="s-label s-label-info s-label-sm">
            <i class="fas fa-info-circle"></i> Cost Undetermined
          </span>
          ` : `
          <span class="s-label s-label-success s-label-sm">
            Cost: ${formatINR(data.thisYearCost)}
          </span>
          `}
        </div>
      </div>
      
      <div class="s-divider"></div>
      
      <!-- Average Fuel Economy -->
      <div style="margin-bottom: 0.75rem;">
        <div class="s-text-gray-700 s-font-bold s-text-sm" style="margin-bottom: 0.35rem;">Average Fuel Economy</div>
        <div class="s-text-primary s-font-black s-text-2xl" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
          ${data.economy} ${data.economyUnit}
        </div>
      </div>
      
      <div class="s-divider"></div>
      
      <!-- Cost Efficiency -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="s-text-gray-700 s-font-bold s-text-sm">Cost Efficiency</span>
        ${data.hasGridException ? `
        <span class="s-pill s-pill-info s-pill-round-sm s-pill-sm">
          <i class="fas fa-info-circle"></i> Pending
        </span>
        ` : `
        <span class="s-text-primary s-font-black s-text-lg" style="font-family: 'Science Gothic', sans-serif; font-style: italic;">
          ${formatINR(data.costPerKm)}/km
        </span>
        `}
      </div>
    </div>
  `;
};





// ═══════════════════════════════════════════════════════════════════════════
// VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════

console.log('✅ ScrollCardBuilders.js loaded successfully');
console.log('📊 All 27 card builders ready');
