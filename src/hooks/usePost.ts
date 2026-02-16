"use client";

import { useState, useEffect } from "react";
import { PostResource } from "@/types/content.types";
import { contentService } from "@/services/content.service";

export const usePost = (code: string | null) => {
  const [post, setPost] = useState<PostResource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await contentService.getPost(code);
        setPost(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [code]);

  return { post, loading, error };
};
