import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { ProductResource, BrandResource, CategoryResource } from "@/types/product.types";
import type { PostResource } from "@/types/content.types";
import type {
    ProductSearchFilters,
    PostSearchFilters,
    SearchSuggestion,
    UniversalSearchResult,
} from "@/types/search.types";

class SearchService {
    async searchProducts(
        filters: ProductSearchFilters,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<ProductResource>> {
        const params = new URLSearchParams();

        if (filters.keyword?.trim()) params.append("keyword", filters.keyword.trim());
        if (filters.sort) params.append("sort", filters.sort);
        if (filters.count) params.append("count", String(filters.count));
        if (filters.paged) params.append("paged", String(filters.paged));

        if (filters.brand) params.append("brand", filters.brand);

        if (filters.minPrice != null) params.append("min_price", String(filters.minPrice));
        if (filters.maxPrice != null) params.append("max_price", String(filters.maxPrice));

        // ✅ unify category vs categories: prefer categories[]
        const cats =
            Array.isArray(filters.categories) && filters.categories.length > 0
                ? filters.categories
                : filters.category
                    ? [filters.category]
                    : [];

        cats.forEach((c) => params.append("categories[]", c));

        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<ProductResource>>>(
            `/products?${params.toString()}`,
            { signal }
        );

        return response.data.data;
    }

    async searchPosts(filters: PostSearchFilters, signal?: AbortSignal): Promise<PaginatedResponse<PostResource>> {
        const params = new URLSearchParams();

        if (filters.keyword?.trim()) params.append("keyword", filters.keyword.trim());
        if (filters.sort) params.append("sort", filters.sort);
        if (filters.count) params.append("count", String(filters.count));
        if (filters.paged) params.append("paged", String(filters.paged));

        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<PostResource>>>(
            `/posts?${params.toString()}`,
            { signal }
        );

        return response.data.data;
    }

    async searchInCategory(
        categoryCode: string,
        keyword: string,
        signal?: AbortSignal
    ): Promise<{ category: CategoryResource; products: PaginatedResponse<ProductResource> }> {
        const params = new URLSearchParams();
        if (keyword?.trim()) params.append("keyword", keyword.trim());

        const response = await axiosInstance.get<
            ApiResponse<{ category: CategoryResource; products: PaginatedResponse<ProductResource> }>
        >(`/product-cats/${categoryCode}?${params.toString()}`, { signal });

        return response.data.data;
    }

    async searchInBrand(
        brandCode: string,
        keyword: string,
        signal?: AbortSignal
    ): Promise<{ brand: BrandResource; products: PaginatedResponse<ProductResource> }> {
        const params = new URLSearchParams();
        if (keyword?.trim()) params.append("keyword", keyword.trim());

        const response = await axiosInstance.get<
            ApiResponse<{ brand: BrandResource; products: PaginatedResponse<ProductResource> }>
        >(`/brands/${brandCode}?${params.toString()}`, { signal });

        return response.data.data;
    }

    async getSearchSuggestions(query: string, signal?: AbortSignal): Promise<SearchSuggestion[]> {
        if (!query || query.trim().length < 2) return [];

        const q = query.trim();

        try {
            const [productsRes, categoriesRes, brandsRes] = await Promise.all([
                this.searchProducts({ keyword: q, count: 3 }, signal),
                axiosInstance.get<ApiResponse<CategoryResource[]>>("/product-cats", { signal }),
                axiosInstance.get<ApiResponse<BrandResource[]>>("/brands", { signal }),
            ]);

            const suggestions: SearchSuggestion[] = [];

            productsRes.items.slice(0, 3).forEach((p) => {
                suggestions.push({
                    text: p.title,
                    type: "product",
                    code: p.code, // ✅
                });
            });

            categoriesRes.data.data
                .filter((c) => c.title?.toLowerCase().includes(q.toLowerCase()))
                .slice(0, 2)
                .forEach((c) => {
                    suggestions.push({
                        text: c.title!,
                        type: "category",
                        code: (c as any).code, // ✅ اگر فیلدش code نیست، عوض کن
                    });
                });

            brandsRes.data.data
                .filter((b) => b.title?.toLowerCase().includes(q.toLowerCase()))
                .slice(0, 2)
                .forEach((b) => {
                    suggestions.push({
                        text: b.title!,
                        type: "brand",
                        code: (b as any).code,
                    });
                });

            return suggestions;
        } catch (error) {
            if (signal?.aborted) return [];
            console.error("Failed to get search suggestions:", error);
            return [];
        }
    }

    async searchAll(query: string, signal?: AbortSignal): Promise<UniversalSearchResult> {
        try {
            const q = query.trim();

            const [productsRes, postsRes] = await Promise.all([
                this.searchProducts({ keyword: q, count: 5 }, signal),
                this.searchPosts({ keyword: q, count: 5 }, signal),
            ]);

            return {
                products: productsRes.items,
                posts: postsRes.items,
                totalResults: productsRes.pagination.total + postsRes.pagination.total,
            };
        } catch (error) {
            if (signal?.aborted) {
                return { products: [], posts: [], totalResults: 0 };
            }
            console.error("Universal search failed:", error);
            return { products: [], posts: [], totalResults: 0 };
        }
    }

    trackSearch(query: string, resultCount: number): void {
        try {
            const searchData = {
                query,
                resultCount,
                timestamp: new Date().toISOString(),
            };

            const searches = JSON.parse(localStorage.getItem("searchAnalytics") || "[]");
            searches.push(searchData);

            if (searches.length > 100) {
                searches.splice(0, searches.length - 100);
            }

            localStorage.setItem("searchAnalytics", JSON.stringify(searches));
        } catch (error) {
            console.error("Failed to track search:", error);
        }
    }
}

export const searchService = new SearchService();