// utils/getOrigin.ts
export async function getOrigin(): Promise<string | undefined> {
    // client: no origin
    if (typeof window !== "undefined") return undefined;

    // ✅ Fallback for build / vazirmatn generation
    // Use env as a safe base (you can set it to your site url)
    const fallback = process.env.NEXT_PUBLIC_SITE_ORIGIN;

    try {
        const { headers } = await import("next/headers");
        const h = await headers();
        const host = h.get("host");
        const proto = h.get("x-forwarded-proto") || "https";
        return host ? `${proto}://${host}` : fallback;
    } catch {
        // ✅ If next/headers is not available (build-time/vazirmatn), return fallback
        return fallback;
    }
}