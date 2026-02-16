import { useState, useEffect } from "react";
import { productService } from "@/services/product.service";

export function useProduct(code: string) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!code) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProduct(code);
        setProduct(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [code]);

  return { product, loading, error };
}
