import { ImageResource } from '@/types/product.types';

/**
 * Get product thumbnail URL (optimized for all uses)
 * Always uses thumb_url as per backend specification
 */
export const getProductThumbnail = (upload?: ImageResource | null): string => {
  if (!upload) return '/placeholder.png';
  return upload.thumb_url || '/placeholder.png';
};

/**
 * Get product main image URL (for detail pages)
 */
export const getProductMainImage = (upload?: ImageResource | null): string => {
  if (!upload) return '/placeholder.png';
  return upload.main_url || '/placeholder.png';
};
