"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/services/auth.service";
import { cartService } from "@/services/cart.service";
import { tokenStorage } from "@/utils/token";
import type { LoginRequest, RegisterRequest, VerifyOtpRequest, UserResource } from "@/types/auth.types";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = tokenStorage.getUser();
      if (storedUser && tokenStorage.isAuthenticated()) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch {
          tokenStorage.clear();
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

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
    await authService.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    if (tokenStorage.isAuthenticated()) {
      const profile = await authService.getProfile();
      setUser(profile);
    }
  };

  const refreshUser = refreshProfile;

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
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
