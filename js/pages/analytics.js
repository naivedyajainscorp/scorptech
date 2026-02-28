/* ════════════════════════════════════════════════════════════════════════════
   ANALYTICS PAGE INITIALIZATION
   ════════════════════════════════════════════════════════════════════════════ */

import { initInfiniteScroll } from '../components/InfiniteScroll.js';
import { analyticsIconRain } from '../components/AnalyticsIconRain.js';

import { AnalyticsCanvasAnimation } from '../visualizations/AnalyticsCanvasAnimation.js';

import { CapitalAllocationHeatmap } from '../visualizations/CapitalAllocationHeatmap.js';
import { PurchaseTimeline } from '../visualizations/PurchaseTimeline.js';
import { OpexOverview } from '../visualizations/OpexOverview.js';
import { NetCostRecovery } from '../visualizations/NetCostRecovery.js';
import { OpexTrendTimeline } from '../visualizations/OpexTrendTimeline.js';
import { DisposalMethodsDonut } from '../visualizations/DisposalMethodsDonut.js';
import { DisposalWaterfallAnalysis } from '../visualizations/DisposalWaterfallAnalysis.js';
import { CategoryRetentionViz } from '../visualizations/CategoryRetentionViz.js';
import { DepreciationViz } from '../visualizations/DepreciationViz.js';
import { ConsolidatedProtection } from '../visualizations/ConsolidatedProtection.js';
import { ProtectionCategoryGrid } from '../visualizations/ProtectionCategoryGrid.js';
import { ProtectionTypeBreakdown } from '../visualizations/ProtectionTypeBreakdown.js';
import { InspectionCorrelationViz } from '../visualizations/InspectionCorrelationViz.js';
import { FuelEconomy } from '../visualizations/FuelEconomy.js';
import { initializeFuelPrices } from '../utils/helpers.js';




import { loadAnalyticsData } from '../builders/CardDataGenerators.js';
import * as CardBuilders from '../builders/ScrollCardBuilders.js';

console.log('📊 Analytics page initialization started');

