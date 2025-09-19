/**
 * Форматирует число, добавляя пробелы между разрядами
 * @param {number|string} number - Число для форматирования
 * @returns {string} Отформатированное число с пробелами
 * 
 * @example
 * formatNumber(12000) // "12 000"
 * formatNumber(120000) // "120 000"
 * formatNumber(1200000) // "1 200 000"
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined || number === '') {
    return '0';
  }
  
  // Преобразуем в строку и убираем все нецифровые символы кроме точки и запятой
  const numStr = String(number).replace(/[^\d.,]/g, '');
  
  // Если строка пустая, возвращаем 0
  if (!numStr) {
    return '0';
  }
  
  // Разделяем на целую и дробную части
  const parts = numStr.split(/[.,]/);
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Форматируем целую часть, добавляя пробелы каждые 3 цифры справа
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  // Возвращаем результат с дробной частью, если она есть
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

/**
 * Форматирует сумму в сумах с пробелами
 * @param {number|string} amount - Сумма для форматирования
 * @returns {string} Отформатированная сумма
 * 
 * @example
 * formatSum(12000) // "12 000 сум"
 * formatSum(120000) // "120 000 сум"
 */
export const formatSum = (amount) => {
  const formattedAmount = formatNumber(amount);
  return `${formattedAmount} сум`;
};

export default {
  formatNumber,
  formatSum
};
