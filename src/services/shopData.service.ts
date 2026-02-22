import type { AxiosInstance } from "axios";

import { ApiResponse } from "@/types/api.types";
import { ShopData, ShopResource } from "@/types/shopData.types";
import axiosInstance from "@/utils/axiosInstance";
import { buildCategoryTree } from "@/utils/categoryTree";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const shopDataService = {
    async getShops(api: AxiosInstance = axiosInstance): Promise<ShopResource[]> {
        const response = await api.get<ApiResponse<ShopResource[]>>("/shops");
        return response.data.data;
    },

    async getShopData(api: AxiosInstance = axiosInstance): Promise<ShopData> {
        let lastError: Error | null = null;
        const maxRetries = 2;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const shopRes = await api.get<ApiResponse<ShopData>>("/shops");
                const shopData = shopRes.data.data;

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
