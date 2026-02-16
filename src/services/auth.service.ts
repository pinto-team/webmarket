import axiosInstance from "@/utils/axiosInstance";
import { tokenStorage } from "@/utils/token";
import type { ApiResponse } from "@/types/api.types";
import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  PasswordResetRequest,
  TokenResponse,
  UserResource
} from "@/types/auth.types";

export const authService = {
  async login(data: LoginRequest, tempId?: string): Promise<TokenResponse> {
    const payload = tempId ? { ...data, temp_id: tempId } : data;
    const headers = tempId ? { "X-Cart-ID": tempId } : {};
    const response = await axiosInstance.post<ApiResponse<TokenResponse>>(
      "/auth/login",
      payload,
      { headers }
    );
    const tokenData = response.data.data;
    tokenStorage.setToken(tokenData.access_token);
    return tokenData;
  },

  async register(data: RegisterRequest): Promise<boolean> {
    const response = await axiosInstance.post<ApiResponse<boolean>>("/auth/register", data);
    return response.data.data;
  },

  async verifyOTP(data: VerifyOtpRequest, tempId?: string): Promise<TokenResponse> {
    const payload = tempId ? { ...data, temp_id: tempId } : data;
    const headers = tempId ? { "X-Cart-ID": tempId } : {};
    const response = await axiosInstance.post<ApiResponse<TokenResponse>>(
      "/auth/register/verify",
      payload,
      { headers }
    );
    const tokenData = response.data.data;
    tokenStorage.setToken(tokenData.access_token);
    return tokenData;
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post<ApiResponse<boolean>>("/auth/logout");
    } finally {
      tokenStorage.clear();
    }
  },

  async getProfile(): Promise<UserResource> {
    const response = await axiosInstance.get<ApiResponse<UserResource>>("/auth/profile");
    const user = response.data.data;
    tokenStorage.setUser(user);
    return user;
  },

  async updateProfile(data: Partial<UserResource>): Promise<boolean> {
    const response = await axiosInstance.post<ApiResponse<boolean>>("/auth/profile", data);
    return response.data.data;
  },

  async updateProfileOptions(data: { email?: string; upload_id?: number }): Promise<boolean> {
    const response = await axiosInstance.post<ApiResponse<boolean>>("/auth/profile/options", data);
    return response.data.data;
  },

  async changePassword(data: {
    password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<boolean> {
    const response = await axiosInstance.post<ApiResponse<boolean>>("/auth/profile/password", data);
    return response.data.data;
  },

  async passwordLost(data: { username: string; mobile: string }): Promise<boolean> {
    const response = await axiosInstance.post<ApiResponse<boolean>>("/auth/password-lost", data);
    return response.data.data;
  },

  async passwordReset(data: PasswordResetRequest): Promise<boolean> {
    const response = await axiosInstance.post<ApiResponse<boolean>>("/auth/password-reset", data);
    return response.data.data;
  }
};
