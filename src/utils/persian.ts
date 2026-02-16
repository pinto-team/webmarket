/**
 * Convert English numbers to Persian numbers
 */
export const toPersianNumber = (value: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(value).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

/**
 * Convert Persian numbers to English numbers
 */
export const toEnglishNumber = (value: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let result = value;
  persianDigits.forEach((persian, index) => {
    result = result.replace(new RegExp(persian, 'g'), index.toString());
  });
  return result;
};

/**
 * Format date in Persian locale
 */
export const formatPersianDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fa-IR', options);
};

/**
 * Format date and time in Persian locale
 */
export const formatPersianDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('fa-IR');
};

/**
 * Format price with Persian numbers and locale
 */
export const formatPersianPrice = (price: number): string => {
  return price.toLocaleString('fa-IR');
};