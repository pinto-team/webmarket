import type { AxiosInstance } from "axios";
import { createSSRAxiosInstance } from "@/utils/axiosSSR";
import { getOrigin } from "@/utils/getOrigin";

function normalizeOrigin(value?: string): string | undefined {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    try {
        return new URL(trimmed).origin;
    } catch {
        return undefined;
    }
}

function ssrDebugEnabled(): boolean {
    const v = process.env.SSR_ORIGIN_DEBUG;
    return v === "1" || v === "true" || v === "yes";
}

export async function getServerOrigin(explicitOrigin?: string): Promise<string | undefined> {
    const explicit = normalizeOrigin(explicitOrigin);
    if (explicit) return explicit;

    const override = normalizeOrigin(process.env.TENANT_ORIGIN);
    if (override) return override;

    const requestOrigin = normalizeOrigin(await getOrigin());
    if (requestOrigin) return requestOrigin;

    return normalizeOrigin(process.env.SITE_ORIGIN || process.env.NEXT_PUBLIC_SITE_ORIGIN);
}

export async function getServerApi(explicitOrigin?: string): Promise<AxiosInstance> {
    const origin = await getServerOrigin(explicitOrigin);

    if (process.env.NODE_ENV === "production" && !origin) {
        throw new Error(
            "SSR tenant origin could not be resolved. Ensure proxy forwards host/x-forwarded-proto or set SITE_ORIGIN."
        );
    }

    // ✅ Debug log (opt-in)
    if (ssrDebugEnabled()) {
        const source = explicitOrigin
            ? "explicitOrigin(arg)"
            : process.env.TENANT_ORIGIN
                ? "TENANT_ORIGIN(env)"
                : (await getOrigin())
                    ? "request(getOrigin)"
                    : "SITE_ORIGIN / NEXT_PUBLIC_SITE_ORIGIN(fallback)";

        console.log("[SSR Tenant Origin]", {
            origin,
            source,
            nodeEnv: process.env.NODE_ENV,
        });
    }

    return createSSRAxiosInstance(origin);
}