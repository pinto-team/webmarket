import { useState, useCallback } from "react";
import { productService } from "@/services/product.service";
import { ProductFilters } from "@/types/product.types";

export function useSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (keyword: string, filters?: Partial<ProductFilters>) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts({ ...filters, keyword });
      setResults(data.items || []);
    } catch (err) {
      setError(err as Error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clear };
}
