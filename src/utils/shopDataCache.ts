import { cache } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ApiResponse } from "@/types/api.types";
import { ShopData } from "@/types/shopData.types";
import { buildCategoryTree } from "@/utils/categoryTree";

export const getShopDataServer = cache(async (): Promise<ShopData | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ShopData>>("/shops");
    const data = response.data.data;
    data.product_categories = buildCategoryTree(data.product_categories);
    return data;
  } catch (error) {
    console.error("Failed to fetch shop data:", error);
    return null;
  }
});
