/**
 * Group SKUs by shop for marketplace display
 */

import { SkuResource, ShopResource } from "@/types/product.types";

export interface ShopGroup {
  shop: ShopResource;
  skus: SkuResource[];
  minPrice: number;
  maxPrice: number;
  minDelivery: number;
  maxDelivery: number;
  totalStock: number;
}

/**
 * Group SKUs by shop and calculate aggregates
 */
export const groupSkusByShop = (skus: SkuResource[]): ShopGroup[] => {
  const shopMap = new Map<string, ShopGroup>();

  skus.forEach(sku => {
    const shopTitle = sku.shop.title;

    if (!shopMap.has(shopTitle)) {
      shopMap.set(shopTitle, {
        shop: sku.shop,
        skus: [],
        minPrice: sku.price,
        maxPrice: sku.price,
        minDelivery: sku.delivery,
        maxDelivery: sku.delivery,
        totalStock: 0
      });
    }

    const group = shopMap.get(shopTitle)!;
    group.skus.push(sku);
    group.minPrice = Math.min(group.minPrice, sku.price);
    group.maxPrice = Math.max(group.maxPrice, sku.price);
    group.minDelivery = Math.min(group.minDelivery, sku.delivery);
    group.maxDelivery = Math.max(group.maxDelivery, sku.delivery);
    group.totalStock += sku.stock;
  });

  return Array.from(shopMap.values());
};

/**
 * Get unique shops from SKUs
 */
export const getUniqueShops = (skus: SkuResource[]): ShopResource[] => {
  const shopMap = new Map<string, ShopResource>();
  
  skus.forEach(sku => {
    if (!shopMap.has(sku.shop.title)) {
      shopMap.set(sku.shop.title, sku.shop);
    }
  });

  return Array.from(shopMap.values());
};
