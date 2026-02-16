import axiosInstance from "@/utils/axiosInstance";
import { ApiResponse } from "@/types/api.types";
import { AddressResource, AddressRequest } from "@/types/address.types";
import { RegionResource, RegionListParams } from "@/types/region.types";

export const addressService = {
  async getAddresses(): Promise<AddressResource[]> {
    const response = await axiosInstance.get<ApiResponse<AddressResource[]>>("/addresses");
    return response.data.data;
  },

  async getAddress(id: number): Promise<AddressResource> {
    const response = await axiosInstance.get<ApiResponse<AddressResource>>(`/addresses/${id}`);
    return response.data.data;
  },

  async createAddress(data: AddressRequest): Promise<number> {
    const response = await axiosInstance.post<ApiResponse<number>>("/addresses", data);
    return response.data.data;
  },

  async updateAddress(id: number, data: AddressRequest): Promise<boolean> {
    const response = await axiosInstance.put<ApiResponse<boolean>>(`/addresses/${id}`, data);
    return response.data.data;
  },

  async deleteAddress(id: number): Promise<boolean> {
    const response = await axiosInstance.delete<ApiResponse<boolean>>(`/addresses/${id}`);
    return response.data.data;
  },

  async getRegions(params?: RegionListParams): Promise<RegionResource[]> {
    const response = await axiosInstance.get<ApiResponse<RegionResource[]>>("/regions", { params });
    return response.data.data;
  }
};
