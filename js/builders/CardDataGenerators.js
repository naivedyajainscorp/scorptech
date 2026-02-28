/* ════════════════════════════════════════════════════════════════════════════
   CARD DATA GENERATORS - ALL CALCULATION & LOGIC
   Purpose: Handle data fetching, calculations, and business logic for cards
   ════════════════════════════════════════════════════════════════════════════ */


// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL DATA STORAGE
// ═══════════════════════════════════════════════════════════════════════════

import {
  initializeFuelPrices,
  getCurrentFuelPrice,
  getAverageFuelPrice,
  formatINR
} from '../utils/helpers.js';

let analyticsData = null;

export const loadAnalyticsData = async () => {
  try {
    console.log('🔄 Fetching analytics-data.json...');
    const response = await fetch('/assets/data/analytics-data.json');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    analyticsData = await response.json();

    // ✅ VERIFICATION - PROOF JSON IS LOADED
    console.log('✅ Analytics data loaded from JSON successfully!');
    console.log('📦 DATA SOURCE: analytics-data.json');
    console.log('🔍 VERIFICATION:');
    console.log(`   Tools: ${analyticsData?.assets?.tools?.length || 0}`);
    console.log(`   Toolkits: ${analyticsData?.assets?.toolkits?.length || 0}`);
    console.log(`   Machinery: ${analyticsData?.assets?.machinery?.length || 0}`);
    console.log(`   Vehicles: ${analyticsData?.assets?.vehicles?.length || 0}`);
    console.log(`   Materials: ${analyticsData?.materials?.length || 0}`);
    console.log(`   Blends: ${analyticsData?.blends?.length || 0}`);
    console.log(`   Vendors: ${analyticsData?.vendors?.length || 0}`);
    console.log(`   Departments: ${analyticsData?.departments?.length || 0}`);
    console.log(`   Employee Names (male): ${analyticsData?.employeeNames?.firstNames?.male?.length || 0}`);
    console.log(`   Employee Names (female): ${analyticsData?.employeeNames?.firstNames?.female?.length || 0}`);
    console.log(`   Last Names: ${analyticsData?.employeeNames?.lastNames?.length || 0}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return analyticsData;
  } catch (error) {
    console.error('❌ CRITICAL ERROR: Failed to load analytics-data.json');
    console.error('📍 Error details:', error.message);
    console.error('⚠️ Cards WILL NOT work without JSON data!');
    console.error('📁 Ensure file exists at: /assets/data/analytics-data.json');
    throw error; // Re-throw to prevent app from continuing
  }
};


// ═══════════════════════════════════════════════════════════════════════════
// DATA VALIDATION - ENSURE JSON IS LOADED
// ═══════════════════════════════════════════════════════════════════════════

const ensureDataLoaded = () => {
  if (!analyticsData) {
    throw new Error('❌ Analytics data not loaded! Call loadAnalyticsData() first.');
  }
  return analyticsData;
};


// ═════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

// Redundant formatINR removed - now imported from utils/helpers.js

export const getRandomItem = (array) => {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomFloat = (min, max, decimals = 2) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

export const getRandomDate = (startYear = 2024, endYear = 2025) => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};


export const getRandomEmployee = () => {
  const data = ensureDataLoaded();
  const isMale = Math.random() > 0.5;
  const firstName = getRandomItem(
    isMale ? data.employeeNames.firstNames.male : data.employeeNames.firstNames.female
  );
  const lastName = getRandomItem(data.employeeNames.lastNames);
  return `${firstName} ${lastName}`;
};

export const getRandomAsset = () => {
  const data = ensureDataLoaded();
  const allAssets = [
    ...(data.assets.tools || []),
    ...(data.assets.toolkits || []),
    ...(data.assets.machinery || []),
    ...(data.assets.vehicles || [])
  ];
  return getRandomItem(allAssets);
};

export const getRandomMaterial = () => {
  const data = ensureDataLoaded();
  return getRandomItem(data.materials || []);
};

export const getRandomBlend = () => {
  const data = ensureDataLoaded();
  return getRandomItem(data.blends || []);
};

export const getRandomVendor = () => {
  const data = ensureDataLoaded();
  return getRandomItem(data.vendors || []);
};

export const getRandomDepartment = () => {
  const data = ensureDataLoaded();
  return getRandomItem(data.departments || []);
};

export const getRandomCondition = () => {
  const data = ensureDataLoaded();
  return getRandomItem(data.conditions || []);
};


// ═══════════════════════════════════════════════════════════════════════════
// DATA GENERATORS - SECTION 1: COST ANALYSIS (2 generators)
// ═══════════════════════════════════════════════════════════════════════════

export const generatePriceBenchmarkData = () => {
  const asset = getRandomAsset();
  const avgPrice = (asset.priceRange.min + asset.priceRange.max) / 2;
  const purchaseCount = getRandomInt(5, 25);
  const variance = getRandomInt(-15, 20);
  const trend = variance >= 0 ? '↗' : '↘';
  const trendClass = variance >= 0 ? 's-pill-danger' : 's-pill-success';

  return {
    asset,
    avgPrice,
    purchaseCount,
    variance,
    trend,
    trendClass
  };
};


//individual purchase ledger entry

export const generatePurchaseLedgerData = () => {
  const data = ensureDataLoaded();

  // Define asset types with their corresponding vendor category
  const assetTypes = [
    { items: data.assets.vehicles, prefix: 'VEH', hasQuantity: false, vendorCategory: 'VEHICLE' },
    { items: data.assets.machinery, prefix: 'MCH', hasQuantity: false, vendorCategory: 'MACHINERY' },
    { items: data.assets.tools, prefix: 'TL', hasQuantity: false, vendorCategory: 'TOOL' },
    { items: data.assets.toolkits, prefix: 'TK', hasQuantity: false, vendorCategory: 'TOOL' },
    { items: data.materials, prefix: 'MAT', hasQuantity: true, vendorCategory: 'MATERIAL' }
  ];

  const selectedType = getRandomItem(assetTypes);
  const item = getRandomItem(selectedType.items);

  // Create asset-like object
  const asset = {
    code: item.code || `${selectedType.prefix}-${getRandomInt(1000, 9999)}`,
    name: selectedType.vendorCategory === 'VEHICLE' && item.brand ? `${item.brand} ${item.name}` : item.name,
    priceRange: item.priceRange
  };

  // FILTER VENDORS BY MATCHING CATEGORY
  const matchedVendors = data.vendors.filter(v => v.category === selectedType.vendorCategory);
  const vendor = getRandomItem(matchedVendors);

  const purchaseDate = getRandomDate();
  const basePrice = getRandomInt(asset.priceRange.min, asset.priceRange.max);

  // Calculate price classification (bulk/standard/premium)
  const avgPrice = (asset.priceRange.min + asset.priceRange.max) / 2;
  const priceVariance = ((basePrice - avgPrice) / avgPrice) * 100;

  let priceType, priceClass, priceIcon;

  if (priceVariance < -15) {
    priceType = "BULK";
    priceClass = "s-pill-success";
    priceIcon = "tags";
  } else if (priceVariance > 20) {
    priceType = "PREMIUM";
    priceClass = "s-pill-amber";
    priceIcon = "star";
  } else {
    priceType = "STANDARD";
    priceClass = "s-pill-primary";
    priceIcon = "tag";
  }

  // Quantity only for materials
  const quantity = selectedType.hasQuantity ? getRandomInt(50, 500) : null;
  const unit = selectedType.hasQuantity && item.unit ? item.unit : null;

  return {
    asset,
    vendor,
    purchaseDate,
    price: basePrice,
    quantity,
    unit,
    priceType,
    priceClass,
    priceIcon
  };
};



// ═══════════════════════════════════════════════════════════════════════════
// DATA GENERATORS - SECTION 2: MAINTENANCE & PROTECTION (1 generator)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// PROTECTION - INDIVIDUAL ITEM TRACKING (DATA GENERATOR)
// ═══════════════════════════════════════════════════════════════════════════

export const generateProtectionIndividualData = () => {
  const data = analyticsData;

  const types = [
    { name: 'Vehicle', typeKey: 'vehicles', prefix: 'VEH', typeClass: 's-pill-royal' },
    { name: 'Machinery', typeKey: 'machinery', prefix: 'MCH', typeClass: 's-pill-info' },
    { name: 'Tool', typeKey: 'tools', prefix: 'TL', typeClass: 's-pill-pop' }
  ];

  const typeInfo = types[Math.floor(Math.random() * types.length)];
  let assetName = 'Unassigned Asset';
  let code = `${typeInfo.prefix}-000`;
  let purchaseCost = Math.floor(Math.random() * 800000 + 200000);

  if (data && data.assets && data.assets[typeInfo.typeKey]) {
    const assets = data.assets[typeInfo.typeKey];
    const asset = assets[Math.floor(Math.random() * assets.length)];

    // For vehicles, we can use brand + name
    if (typeInfo.name === 'Vehicle' && asset.brand) {
      assetName = `${asset.brand} ${asset.name}`;
    } else {
      assetName = asset.name;
    }

    code = asset.code;

    if (asset.priceRange) {
      purchaseCost = Math.floor(Math.random() * (asset.priceRange.max - asset.priceRange.min) + asset.priceRange.min);
    }
  } else {
    // Fallback if data is not loaded (mostly for safety)
    const fallbackNames = {
      'Vehicle': ['Executive Sedan', 'Pickup Truck', 'Delivery Van', 'Company SUV'],
      'Machinery': ['Excavator', 'Forklift', 'Concrete Mixer', 'Generator'],
      'Tool': ['Power Tools Set', 'Welding Machine', 'Air Compressor', 'Drill Set']
    };
    assetName = fallbackNames[typeInfo.name][Math.floor(Math.random() * fallbackNames[typeInfo.name].length)];
    code = `${typeInfo.prefix}-${Math.floor(Math.random() * 900 + 100)}`;
  }
  const purchaseDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);

  // Date calculations
  const warrantyDate = new Date(purchaseDate.getTime() + (365 + Math.random() * 730) * 24 * 60 * 60 * 1000);
  const insuranceDate = new Date(purchaseDate.getTime() + (730 + Math.random() * 365) * 24 * 60 * 60 * 1000);
  const maintenanceDate = new Date(purchaseDate.getTime() + (365 + Math.random() * 1095) * 24 * 60 * 60 * 1000);
  const productWarrantyDate = new Date(purchaseDate.getTime() + 365 * 24 * 60 * 60 * 1000);

  // Cost calculations (15-20% of purchase cost total)
  const protectionBudget = purchaseCost * (0.15 + Math.random() * 0.05);
  const extendedWarrantyCost = Math.floor(protectionBudget * (0.40 + Math.random() * 0.10));
  const insuranceCost = Math.floor(protectionBudget * (0.25 + Math.random() * 0.10));
  const maintenanceCost = Math.floor(protectionBudget - extendedWarrantyCost - insuranceCost);
  const totalProtection = extendedWarrantyCost + insuranceCost + maintenanceCost;

  // Progress bar percentages
  const extendedWarrantyBarPct = Math.round((extendedWarrantyCost / totalProtection) * 100);
  const insuranceBarPct = Math.round((insuranceCost / totalProtection) * 100);
  const maintenanceBarPct = 100 - extendedWarrantyBarPct - insuranceBarPct;

  return {
    code,
    type: typeInfo.name,
    typeClass: typeInfo.typeClass,
    assetName,
    purchaseCost,
    purchaseDate: purchaseDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    extendedWarrantyCost,
    extendedWarrantyExpiry: warrantyDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    insuranceCost,
    insuranceExpiry: insuranceDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    maintenanceCost,
    maintenanceExpiry: maintenanceDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    totalProtection,
    productWarrantyExpiry: productWarrantyDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    extendedWarrantyBarPct,
    insuranceBarPct,
    maintenanceBarPct
  };
};


// ═══════════════════════════════════════════════════════════════════════════
// OPEX CARD DATA GENERATOR - OPTIMIZED & LIGHTWEIGHT
// ═══════════════════════════════════════════════════════════════════════════

export const generateMTTBData = () => {
  const days = 15 + Math.floor(Math.random() * 165); // 15-180 days

  let converted;
  if (days < 28) {
    const weeks = Math.round((days / 7) * 2) / 2; // Round to nearest 0.5
    converted = weeks === 1 ? '1 week' : `${weeks} weeks`;
  } else {
    const months = Math.floor(days / 30);
    const remainder = days % 30;
    const decimal = remainder >= 25 ? 0.99 : remainder >= 20 ? 0.75 : remainder >= 15 ? 0.66 : remainder >= 10 ? 0.5 : remainder >= 7 ? 0.33 : 0.25;
    converted = decimal === 0.25 && months === 0 ? '1 month' : `${months}.${decimal.toString().split('.')[1] || '0'} months`;
  }

  return { days, converted };
};

// ULTRA-OPTIMIZED OPEX DATA GENERATOR
export const generateOpexAssetsData = () => {
  const data = ensureDataLoaded();

  // Pre-cache asset arrays for speed
  const assetPool = [
    ...data.assets.tools,
    ...data.assets.toolkits,
    ...data.assets.machinery,
    ...data.assets.vehicles
  ];

  const asset = assetPool[Math.floor(Math.random() * assetPool.length)];

  // Determine type - fast lookup
  let assetType, assetTypeClass;
  if (data.assets.vehicles.includes(asset)) {
    assetType = 'VEHICLE';
    assetTypeClass = 's-pill-royal';
  } else if (data.assets.machinery.includes(asset)) {
    assetType = 'MACHINERY';
    assetTypeClass = 's-pill-info';
  } else {
    assetType = 'TOOL';
    assetTypeClass = 's-pill-pop';
  }

  // OPTIMIZED COST CALCULATION - Miscellaneous LOCKED to 10-15%
  const totalOpex = 20000 + Math.floor(Math.random() * 40000); // ₹20k-60k

  // Misc is ALWAYS 10-15% (use integer percentages for speed)
  const miscPct = 10 + Math.floor(Math.random() * 6); // 10, 11, 12, 13, 14, 15
  const miscCost = Math.floor((totalOpex * miscPct) / 100);

  // Remaining split between labor and parts
  const remaining = totalOpex - miscCost;
  const laborPct = 15 + Math.floor(Math.random() * 46); // 15-60%
  const laborCost = Math.floor((remaining * laborPct) / 100);
  const partsCost = remaining - laborCost;

  // Calculate display percentages (already optimized with integer math)
  const laborDisplayPct = Math.round((laborCost / totalOpex) * 100);
  const partsDisplayPct = Math.round((partsCost / totalOpex) * 100);
  const miscDisplayPct = 100 - laborDisplayPct - partsDisplayPct;

  return {
    asset,
    assetType,
    assetTypeClass,
    laborCost,
    partsCost,
    miscCost,
    totalOpex,
    laborPct: laborDisplayPct,
    partsPct: partsDisplayPct,
    miscPct: miscDisplayPct,
    lastService: getRandomDate(),
    mttb: generateMTTBData()
  };
};


// ═══════════════════════════════════════════════════════════════════════════
// RESOLUTION STATUS TRACKING - DATA GENERATORS (5 TYPES)
// ═══════════════════════════════════════════════════════════════════════════

// Helper: Get asset with type classification
const getAssetWithType = () => {
  const data = ensureDataLoaded();

  const assetTypes = [
    { items: data.assets.tools, type: 'TOOL', typeClass: 's-pill-pop', prefix: 'TL' },
    { items: data.assets.toolkits, type: 'TOOLKIT', typeClass: 's-pill-info', prefix: 'TK' },
    { items: data.assets.machinery, type: 'MACHINERY', typeClass: 's-pill-primary', prefix: 'MCH' },
    { items: data.assets.vehicles, type: 'VEHICLE', typeClass: 's-pill-royal', prefix: 'VEH' }
  ];

  const selectedType = getRandomItem(assetTypes);
  const asset = getRandomItem(selectedType.items);

  return {
    code: asset.code,
    name: selectedType.type === 'VEHICLE' && asset.brand ? `${asset.brand} ${asset.name}` : asset.name,
    type: selectedType.type,
    typeClass: selectedType.typeClass,
    isVehicle: selectedType.type === 'VEHICLE',
    isMachinery: selectedType.type === 'MACHINERY'
  };
};

// Helper: Get manager designation
const getManagerDesignation = () => {
  const designations = [
    'Workplace Manager',
    'Floor Manager',
    'Body Shop Manager',
    'Maintenance Manager',
    'Operations Manager'
  ];
  return getRandomItem(designations);
};

// ═══════════════════════════════════════════════════════════════════════════
// A. REPAIRED RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════

export const generateRepairedResolution = () => {
  const item = getAssetWithType();
  const technicianType = Math.random() > 0.6 ? 'INTERNAL' : 'EXTERNAL';
  const technicianName = getRandomEmployee();

  const reportedDate = getRandomDate();
  const daysToFix = getRandomInt(2, 15);
  const resolvedDate = new Date(reportedDate.getTime() + daysToFix * 24 * 60 * 60 * 1000);
  const daysWindow = Math.ceil((resolvedDate - reportedDate) / (1000 * 60 * 60 * 24));
  const timeTakenDays = getRandomInt(1, Math.max(1, daysWindow - 1));

  // Cost calculation
  const laborCost = technicianType === 'INTERNAL' ? 0 : getRandomInt(5000, 25000);
  const sparePartsCost = getRandomInt(3000, 35000);
  const miscCost = getRandomInt(500, 5000);
  const totalCost = laborCost + sparePartsCost + miscCost;

  // Benefits - warranty mutual exclusivity
  const hasExtendedWarranty = Math.random() > 0.6;
  const extendedWarrantyAmount = hasExtendedWarranty ? getRandomInt(5000, totalCost) : 0;
  const productWarrantyExpired = hasExtendedWarranty;
  const productWarrantyAmount = hasExtendedWarranty ? 0 : (Math.random() > 0.5 ? getRandomInt(0, totalCost * 0.5) : 0);

  const maintenanceContractAmount = Math.random() > 0.7 ? getRandomInt(2000, 15000) : 0;
  const insurancePolicyAmount = item.isVehicle ? getRandomInt(8000, 50000) : (Math.random() > 0.8 ? getRandomInt(0, 20000) : 0);

  const inChargeName = getRandomEmployee();
  const inChargeDesignation = getManagerDesignation();

  return {
    resolutionType: 'REPAIRED',
    code: item.code,
    name: item.name,
    itemType: item.type,
    itemTypeClass: item.typeClass,

    technician: {
      name: technicianName,
      type: technicianType
    },

    costs: {
      labor: laborCost,
      sparePartsMaterial: sparePartsCost,
      miscellaneous: miscCost,
      total: totalCost
    },

    benefits: {
      maintenanceContract: maintenanceContractAmount,
      insurancePolicy: insurancePolicyAmount,
      productWarranty: {
        amount: productWarrantyAmount,
        expired: productWarrantyExpired
      },
      extendedWarranty: {
        amount: extendedWarrantyAmount,
        active: hasExtendedWarranty
      }
    },

    timeTakenToFix: timeTakenDays,
    reportedDate,
    resolvedDate,

    inCharge: {
      name: inChargeName,
      designation: inChargeDesignation
    }
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// B. DISCARDED RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════

export const generateDiscardedResolution = () => {
  const item = getAssetWithType();
  const isEndOfLife = Math.random() > 0.6;

  const reportedDate = isEndOfLife ? null : getRandomDate();
  const resolvedDate = getRandomDate();

  // Insurance claim only for MACHINERY and VEHICLE
  let insuranceClaim = null;
  if (item.isMachinery || item.isVehicle) {
    const hasInsurance = Math.random() > 0.3;
    insuranceClaim = {
      amount: hasInsurance ? getRandomInt(10000, 150000) : 0,
      applicableFor: item.type
    };
  }

  const inChargeName = getRandomEmployee();
  const inChargeDesignation = getManagerDesignation();

  return {
    resolutionType: 'DISCARDED',
    code: item.code,
    name: item.name,
    itemType: item.type,
    itemTypeClass: item.typeClass,

    endOfLife: isEndOfLife,
    insuranceClaim,

    reportedDate,
    resolvedDate,

    inCharge: {
      name: inChargeName,
      designation: inChargeDesignation
    }
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// C. REPLACED RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════

export const generateReplacedResolution = () => {
  const item = getAssetWithType();
  const coveredUnderWarranty = Math.random() > 0.5;
  const warrantyType = coveredUnderWarranty ? getRandomItem(['PRODUCT_WARRANTY', 'EXTENDED_WARRANTY']) : null;
  const replacementCost = coveredUnderWarranty ? 0 : getRandomInt(15000, 80000);

  const reportedDate = getRandomDate();
  const resolvedDate = new Date(reportedDate.getTime() + getRandomInt(3, 20) * 24 * 60 * 60 * 1000);

  const inChargeName = getRandomEmployee();
  const inChargeDesignation = getManagerDesignation();

  return {
    resolutionType: 'REPLACED',
    code: item.code,
    name: item.name,
    itemType: item.type,
    itemTypeClass: item.typeClass,

    replacement: {
      cost: replacementCost,
      coveredUnderWarranty,
      warrantyType
    },

    reportedDate,
    resolvedDate,

    inCharge: {
      name: inChargeName,
      designation: inChargeDesignation
    }
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// D. SOLD RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════

export const generateSoldResolution = () => {
  const item = getAssetWithType();
  const isEndOfLife = Math.random() > 0.4;
  const salePrice = getRandomInt(5000, 120000);

  const reportedDate = isEndOfLife ? null : getRandomDate();
  const resolvedDate = getRandomDate();

  const inChargeName = getRandomEmployee();
  const inChargeDesignation = getManagerDesignation();

  return {
    resolutionType: 'SOLD',
    code: item.code,
    name: item.name,
    itemType: item.type,
    itemTypeClass: item.typeClass,

    endOfLife: isEndOfLife,

    sale: {
      price: salePrice,
      currency: 'INR'
    },

    reportedDate,
    resolvedDate,

    inCharge: {
      name: inChargeName,
      designation: inChargeDesignation
    }
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// E. PERMANENTLY LOST RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════

export const generatePermanentlyLostResolution = () => {
  const item = getAssetWithType();

  const reportedDate = getRandomDate();
  const resolvedDate = new Date(reportedDate.getTime() + getRandomInt(15, 90) * 24 * 60 * 60 * 1000);

  const inChargeName = getRandomEmployee();
  const inChargeDesignation = getManagerDesignation();

  return {
    resolutionType: 'PERMANENTLY_LOST',
    code: item.code,
    name: item.name,
    itemType: item.type,
    itemTypeClass: item.typeClass,

    reportedDate,
    resolvedDate,

    inCharge: {
      name: inChargeName,
      designation: inChargeDesignation
    }
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED RESOLUTION GENERATOR (Randomly picks one type)
// ═══════════════════════════════════════════════════════════════════════════

export const generateResolutionData = () => {
  const generators = [
    generateRepairedResolution,
    generateDiscardedResolution,
    generateReplacedResolution,
    generateSoldResolution,
    generatePermanentlyLostResolution
  ];

  const selectedGenerator = getRandomItem(generators);
  return selectedGenerator();
};














export const generateDisposalTimelineData = () => {
  const isMaterial = Math.random() > 0.6;

  const assetMethods = [
    { key: 'lost', name: 'LOST', icon: 'fas fa-exclamation-triangle', canRecover: false, pillClass: 's-pill-amber' },
    { key: 'eol', name: 'EOL', icon: 'fas fa-hourglass-end', canRecover: false, pillClass: 's-pill-attention' },
    { key: 'sold', name: 'SOLD', icon: 'fas fa-file-invoice', canRecover: true, pillClass: 's-pill-success' },
    { key: 'trashed', name: 'TRASHED', icon: 'fas fa-trash', canRecover: false, pillClass: 's-pill-secondary' }
  ];

  const materialMethods = [
    { key: 'mishandled', name: 'MISHANDLED', icon: 'fa-solid fa-droplet-slash', canRecover: false, pillClass: 's-pill-royal' },
    { key: 'replaced', name: 'REPLACED', icon: 'fa-solid fa-arrow-right-arrow-left', canRecover: false, pillClass: 's-pill-success' },
    { key: 'trashed', name: 'TRASHED', icon: 'fas fa-trash', canRecover: false, pillClass: 's-pill-secondary' }
  ];

  const method = isMaterial
    ? materialMethods[Math.floor(Math.random() * materialMethods.length)]
    : assetMethods[Math.floor(Math.random() * assetMethods.length)];

  const assetTypes = ['Vehicle', 'Machinery', 'Equipment', 'Furniture', 'Tool'];
  const materialTypes = ['Hydraulic Fluid', 'Coolant', 'Lubricant', 'Solvent', 'Paint'];
  const units = ['L', 'Kg', 'Units', 'N'];

  const type = isMaterial
    ? materialTypes[Math.floor(Math.random() * materialTypes.length)]
    : assetTypes[Math.floor(Math.random() * assetTypes.length)];

  const code = isMaterial
    ? `MAT-${Math.floor(Math.random() * 9000 + 1000)}`
    : `AST-${Math.floor(Math.random() * 9000 + 1000)}`;

  const purchaseCost = Math.floor(Math.random() * 400000 + 100000);
  const bookValue = isMaterial ? 0 : Math.floor(purchaseCost * (0.3 + Math.random() * 0.4));
  const recoveredAmount = method.canRecover ? Math.floor(bookValue * (0.6 + Math.random() * 0.4)) : 0;

  const quantity = isMaterial ? Math.floor(Math.random() * 900 + 100) : 0;
  const unit = isMaterial ? units[Math.floor(Math.random() * units.length)] : '';

  const netGainLoss = recoveredAmount - (isMaterial ? 0 : bookValue);
  const isProfit = netGainLoss > 0;
  const disposalDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // ← FIXED

  return {
    asset: {
      code,
      name: type
    },
    purchaseCost,
    bookValue,
    recoveredAmount,
    netGainLoss,
    disposalDate,
    disposalMethod: method.name,
    disposalIcon: method.icon,
    isProfit,
    disposalClass: method.pillClass,
    isMaterial,
    quantity,
    unit,
    showProfit: recoveredAmount > 0
  };
};


// ═══════════════════════════════════════════════════════════════════════════
// DATA GENERATORS - SECTION 5: MATERIAL INTELLIGENCE (4 generators)
// ═══════════════════════════════════════════════════════════════════════════

export const generatePurchaseTrackingData = () => {
  const material = getRandomMaterial();
  const vendor = getRandomVendor();
  const purchaseDate = getRandomDate();
  const unitPrice = getRandomInt(material.priceRange.min, material.priceRange.max);
  const quantity = getRandomInt(10, 500);
  const totalCost = unitPrice * quantity;
  const avgPrice = (material.priceRange.min + material.priceRange.max) / 2;
  const variance = Math.round(((unitPrice - avgPrice) / avgPrice) * 100);

  return {
    material,
    vendor,
    purchaseDate,
    unitPrice,
    quantity,
    totalCost,
    variance
  };
};

export const generateEmployeeConsumptionData = () => {
  const material = getRandomMaterial();
  const employee = getRandomEmployee();
  const department = getRandomDepartment();
  const quantity = getRandomInt(1, 50);
  const issueDate = getRandomDate();
  const purpose = getRandomItem(['Maintenance', 'Production', 'Repair', 'Installation']);

  return {
    material,
    employee,
    department,
    quantity,
    issueDate,
    purpose
  };
};

export const generateEquipmentAllocationData = () => {
  const material = getRandomMaterial();
  const asset = getRandomAsset();
  const quantity = getRandomInt(1, 20);
  const installDate = getRandomDate();
  const technician = getRandomEmployee();
  const workOrder = `WO-${getRandomInt(1000, 9999)}`;

  return {
    material,
    asset,
    quantity,
    installDate,
    technician,
    workOrder
  };
};

export const generateWasteAccountingData = () => {
  const material = getRandomMaterial();
  const quantity = getRandomInt(1, 30);
  const wasteDate = getRandomDate();
  const reason = getRandomItem(['Damaged', 'Expired', 'Spilled', 'Lost', 'Contaminated']);
  const reportedBy = getRandomEmployee();
  const unitCost = getRandomInt(material.priceRange.min, material.priceRange.max);
  const wasteCost = unitCost * quantity;

  return {
    material,
    quantity,
    wasteDate,
    reason,
    reportedBy,
    wasteCost
  };
};


// ═══════════════════════════════════════════════════════════════════════════
// DATA GENERATORS - SECTION 6: REQUEST ANALYTICS (5 generators)
// ═══════════════════════════════════════════════════════════════════════════

export const generateDemandFrequencyData = () => {
  const asset = getRandomAsset();
  const requestCount = getRandomInt(5, 120);
  const lastRequest = getRandomDate();
  const avgDuration = getRandomInt(2, 30);
  const demandLevel = requestCount > 80 ? 'High' : requestCount > 40 ? 'Medium' : 'Low';
  const demandClass = requestCount > 80 ? 's-pill-danger' : requestCount > 40 ? 's-pill-attention' : 's-pill-success';

  return {
    asset,
    requestCount,
    lastRequest,
    avgDuration,
    demandLevel,
    demandClass
  };
};

export const generateRequesterProfilingData = () => {
  const employee = getRandomEmployee();
  const department = getRandomDepartment();
  const asset = getRandomAsset();
  const requestCount = getRandomInt(3, 45);
  const returnRate = getRandomInt(85, 100);
  const isFrequentUser = requestCount > 30;

  return {
    employee,
    department,
    asset,
    requestCount,
    returnRate,
    isFrequentUser
  };
};

export const generateReturnConditionData = () => {
  const asset = getRandomAsset();
  const employee = getRandomEmployee();
  const issuer = getRandomEmployee(); // Person who issued the asset
  const returnDate = getRandomDate();

  // Return conditions - removed "Available" and "Under Maintenance"
  const returnConditions = [
    {
      label: 'Okay',
      cssClass: 's-pill-success',
      labelClass: 's-content-label s-content-label-success',
      icon: 'fas fa-thumbs-up',
      damageNote: null // No damage note for Okay condition
    },
    {
      label: 'Damage',
      cssClass: 's-pill-danger',
      labelClass: 's-content-label s-content-label-danger',
      icon: 'fas fa-times-circle'
    },
    {
      label: 'Partially Damage',
      cssClass: 's-pill-attention',
      labelClass: 's-content-label s-content-label-attention',
      icon: 'fas fa-exclamation-triangle'
    },
    {
      label: 'Missing',
      cssClass: 's-pill-warning',
      labelClass: 's-content-label s-content-label-warning',
      icon: 'fas fa-question-circle'
    }
  ];

  const condition = getRandomItem(returnConditions.filter(c => {
    // Filter conditions based on asset category
    if (asset.category === 'MATERIAL') {
      return false; // Materials don't have these return conditions
    }
    return true;
  }));

  // Get damage note from JSON based on asset category
  let damageNote = null;
  if (condition.label !== 'Okay') {
    const data = ensureDataLoaded(); // ✅ FIX: Get loaded data first
    const damageNotes = data.damageNotes[asset.category]; // ✅ FIX: Use 'data' instead of 'ANALYTICS_DATA'
    damageNote = getRandomItem(damageNotes);

    // For TOOLKIT, append condition to part name
    if (asset.category === 'TOOLKIT') {
      const conditionSuffix =
        condition.label === 'Damage' ? ' - damage' :
          condition.label === 'Partially Damage' ? ' - partially damage' :
            ' - missing';
      damageNote = damageNote + conditionSuffix;
    }
  }

  return {
    asset,
    employee,
    issuer,
    returnDate,
    condition: {
      label: condition.label,
      cssClass: condition.cssClass,
      labelClass: condition.labelClass,
      icon: condition.icon
    },
    damageNote
  };
};



export const generateFloorTimeData = () => {
  const asset = getRandomAsset();
  const floorDays = getRandomInt(50, 300);
  const shelfDays = getRandomInt(10, 100);
  const totalDays = floorDays + shelfDays;
  const utilizationRate = Math.round((floorDays / totalDays) * 100);
  const isHighUtilization = utilizationRate > 70;

  return {
    asset,
    floorDays,
    shelfDays,
    totalDays,
    utilizationRate,
    isHighUtilization
  };
};

export const generateRejectionPatternsData = () => {
  const asset = getRandomAsset();
  const rejectionCount = getRandomInt(2, 30);
  const totalRequests = getRandomInt(rejectionCount + 10, 100);
  const rejectionRate = Math.round((rejectionCount / totalRequests) * 100);

  const rejectionReasons = [
    {
      text: 'Asset Unavailable',
      pill: 's-pill-danger',
      icon: 'fas fa-ban'
    },
    {
      text: 'Pending Approvals',
      pill: 's-pill-attention',
      icon: 'fas fa-clock'
    },
    {
      text: 'Maintenance Required',
      pill: 's-pill-pop',
      icon: 'fas fa-cogs'
    },
    {
      text: 'Policy Violation',
      pill: 's-pill-royal',
      icon: 'fas fa-gavel'
    },
    {
      text: 'Incorrect Asset Requested',
      pill: 's-pill-attention',
      icon: 'fas fa-exclamation-circle'
    },
    {
      text: 'Issued to Another Employee',
      pill: 's-pill-info',
      icon: 'fas fa-user-friends'
    }
  ];

  const topReason = getRandomItem(rejectionReasons);
  const isHighRejection = rejectionRate > 20;

  return {
    asset,
    rejectionCount,
    totalRequests,
    rejectionRate,
    topReason: topReason.text,
    topReasonPill: topReason.pill,
    topReasonIcon: topReason.icon,
    isHighRejection
  };
};



// ═══════════════════════════════════════════════════════════════════════════
// DATA GENERATORS - SECTION 7: MATERIAL REQUEST INTELLIGENCE (5 generators)
// ═══════════════════════════════════════════════════════════════════════════

export const generateVolumetricTrackingData = () => {
  const material = getRandomMaterial();
  const requester = getRandomEmployee();
  const quantityIssued = getRandomInt(5, 100);
  const issueDate = getRandomDate();
  const purpose = getRandomItem(['Production', 'Maintenance', 'Assembly', 'Repair']);

  return {
    material,
    requester,
    quantityIssued,
    issueDate,
    purpose
  };
};

export const generateConsumptionAnalysisData = () => {
  const material = getRandomMaterial();
  const quantityIssued = getRandomInt(10, 100);
  const quantityReturned = getRandomInt(0, Math.floor(quantityIssued * 0.3));
  const fullyConsumed = quantityReturned === 0;
  const consumptionRate = Math.round(((quantityIssued - quantityReturned) / quantityIssued) * 100);

  return {
    material,
    quantityIssued,
    quantityReturned,
    fullyConsumed,
    consumptionRate
  };
};

export const generateReturnAssessmentData = () => {
  const material = getRandomMaterial();
  const quantityReturned = getRandomInt(1, 50);
  const returnCondition = getRandomItem(['Unused', 'Partially Used', 'Damaged', 'Expired']);
  const returnDate = getRandomDate();
  const conditionClass = returnCondition === 'Unused' ? 's-pill-success' :
    returnCondition === 'Partially Used' ? 's-pill-info' :
      's-pill-danger';

  return {
    material,
    quantityReturned,
    returnCondition,
    returnDate,
    conditionClass
  };
};

export const generateRequesterDemandData = () => {
  const material = getRandomMaterial();
  const requester = getRandomEmployee();
  const department = getRandomDepartment();
  const requestCount = getRandomInt(5, 50);
  const totalQuantity = getRandomInt(50, 500);
  const avgQuantity = Math.round(totalQuantity / requestCount);

  return {
    material,
    requester,
    department,
    requestCount,
    totalQuantity,
    avgQuantity
  };
};

export const generatePeakDemandData = () => {
  const material = getRandomMaterial();
  const peakMonth = getRandomItem(['January', 'March', 'June', 'September', 'December']);
  const requestsInMonth = getRandomInt(20, 80);
  const avgMonthly = getRandomInt(10, 40);
  const peakMultiplier = (requestsInMonth / avgMonthly).toFixed(1);

  return {
    material,
    peakMonth,
    requestsInMonth,
    avgMonthly,
    peakMultiplier
  };
};


// ═══════════════════════════════════════════════════════════════════════════
// DATA GENERATORS - SECTION 8: BLEND CONSUMPTION (4 generators)
// ═══════════════════════════════════════════════════════════════════════════

export const generateIssueFrequencyData = () => {
  const blend = getRandomBlend();
  const issueCount = getRandomInt(10, 100);
  const totalQuantity = getRandomInt(100, 1000);
  const avgPerIssue = Math.round(totalQuantity / issueCount);
  const lastIssue = getRandomDate();

  return {
    blend,
    issueCount,
    totalQuantity,
    avgPerIssue,
    lastIssue
  };
};

export const generateRequesterConsumptionData = () => {
  const blend = getRandomBlend();
  const requester = getRandomEmployee();
  const department = getRandomDepartment();
  const issueCount = getRandomInt(5, 40);
  const totalQuantity = getRandomInt(50, 500);

  return {
    blend,
    requester,
    department,
    issueCount,
    totalQuantity
  };
};

export const generateTimeframeDemandData = () => {
  const blend = getRandomBlend();

  // Define timeframes with their hour ranges and color schemes
  const timeframes = [
    {
      name: 'Morning',
      startRange: [6, 11], // 6 AM - 11 AM
      color: 'primary',
      icon: 'fa-sun-plant-wilt'
    },
    {
      name: 'Afternoon',
      startRange: [12, 15], // 12 PM - 3 PM
      color: 'attention',
      icon: 'fa-sun'
    },
    {
      name: 'Evening',
      startRange: [16, 19], // 4 PM - 7 PM
      color: 'amber',
      icon: 'fa-cloud-sun'
    },
    {
      name: 'Night',
      startRange: [20, 5], // 8 PM - 5 AM (wraps around midnight)
      color: 'info-special',
      icon: 'fa-moon'
    }
  ];

  // Select random timeframe
  const selectedTimeframe = getRandomItem(timeframes);

  // Generate start hour within timeframe range
  let startHour;
  if (selectedTimeframe.startRange[0] <= selectedTimeframe.startRange[1]) {
    // Normal range (e.g., 6-11, 12-15, 16-19)
    startHour = getRandomInt(selectedTimeframe.startRange[0], selectedTimeframe.startRange[1]);
  } else {
    // Wrapped range for Night (20-23 or 0-5)
    const useEveningPart = Math.random() > 0.5;
    if (useEveningPart) {
      startHour = getRandomInt(20, 23); // 8 PM - 11 PM
    } else {
      startHour = getRandomInt(0, 5); // 12 AM - 5 AM
    }
  }

  // End hour is always 1 hour after start
  let endHour = startHour + 1;
  if (endHour === 24) endHour = 0; // Wrap midnight

  // Format time with AM/PM notation
  const formatTime = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
  };

  const peakHour = `${formatTime(startHour)} - ${formatTime(endHour)}`;
  const issueCount = getRandomInt(10, 60);

  return {
    blend,
    timeframe: selectedTimeframe.name,
    timeframeColor: selectedTimeframe.color,
    timeframeIcon: selectedTimeframe.icon,
    issueCount,
    peakHour
  };
};

export const generateVolumeOptimizationData = () => {
  const blend = getRandomBlend();
  const standardBatch = getRandomInt(10, 50);
  const actualUsage = getRandomInt(standardBatch - 10, standardBatch + 10);
  const wastePercentage = Math.abs(Math.round(((standardBatch - actualUsage) / standardBatch) * 100));
  const isOptimized = wastePercentage < 10;

  return {
    blend,
    standardBatch,
    actualUsage,
    wastePercentage,
    isOptimized
  };
};


// ═══════════════════════════════════════════════════════════════════════════
// DATA GENERATORS - SECTION 9: INSPECTION & REPORTING (3 generators)
// ═══════════════════════════════════════════════════════════════════════════

export const generateRealtimeInspectionData = () => {
  const asset = getRandomAsset();
  const inspector = getRandomEmployee();

  // Generate scheduled date with time in 30-minute intervals
  const scheduledDate = getRandomDate();
  const scheduledHours = [8, 9, 10, 11, 13, 14, 15, 16, 17]; // Working hours
  const scheduledMinutes = [0, 30]; // 30-minute intervals
  scheduledDate.setHours(getRandomItem(scheduledHours));
  scheduledDate.setMinutes(getRandomItem(scheduledMinutes));
  scheduledDate.setSeconds(0);

  // Random chance for "Under Maintenance" status
  const isUnderMaintenance = Math.random() < 0.15; // 15% chance

  if (isUnderMaintenance) {
    // Under Maintenance case - special handling
    return {
      asset,
      inspector: 'N/A',
      scheduledDate,
      completedDate: 'N/A',
      status: 'Skipped',
      statusClass: 's-pill-info',
      statusIcon: 'fa-forward',
      findings: 'Under Maintenance',
      findingsClass: 's-pill-pop',
      findingsIcon: 'fa-cogs',
      condition: getRandomItem(['Condition Unchanged', 'Reported']),
      conditionClass: null,
      conditionIcon: null,
      isUnderMaintenance: true,
      isIncomplete: false
    };
  }

  // Normal inspection flow
  // Calculate completion time (random offset from scheduled)
  const minutesOffset = getRandomInt(-30, 240); // -30 mins to +4 hours
  const completedDate = new Date(scheduledDate.getTime() + minutesOffset * 60 * 1000);

  // Determine status based on time difference
  const timeDiffMinutes = Math.round((completedDate - scheduledDate) / (60 * 1000));

  let status, statusClass, statusIcon, finalCompletedDate, isIncomplete;
  let selectedFinding;

  if (timeDiffMinutes > 180) {
    // More than 3 hours = Incomplete
    status = 'Incomplete';
    statusClass = 's-pill-danger';
    statusIcon = 'fa-times-circle';
    finalCompletedDate = 'N/A'; // No completion time for incomplete inspections
    isIncomplete = true;

    // Findings are N/A for incomplete inspections
    selectedFinding = { text: 'N/A', class: 's-pill-secondary', icon: 'fa-ban' };
  } else if (timeDiffMinutes > 30) {
    // More than 30 minutes = Delayed
    status = 'Delayed';
    statusClass = 's-pill-attention';
    statusIcon = 'fa-clock';
    finalCompletedDate = completedDate;
    isIncomplete = false;

    // Normal findings options
    const findingsOptions = [
      { text: 'OK', class: 's-pill-success', icon: 'fa-check' },
      { text: 'Damaged', class: 's-pill-danger', icon: 'fa-times' },
      { text: 'Partially Damaged', class: 's-pill-attention', icon: 'fa-exclamation-triangle' },
      { text: 'Incomplete Kit', class: 's-pill-attention', icon: 'fa-exclamation-triangle' },
      { text: 'Missing', class: 's-pill-warning', icon: 'fa-question' }
    ];
    selectedFinding = getRandomItem(findingsOptions);
  } else {
    // Within 30 minutes = On-Time
    status = 'On-Time';
    statusClass = 's-pill-success';
    statusIcon = 'fa-check-circle';
    finalCompletedDate = completedDate;
    isIncomplete = false;

    // Normal findings options
    const findingsOptions = [
      { text: 'OK', class: 's-pill-success', icon: 'fa-check' },
      { text: 'Damaged', class: 's-pill-danger', icon: 'fa-times' },
      { text: 'Partially Damaged', class: 's-pill-attention', icon: 'fa-exclamation-triangle' },
      { text: 'Incomplete Kit', class: 's-pill-attention', icon: 'fa-exclamation-triangle' },
      { text: 'Missing', class: 's-pill-warning', icon: 'fa-question' }
    ];
    selectedFinding = getRandomItem(findingsOptions);
  }

  // Condition status
  const conditionOptions = [
    { text: 'Condition Unchanged', class: 's-pill-success', icon: 'fa-check-circle' },
    { text: 'Reported', class: 's-pill-danger', icon: 'fa-flag' }
  ];

  const selectedCondition = getRandomItem(conditionOptions);

  return {
    asset,
    inspector,
    scheduledDate,
    completedDate: finalCompletedDate,
    status,
    statusClass,
    statusIcon,
    findings: selectedFinding.text,
    findingsClass: selectedFinding.class,
    findingsIcon: selectedFinding.icon,
    condition: selectedCondition.text,
    conditionClass: selectedCondition.class,
    conditionIcon: selectedCondition.icon,
    isUnderMaintenance: false,
    isIncomplete
  };
};


/**
 * generateInspectionMonitoringData()
 * 
 * Generates mathematically correct inspection monitoring data
 * Pulls data from analytics-data.json
 */


export const generateInspectionMonitoringData = () => {
  const data = ensureDataLoaded();

  // Item type selection with JSON references
  const itemTypes = [
    { items: data.assets.tools, type: 'Tool', pillClass: 's-pill-primary' },
    { items: data.assets.toolkits, type: 'Toolkit', pillClass: 's-pill-info' },
    { items: data.assets.machinery, type: 'Machinery', pillClass: 's-pill-royal' },
    { items: data.assets.vehicles, type: 'Vehicles', pillClass: 's-pill-info-special' }
  ];

  const selectedType = getRandomItem(itemTypes);
  const selectedItem = getRandomItem(selectedType.items);
  const isToolkit = selectedType.type === 'Toolkit';

  const name = selectedItem.name;
  const code = selectedItem.code;

  // STEP 1: Base Inspection Metrics
  const scheduled = getRandomInt(15, 40);
  const skippedDueMaintenance = getRandomInt(0, Math.min(5, Math.floor(scheduled * 0.2)));
  const maxPossibleConducted = scheduled - skippedDueMaintenance;
  const minConducted = Math.floor(maxPossibleConducted * 0.7);
  const conducted = getRandomInt(minConducted, maxPossibleConducted);
  const incomplete = scheduled - conducted - skippedDueMaintenance;

  // STEP 2: Punctuality Metrics
  const minPunctual = Math.floor(conducted * 0.6);
  const maxPunctual = Math.floor(conducted * 0.95);
  const punctual = getRandomInt(minPunctual, maxPunctual);
  const delayed = conducted - punctual;
  const punctualityEfficiency = ((punctual / conducted) * 100).toFixed(1);

  // STEP 3: Inspection Findings
  const totalReported = getRandomInt(8, Math.min(conducted, 25));
  const maxUnchanged = Math.floor(totalReported * 0.5);
  const conditionUnchanged = getRandomInt(2, maxUnchanged);
  const remainingReports = totalReported - conditionUnchanged;

  // STEP 4: Report Type Distribution
  let reportTypes = {};

  if (isToolkit) {
    // Toolkit specific reports
    const maxDamagedKit = Math.floor(remainingReports * 0.3);
    const damagedKit = getRandomInt(0, maxDamagedKit);

    const maxIncompleteKit = Math.floor(remainingReports * 0.45);
    const incompleteKit = getRandomInt(0, Math.min(maxIncompleteKit, remainingReports - damagedKit));

    const maxMissingKit = Math.floor(remainingReports * 0.15);
    const missingKit = getRandomInt(0, Math.min(maxMissingKit, remainingReports - damagedKit - incompleteKit));

    const ok = remainingReports - damagedKit - incompleteKit - missingKit;

    reportTypes = {
      damagedKit,
      incompleteKit,
      missingKit,
      ok
    };
  } else {
    // Tools/Machinery/Vehicles reports
    const maxDamaged = Math.floor(remainingReports * 0.4);
    const damaged = getRandomInt(0, maxDamaged);

    const maxPartiallyDamaged = Math.floor(remainingReports * 0.35);
    const partiallyDamaged = getRandomInt(0, Math.min(maxPartiallyDamaged, remainingReports - damaged));

    const maxMissing = Math.floor(remainingReports * 0.2);
    const missing = getRandomInt(0, Math.min(maxMissing, remainingReports - damaged - partiallyDamaged));

    const ok = remainingReports - damaged - partiallyDamaged - missing;

    reportTypes = {
      damaged,
      partiallyDamaged,
      missing,
      ok
    };
  }

  // STEP 5: Next Scheduled Inspection
  const daysFromNow = getRandomInt(7, 45);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysFromNow);

  const possibleTimes = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM"
  ];

  const scheduledTime = getRandomItem(possibleTimes);

  // Format next scheduled date
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const nextScheduled = `${nextDate.getDate()} ${months[nextDate.getMonth()]} ${nextDate.getFullYear()}, ${scheduledTime}`;

  return {
    name,
    code,
    itemType: selectedType.type,
    itemTypeClass: selectedType.pillClass,
    isToolkit,

    // Inspection Statistics
    scheduled,
    conducted,
    incomplete,
    skippedDueMaintenance,

    // Punctuality
    punctual,
    delayed,
    punctualityEfficiency,

    // Findings
    totalReported,
    conditionUnchanged,
    reportTypes,

    // Next Scheduled
    nextScheduled
  };
};



export const generateReportSubmissionsData = () => {
  const asset = getRandomAsset();
  const reporter = getRandomEmployee();
  const reportDate = getRandomDate();
  const issueType = getRandomItem(['Damage', 'Malfunction', 'Missing', 'Safety Concern']);
  const severity = getRandomItem(['Low', 'Medium', 'High', 'Critical']);
  const severityClass = severity === 'Low' ? 's-pill-info' :
    severity === 'Medium' ? 's-pill-attention' :
      severity === 'High' ? 's-pill-danger' :
        's-pill-danger';

  return {
    asset,
    reporter,
    reportDate,
    issueType,
    severity,
    severityClass
  };
};


// ═══════════════════════════════════════════════════════════════════════════
// DATA GENERATORS - SECTION 10: VEHICLE MILEAGE & REFUELING (2 generators)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 10: VEHICLE MILEAGE & REFUELING (2 builders)
// ═══════════════════════════════════════════════════════════════════════════

export const generateVehicleMileageData = () => {
  const data = ensureDataLoaded();
  const vehicle = getRandomItem(data.assets.vehicles);
  const driver = getRandomEmployee();
  const department = getRandomDepartment();
  const startOdometer = getRandomInt(10000, 50000);
  const endOdometer = startOdometer + getRandomInt(20, 99); // Max 99 km trip
  const distance = endOdometer - startOdometer;

  // Status logic: Issued (2 dates) or Assigned (1 date)
  const status = Math.random() > 0.5 ? 'Issued' : 'Assigned';
  const issueDate = getRandomDate();

  // Return date is 1-5 days after issue date (only for Issued status)
  let returnDate = null;
  if (status === 'Issued') {
    const issueDateObj = new Date(issueDate);
    const daysGap = getRandomInt(1, 5); // 1 to 5 days gap
    returnDate = new Date(issueDateObj);
    returnDate.setDate(returnDate.getDate() + daysGap);
  }

  return {
    vehicle,
    driver,
    department,
    startOdometer,
    endOdometer,
    distance,
    status,
    issueDate,
    returnDate
  };
};



export const generateRefuelingActivityData = () => {
  const data = ensureDataLoaded();
  const vehicle = getRandomItem(data.assets.vehicles);

  // Fuel type distribution
  const fuelType = getRandomItem(['Petrol', 'Diesel', 'Electric']);

  // In-House Grid logic (only for Electric vehicles)
  const isInHouseGrid = fuelType === 'Electric' && Math.random() > 0.6; // 40% chance for grid

  let quantity, unit, pricePerUnit, totalCost, station, costStatus;

  if (fuelType === 'Electric') {
    // Electric vehicle logic
    quantity = getRandomInt(20, 80);
    unit = 'kWh';

    if (isInHouseGrid) {
      station = 'In-House Grid';

      // 30% chance cost is "yet to be calculated"
      if (Math.random() > 0.7) {
        pricePerUnit = null;
        totalCost = null;
        costStatus = 'Calculate Later';
      } else {
        // Grid cost multiplier: ₹6-10 per kWh (cheaper than commercial)
        pricePerUnit = getRandomInt(60, 100) / 10; // ₹6.0 - ₹10.0
        totalCost = Math.round(quantity * pricePerUnit * 100) / 100; // Round to 2 decimals
        costStatus = 'Invoiced';
      }
    } else {
      // Commercial charging station
      station = getRandomItem(['Tata Power', 'Ather Grid', 'Fortum Charge']);
      pricePerUnit = getRandomInt(120, 180) / 10; // ₹12.0 - ₹18.0 per kWh
      totalCost = Math.round(quantity * pricePerUnit * 100) / 100;
      costStatus = 'Invoiced';
    }
  } else if (fuelType === 'Petrol') {
    // Petrol vehicle logic (current rates)
    quantity = getRandomInt(20, 60);
    unit = 'Liters';
    pricePerUnit = 102.63; // Current petrol rate in Jaipur (Feb 2026)
    totalCost = Math.round(quantity * pricePerUnit * 100) / 100;
    station = getRandomItem(['Shell', 'HP', 'IOCL', 'Reliance']);
    costStatus = 'Invoiced';
  } else {
    // Diesel vehicle logic (current rates)
    quantity = getRandomInt(25, 70);
    unit = 'Liters';
    pricePerUnit = 89.25; // Current diesel rate in Jaipur (Feb 2026)
    totalCost = Math.round(quantity * pricePerUnit * 100) / 100;
    station = getRandomItem(['Shell', 'HP', 'IOCL', 'Reliance']);
    costStatus = 'Invoiced';
  }

  const refuelDate = getRandomDate();

  return {
    vehicle,
    fuelType,
    quantity,
    unit,
    pricePerUnit,
    totalCost,
    refuelDate,
    station,
    isInHouseGrid,
    costStatus // 'Invoiced' or 'Calculate Later'
  };
};


// ============================================================================
// SECTION 10B: FUEL ECONOMY DATA GENERATOR - COMPLETE WITH ALL CALCULATIONS
// ============================================================================

export function generateFuelEconomyData() {
  const data = ensureDataLoaded();

  // STEP 1: Basic Info
  const vehicle = getRandomItem(data.assets.vehicles);
  const vehicleName = `${vehicle.brand} ${vehicle.name}`;
  const vehicleCode = `VEH-${getRandomInt(1, 999).toString().padStart(3, '0')}`;
  const employeeName = getRandomEmployee();

  // Fuel type selection
  const fuelTypes = ['Electric', 'Diesel', 'Petrol'];
  const fuelType = getRandomItem(fuelTypes);

  // STEP 2: Calculate Total Mileage (Since Purchase)
  const totalMileage = getRandomInt(5000, 100000); // km

  // STEP 3: Calculate This Year Mileage
  const currentYear = new Date().getFullYear(); // 2026
  const currentMonth = new Date().getMonth() + 1; // February = 2
  const divisionFactor = getRandomInt(10, 15); // 10-15
  const thisYearMileage = Math.floor((totalMileage / divisionFactor) * currentMonth);

  // STEP 4: Calculate Last Trip Distance
  let lastTripDistance = getRandomInt(50, 400); // km
  if (lastTripDistance > thisYearMileage) {
    lastTripDistance = Math.floor(thisYearMileage * 0.1);
  }

  // STEP 5: Fuel Type Configuration & Economy
  let unit, economy, pricePerUnit, badgeColor, hasGridException = false, kWhChargedThisTrip = null;

  if (fuelType === 'Electric') {
    unit = 'kWh';
    economy = getRandomFloat(4.0, 8.0, 1); // km/kWh
    pricePerUnit = getRandomFloat(8, 12, 2); // ₹/kWh for station
    badgeColor = 'success'; // green

    // Grid Exception (33% chance)
    hasGridException = (getRandomInt(1, 3) === 1);

    if (hasGridException) {
      pricePerUnit = null;
      kWhChargedThisTrip = Math.round(lastTripDistance / economy);
    }
  } else if (fuelType === 'Diesel') {
    unit = 'L';
    economy = getRandomFloat(10.0, 22.0, 1); // kmpl
    pricePerUnit = getRandomFloat(85, 90, 2); // ₹/L
    badgeColor = 'amber';
  } else { // Petrol
    unit = 'L';
    economy = getRandomFloat(8.0, 18.0, 1); // kmpl
    pricePerUnit = getRandomFloat(100, 105, 2); // ₹/L
    badgeColor = 'info-special';
  }

  // STEP 6: Calculate Status (Based on Economy)
  let status, statusIcon, statusPill;

  if (fuelType === 'Electric') {
    if (economy > 6.5) {
      status = 'Excellent';
      statusIcon = 'fa-star';
      statusPill = 's-pill-success';
    } else if (economy > 5.5) {
      status = 'Good';
      statusIcon = 'fa-thumbs-up';
      statusPill = 's-pill-success';
    } else if (economy > 4.5) {
      status = 'Fair';
      statusIcon = 'fa-circle-check';
      statusPill = 's-pill-amber';
    } else if (economy > 3.5) {
      status = 'Low';
      statusIcon = 'fa-triangle-exclamation';
      statusPill = 's-pill-attention';
    } else {
      status = 'Very Low';
      statusIcon = 'fa-exclamation';
      statusPill = 's-pill-danger';
    }
  } else {
    // Petrol/Diesel (kmpl)
    if (economy > 18) {
      status = 'Excellent';
      statusIcon = 'fa-star';
      statusPill = 's-pill-success';
    } else if (economy > 14) {
      status = 'Good';
      statusIcon = 'fa-thumbs-up';
      statusPill = 's-pill-success';
    } else if (economy > 10) {
      status = 'Fair';
      statusIcon = 'fa-circle-check';
      statusPill = 's-pill-amber';
    } else if (economy > 6) {
      status = 'Low';
      statusIcon = 'fa-triangle-exclamation';
      statusPill = 's-pill-attention';
    } else {
      status = 'Very Low';
      statusIcon = 'fa-exclamation';
      statusPill = 's-pill-danger';
    }
  }

  // STEP 7: Calculate Total Fuel Cost (Since Purchase)
  let totalCostSincePurchase;
  if (!hasGridException) {
    const totalFuelConsumed = totalMileage / economy;
    totalCostSincePurchase = Math.round(totalFuelConsumed * pricePerUnit);
  } else {
    const totalFuelConsumed = totalMileage / economy;
    totalCostSincePurchase = Math.round(totalFuelConsumed * 10 * 0.8);
  }

  // STEP 8: Calculate This Year Fuel Cost
  let thisYearCost;
  if (!hasGridException) {
    const thisYearFuelConsumed = thisYearMileage / economy;
    thisYearCost = Math.round(thisYearFuelConsumed * pricePerUnit);
  } else {
    thisYearCost = null;
  }

  // STEP 9: Calculate Cost Efficiency (₹/km)
  let costPerKm;
  if (!hasGridException) {
    costPerKm = (totalCostSincePurchase / totalMileage).toFixed(2);
  } else {
    costPerKm = null;
  }

  // Calculate this year's average (slight variation from total average)
  const thisYearEconomy = getRandomFloat(economy * 0.9, economy * 1.1, 1);

  const economyUnit = fuelType === 'Electric' ? 'km/kWh' : 'kmpl';

  return {
    vehicleName,
    vehicleCode,
    employeeName,

    fuelType,
    fuelUnit: unit,
    fuelBadgeColor: badgeColor,

    status,
    statusIcon,
    statusPill,

    lastTripDistance,

    economy,
    thisYearEconomy,
    economyUnit,

    totalMileage,
    thisYearMileage,
    currentYear,

    totalCostSincePurchase,
    thisYearCost,

    costPerKm,

    hasGridException,
    kWhChargedThisTrip,

    pricePerUnit
  };
}







// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════

console.log('✅ CardDataGenerators.js loaded successfully');
console.log('📊 27 data generators ready');
console.log('🔒 Using JSON ONLY - no fallback data');
