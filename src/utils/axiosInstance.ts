import axios from "axios";
import https from "https";
import { tokenStorage } from "./token";

const isServer = typeof window === "undefined";
const shouldVerifyTLS = process.env.NODE_ENV === "production";

const axiosInstance = axios.create({
    baseURL: isServer
        ? (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.taavoni.online/api/front")
        : "/api/front",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    ...(isServer
        ? {
            httpsAgent: new https.Agent({
                rejectUnauthorized: shouldVerifyTLS,
                keepAlive: true,
            }),
        }
        : {}),
    withCredentials: false,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenStorage.getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const isCartRequest =
            typeof window !== "undefined" && config.url?.includes("/cart-items");

        if (isCartRequest) {
            if (!token) {
                const tempId = localStorage.getItem("temp_cart_id");
                if (tempId) {
                    config.headers["X-Cart-ID"] = `temp_${tempId}`;
                }
            } else {
                if (config.headers && "X-Cart-ID" in config.headers) {
                    delete (config.headers as any)["X-Cart-ID"];
                }
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            tokenStorage.clear();
            if (typeof window !== "undefined") {
                window.dispatchEvent(
                    new CustomEvent("auth:unauthorized", {
                        detail: { reason: error.response?.data?.message || "unauthorized" },
                    })
                );
            }
        }
        if (error.response?.status === 422) {
            const apiError = error.response.data;

            if (typeof window !== "undefined" && apiError.message) {
                window.dispatchEvent(
                    new CustomEvent("api-error", {
                        detail: { message: apiError.message, variant: "error" },
                    })
                );
            }
            if (apiError.message) {
                error.message = apiError.message;
            }
            if (apiError.data?.errors) {
                const errors: string[] = [];
                Object.entries(apiError.data.errors).forEach(
                    ([, messages]) => {
                        if (Array.isArray(messages)) {
                            errors.push(...messages);
                        }
                    }
                );
                error.validationErrors = apiError.data.errors;
                error.validationMessage = errors.join(", ");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
