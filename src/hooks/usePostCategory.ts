"use client";

import { useState, useEffect, useMemo } from "react";
import { CategoryWithPosts, PostListParams } from "@/types/content.types";
import { contentService } from "@/services/content.service";

export const usePostCategory = (code: string, params?: PostListParams) => {
  const [data, setData] = useState<CategoryWithPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsString = JSON.stringify(params);
  const memoizedParams = useMemo(() => params, [paramsString]);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await contentService.getPostCategory(code, memoizedParams);
        setData(result);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [code, memoizedParams]);

  return { data, loading, error };
};
