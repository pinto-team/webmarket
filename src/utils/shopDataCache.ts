import { cache } from "react";

import { ApiResponse } from "@/types/api.types";
import { ShopData } from "@/types/shopData.types";
import { buildCategoryTree } from "@/utils/categoryTree";
import { getServerApi, getServerOrigin } from "@/utils/serverApi";

const getShopDataByOrigin = cache(async (origin?: string): Promise<ShopData | null> => {
    try {
        const api = await getServerApi(origin);
        const response = await api.get<ApiResponse<ShopData>>("/shops");
        const data = response.data.data;
        data.product_categories = buildCategoryTree(data.product_categories);
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
