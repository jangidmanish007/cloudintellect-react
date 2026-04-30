// Percentage calculation utilities

/**
 * Calculate percentage of a value relative to a total
 * @param {number} value
 * @param {number} total
 * @param {number} decimals - Number of decimal places
 * @returns {number}
 */
export const calcPercentage = (value, total, decimals = 2) => {
  if (!total || total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
};

/**
 * Calculate the value from a percentage and total
 * @param {number} percentage
 * @param {number} total
 * @returns {number}
 */
export const percentageToValue = (percentage, total) => {
  return (percentage / 100) * total;
};

/**
 * Calculate percentage change between two values
 * @param {number} oldValue
 * @param {number} newValue
 * @returns {number}
 */
export const percentageChange = (oldValue, newValue) => {
  if (!oldValue || oldValue === 0) return 0;
  return parseFloat((((newValue - oldValue) / Math.abs(oldValue)) * 100).toFixed(2));
};

/**
 * Clamp a percentage between 0 and 100
 * @param {number} value
 * @returns {number}
 */
export const clampPercentage = (value) => Math.min(100, Math.max(0, value));
