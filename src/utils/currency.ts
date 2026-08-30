/**
 * Formats an amount in paise to Indian Rupees string.
 */
export function formatCurrency(paise: number): string {
  const rupees = paiseToRupees(paise);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Formats an amount in paise to a compact Indian Rupees string.
 */
export function formatCurrencyCompact(paise: number): string {
  const rupees = paiseToRupees(paise);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(rupees);
}

/**
 * Converts paise to rupees.
 */
export function paiseToRupees(paise: number): number {
  return Math.floor(paise) / 100;
}

/**
 * Converts rupees to paise.
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Calculates a percentage of an amount in paise, returning integer paise.
 */
export function calculatePercentage(amount: number, percentage: number): number {
  return Math.floor((amount * percentage) / 100);
}

/**
 * Calculates discount amounts in integer paise.
 */
export function calculateDiscount(originalPaise: number, discountPercent: number): { discountAmount: number; finalAmount: number } {
  const discountAmount = calculatePercentage(originalPaise, discountPercent);
  const finalAmount = Math.max(0, originalPaise - discountAmount);
  return { discountAmount, finalAmount };
}

/**
 * Checks if a given paise amount is a valid positive integer.
 */
export function isValidAmount(paise: number): boolean {
  return Number.isInteger(paise) && paise >= 0;
}