// ═══════════════════════════════════════════════════════════════════════════
// ASYNC INITIALIZATION - Load data FIRST, then everything else
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => { // ← Changed to async
  console.log('🔵 Analytics page DOMContentLoaded');

  //=============================================================================
  // 0. LOAD ANALYTICS DATA FIRST (NEW - CRITICAL)
  //=============================================================================

  try {
    console.log('🔄 Loading analytics data from JSON...');
    await loadAnalyticsData();
    await initializeFuelPrices();
    console.log('✅ Analytics data and Fuel prices loaded');
  } catch (error) {
    console.warn('⚠️ Failed to load analytics data, using fallback:', error);
  }

  //=============================================================================
  // 1. ANALYTICS HERO CANVAS ANIMATION
  //=============================================================================

  const canvasElement = document.getElementById('analyticsNetworkCanvas');
  if (canvasElement) {
    const canvasAnimation = new AnalyticsCanvasAnimation('analyticsNetworkCanvas');
    canvasAnimation.init();
    console.log('✅ Analytics canvas animation initialized');
  } else {
    console.warn('⚠️ Analytics canvas not found');
  }

  //=============================================================================
  // 2. ANALYTICS ICON RAIN (11 Hero Sections)
  //=============================================================================

  const iconRainConfigs = [
    { id: 'analytics-cost-hero', icons: ['fa-solid fa-money-bill-1', 'fa-solid fa-money-bill-transfer', 'fa-solid fa-wallet', 'fa-solid fa-indian-rupee-sign'] },
    { id: 'analytics-material-hero', icons: ['fas fa-flask', 'fas fa-vial', 'fas fa-droplet', 'fas fa-microscope'] },
    { id: 'analytics-maintenance-hero', icons: ['fas fa-wrench', 'fas fa-screwdriver', 'fas fa-hammer', 'fas fa-tools'] },
    { id: 'analytics-disposal-hero', icons: ['fas fa-recycle', 'fas fa-trash-alt', 'fas fa-dumpster'] },
    { id: 'analytics-request-hero', icons: ['fas fa-clipboard-list', 'fas fa-list-check', 'fas fa-clock'] },
    { id: 'analytics-material-request-hero', icons: ['fas fa-boxes', 'fas fa-box', 'fas fa-warehouse'] },
    { id: 'analytics-blend-hero', icons: ['fas fa-blender', 'fas fa-flask', 'fas fa-atom'] },
    { id: 'analytics-inspection-hero', icons: ['fas fa-clipboard-check', 'fas fa-tasks', 'fas fa-magnifying-glass'] },
    { id: 'analytics-opex-hero', icons: ['fas fa-tools', 'fas fa-wrench', 'fas fa-circle-check'] },
    { id: 'analytics-vehicle-hero', icons: ['fas fa-car', 'fas fa-truck', 'fas fa-gas-pump'] },
    { id: 'analytics-audit-hero', icons: ['fas fa-file-alt', 'fas fa-clipboard-check', 'fas fa-shield-check'] }
  ];

  iconRainConfigs.forEach(config => {
    if (document.getElementById(config.id)) {
      analyticsIconRain(config.id, config.icons, 20);
    }
  });

  console.log('✅ Analytics icon rains initialized');

  //=============================================================================
  // 3. INFINITE SCROLLS WITH CARD BUILDERS (27 scrolls - CORRECT IDs)
  //=============================================================================

  const scrollConfigs = [
    // SECTION 1: COST ANALYSIS (2)
    { id: '#price-benchmarking-scroll', builder: CardBuilders.PriceBenchmarkingCardBuilder, speed: 3, direction: 'up' },
    { id: '#purchase-ledger-scroll', builder: CardBuilders.PurchaseLedgerCardBuilder, speed: 3, direction: 'up' },

    // SECTION 2: MAINTENANCE & PROTECTION (1)
    { id: '#protection-individual-scroll', builder: CardBuilders.ProtectionIndividualCardBuilder, speed: 3, direction: 'up' },

    // SECTION 3: OPEX MANAGEMENT (1)
    { id: '#opex-assets-scroll', builder: CardBuilders.OpexAssetsCardBuilder, speed: 3, direction: 'up' },
    { id: '#viz-resolution-status', builder: CardBuilders.ResolutionCardBuilder, speed: 3, direction: 'up' },
    // SECTION 4: DISPOSAL & RECOVERY (1)
    { id: '#disposal-timeline-scroll', builder: CardBuilders.DisposalTimelineCardBuilder, speed: 3, direction: 'up' },

    // SECTION 5: MATERIAL INTELLIGENCE (4)
    { id: '#purchase-tracking-scroll', builder: CardBuilders.PurchaseTrackingCardBuilder, speed: 3, direction: 'up' },
    { id: '#employee-consumption-scroll', builder: CardBuilders.EmployeeConsumptionCardBuilder, speed: 3, direction: 'up' },
    { id: '#equipment-allocation-scroll', builder: CardBuilders.EquipmentAllocationCardBuilder, speed: 3, direction: 'up' },
    { id: '#waste-accounting-scroll', builder: CardBuilders.WasteAccountingCardBuilder, speed: 3, direction: 'up' },

    // SECTION 6: REQUEST ANALYTICS (5)
    { id: '#demand-frequency-scroll', builder: CardBuilders.DemandFrequencyCardBuilder, speed: 3, direction: 'up' },
    { id: '#requester-profiling-scroll', builder: CardBuilders.RequesterProfilingCardBuilder, speed: 3, direction: 'up' },
    { id: '#return-condition-scroll', builder: CardBuilders.ReturnConditionCardBuilder, speed: 3, direction: 'up' },
    { id: '#floor-time-scroll', builder: CardBuilders.FloorTimeCardBuilder, speed: 3, direction: 'up' },
    { id: '#rejection-patterns-scroll', builder: CardBuilders.RejectionPatternsCardBuilder, speed: 3, direction: 'up' },

    // SECTION 7: MATERIAL REQUEST INTELLIGENCE (5)
    { id: '#volumetric-tracking-scroll', builder: CardBuilders.VolumetricTrackingCardBuilder, speed: 3, direction: 'up' },
    { id: '#consumption-analysis-scroll', builder: CardBuilders.ConsumptionAnalysisCardBuilder, speed: 3, direction: 'up' },
    { id: '#return-assessment-scroll', builder: CardBuilders.ReturnAssessmentCardBuilder, speed: 3, direction: 'up' },
    { id: '#requester-demand-scroll', builder: CardBuilders.RequesterDemandCardBuilder, speed: 3, direction: 'up' },
    { id: '#peak-demand-scroll', builder: CardBuilders.PeakDemandCardBuilder, speed: 3, direction: 'up' },

    // SECTION 8: BLEND CONSUMPTION (4)
    { id: '#issue-frequency-scroll', builder: CardBuilders.IssueFrequencyCardBuilder, speed: 3, direction: 'up' },
    { id: '#requester-consumption-scroll', builder: CardBuilders.RequesterConsumptionCardBuilder, speed: 3, direction: 'up' },
    { id: '#timeframe-demand-scroll', builder: CardBuilders.TimeframeDemandCardBuilder, speed: 3, direction: 'up' },
    { id: '#volume-optimization-scroll', builder: CardBuilders.VolumeOptimizationCardBuilder, speed: 3, direction: 'up' },

    // SECTION 9: INSPECTION & REPORTING (3)
    { id: '#realtime-inspection-scroll', builder: CardBuilders.RealtimeInspectionCardBuilder, speed: 3, direction: 'up' },
    { id: '#inspection-efficiency-scroll', builder: CardBuilders.InspectionMonitoringCardBuilder, speed: 3, direction: 'up' },
    { id: '#report-submissions-scroll', builder: CardBuilders.ReportSubmissionsCardBuilder, speed: 3, direction: 'up' },

    // SECTION 10: VEHICLE MILEAGE & REFUELING (3)
    { id: '#vehicle-mileage-scroll', builder: CardBuilders.VehicleMileageCardBuilder, speed: 3, direction: 'up' },
    { id: '#refueling-activity-scroll', builder: CardBuilders.RefuelingActivityCardBuilder, speed: 3, direction: 'up' },
    { id: '#fuel-economy-scroll', builder: CardBuilders.FuelEconomyCardBuilder, speed: 3, direction: 'up' }
  ];

  let initializedCount = 0;

  scrollConfigs.forEach(config => {
    const container = document.querySelector(config.id);
    if (!container) {
      console.warn(`⚠️ Container not found: ${config.id}`);
      return;
    }

    const track = container.querySelector('[data-infinite-track]');
    if (!track) {
      console.warn(`⚠️ Track not found in: ${config.id}`);
      return;
    }

    // Clear existing content
    track.innerHTML = '';

    // Generate 8 cards using the builder (NOW with loaded data)
    for (let i = 1; i <= 6; i++) {
      track.insertAdjacentHTML('beforeend', config.builder(i));
    }

    // Initialize infinite scroll with VERTICAL direction
    const result = initInfiniteScroll(config.id, {
      speed: config.speed,
      direction: config.direction,
      pauseOnHover: true
    });

    if (result) {
      initializedCount++;
    }
  });

  console.log(`✅ Initialized ${initializedCount}/27 infinite scrolls (all vertical)`);

  //=============================================================================
  // 4. CAPITAL ALLOCATION HEATMAP
  //=============================================================================

  const heatmapContainer = document.getElementById('viz-capital-allocation');
  if (heatmapContainer) {
    const heatmap = new CapitalAllocationHeatmap('viz-capital-allocation');
    console.log('✅ Capital allocation heatmap initialized');
  } else {
    console.warn('⚠️ Heatmap container not found');
  }

  //=============================================================================
  // 5. OPEX OVERVIEW VISUALIZATION
  //=============================================================================

  const opexContainer = document.getElementById('viz-opex-overview');
  if (opexContainer) {
    const opexViz = new OpexOverview('viz-opex-overview');
    console.log('✅ OPEX Overview visualization initialized');
  } else {
    console.warn('⚠️ OPEX Overview container not found');
  }


  //=============================================================================
  // 6. CONSOLIDATED PROTECTION VISUALIZATION
  //=============================================================================
  const protectionContainer = document.getElementById('viz-protection-consolidated');
  if (protectionContainer) {
    const protectionViz = new ConsolidatedProtection('viz-protection-consolidated');
    protectionViz.init();
    console.log('✅ Consolidated Protection visualization initialized');
  } else {
    console.warn('⚠️ Consolidated Protection container not found');
  }

  //=============================================================================
  // 6.1. PROTECTION CATEGORY GRID (NEW - Vanilla JS)
  //=============================================================================
  const protectionGridContainer = document.getElementById('viz-protection-category');
  if (protectionGridContainer) {
    new ProtectionCategoryGrid('viz-protection-category');
    console.log('✅ Protection Category Grid initialized');
  } else {
    console.warn('⚠️ Protection Category Grid container not found');
  }

  //=============================================================================
  // 6.2. PROTECTION TYPE BREAKDOWN (NEW - Vanilla JS)
  //=============================================================================
  const protectionTypeContainer = document.getElementById('viz-protection-type');
  if (protectionTypeContainer) {
    new ProtectionTypeBreakdown('viz-protection-type');
    console.log('✅ Protection Type Breakdown initialized');
  } else {
    console.warn('⚠️ Protection Type Breakdown container not found');
  }

  //=============================================================================
  // 9.1. INSPECTION VS REPORT CORRELATION (NEW)
  //=============================================================================
  const inspectionCorrelationContainer = document.getElementById('viz-inspection-correlation');
  if (inspectionCorrelationContainer) {
    new InspectionCorrelationViz('viz-inspection-correlation');
    console.log('✅ Inspection Correlation initialized');
  } else {
    console.warn('⚠️ Inspection Correlation container not found');
  }



  //=============================================================================
  // 7. NET COST RECOVERY VISUALIZATION
  //=============================================================================
  const netCostRecoveryContainer = document.getElementById('viz-opex-net');
  if (netCostRecoveryContainer) {
    try {
      window.netCostRecoveryViz = new NetCostRecovery('viz-opex-net');
      console.log('✅ Net Cost Recovery visualization initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Net Cost Recovery:', error);
    }
  } else {
    console.warn('⚠️ Net Cost Recovery container not found (#viz-opex-net)');
  }

  //=============================================================================
  // 6. PURCHASE TIMELINE VISUALIZATION ✅ ADD THIS SECTION
  //=============================================================================
  const timelineContainer = document.getElementById('viz-procurement-timeline');
  if (timelineContainer) {
    const timelineViz = new PurchaseTimeline('viz-procurement-timeline');
    console.log('✅ Purchase Timeline visualization initialized');
  } else {
    console.warn('⚠️ Purchase Timeline container not found');
  }

  //=============================================================================
  // 8. OPEX TREND TIMELINE VISUALIZATION
  //=============================================================================
  const opexTimelineContainer = document.getElementById('viz-opex-timeline');
  if (opexTimelineContainer) {
    const opexTimeline = new OpexTrendTimeline('viz-opex-timeline');
    console.log('✅ OPEX Trend Timeline visualization initialized');
  } else {
    console.warn('⚠️ OPEX Trend Timeline container not found');
  }

  //=============================================================================
  // 9. RESOLUTION STATUS INFINITE SCROLL (Multi-card vertical scroll) 
  //=============================================================================
  function initResolutionScroll() {
    const resolutionContainer = document.getElementById('viz-resolution-status');
    if (resolutionContainer) {
      const track = resolutionContainer.querySelector('.resolution-scroll-track');
      if (track) {
        const cards = [];
        for (let i = 0; i < 4; i++) {
          cards.push(CardBuilders.ResolutionCardBuilder(i));
        }
        track.innerHTML = cards.join('');
        track.setAttribute('data-infinite-track', '');
        initInfiniteScroll('#viz-resolution-status .resolution-scroll-track', {
          speed: 3,
          direction: 'up'
        });
        console.log('✓ Resolution Status scroll initialized');
      }
    }
  }

  //=============================================================================
  // 10. DISPOSAL METHODS DONUT VISUALIZATION
  //=============================================================================
  const disposalDonutContainer = document.getElementById('viz-disposal-methods');
  if (disposalDonutContainer) {
    const disposalDonut = new DisposalMethodsDonut('viz-disposal-methods');
    console.log('✅ Disposal Methods Donut initialized');
  } else {
    console.warn('⚠️ Disposal Methods container not found');
  }

  //=============================================================================
  // 11. DISPOSAL WATERFALL ANALYSIS VISUALIZATION
  //=============================================================================
  const disposalWaterfallContainer = document.getElementById('viz-disposal-waterfall');
  if (disposalWaterfallContainer) {
    const disposalWaterfall = new DisposalWaterfallAnalysis('viz-disposal-waterfall');
    console.log('✅ Disposal Waterfall Analysis initialized');
  } else {
    console.warn('⚠️ Disposal Waterfall container not found');
  }


  //=============================================================================
  // 12. CATEGORY RETENTION VISUALIZATION
  //=============================================================================
  const categoryRetentionContainer = document.getElementById('viz-disposal-category');
  if (categoryRetentionContainer) {
    const categoryRetention = new CategoryRetentionViz('viz-disposal-category');
    console.log('✅ Category Retention Visualization initialized');
  } else {
    console.warn('⚠️ Category Retention container not found');
  }

  //=============================================================================
  // 13. DEPRECIATION DUAL-METHOD VISUALIZATION
  //=============================================================================
  const depreciationVizContainer = document.getElementById('viz-depreciation');
  if (depreciationVizContainer) {
    const depreciationViz = new DepreciationViz('viz-depreciation');
    console.log('✅ Depreciation Visualization initialized');
  } else {
    console.warn('⚠️ Depreciation Visualization container not found');
  }



  //=============================================================================
  // 14. FUEL ECONOMY DYNAMIC INDEX
  //=============================================================================
  const fuelEconomyContainer = document.getElementById('viz-fuel-economy');
  if (fuelEconomyContainer) {
    new FuelEconomy('viz-fuel-economy');
    console.log('✅ Fuel Economy visualization initialized');
  } else {
    console.warn('⚠️ Fuel Economy container not found');
  }



  console.log('🎉 Analytics page fully initialized');
});
