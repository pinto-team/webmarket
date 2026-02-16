import { useQuery } from '@tanstack/react-query';
import { getCategoryByCode } from '@/services/category.service';

interface ProductListParams {
  paged?: number;
  count?: number;
  sort?: string;
  keyword?: string;
}

export const useCategoryProducts = (code: string, params?: ProductListParams) => {
  return useQuery({
    queryKey: ['category', code, params],
    queryFn: () => getCategoryByCode(code, params),
    enabled: !!code,
  });
};
