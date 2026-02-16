import axiosInstance from "@/utils/axiosInstance";
import { createSSRAxiosInstance } from "@/utils/axiosSSR";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import {
    ProductResource, BrandWithProducts, CategoryWithProducts, TagWithProducts, ProductFilters as ProductFiltersType,
    CategoryResource
} from "@/types/product.types";

export const productService = {
    async getProducts(filters?: ProductFiltersType): Promise<PaginatedResponse<ProductResource>> {
        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<ProductResource>>>("/products", { params: filters });
        return response.data.data;
    },

    async getProduct(code: string, origin?: string): Promise<ProductResource> {
        try {
            const axios = origin ? createSSRAxiosInstance(origin) : axiosInstance;
            const response = await axios.get<ApiResponse<ProductResource>>(`/products/${code}`);
            const product = response.data.data;


            console.log('[Product Service] Response:', product);
            // Add product_code to all SKUs
            if (product.skus) {
                product.skus = product.skus.map(sku => ({
                    ...sku,
                    product_code: product.code
                }));
            }

            return product;
        } catch (error: any) {
            console.error(`Failed to fetch product ${code}:`, error.response?.status, error.message);
            throw error;
        }
    },

    async getCategories(): Promise<CategoryResource[]> {
        const response = await axiosInstance.get<ApiResponse<CategoryResource[]>>("/product-cats");
        return response.data.data;
    },

    async getCategory(code: string, params?: ProductFiltersType): Promise<CategoryWithProducts> {
        const response = await axiosInstance.get<ApiResponse<CategoryWithProducts>>(`/product-cats/${code}`, { params });
        return response.data.data;
    },

    async getBrands() {
        const response = await axiosInstance.get("/brands");
        return response.data.data;
    },

    async getBrand(code: string, params?: ProductFiltersType): Promise<BrandWithProducts> {
        const response = await axiosInstance.get<ApiResponse<BrandWithProducts>>(`/brands/${code}`, { params });
        return response.data.data;
    },

    async getTags() {
        const response = await axiosInstance.get("/product-tags");
        return response.data.data;
    },

    async getTag(code: string, params?: ProductFiltersType): Promise<TagWithProducts> {
        const response = await axiosInstance.get<ApiResponse<TagWithProducts>>(`/product-tags/${code}`, { params });
        return response.data.data;
    }
};
