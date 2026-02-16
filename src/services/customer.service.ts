import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse } from "@/types/api.types";
import type { UserResource } from "@/types/auth.types";

export interface ProfileUpdateRequest {
  mobile: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
}

export interface ProfileOptionsRequest {
  email: string;
  upload_id?: number;
}

export interface ProfilePasswordUpdateRequest {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const customerService = {
  async updateProfile(data: ProfileUpdateRequest): Promise<boolean> {
    const response = await axiosInstance.post<ApiResponse<boolean>>("/auth/profile", data);
    return response.data.data;
  },

  async updateProfileOptions(data: ProfileOptionsRequest): Promise<boolean> {
    const response = await axiosInstance.post<ApiResponse<boolean>>("/auth/profile/options", data);
    return response.data.data;
  },

  async updatePassword(data: ProfilePasswordUpdateRequest): Promise<boolean> {
    const response = await axiosInstance.post<ApiResponse<boolean>>("/auth/profile/password", data);
    return response.data.data;
  },

  async getProfile(): Promise<UserResource> {
    const response = await axiosInstance.get<ApiResponse<UserResource>>("/auth/profile");
    return response.data.data;
  }
};
