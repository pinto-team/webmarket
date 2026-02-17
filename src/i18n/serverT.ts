// src/i18n/serverT.ts

import {resources} from "@/i18n/resource";

type AnyObj = Record<string, any>;

function getByPath(obj: AnyObj, path: string) {
    return path.split(".").reduce<any>((acc, key) => (acc ? acc[key] : undefined), obj);
}

/**
 * Server-safe translation getter (no hooks, no i18next runtime needed).
 * Supports strings and arrays/objects if your resource value is not a string.
 */
export function tServer<T = string>(key: string, fallback?: T): T {
    const root = resources?.fa?.translation as AnyObj;
    const value = getByPath(root, key);

    if (value === undefined || value === null) return (fallback as T);
    return value as T;
}
