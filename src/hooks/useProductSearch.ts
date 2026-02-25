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

    // ✅ filters is the single source of truth
    const [filters, setFilters] = useState<ProductSearchFilters>(() => initialFilters);

    // ✅ keep latest filters in a ref (so callbacks stay stable)
    const filtersRef = useRef(filters);
    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    // ✅ request cancellation / race protection
    const abortRef = useRef<AbortController | null>(null);

    const runSearch = useCallback(async (override?: Partial<ProductSearchFilters>) => {
        const merged: ProductSearchFilters = { ...filtersRef.current, ...override };

        const keyword = merged.keyword?.trim();
        if (!keyword) {
            // no keyword => reset results & stop
            setError(null);
            setLoading(false);
            setResults(EMPTY_RESULTS);
            return;
        }

        // cancel previous request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            setLoading(true);
            setError(null);

            // ⛔ IMPORTANT:
            // if your searchService.searchProducts supports passing signal, pass it.
            // otherwise this still protects state updates (we check aborted).
            const data = await searchService.searchProducts(merged as any, controller.signal as any);

            if (controller.signal.aborted) return;

            setResults(data);

            // Track search (don’t block UI)
            try {
                searchService.trackSearch(keyword, data.pagination.total);
            } catch {
                // ignore tracking failures
            }
        } catch (err: any) {
            if (controller.signal.aborted) return;

            setError(err instanceof Error ? err.message : "Search failed");
            // Keep previous results instead of wiping to reduce UI jank:
            // setResults(EMPTY_RESULTS);  // <- اگر دوست داشتی پاک کن
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, []);

    /**
     * ✅ Update filters ONLY (no direct fetch here)
     * Then effect will run and fetch.
     */
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

    // ✅ Auto-search whenever filters change (single source of truth)
    useEffect(() => {
        // only run if keyword exists
        if (!filters.keyword?.trim()) {
            setResults(EMPTY_RESULTS);
            setLoading(false);
            setError(null);
            return;
        }

        void runSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.keyword, filters.paged, filters.count, filters.sort, filters.brand, filters.minPrice, filters.maxPrice, filters.categories]);

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