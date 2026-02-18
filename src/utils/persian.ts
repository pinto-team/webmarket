/**
 * Persian/English digit helpers + formatting
 * src/utils/persian.ts
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

const faNumberFormat = new Intl.NumberFormat("fa-IR"); // grouping: ۱۲٬۳۴۵
const faMoneyFormat = new Intl.NumberFormat("fa-IR");  // same grouping; unit handled by UI

/**
 * Convert ANY ASCII digits in a string/number to Persian digits (۰-۹)
 * - safe for mixed strings: "Order 123" -> "Order ۱۲۳"
 */
export const toPersianNumber = (value: string | number): string => {
    return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
};

/**
 * Convert Persian digits (۰-۹) to English digits (0-9)
 * - useful for parsing user input that contains Persian digits
 */
export const toEnglishNumber = (value: string): string => {
    let result = String(value);
    PERSIAN_DIGITS.forEach((p, i) => {
        result = result.replace(new RegExp(p, "g"), String(i));
    });
    return result;
};

/**
 * Format a number in fa-IR locale with grouping (۱۲٬۳۴۵)
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
 * Safe date parser (accepts string/number/Date)
 */
const toValidDate = (input: string | number | Date): Date | null => {
    const d = input instanceof Date ? input : new Date(input);
    return Number.isFinite(d.getTime()) ? d : null;
};

/**
 * Format date in Persian calendar (Jalali) - date only
 * Default output typically like: ۱۴۰۴/۱۱/۲۹ (browser-dependent separators)
 */
export const formatPersianDate = (
    input: string | number | Date,
    options?: Intl.DateTimeFormatOptions
): string => {
    const d = toValidDate(input);
    if (!d) return "";

    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        ...options,
    }).format(d);
};

/**
 * Format date & time in Persian calendar (Jalali)
 * Default output typically like: ۱۴۰۴/۱۱/۲۹، ۱۴:۳۲
 */
export const formatPersianDateTime = (
    input: string | number | Date
): string => {
    const d = new Date(input);
    if (!Number.isFinite(d.getTime())) return "";

    const parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(d);

    const get = (type: string) =>
        parts.find((p) => p.type === type)?.value ?? "";

    const formatted = `${get("year")}/${get("month")}/${get("day")} ${get("hour")}:${get("minute")}`;

    return "\u200E" + formatted;
};


/**
 * Simple Persian relative time formatter
 * (keeps output Persian and numbers Persian)
 */
export const formatPersianRelativeTime = (dateInput: string | number | Date): string => {
    const d = toValidDate(dateInput);
    if (!d) return "";

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return "همین الآن";

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${toPersianNumber(diffMin)} دقیقه قبل`;

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${toPersianNumber(diffHour)} ساعت قبل`;

    const diffDay = Math.floor(diffHour / 24);
    return `${toPersianNumber(diffDay)} روز قبل`;
};

/**
 * Long Persian date, e.g. "۲۹ بهمن ۱۴۰۴"
 */
export const formatPersianDateLong = (dateInput: string | number | Date): string => {
    const d = toValidDate(dateInput);
    if (!d) return "";

    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(d);
};

/**
 * Get current Jalali year as number (latin digits)
 */
export const getCurrentJalaliYear = (): number => {
    const parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).formatToParts(
        new Date()
    );
    const yearPart = parts.find((p) => p.type === "year")?.value || "0";

    // Convert Persian digits to latin digits
    const latinYear = yearPart.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
    return Number(latinYear);
};
