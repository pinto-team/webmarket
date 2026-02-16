import { ApiResponse, PaginatedResponse } from './api.types';
import { ProductResource } from './product.types';
import { PostResource } from './content.types';

export interface ProductSearchFilters {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  categories?: string[];
  sort?: 'lowest' | 'highest' | 'most_visited' | 'most_sales';
  inStock?: boolean;
  count?: number;
  paged?: number;
}

export interface PostSearchFilters {
  keyword?: string;
  categories?: string[];
  tags?: string[];
  sort?: 'latest' | 'oldest' | 'most_viewed';
  count?: number;
  paged?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand' | 'recent';
  count?: number;
}

export interface UniversalSearchResult {
  products: ProductResource[];
  posts: PostResource[];
  totalResults: number;
}

export interface SearchState {
  query: string;
  results: ProductResource[] | PostResource[];
  loading: boolean;
  error: string | null;
  filters: ProductSearchFilters | PostSearchFilters;
  recentSearches: string[];
}