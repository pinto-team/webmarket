// src/utils/imageUtils.ts
export const PLACEHOLDER_IMAGE_URL = "/placeholder.png";

function parseSize(size?: string) {
    if (!size) return { width: 800, height: 800 };
    const [wRaw, hRaw] = size.split("x");
    const w = Number(wRaw);
    const h = Number(hRaw);
    return {
        width: Number.isFinite(w) && w > 0 ? w : 800,
        height: Number.isFinite(h) && h > 0 ? h : 800,
    };
}

function fillProxyTemplate(url: string, size?: string, quality = 80) {
    if (!url || !url.trim()) return "";
    const hasTemplate =
        url.includes("{WIDTH}") || url.includes("{HEIGHT}") || url.includes("{QUALITY}");
    if (!hasTemplate) return url;

    const { width, height } = parseSize(size);
    return url
        .replaceAll("{WIDTH}", String(width))
        .replaceAll("{HEIGHT}", String(height))
        .replaceAll("{QUALITY}", String(quality));
}

export function getServerImageUrl(entityOrProxy: any, size?: string, quality = 80): string {
    const raw =
        typeof entityOrProxy === "string"
            ? entityOrProxy
            : entityOrProxy?.upload?.proxy_url ||
            entityOrProxy?.proxy_url ||
            entityOrProxy?.image?.proxy_url ||
            entityOrProxy?.icon?.proxy_url ||
            "";

    if (!raw || (typeof raw === "string" && !raw.trim())) return PLACEHOLDER_IMAGE_URL;

    const finalUrl = fillProxyTemplate(raw, size, quality);
    return finalUrl && finalUrl.trim() ? finalUrl : PLACEHOLDER_IMAGE_URL;
}


export function isPlaceholderProductImage(url?: string | null) {
    if (!url) return true;
    return url.includes("/placeholder.png") || url.includes("placeholder");
}

export function getLogoImageUrl(entityOrProxy: any, size?: string, quality = 80): string {
    const raw = getServerImageUrl(entityOrProxy, size, quality);

    if (!raw) return raw;
    if (raw.includes("/rs:fill:")) {
        return raw.replace("/rs:fill:", "/rs:fit:");
    }
    return raw;
}