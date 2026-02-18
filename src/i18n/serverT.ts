// src/i18n/serverT.ts

import { resources } from "@/i18n/resource";
import { toPersianNumber } from "@/utils/persian";

type AnyObj = Record<string, any>;

function getByPath(obj: AnyObj, path: string) {
    return path.split(".").reduce<any>((acc, key) => (acc ? acc[key] : undefined), obj);
}

function normalize<T>(value: T): T {
    if (typeof value === "string") return toPersianNumber(value) as T;
    return value;
}

export function tServer<T = string>(key: string, fallback?: T): T {
    const root = resources?.fa?.translation as AnyObj;
    const value = getByPath(root, key);

    if (value === undefined || value === null) return normalize(fallback as T);
    return normalize(value as T);
}
