/**
 * Image Utils — LOCKED (backend-first)
 *
 * Goal:
 * - Single source of truth for image URLs in the frontend
 * - Always prefer backend `proxy_url` (image pipeline is backend-owned)
 * - No frontend resizing (no `?size=` injection on box urls)
 *
 * Priority:
 * - upload.proxy_url -> proxy_url -> upload.thumb_url -> thumb_url -> upload.main_url -> main_url -> thumbnail -> placeholder
 *
 * Notes:
 * - If proxy_url contains placeholders {WIDTH}/{HEIGHT}/{QUALITY}, we fill them.
 * - If proxy_url is already a final URL (no placeholders), we return it as-is.
 */

const PLACEHOLDER_IMAGE = "/placeholder.png";

function parseSize(size?: string): { width: number; height: number } {
    if (!size) return { width: 800, height: 800 };

    const [wRaw, hRaw] = size.split("x");
    const width = Number(wRaw);
    const height = Number(hRaw);

    return {
        width: Number.isFinite(width) && width > 0 ? width : 800,
        height: Number.isFinite(height) && height > 0 ? height : 800
    };
}

function fillProxyTemplate(url: string, size?: string, quality = 80): string {
    // Only fill if template placeholders exist
    if (!url.includes("{WIDTH}") && !url.includes("{HEIGHT}") && !url.includes("{QUALITY}")) return url;

    const { width, height } = parseSize(size);

    return url
        .replaceAll("{WIDTH}", String(width))
        .replaceAll("{HEIGHT}", String(height))
        .replaceAll("{QUALITY}", String(quality));
}

export const getProductImageUrl = (product: any, size?: string): string => {
    if (!product) return PLACEHOLDER_IMAGE;

    // Pick the best available base URL
    const proxyUrl =
        product?.upload?.proxy_url ||
        product?.proxy_url ||
        "";

    const fallbackUrl =
        product?.upload?.thumb_url ||
        product?.thumb_url ||
        product?.upload?.main_url ||
        product?.main_url ||
        product?.thumbnail ||
        "";

    // Always prefer proxy_url (backend pipeline)
    if (proxyUrl) {
        return fillProxyTemplate(proxyUrl, size, 80) || PLACEHOLDER_IMAGE;
    }

    // Fallback (should be rare if backend always provides proxy_url)
    if (fallbackUrl) return fallbackUrl;

    return PLACEHOLDER_IMAGE;
};

/**
 * Convenience helpers (sizes are only used for filling proxy template).
 */
export const getProductImageUrls = {
    thumbnail: (product: any) => getProductImageUrl(product, "150x150"),
    small: (product: any) => getProductImageUrl(product, "300x300"),
    medium: (product: any) => getProductImageUrl(product, "500x500"),
    large: (product: any) => getProductImageUrl(product, "800x800"),
    original: (product: any) => getProductImageUrl(product)
};