import { useState } from "react";
import { customerService, type ProfileUpdateRequest, type ProfileOptionsRequest, type ProfilePasswordUpdateRequest } from "@/services/customer.service";
import { useAuth } from "./useAuth";

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  const updateProfile = async (data: ProfileUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      await customerService.updateProfile(data);
      await refreshUser();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در بروزرسانی پروفایل");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOptions = async (data: ProfileOptionsRequest) => {
    setLoading(true);
    setError(null);
    try {
      await customerService.updateProfileOptions(data);
      await refreshUser();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در بروزرسانی تنظیمات");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (data: ProfilePasswordUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      await customerService.updatePassword(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در تغییر رمز عبور");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, updateOptions, updatePassword, loading, error };
};
