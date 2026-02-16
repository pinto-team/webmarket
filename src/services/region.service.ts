import axiosInstance from "@/utils/axiosInstance";
import { RegionResource } from "@/types/region.types";
import { ApiResponse } from "@/types/api.types";

export const regionService = {
  async getRegions(parentId?: number): Promise<RegionResource[]> {
    const params = parentId ? { parent_id: parentId } : {};
    const response = await axiosInstance.get<ApiResponse<RegionResource[]>>("/regions", { params });
    return response.data.data;
  }
};
