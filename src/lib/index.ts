import { formatPersianNumber } from "@/utils/persian";

export type TFn = (key: string, options?: any) => string;

export function getDateDifference(date: string | number | Date): string {
    const rtf = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });

    const now = Date.now();
    const then = new Date(date).getTime();

    if (!Number.isFinite(then)) return "";

    const diffSec = Math.round((then - now) / 1000);
    const absSec = Math.abs(diffSec);

    if (absSec < 60) return rtf.format(diffSec, "second");

    const diffMin = Math.round(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");

    const diffHour = Math.round(diffMin / 60);
    if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");

    const diffDay = Math.round(diffHour / 24);
    if (Math.abs(diffDay) < 30) return rtf.format(diffDay, "day");

    const diffMonth = Math.round(diffDay / 30);
    if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, "month");

    const diffYear = Math.round(diffMonth / 12);
    return rtf.format(diffYear, "year");
}

export function renderProductCount(
    t: TFn,
    page: number,
    perPageProduct: number,
    totalProduct: number
): string {
    const startNumber = (page - 1) * perPageProduct + 1;
    const endNumber = Math.min(page * perPageProduct, totalProduct);

    const start = formatPersianNumber(startNumber);
    const end = formatPersianNumber(endNumber);
    const total = formatPersianNumber(totalProduct);

    return `${t("pagination.showing")} ${start}-${end} ${t("pagination.of")} ${total} ${t("common.productsLabel")}`;
}

export function calculateDiscount(price: number, discount: number): number {
    return Number((price - price * (discount / 100)).toFixed(2));
}

export function currency(price: number, fraction: number = 0, unitLabel?: string): string {
    const formatted = new Intl.NumberFormat("fa-IR", {
        maximumFractionDigits: fraction,
    }).format(price);

    return unitLabel ? `${formatted} ${unitLabel}` : formatted;
}
