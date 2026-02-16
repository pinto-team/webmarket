"use client";

import { useState, useEffect } from "react";
import { ProductResource } from "@/types/product.types";
import { productService } from "@/services/product.service";

export const useRelatedProducts = (categoryCode?: string, excludeCode?: string, limit: number = 8) => {
  const [products, setProducts] = useState<ProductResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryCode) return;

    const fetchRelated = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await productService.getCategory(categoryCode);
        let items = response.products?.items || [];
        
        // Exclude current product
        if (excludeCode) {
          items = items.filter((p: ProductResource) => p.code !== excludeCode);
        }
        
        // Limit results
        setProducts(items.slice(0, limit));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [categoryCode, excludeCode, limit]);

  return { products, loading, error };
};
