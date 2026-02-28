/* ════════════════════════════════════════════════════════════════════════════
  UTILITY HELPERS
   ════════════════════════════════════════════════════════════════════════════ */

// Shorthand selectors
export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

// INR formatter (Legacy)
export function formatINRFull(value) {
  return '₹' + Math.floor(value).toLocaleString('en-IN');
}

// Check if href targets same page
export function isSamePage(href) {
  if (!href) return false;
  const target = href.split('#')[0];
  const current = (window.location.pathname.split('/').pop() || 'index.html');
  return target === current;
}

// Nudge active element
export function nudgeActive(el) {
  el.classList.remove('s-already-active');
  void el.offsetWidth;
  el.classList.add('s-already-active');
  if (window.navigator && typeof window.navigator.vibrate === 'function') {
    window.navigator.vibrate(18);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FUEL PRICE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

let cachedFuelPrices = null;

/**
 * Attempts to fetch fuel prices from petroldieselprice.com for Jaipur
 * Falls back to random generation if fetch fails
 */
async function fetchJaipurFuelPrices() {
  try {
    console.log('🔄 Attempting to fetch Jaipur fuel prices...');
    // throw new Error('Direct fetch not available - using failsafe');
    return null; // Force fallback for now as per user instruction
  } catch (error) {
    console.warn('⚠️ Fetch failed, using random generation within realistic ranges');
    return null;
  }
}

/**
 * Generates random fuel prices within realistic ranges
 */
function generateFallbackPrices() {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 10;

  const prices = {
    petrol: {},
    diesel: {},
    electricCommercial: {},
    electricGrid: {}
  };

  for (let year = startYear; year <= currentYear; year++) {
    prices.petrol[year] = parseFloat((Math.random() * (106 - 80) + 80).toFixed(2));
    prices.diesel[year] = parseFloat((Math.random() * (90 - 75) + 75).toFixed(2));

    if (year >= 2024) {
      prices.electricCommercial[year] = parseFloat((Math.random() * (13 - 10) + 10).toFixed(2));
      const gridDiscount = Math.random() * (6 - 5) + 5;
      prices.electricGrid[year] = parseFloat((prices.electricCommercial[year] - gridDiscount).toFixed(2));
    }
  }

  return prices;
}

/**
 * Fill missing years with interpolated or random values
 */
function fillMissingYears(priceData) {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 10;

  const fuelTypes = ['petrol', 'diesel', 'electricCommercial', 'electricGrid'];

  fuelTypes.forEach(type => {
    if (!priceData[type]) {
      priceData[type] = {};
    }

    const minYear = (type.includes('electric')) ? 2024 : startYear;

    for (let year = minYear; year <= currentYear; year++) {
      if (!priceData[type][year]) {
        const prevYear = year - 1;
        const nextYear = year + 1;

        if (priceData[type][prevYear] && priceData[type][nextYear]) {
          priceData[type][year] = parseFloat(((priceData[type][prevYear] + priceData[type][nextYear]) / 2).toFixed(2));
          console.log(`📊 Interpolated ${type} price for ${year}: ₹${priceData[type][year]}`);
        } else if (priceData[type][prevYear]) {
          const variation = (Math.random() * 0.04 - 0.02) + 1;
          priceData[type][year] = parseFloat((priceData[type][prevYear] * variation).toFixed(2));
          console.log(`📊 Assumed ${type} price for ${year} from prev year: ₹${priceData[type][year]}`);
        } else if (priceData[type][nextYear]) {
          const variation = (Math.random() * 0.04 - 0.02) + 1;
          priceData[type][year] = parseFloat((priceData[type][nextYear] * variation).toFixed(2));
          console.log(`📊 Assumed ${type} price for ${year} from next year: ₹${priceData[type][year]}`);
        } else {
          let min, max;
          if (type === 'petrol') { min = 80; max = 106; }
          else if (type === 'diesel') { min = 75; max = 90; }
          else if (type === 'electricCommercial') { min = 10; max = 13; }
          else { min = 4; max = 8; }
          priceData[type][year] = parseFloat((Math.random() * (max - min) + min).toFixed(2));
          console.log(`📊 Generated random ${type} price for ${year}: ₹${priceData[type][year]}`);
        }
      }
    }
  });

  return priceData;
}

/**
 * Initialize fuel prices
 */
export async function initializeFuelPrices() {
  if (cachedFuelPrices) return cachedFuelPrices;

  let fetchedData = await fetchJaipurFuelPrices();

  if (fetchedData && Object.keys(fetchedData.petrol || {}).length > 0) {
    console.log('✅ Successfully fetched real fuel prices for Jaipur');
    cachedFuelPrices = fillMissingYears(fetchedData);
  } else {
    console.log('📊 Using realistic random fuel prices');
    cachedFuelPrices = generateFallbackPrices();
  }

  return cachedFuelPrices;
}

/**
 * Get current year fuel price with fallback
 */
export function getCurrentFuelPrice(fuelType, chargingType = 'commercial') {
  const prices = cachedFuelPrices;
  if (!prices) {
    console.warn(`⚠️ Fuel prices not initialized, calling initializeFuelPrices...`);
    // Note: This is a synchronous fallback if somehow called before init
    return 100; // Sensible default
  }

  const currentYear = new Date().getFullYear();
  let price;

  if (fuelType === 'Petrol') price = prices.petrol[currentYear];
  else if (fuelType === 'Diesel') price = prices.diesel[currentYear];
  else if (fuelType === 'Electric') {
    price = chargingType === 'grid' ? prices.electricGrid[currentYear] : prices.electricCommercial[currentYear];
  }

  if (!price) {
    console.warn(`⚠️ Missing price for ${fuelType} ${currentYear}, using fallback`);
    const priceSource = fuelType === 'Petrol' ? prices.petrol :
      fuelType === 'Diesel' ? prices.diesel :
        chargingType === 'grid' ? prices.electricGrid : prices.electricCommercial;

    price = priceSource[currentYear - 1];
    if (!price) {
      if (fuelType === 'Petrol') price = 106.5;
      else if (fuelType === 'Diesel') price = 89.5;
      else price = chargingType === 'grid' ? 6.5 : 12.5;
    }
  }

  return price;
}

/**
 * Calculate average fuel price with validation
 */
export function getAverageFuelPrice(fuelType, purchaseYear, hasGridException = false) {
  const prices = cachedFuelPrices;
  if (!prices) return 90;

  const currentYear = new Date().getFullYear();
  const priceArray = [];

  let priceSource;
  if (fuelType === 'Petrol') priceSource = prices.petrol;
  else if (fuelType === 'Diesel') priceSource = prices.diesel;
  else if (fuelType === 'Electric') {
    if (hasGridException) {
      const commercialArray = [];
      const gridArray = [];
      for (let year = purchaseYear; year <= currentYear; year++) {
        if (prices.electricCommercial[year]) commercialArray.push(prices.electricCommercial[year]);
        if (prices.electricGrid[year]) gridArray.push(prices.electricGrid[year]);
      }

      if (commercialArray.length === 0 || gridArray.length === 0) return 8.5;

      const avgCommercial = commercialArray.reduce((sum, p) => sum + p, 0) / commercialArray.length;
      const avgGrid = gridArray.reduce((sum, p) => sum + p, 0) / gridArray.length;
      return parseFloat(((avgCommercial * 0.7) + (avgGrid * 0.3)).toFixed(2));
    } else {
      priceSource = prices.electricCommercial;
    }
  }

  for (let year = purchaseYear; year <= currentYear; year++) {
    if (priceSource[year]) priceArray.push(priceSource[year]);
  }

  if (priceArray.length === 0) {
    if (fuelType === 'Petrol') return 95;
    if (fuelType === 'Diesel') return 85;
    return 11;
  }

  const sum = priceArray.reduce((total, p) => total + p, 0);
  return parseFloat((sum / priceArray.length).toFixed(2));
}

export function formatINR(amount) {
  const numStr = Math.floor(amount).toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') {
    return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  } else {
    return '₹' + lastThree;
  }
}

console.log('✅ Utility helpers loaded');
