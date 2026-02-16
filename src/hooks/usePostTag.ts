"use client";

import { useState, useEffect, useMemo } from "react";
import { TagWithPosts, PostListParams } from "@/types/content.types";
import { contentService } from "@/services/content.service";

export const usePostTag = (code: string, params?: PostListParams) => {
  const [data, setData] = useState<TagWithPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsString = JSON.stringify(params);
  const memoizedParams = useMemo(() => params, [paramsString]);

  useEffect(() => {
    const fetchTag = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await contentService.getPostTag(code, memoizedParams);
        setData(result);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load tag");
      } finally {
        setLoading(false);
      }
    };
    fetchTag();
  }, [code, memoizedParams]);

  return { data, loading, error };
};
