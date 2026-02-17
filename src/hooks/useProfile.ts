import { useState } from "react";
import {
    customerService,
    type ProfileUpdateRequest,
    type ProfileOptionsRequest,
    type ProfilePasswordUpdateRequest,
} from "@/services/customer.service";
import { useAuth } from "./useAuth";
import { t } from "@/i18n/t";

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
            setError(err?.response?.data?.message || t("profile.updateFailed", t("errors.general")));
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
            setError(
                err?.response?.data?.message ||
                t("profile.optionsUpdateFailed", t("errors.general"))
            );
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
            setError(
                err?.response?.data?.message ||
                t("profile.passwordUpdateFailed", t("errors.general"))
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, updateOptions, updatePassword, loading, error };
};
