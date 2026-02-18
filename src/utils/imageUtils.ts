// file: src/utils/imageUtils.ts

const PLACEHOLDER_IMAGE = "/placeholder.png";

function parseSize(size?: string): { width: number; height: number } {
    if (!size) return { width: 800, height: 800 };
    const [wRaw, hRaw] = size.split("x");
    const w = Number(wRaw);
    const h = Number(hRaw);
    return {
        width: Number.isFinite(w) && w > 0 ? w : 800,
        height: Number.isFinite(h) && h > 0 ? h : 800,
    };
}

function fillProxyTemplate(url: string, size?: string, quality = 80): string {
    if (!url) return "";
    const hasTemplate =
        url.includes("{WIDTH}") || url.includes("{HEIGHT}") || url.includes("{QUALITY}");
    if (!hasTemplate) return url;

    const { width, height } = parseSize(size);

    return url
        .replaceAll("{WIDTH}", String(width))
        .replaceAll("{HEIGHT}", String(height))
        .replaceAll("{QUALITY}", String(quality));
}

/**
 * ✅ Canonical: get URL for ANY server-provided image entity.
 * Rule: only proxy_url is allowed.
 */
export const getServerImageUrl = (entity: any, size?: string, quality = 80): string => {
    // Accept direct string too
    const raw =
        typeof entity === "string"
            ? entity
            : entity?.upload?.proxy_url ||
            entity?.proxy_url ||
            entity?.image?.proxy_url ||
            entity?.icon?.proxy_url ||
            "";

    if (!raw) return PLACEHOLDER_IMAGE;

    const finalUrl = fillProxyTemplate(raw, size, quality);
    return finalUrl || PLACEHOLDER_IMAGE;
};

// Backward-compatible wrapper (kept for existing code)
export const getProductImageUrl = (product: any, size?: string): string => {
    return getServerImageUrl(product, size, 80);
};

export const isPlaceholderProductImage = (url?: string | null): boolean => {
    if (!url) return true;
    return url.includes("/placeholder.png") || url.includes("placeholder");
};

export const PLACEHOLDER_PRODUCT_IMAGE = PLACEHOLDER_IMAGE;
export const PLACEHOLDER_IMAGE_URL = PLACEHOLDER_IMAGE;
