import type { AxiosInstance } from "axios";

import { ApiResponse } from "@/types/api.types";
import { ShopData, ShopResource } from "@/types/shopData.types";
import axiosInstance from "@/utils/axiosInstance";
import { buildCategoryTree } from "@/utils/categoryTree";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isNonEmptyString(v: unknown): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

function isShopDataPayload(data: unknown): data is ShopData {
    // ✅ must be an object, not array
    if (!data || typeof data !== "object" || Array.isArray(data)) return false;

    const d = data as any;

    // ✅ "strong" indicators (pick what you know backend always provides)
    // We avoid relying on fixed values; only structure checks.
    const hasTitle = isNonEmptyString(d.title);
    const hasThemeCode = isNonEmptyString(d.theme?.code);
    const hasTopbar = d.topbar && typeof d.topbar === "object";
    const hasNavigationArray = Array.isArray(d.main_navigation);

    // if any of these is present, we treat it as ShopData
    return Boolean(hasTitle || hasThemeCode || hasTopbar || hasNavigationArray);
}

export const shopDataService = {
    async getShops(api: AxiosInstance = axiosInstance): Promise<ShopResource[]> {
        const response = await api.get<ApiResponse<ShopResource[]>>("/shops");
        const data = response.data.data;

        // ✅ If backend returns object here by mistake, fail loudly
        if (!Array.isArray(data)) {
            throw new Error("Invalid response for getShops(): expected ShopResource[]");
        }

        return data;
    },

    async getShopData(api: AxiosInstance = axiosInstance): Promise<ShopData> {
        let lastError: Error | null = null;
        const maxRetries = 2;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                // ⚠️ Backend uses "/shops" for shop data in your current API
                const shopRes = await api.get<ApiResponse<unknown>>("/shops");
                const raw = shopRes.data.data;

                // ✅ Guard: must be ShopData-like object, not ShopResource[]
                if (!isShopDataPayload(raw)) {
                    // If it's an array, it probably returned shops list
                    if (Array.isArray(raw)) {
                        throw new Error(
                            "ShopData endpoint returned an array (looks like ShopResource[]). Check backend route for /shops."
                        );
                    }
                    throw new Error("Invalid ShopData payload from /shops");
                }

                const shopData: ShopData = raw;

                // ✅ Fetch categories separately and build tree
                const catRes = await api.get<ApiResponse<any[]>>("/product-cats");
                const flatCats = catRes.data.data ?? [];

                shopData.product_categories = buildCategoryTree(flatCats as any);

                return shopData;
            } catch (error) {
                lastError = error as Error;

                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000;
                    await sleep(delay);
                }
            }
        }

        throw lastError || new Error("Failed to load shop data");
    },
};