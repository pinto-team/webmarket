"use client";

import { useState, useMemo } from "react";
import { CommentResource } from "@/types/product.types";
import { commentService, AddCommentRequest } from "@/services/comment.service";
import { calculateAverageRating } from "@/utils/product";

export const useComments = (initialComments: CommentResource[] = [], productCode: string) => {
  const [comments, setComments] = useState<CommentResource[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const averageRating = useMemo(() => calculateAverageRating(comments), [comments]);

  const addComment = async (body: string, rate: number) => {
    setLoading(true);
    setError(null);

    try {
      const commentId = await commentService.addComment({ product_code: productCode, body, rate });
      // Optionally refetch or add optimistically
      return commentId;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add comment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { comments, averageRating, addComment, loading, error };
};
