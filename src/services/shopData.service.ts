import axiosInstance from "@/utils/axiosInstance";
import { ApiResponse } from "@/types/api.types";
import { ShopData, ShopResource } from "@/types/shopData.types";
import { buildCategoryTree } from "@/utils/categoryTree";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const shopDataService = {
    async getShops(): Promise<ShopResource[]> {
        const response = await axiosInstance.get<ApiResponse<ShopResource[]>>("/shops");
        return response.data.data;
    },

    async getShopData(): Promise<ShopData> {
        let lastError: Error | null = null;
        const maxRetries = 2;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                // 1) shop config
                const shopRes = await axiosInstance.get<ApiResponse<ShopData>>("/shops");
                const shopData = shopRes.data.data;

                // 2) real product categories (source of truth)
                const catRes = await axiosInstance.get<ApiResponse<any[]>>("/product-cats");
                const flatCats = catRes.data.data ?? [];

                console.log("[ShopData] baseURL:", axiosInstance.defaults.baseURL);
                console.log("[ShopData] product-cats length:", flatCats.length);
                console.log("[ShopData] product-cats names:", flatCats.map((x: any) => x?.name).slice(0, 30));

                // 3) normalize to tree
                shopData.product_categories = buildCategoryTree(flatCats as any);

                return shopData;
            } catch (error) {
                lastError = error as Error;

                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000; // 1s, 2s
                    await sleep(delay);
                }
            }
        }

        throw lastError || new Error("Failed to load shop data");
    }
};
