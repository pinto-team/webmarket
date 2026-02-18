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

export const formatPersianRelativeTime = (dateInput: string | Date): string => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return "همین الآن";

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${toPersianNumber(diffMin)} دقیقه قبل`;

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${toPersianNumber(diffHour)} ساعت قبل`;

    const diffDay = Math.floor(diffHour / 24);
    return `${toPersianNumber(diffDay)} روز قبل`;
};

export const formatPersianDateLong = (dateInput: Date | string): string => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const formatter = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return formatter.format(date);
};


export const getCurrentJalaliYear = (): number => {
    const parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" })
        .formatToParts(new Date());
    const yearPart = parts.find((p) => p.type === "year")?.value || "0";
    const latinYear = yearPart.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
    return Number(latinYear);
};
