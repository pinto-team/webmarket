/**
 * Persian/English digit helpers + formatting
 */

const faNumberFormat = new Intl.NumberFormat("fa-IR");
const faMoneyFormat = new Intl.NumberFormat("fa-IR");

/**
 * Convert ANY digits in a string/number to Persian digits (۰-۹)
 * - safe for mixed strings: "Order 123" -> "Order ۱۲۳"
 */
export const toPersianNumber = (value: string | number): string => {
    const persianDigits = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
    return String(value).replace(/\d/g, (d) => persianDigits[Number(d)]);
};

/**
 * Convert Persian digits (۰-۹) to English digits (0-9)
 */
export const toEnglishNumber = (value: string): string => {
    const persianDigits = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
    let result = value;
    persianDigits.forEach((p, i) => {
        result = result.replace(new RegExp(p, "g"), String(i));
    });
    return result;
};

/**
 * Format a number in fa-IR locale (۱۲٬۳۴۵)
 * Use this for plain numbers, counts, badges, etc.
 */
export const formatPersianNumber = (value: number | string): string => {
    const num = typeof value === "string" ? Number(toEnglishNumber(value)) : value;
    if (!Number.isFinite(num)) return toPersianNumber(value);
    return faNumberFormat.format(num);
};

/**
 * Format price in fa-IR locale with grouping (۱۲٬۳۴۵)
 * Returns only number (unit handled by UI)
 */
export const formatPersianPrice = (price: number | string): string => {
    const num = typeof price === "string" ? Number(toEnglishNumber(price)) : price;
    if (!Number.isFinite(num)) return toPersianNumber(price);
    return faMoneyFormat.format(num);
};

/**
 * Format date in Persian locale
 */
export const formatPersianDate = (
    date: string | Date,
    options?: Intl.DateTimeFormatOptions
): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("fa-IR", options);
};

/**
 * Format date and time in Persian locale
 */
export const formatPersianDateTime = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("fa-IR");
};

