/**
 * Product Helper Utilities
 * Calculate ratings, stock, prices from product data
 */

import { SkuResource, CommentResource } from "@/types/product.types";
import { formatPersianPrice } from "@/utils/persian";

/**
 * Calculate average rating from comments
 */
export const calculateAverageRating = (comments?: CommentResource[]): number => {
  if (!comments || comments.length === 0) return 0;
  
  const total = comments.reduce((sum, comment) => sum + comment.rating, 0);
  return Math.round((total / comments.length) * 10) / 10; // Round to 1 decimal
};

/**
 * Calculate total stock across all SKUs
 */
export const calculateTotalStock = (skus: SkuResource[]): number => {
  return skus.reduce((total, sku) => total + sku.stock, 0);
};

/**
 * Get minimum price from SKUs
 */
export const getMinPrice = (skus: SkuResource[]): number => {
  if (skus.length === 0) return 0;
  return Math.min(...skus.map(sku => sku.price));
};

/**
 * Get maximum price from SKUs
 */
export const getMaxPrice = (skus: SkuResource[]): number => {
  if (skus.length === 0) return 0;
  return Math.max(...skus.map(sku => sku.price));
};

/**
 * Check if product has any stock available
 */
export const isInStock = (skus: SkuResource[]): boolean => {
  return skus.some(sku => sku.stock > 0);
};

/**
 * Get stock status label
 */
export const getStockStatus = (stock: number): string => {
  if (stock === 0) return "Out of Stock";
  if (stock <= 5) return "Low Stock";
  return "In Stock";
};

/**
 * Format price range
 */
export const formatPriceRange = (minPrice: number, maxPrice: number): string => {
  if (minPrice === maxPrice) {
    return `${formatPersianPrice(minPrice)} تومان`;
  }
  return `${formatPersianPrice(minPrice)} - ${formatPersianPrice(maxPrice)} تومان`;
};
