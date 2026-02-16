import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { ProductFilters } from '@/types/product.types';

export const useBrandProducts = (code: string, filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['brand', code, filters],
    queryFn: () => productService.getBrand(code, filters),
    enabled: !!code
  });
};
