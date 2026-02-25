import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { ProductResource, BrandResource, CategoryResource } from '@/types/product.types';
import { PostResource } from '@/types/content.types';
import { ProductSearchFilters, PostSearchFilters, SearchSuggestion, UniversalSearchResult } from '@/types/search.types';

class SearchService {
  async searchProducts(filters: ProductSearchFilters, p0: any): Promise<PaginatedResponse<ProductResource>> {
    const params = new URLSearchParams();
    
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.count) params.append('count', filters.count.toString());
    if (filters.paged) params.append('paged', filters.paged.toString());

    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<ProductResource>>>(
      `/products?${params.toString()}`
    );
    return response.data.data;
  }

  async searchPosts(filters: PostSearchFilters): Promise<PaginatedResponse<PostResource>> {
    const params = new URLSearchParams();
    
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.count) params.append('count', filters.count.toString());
    if (filters.paged) params.append('paged', filters.paged.toString());

    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<PostResource>>>(
      `/posts?${params.toString()}`
    );
    return response.data.data;
  }

  async searchInCategory(categoryCode: string, keyword: string): Promise<{ category: CategoryResource; products: PaginatedResponse<ProductResource> }> {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);

    const response = await axiosInstance.get<ApiResponse<{ category: CategoryResource; products: PaginatedResponse<ProductResource> }>>(
      `/product-cats/${categoryCode}?${params.toString()}`
    );
    return response.data.data;
  }

  async searchInBrand(brandCode: string, keyword: string): Promise<{ brand: BrandResource; products: PaginatedResponse<ProductResource> }> {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);

    const response = await axiosInstance.get<ApiResponse<{ brand: BrandResource; products: PaginatedResponse<ProductResource> }>>(
      `/brands/${brandCode}?${params.toString()}`
    );
    return response.data.data;
  }

  async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!query || query.length < 2) return [];

    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        this.searchProducts({ keyword: query, count: 3 }),
        axiosInstance.get<ApiResponse<CategoryResource[]>>('/product-cats'),
        axiosInstance.get<ApiResponse<BrandResource[]>>('/brands')
      ]);

      const suggestions: SearchSuggestion[] = [];

      // Add product suggestions
      productsRes.items.slice(0, 3).forEach(product => {
        suggestions.push({
          text: product.title,
          type: 'product'
        });
      });

      // Add category suggestions
      categoriesRes.data.data
        .filter(cat => cat.title?.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2)
        .forEach(category => {
          if (category.title) {
            suggestions.push({
              text: category.title,
              type: 'category'
            });
          }
        });

      // Add brand suggestions
      brandsRes.data.data
        .filter(brand => brand.title?.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2)
        .forEach(brand => {
          suggestions.push({
            text: brand.title,
            type: 'brand'
          });
        });

      return suggestions;
    } catch (error) {
      console.error('Failed to get search suggestions:', error);
      return [];
    }
  }

  async searchAll(query: string): Promise<UniversalSearchResult> {
    try {
      const [productsRes, postsRes] = await Promise.all([
        this.searchProducts({ keyword: query, count: 5 }),
        this.searchPosts({ keyword: query, count: 5 })
      ]);

      return {
        products: productsRes.items,
        posts: postsRes.items,
        totalResults: productsRes.pagination.total + postsRes.pagination.total
      };
    } catch (error) {
      console.error('Universal search failed:', error);
      return {
        products: [],
        posts: [],
        totalResults: 0
      };
    }
  }

  trackSearch(query: string, resultCount: number): void {
    try {
      const searchData = {
        query,
        resultCount,
        timestamp: new Date().toISOString()
      };
      
      const searches = JSON.parse(localStorage.getItem('searchAnalytics') || '[]');
      searches.push(searchData);
      
      // Keep only last 100 searches
      if (searches.length > 100) {
        searches.splice(0, searches.length - 100);
      }
      
      localStorage.setItem('searchAnalytics', JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  }
}

export const searchService = new SearchService();