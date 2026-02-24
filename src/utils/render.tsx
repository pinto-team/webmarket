// src/utils/render.ts
import type { FooterSection, SocialLink } from "@/types/shopData.types";
import type { ReactNode } from "react";

/**
 * Meaningful primitives
 */
export function isMeaningfulString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export function safeTrim(value: unknown, fallback = ""): string {
    return isMeaningfulString(value) ? value.trim() : fallback;
}

/**
 * ✅ IMPORTANT:
 * This is a real TS type guard (predicate), so after calling hasAny(arr),
 * TypeScript knows arr is T[] (not null/undefined).
 */
export function hasAny<T>(arr: T[] | null | undefined): arr is T[] {
    return Array.isArray(arr) && arr.length > 0;
}

export function hasAnyMeaningfulString(values: Array<unknown>): boolean {
    return values.some((v) => isMeaningfulString(v));
}

/**
 * JSX helper: return node only when condition is true.
 */
export function renderIf(condition: boolean, node: ReactNode): ReactNode | null {
    return condition ? node : null;
}

/**
 * Normalize footer sections:
 * - keep section if title or links exist
 * - keep links only if both title & url are meaningful
 */
export function normalizeFooterSections(
    sections: FooterSection[] | null | undefined
): FooterSection[] {
    if (!hasAny(sections)) return [];

    return sections
        .filter((s): s is FooterSection => Boolean(s)) // defensive if API ever sends nulls
        .map((s) => {
            const title = safeTrim(s.title);

            const rawLinks = hasAny(s.links) ? s.links : [];

            const links = rawLinks
                .filter((l) => Boolean(l))
                .map((l) => ({
                    title: safeTrim(l.title),
                    url: safeTrim(l.url),
                }))
                .filter((l) => isMeaningfulString(l.title) && isMeaningfulString(l.url));

            return { title, links };
        })
        .filter((s) => isMeaningfulString(s.title) || hasAny(s.links));
}

/**
 * Social links normalization:
 * - Keep only meaningful url
 * - Platform normalized to lower-case string
 */
export function normalizeSocialLinks(
    links: SocialLink[] | null | undefined
): Array<{ platform: string; url: string }> {
    if (!hasAny(links)) return [];

    return links
        .filter((l): l is SocialLink => Boolean(l))
        .map((l) => ({
            platform: safeTrim(l.platform).toLowerCase(),
            url: safeTrim(l.url),
        }))
        .filter((l) => isMeaningfulString(l.platform) && isMeaningfulString(l.url));
}

/**
 * Convert normalized social links array into a dictionary
 * Useful for components that expect { instagram?: string; telegram?: string; ... }
 */
export function socialLinksToMap(
    links: SocialLink[] | null | undefined
): Record<string, string> {
    const normalized = normalizeSocialLinks(links);
    return normalized.reduce((acc, item) => {
        acc[item.platform] = item.url;
        return acc;
    }, {} as Record<string, string>);
}