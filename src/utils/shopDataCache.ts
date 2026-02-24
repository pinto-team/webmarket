import { cache } from "react";

import { ApiResponse } from "@/types/api.types";
import { ShopData } from "@/types/shopData.types";
import { buildCategoryTree } from "@/utils/categoryTree";
import { getServerApi, getServerOrigin } from "@/utils/serverApi";

function isShopDataPayload(data: unknown): data is ShopData {
    if (!data || typeof data !== "object" || Array.isArray(data)) return false;

    const d = data as any;

    // lightweight structure checks
    const hasTitle = typeof d.title === "string";
    const hasTheme = d.theme && typeof d.theme === "object";
    const hasTopbar = d.topbar && typeof d.topbar === "object";
    const hasNav = Array.isArray(d.main_navigation);

    return Boolean(hasTitle || hasTheme || hasTopbar || hasNav);
}

/**
 * ✅ Cached per origin (origin is part of the function argument => cache key)
 */
const getShopDataByOrigin = cache(async (origin?: string): Promise<ShopData | null> => {
    try {
        const api = await getServerApi(origin);

        // ⚠️ backend uses "/shops" as shop-data in your setup
        const shopRes = await api.get<ApiResponse<unknown>>("/shops");
        const raw = shopRes.data.data;

        if (!isShopDataPayload(raw)) {
            console.error("[SSR] Invalid ShopData payload from /shops", { origin });
            return null;
        }

        const data: ShopData = raw;

        // ✅ Keep SSR consistent with client: fetch flat cats and build tree
        const catRes = await api.get<ApiResponse<any[]>>("/product-cats");
        const flatCats = catRes.data.data ?? [];
        data.product_categories = buildCategoryTree(flatCats as any);

        return data;
    } catch (error) {
        console.error("Failed to fetch shop data:", error);
        return null;
    }
});

export async function getShopDataServer(originKey?: string): Promise<ShopData | null> {
    const resolvedOrigin = await getServerOrigin(originKey);
    return getShopDataByOrigin(resolvedOrigin);
}