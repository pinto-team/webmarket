import { cache } from "react";
import { ApiResponse } from "@/types/api.types";
import { ShopData } from "@/types/shopData.types";
import { buildCategoryTree } from "@/utils/categoryTree";
import { createSSRAxiosInstance } from "@/utils/axiosSSR";
import { getOrigin } from "@/utils/getOrigin";

export const getShopDataServer = cache(async (originKey?: string): Promise<ShopData | null> => {
    try {
        const reqOrigin = await getOrigin();

        // ✅ Dev override (prevents localhost tenant)
        const origin =
            originKey ||
            process.env.TENANT_ORIGIN ||
            reqOrigin;

        const axios = createSSRAxiosInstance(origin);

        const response = await axios.get<ApiResponse<ShopData>>("/shops");
        const data = response.data.data;
        data.product_categories = buildCategoryTree(data.product_categories);
        return data;
    } catch (error) {
        console.error("Failed to fetch shop data:", error);
        return null;
    }
});