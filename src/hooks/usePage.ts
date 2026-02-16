"use client";

import { useState, useEffect } from "react";
import { PageResource } from "@/types/content.types";
import { contentService } from "@/services/content.service";

export const usePage = (code: string) => {
  const [page, setPage] = useState<PageResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await contentService.getPage(code);
        setPage(result);
      } catch (err: any) {
        setError(err.response?.data?.message || "Page not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [code]);

  return { page, loading, error };
};
