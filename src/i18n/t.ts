import { resources } from "@/i18n/resource";
import { toPersianNumber } from "@/utils/persian";

type Dict = Record<string, any>;
type InterpolationValues = Record<string, string | number>;

const dict = resources.fa.translation as Dict;

function getValueByPath(obj: Dict, path: string): any {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function interpolate(template: string, values?: InterpolationValues): string {
    if (!values) return template;

    return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
        const value = values[key.trim()];
        if (value == null) return "";

        // اگر عدد بود فارسیش کن
        if (typeof value === "number") {
            return toPersianNumber(value);
        }

        return String(value);
    });
}

export function t(
    key: string,
    options?: InterpolationValues | string
): string {
    const value = getValueByPath(dict, key);

    // اگر key پیدا نشد
    if (value == null) {
        return typeof options === "string" ? options : key;
    }

    if (typeof value !== "string") {
        return key;
    }

    // اگر options string باشه یعنی fallback
    if (typeof options === "string") {
        return value;
    }

    // interpolation
    return interpolate(value, options);
}
