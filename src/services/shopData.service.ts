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
        const response = await axiosInstance.get<ApiResponse<ShopData>>("/shops");
        const data = response.data.data;
        
        // Transform flat categories to tree structure
        data.product_categories = buildCategoryTree(data.product_categories);
        
        return data;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s
          const delay = Math.pow(2, attempt) * 1000;
          await sleep(delay);
        }
      }
    }
    
    throw lastError || new Error("Failed to load shop data");
  }
};
