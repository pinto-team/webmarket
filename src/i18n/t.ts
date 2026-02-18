import { resources } from "@/i18n/resource";
import { toPersianNumber } from "@/utils/persian";

type Dict = Record<string, any>;
type InterpolationValues = Record<string, string | number>;

const dict = resources.fa.translation as Dict;

function getValueByPath(obj: Dict, path: string): any {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function normalizeText(text: string): string {
    return toPersianNumber(text);
}

function interpolate(template: string, values?: InterpolationValues): string {
    if (!values) return normalizeText(template);

    const out = template.replace(/\{\{(.*?)\}\}/g, (_, rawKey) => {
        const key = String(rawKey).trim();
        const value = values[key];

        if (value == null) return "";

        return normalizeText(String(value));
    });

    return normalizeText(out);
}

export function t(key: string, options?: InterpolationValues | string): string {
    const value = getValueByPath(dict, key);

    if (value == null) {
        const fallback = typeof options === "string" ? options : key;
        return normalizeText(fallback);
    }

    if (typeof value !== "string") {
        return normalizeText(key);
    }

    if (typeof options === "string") {
        return normalizeText(value);
    }

    return interpolate(value, options);
}
