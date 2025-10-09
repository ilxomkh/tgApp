/**
 * @param {number|string} number
 * @returns {string}
 * @example
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined || number === '') {
    return '0';
  }
  
  const numStr = String(number).replace(/[^\d.,]/g, '');
  
  if (!numStr) {
    return '0';
  }
  
  const parts = numStr.split(/[.,]/);
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

/**
 * @param {number|string} amount
 * @returns {string}
 * @example
 */
export const formatSum = (amount) => {
  const formattedAmount = formatNumber(amount);
  return `${formattedAmount} сум`;
};

export default {
  formatNumber,
  formatSum
};
