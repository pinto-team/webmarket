/**
 * Transform SKU array to variant groups for variant selector
 */

import { SkuResource } from "@/types/product.types";

export interface VariantGroup {
  attribute: string;
  values: string[];
}

export interface VariantOption {
  attribute: string;
  value: string;
}

/**
 * Extract unique variant attributes and values from SKUs
 */
export const transformSkuToVariants = (skus: SkuResource[]): VariantGroup[] => {
  const variantMap = new Map<string, Set<string>>();

  // Collect all unique attribute-value combinations
  skus.forEach(sku => {
    sku.variants?.forEach(variant => {
      const attribute = variant.attribute.title;
      const value = variant.attribute_value.title;

      if (!variantMap.has(attribute)) {
        variantMap.set(attribute, new Set());
      }
      variantMap.get(attribute)!.add(value);
    });
  });

  // Convert to array format
  return Array.from(variantMap.entries()).map(([attribute, values]) => ({
    attribute,
    values: Array.from(values)
  }));
};

/**
 * Get available variant values based on current selection
 * Returns values that have matching SKUs
 */
export const getAvailableVariants = (
  skus: SkuResource[],
  selectedVariants: Record<string, string>,
  targetAttribute: string
): string[] => {
  const availableValues = new Set<string>();

  skus.forEach(sku => {
    // Check if SKU matches currently selected variants (except target)
    const matchesSelection = Object.entries(selectedVariants).every(([attr, val]) => {
      if (attr === targetAttribute) return true; // Skip target attribute
      return sku.variants?.some(
        v => v.attribute.title === attr && v.attribute_value.title === val
      );
    });

    if (matchesSelection) {
      // Add target attribute values from this SKU
      sku.variants?.forEach(variant => {
        if (variant.attribute.title === targetAttribute) {
          availableValues.add(variant.attribute_value.title);
        }
      });
    }
  });

  return Array.from(availableValues);
};

/**
 * Check if a variant combination exists in SKUs
 */
export const isVariantCombinationAvailable = (
  skus: SkuResource[],
  variants: Record<string, string>
): boolean => {
  return skus.some(sku => {
    return Object.entries(variants).every(([attr, val]) => {
      return sku.variants?.some(
        v => v.attribute.title === attr && v.attribute_value.title === val
      );
    });
  });
};
