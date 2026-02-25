import type { AxiosInstance } from "axios";

import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
    ProductResource,
    BrandWithProducts,
    CategoryWithProducts,
    TagWithProducts,
    ProductFilters as ProductFiltersType,
    CategoryResource,
    BrandResource,
} from "@/types/product.types";
import axiosInstance from "@/utils/axiosInstance";

const isDev = process.env.NODE_ENV !== "production";

// ✅ client-only cache (keyed by origin)
const clientCache = {
    categories: new Map<string, Promise<CategoryResource[]>>(),
    brands: new Map<string, Promise<BrandResource[]>>(),
};

function cacheKey(): string {
    if (typeof window === "undefined") return "server";
    return window.location.origin;
}

function normalizeCategoryTree(input: any[]): CategoryResource[] {
    if (!Array.isArray(input) || input.length === 0) return [];

    const looksNested = input.some((c) => Array.isArray(c?.children));
    const normalizeNode = (c: any): CategoryResource => ({
        ...c,
        title: c.title ?? c.name,
        code: c.code ?? c.slug,
        children: Array.isArray(c.children) ? c.children.map(normalizeNode) : undefined,
    });

    if (looksNested) return input.map(normalizeNode);

    // flat -> tree by id/parent_id
    const map = new Map<number, CategoryResource>();
    input.forEach((c) => {
        if (typeof c?.id !== "number") return;
        map.set(c.id, normalizeNode(c));
    });

    const roots: CategoryResource[] = [];
    input.forEach((c) => {
        const node = map.get(c.id);
        if (!node) return;

        const parentId = c.parent_id;
        if (parentId == null) {
            roots.push(node);
        } else {
            const parent = map.get(parentId);
            if (parent) {
                parent.children = parent.children ?? [];
                parent.children.push(node);
            } else {
                // fallback اگر parent پیدا نشد
                roots.push(node);
            }
        }
    });

    return roots;
}

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
        // ✅ cache only in browser
        if (typeof window !== "undefined") {
            const key = cacheKey();
            if (!clientCache.categories.has(key)) {
                clientCache.categories.set(
                    key,
                    api
                        .get<ApiResponse<any[]>>("/product-cats")
                        .then((res) => normalizeCategoryTree(res.data.data))
                );
            }
            return clientCache.categories.get(key)!;
        }

        const response = await api.get<ApiResponse<any[]>>("/product-cats");
        return normalizeCategoryTree(response.data.data);
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

    async getBrands(api: AxiosInstance = axiosInstance): Promise<BrandResource[]> {
        if (typeof window !== "undefined") {
            const key = cacheKey();
            if (!clientCache.brands.has(key)) {
                clientCache.brands.set(
                    key,
                    api.get<ApiResponse<BrandResource[]>>("/brands").then((res) => res.data.data)
                );
            }
            return clientCache.brands.get(key)!;
        }

        const response = await api.get<ApiResponse<BrandResource[]>>("/brands");
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