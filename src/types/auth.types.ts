// Login request payload
export interface LoginRequest {
    username: string; // mobile or email
    password: string;
}

// Registration request payload
export interface RegisterRequest {
    username: string;
    mobile: string;
    birth_year: number;
    birth_month: number;
    birth_day: number;
    password: string;
    rules: boolean; // Terms acceptance
}

// OTP verification request
export interface VerifyOtpRequest {
    mobile: string;
    code: string; // 5-digit OTP
}

// Password reset request
export interface PasswordResetRequest {
    username: string;
    password: string;
    code: string; // OTP code
}

// Auth token response
export interface TokenResponse {
    access_token: string;
    token_type: "Bearer";
    expires_at: string; // ISO 8601 datetime
}

// Wallet resource
export interface WalletResource {
    balance: number;
    type: string;
}

/**
 * ✅ Canonical image resource for UI rendering:
 * only proxy_url is allowed.
 */
export interface ImageResource {
    proxy_url?: string;
    title?: string;
    extension?: string;
    class?: string;
    priority?: number;
}

// User profile resource
export interface UserResource {
    id?: number;
    email?: string;
    username: string;
    mobile: string;
    title?: string;
    first_name?: string;
    last_name?: string;
    gender: number; // 0: Female, 1: Male, 2: Other
    gender_label: string;
    birth_year?: number;
    birth_month?: number;
    birth_day?: number;
    monthly_limit?: number;
    status: number;
    status_label: string;
    wallet?: WalletResource;
    upload?: ImageResource;
}

// Legacy aliases for backward compatibility
export type User = UserResource;
export type AuthResponse = TokenResponse;
export type VerifyOTPRequest = VerifyOtpRequest;
export type LoginResponse = TokenResponse;
export type RegisterResponse = boolean;
export type UserProfile = UserResource;