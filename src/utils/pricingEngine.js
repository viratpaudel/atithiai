/**
 * Luxury Pricing, Tax Calculation & Multi-Currency Engine
 * Handles hospitality GST breakdowns, service charges, and foreign exchange conversions.
 */

export const DEFAULT_EXCHANGE_RATES = {
  INR: 1.0,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044,
};

/**
 * Calculates itemized luxury hospitality invoice breakdown.
 * @param {number} baseAmount - Base price in INR
 * @param {Object} [options]
 * @param {number} [options.gstRate=0.18] - Goods & Services Tax (standard 18% for luxury hospitality)
 * @param {number} [options.serviceChargeRate=0.05] - Discretionary service fee (5%)
 * @returns {Object} Invoice summary
 */
export function calculateHospitalityInvoice(baseAmount, options = {}) {
  const base = Math.max(0, Number(baseAmount) || 0);
  const gstRate = options.gstRate ?? 0.18;
  const serviceRate = options.serviceChargeRate ?? 0.05;

  const gstAmount = Math.round(base * gstRate);
  const serviceCharge = Math.round(base * serviceRate);
  const totalAmount = base + gstAmount + serviceCharge;

  return {
    baseAmount: base,
    gstRate,
    gstAmount,
    serviceChargeRate: serviceRate,
    serviceCharge,
    totalAmount,
  };
}

/**
 * Converts an INR amount to a target currency.
 * @param {number} inrAmount
 * @param {string} targetCurrency - 'USD' | 'EUR' | 'GBP' | 'AED'
 * @param {Object} [customRates]
 * @returns {Object} { currency, amount, formatted }
 */
export function convertCurrency(inrAmount, targetCurrency = "USD", customRates = null) {
  const rates = customRates || DEFAULT_EXCHANGE_RATES;
  const rate = rates[targetCurrency.toUpperCase()] || 1.0;
  const converted = Math.round((Number(inrAmount) || 0) * rate * 100) / 100;

  const symbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AED: "AED ",
  };

  const symbol = symbols[targetCurrency.toUpperCase()] || "";
  return {
    currency: targetCurrency.toUpperCase(),
    amount: converted,
    formatted: `${symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };
}
