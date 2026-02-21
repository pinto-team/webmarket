"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { cartService } from "@/services/cart.service";
import { tokenStorage } from "@/utils/token";
import { DEFAULT_AUTH_REDIRECT } from "@/utils/auth-navigation";
import type {
    LoginRequest,
    RegisterRequest,
    VerifyOtpRequest,
    UserResource,
} from "@/types/auth.types";

interface AuthContextType {
    user: UserResource | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<{ needsVerification: boolean }>;
    verifyOTP: (data: VerifyOtpRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<UserResource | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const clearAuthState = useCallback(() => {
        tokenStorage.clear();
        setUser(null);
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = tokenStorage.getUser();
            if (storedUser && tokenStorage.isAuthenticated()) {
                try {
                    const profile = await authService.getProfile();
                    setUser(profile);
                } catch {
                    clearAuthState();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, [clearAuthState]);

    useEffect(() => {
        const handleUnauthorized = () => {
            clearAuthState();
            router.replace(DEFAULT_AUTH_REDIRECT);
        };

        window.addEventListener("auth:unauthorized", handleUnauthorized);
        return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
    }, [clearAuthState, router]);

    const login = async (data: LoginRequest) => {
        const tempId = cartService.getTempId();
        await authService.login(data, tempId);
        cartService.clearTempId();

        const profile = await authService.getProfile();
        setUser(profile);
    };

    const register = async (data: RegisterRequest) => {
        await authService.register(data);
        return { needsVerification: true };
    };

    const verifyOTP = async (data: VerifyOtpRequest) => {
        const tempId = cartService.getTempId();
        await authService.verifyOTP(data, tempId);
        cartService.clearTempId();

        const profile = await authService.getProfile();
        setUser(profile);
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch {
            // Even if logout API fails, local state must be cleared.
        }

        clearAuthState();
        router.replace(DEFAULT_AUTH_REDIRECT);
    };

    const refreshProfile = async () => {
        if (tokenStorage.isAuthenticated()) {
            const profile = await authService.getProfile();
            setUser(profile);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                verifyOTP,
                logout,
                refreshProfile,
                refreshUser: refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
