// src/utils/nullSafe.ts

/**
 * Text fallback:
 * - default: single space to keep layout from collapsing
 */
export function safeStr(value: unknown, fallback: string = " "): string {
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length ? value : fallback;
    }
    if (typeof value === "number") return String(value);
    return fallback;
}

/**
 * Object fallback (accepts undefined/null safely)
 */
export function safeObj<T>(value: T | null | undefined, fallback: T): T {
    return value ?? fallback;
}

/**
 * Array fallback
 */
export function safeArr<T>(value: T[] | null | undefined): T[] {
    return Array.isArray(value) ? value : [];
}