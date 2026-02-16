import { useState, useCallback, useEffect } from 'react';
import { searchService } from '@/services/search.service';
import { ProductResource } from '@/types/product.types';
import { ProductSearchFilters } from '@/types/search.types';
import { PaginatedResponse } from '@/types/api.types';

export function useProductSearch(initialFilters: ProductSearchFilters = {}) {
  const [results, setResults] = useState<PaginatedResponse<ProductResource>>({
    items: [],
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
      from: 0,
      to: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductSearchFilters>(initialFilters);

  const search = useCallback(async (newFilters?: Partial<ProductSearchFilters>) => {
    const searchFilters = { ...filters, ...newFilters };
    
    if (!searchFilters.keyword?.trim()) {
      setResults({
        items: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
          from: 0,
          to: 0
        }
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await searchService.searchProducts(searchFilters);
      setResults(data);
      
      // Track search
      searchService.trackSearch(searchFilters.keyword, data.pagination.total);
      
      if (newFilters) {
        setFilters(searchFilters);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults({
        items: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
          from: 0,
          to: 0
        }
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<ProductSearchFilters>) => {
    search(newFilters);
  }, [search]);

  const clear = useCallback(() => {
    setResults({
      items: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
        from: 0,
        to: 0
      }
    });
    setError(null);
    setFilters({});
  }, []);

  // Auto-search on mount with initial filters
  useEffect(() => {
    if (initialFilters.keyword) {
      search();
    }
  }, [initialFilters.keyword, search]);

  return {
    results,
    loading,
    error,
    filters,
    search,
    updateFilters,
    clear
  };
}