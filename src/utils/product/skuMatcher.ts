/**
 * Find SKU by variant selection
 */

import { SkuResource } from "@/types/product.types";

/**
 * Find SKU that matches selected variants
 */
export const findSkuByVariants = (
  skus: SkuResource[],
  selectedVariants: Record<string, string>
): SkuResource | null => {
  const selectedEntries = Object.entries(selectedVariants);
  
  // If no variants selected, return null
  if (selectedEntries.length === 0) return null;

  return skus.find(sku => {
    // Check if all selected variants match this SKU
    return selectedEntries.every(([attribute, value]) => {
      return sku.variants?.some(
        v => v.attribute.title === attribute && v.attribute_value.title === value
      );
    });
  }) || null;
};

/**
 * Get SKU variants as key-value pairs
 */
export const getSkuVariants = (sku: SkuResource): Record<string, string> => {
  const variants: Record<string, string> = {};
  
  sku.variants?.forEach(variant => {
    variants[variant.attribute.title] = variant.attribute_value.title;
  });

  return variants;
};

/**
 * Check if SKU matches variant selection
 */
export const skuMatchesVariants = (
  sku: SkuResource,
  selectedVariants: Record<string, string>
): boolean => {
  return Object.entries(selectedVariants).every(([attribute, value]) => {
    return sku.variants?.some(
      v => v.attribute.title === attribute && v.attribute_value.title === value
    );
  });
};
