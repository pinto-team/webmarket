import axios from "axios";
import https from "https";
import MockAdapter from "axios-mock-adapter";
import { MockEndPoints } from "__server__";
import { tokenStorage } from "./token";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.taavoni.online/api/front",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    keepAlive: false
  }),
  withCredentials: false
});

// Request interceptor for adding auth token and cart ID
axiosInstance.interceptors.request.use(
  (config) => {
    
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add X-Cart-ID header for cart operations
    if (typeof window !== "undefined" && config.url?.includes("/cart-items")) {
      const tempId = localStorage.getItem("temp_cart_id");
      if (tempId) {
        config.headers["X-Cart-ID"] = `temp_${tempId}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      tokenStorage.clear();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login?session_expired=true";
      }
    }
    
    // Handle 422 Validation Error - format validation errors and show to user
    if (error.response?.status === 422) {
      const apiError = error.response.data;
      
      // Show error message to user (only in browser)
      if (typeof window !== "undefined" && apiError.message) {
        // Dispatch custom event for error notification
        window.dispatchEvent(new CustomEvent('api-error', { 
          detail: { message: apiError.message, variant: 'error' } 
        }));
      }
      
      // Set user-friendly message
      if (apiError.message) {
        error.message = apiError.message;
      }
      
      if (apiError.data?.errors) {
        // Format validation errors from Laravel format
        const errors: string[] = [];
        Object.entries(apiError.data.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            errors.push(...messages);
          }
        });
        error.validationErrors = apiError.data.errors;
        error.validationMessage = errors.join(', ');
      } else if (apiError.data && Array.isArray(apiError.data)) {
        // Old format support
        error.validationErrors = apiError.data.reduce((acc: Record<string, string>, err: any) => {
          acc[err.field] = err.message;
          return acc;
        }, {});
      }
    }
    
    return Promise.reject(error);
  }
);

// Mock adapter for development
if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
  const Mock = new MockAdapter(axiosInstance, { delayResponse: 300, onNoMatch: "passthrough" });
  MockEndPoints(Mock);
}

export default axiosInstance;
