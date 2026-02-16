"use client";

import { useState, useMemo } from "react";
import { SkuResource } from "@/types/product.types";
import { 
  transformSkuToVariants, 
  findSkuByVariants,
  getAvailableVariants,
  VariantGroup 
} from "@/utils/product";

export const useProductVariants = (skus: SkuResource[]) => {
  const variantGroups = useMemo(() => transformSkuToVariants(skus), [skus]);
  
  // Auto-select if only one option per variant
  const initialVariants = useMemo(() => {
    const initial: Record<string, string> = {};
    variantGroups.forEach(group => {
      if (group.values.length === 1) {
        initial[group.attribute] = group.values[0];
      }
    });
    return initial;
  }, [variantGroups]);

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(initialVariants);

  const selectedSku = useMemo(
    () => findSkuByVariants(skus, selectedVariants),
    [skus, selectedVariants]
  );

  const selectVariant = (attribute: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [attribute]: value }));
  };

  const isVariantAvailable = (attribute: string, value: string): boolean => {
    const available = getAvailableVariants(skus, selectedVariants, attribute);
    return available.includes(value);
  };

  const resetSelection = () => {
    setSelectedVariants({});
  };

  const setSelectedSku = (sku: SkuResource | null) => {
    if (sku) {
      const skuVariants = sku.variants?.reduce((acc, v) => {
        acc[v.attribute.title] = v.attribute_value.title;
        return acc;
      }, {} as Record<string, string>) || {};
      setSelectedVariants(skuVariants);
    }
  };

  return {
    variantGroups,
    selectedVariants,
    selectedSku,
    selectVariant,
    isVariantAvailable,
    resetSelection,
    setSelectedSku
  };
};
