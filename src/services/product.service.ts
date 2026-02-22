import type { AxiosInstance } from "axios";

import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
    ProductResource,
    BrandWithProducts,
    CategoryWithProducts,
    TagWithProducts,
    ProductFilters as ProductFiltersType,
    CategoryResource,
} from "@/types/product.types";
import axiosInstance from "@/utils/axiosInstance";

const isDev = process.env.NODE_ENV !== "production";

export const productService = {
    async getProducts(
        filters?: ProductFiltersType,
        api: AxiosInstance = axiosInstance,
    ): Promise<PaginatedResponse<ProductResource>> {
        const response = await api.get<ApiResponse<PaginatedResponse<ProductResource>>>("/products", {
            params: filters,
        });
        return response.data.data;
    },

    async getProduct(code: string, api: AxiosInstance = axiosInstance): Promise<ProductResource> {
        try {
            const response = await api.get<ApiResponse<ProductResource>>(`/products/${code}`);
            const product = response.data.data;

            if (isDev) {
                console.log("[Product Service] getProduct OK:", {
                    code: product?.code,
                    title: product?.title,
                    skuCount: Array.isArray(product?.skus) ? product.skus.length : 0,
                    commentCount: Array.isArray(product?.comments) ? product.comments.length : 0,
                });
            }

            if (Array.isArray(product?.skus)) {
                product.skus = product.skus.map((sku: any) => ({
                    ...sku,
                    product_code: product.code,
                }));
            }

            return product;
        } catch (error: any) {
            console.error(`Failed to fetch product ${code}:`, error.response?.status, error.message);
            throw error;
        }
    },

    async getCategories(api: AxiosInstance = axiosInstance): Promise<CategoryResource[]> {
        const response = await api.get<ApiResponse<CategoryResource[]>>("/product-cats");
        return response.data.data;
    },

    async getCategory(
        code: string,
        params?: ProductFiltersType,
        api: AxiosInstance = axiosInstance,
    ): Promise<CategoryWithProducts> {
        const response = await api.get<ApiResponse<CategoryWithProducts>>(`/product-cats/${code}`, {
            params,
        });
        return response.data.data;
    },

    async getBrands(api: AxiosInstance = axiosInstance) {
        const response = await api.get("/brands");
        return response.data.data;
    },

    async getBrand(
        code: string,
        params?: ProductFiltersType,
        api: AxiosInstance = axiosInstance,
    ): Promise<BrandWithProducts> {
        const response = await api.get<ApiResponse<BrandWithProducts>>(`/brands/${code}`, {
            params,
        });
        return response.data.data;
    },

    async getTags(api: AxiosInstance = axiosInstance) {
        const response = await api.get("/product-tags");
        return response.data.data;
    },

    async getTag(
        code: string,
        params?: ProductFiltersType,
        api: AxiosInstance = axiosInstance,
    ): Promise<TagWithProducts> {
        const response = await api.get<ApiResponse<TagWithProducts>>(`/product-tags/${code}`, {
            params,
        });
        return response.data.data;
    },
};
