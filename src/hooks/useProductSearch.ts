import { useState, useCallback, useEffect, useRef } from "react";
import { searchService } from "@/services/search.service";
import type { ProductResource } from "@/types/product.types";
import type { ProductSearchFilters } from "@/types/search.types";
import type { PaginatedResponse } from "@/types/api.types";

const EMPTY_RESULTS: PaginatedResponse<ProductResource> = {
    items: [],
    pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
        from: 0,
        to: 0,
    },
};

export function useProductSearch(initialFilters: ProductSearchFilters = {}) {
    const [results, setResults] = useState<PaginatedResponse<ProductResource>>(EMPTY_RESULTS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // single source of truth
    const [filters, setFilters] = useState<ProductSearchFilters>(() => initialFilters);

    const filtersRef = useRef(filters);
    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    const abortRef = useRef<AbortController | null>(null);

    const runSearch = useCallback(async (override?: Partial<ProductSearchFilters>) => {
        const merged: ProductSearchFilters = { ...filtersRef.current, ...override };

        const keyword = merged.keyword?.trim();
        if (!keyword) {
            setError(null);
            setLoading(false);
            setResults(EMPTY_RESULTS);
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            setLoading(true);
            setError(null);

            const data = await searchService.searchProducts(merged, controller.signal);
            if (controller.signal.aborted) return;

            setResults(data);

            try {
                searchService.trackSearch(keyword, data.pagination.total);
            } catch {
                // ignore tracking failures
            }
        } catch (err: any) {
            if (controller.signal.aborted) return;
            setError(err instanceof Error ? err.message : "Search failed");
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, []);

    // ✅ patch-based updates
    const updateFilters = useCallback((patch: Partial<ProductSearchFilters>) => {
        setFilters((prev) => ({ ...prev, ...patch }));
    }, []);

    const clear = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;

        setError(null);
        setLoading(false);
        setFilters({});
        setResults(EMPTY_RESULTS);
    }, []);

    // auto-search whenever filters change
    useEffect(() => {
        if (!filters.keyword?.trim()) {
            setResults(EMPTY_RESULTS);
            setLoading(false);
            setError(null);
            return;
        }

        void runSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filters.keyword,
        filters.paged,
        filters.count,
        filters.sort,
        filters.brand,
        filters.minPrice,
        filters.maxPrice,
        filters.categories,
    ]);

    return {
        results,
        loading,
        error,
        filters,
        search: runSearch,
        updateFilters,
        clear,
    };
}