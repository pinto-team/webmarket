import {resources} from "@/i18n/resource";

const dict = resources.fa.translation as unknown as Record<string, any>;

export function t(key: string, fallback?: string) {
    // پشتیبانی از مسیرهای dotted مثل "cart.title"
    const parts = key.split(".");
    let cur: any = dict;

    for (const p of parts) {
        cur = cur?.[p];
        if (cur == null) return fallback ?? key;
    }

    return typeof cur === "string" ? cur : (fallback ?? key);
}
