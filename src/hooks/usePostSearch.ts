import { useState, useCallback, useEffect } from 'react';
import { searchService } from '@/services/search.service';
import { PostResource } from '@/types/content.types';
import { PostSearchFilters } from '@/types/search.types';
import { PaginatedResponse } from '@/types/api.types';

export function usePostSearch(initialFilters: PostSearchFilters = {}) {
  const [results, setResults] = useState<PaginatedResponse<PostResource>>({
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
  const [filters, setFilters] = useState<PostSearchFilters>(initialFilters);

  const search = useCallback(async (newFilters?: Partial<PostSearchFilters>) => {
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

      const data = await searchService.searchPosts(searchFilters);
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

  const updateFilters = useCallback((newFilters: Partial<PostSearchFilters>) => {
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

  // Auto-search when filters change
  useEffect(() => {
    if (filters.keyword) {
      search();
    }
  }, [filters.keyword, search]);

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