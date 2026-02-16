"use client";

import { useState, useEffect, useMemo } from "react";
import { PostResource, PostListParams } from "@/types/content.types";
import { contentService } from "@/services/content.service";

export const usePosts = (params?: PostListParams) => {
  const [posts, setPosts] = useState<PostResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const paramsString = JSON.stringify(params);
  const memoizedParams = useMemo(() => params, [paramsString]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await contentService.getPosts(memoizedParams);
        setPosts(response.items);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [memoizedParams]);

  return { posts, loading, error, pagination };
};
