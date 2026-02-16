import { useState, useEffect } from 'react';
import { productService } from '@/services/product.service';

export const useProducts = (params?: { sort?: 'most_visited' | 'best_sale' | 'highest' | 'lowest'; count?: number; paged?: number }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts(params);
        setProducts(response.items || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params?.sort, params?.count, params?.paged, params]);

  return { products, loading, error };
};
