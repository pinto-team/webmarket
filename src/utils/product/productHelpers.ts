/**
 * Product Helper Utilities
 */

import { SkuResource, CommentResource } from "@/types/product.types";
import { formatPersianPrice } from "@/utils/persian";
import { t } from "@/i18n/t";

/**
 * Calculate average rating
 */
export const calculateAverageRating = (comments?: CommentResource[]): number => {
    if (!comments || comments.length === 0) return 0;

    const total = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return Math.round((total / comments.length) * 10) / 10;
};

/**
 * Calculate total stock
 */
export const calculateTotalStock = (skus: SkuResource[]): number => {
    return skus.reduce((total, sku) => total + sku.stock, 0);
};

/**
 * Get minimum price
 */
export const getMinPrice = (skus: SkuResource[]): number => {
    if (skus.length === 0) return 0;
    return Math.min(...skus.map((sku) => sku.price));
};

/**
 * Get maximum price
 */
export const getMaxPrice = (skus: SkuResource[]): number => {
    if (skus.length === 0) return 0;
    return Math.max(...skus.map((sku) => sku.price));
};

/**
 * Check stock availability
 */
export const isInStock = (skus: SkuResource[]): boolean => {
    return skus.some((sku) => sku.stock > 0);
};

/**
 * Get stock status label
 */
export const getStockStatus = (stock: number): string => {
    if (stock === 0) return t("products.outOfStock");
    if (stock <= 5) return t("products.lowStock");
    return t("products.inStock");
};

/**
 * Format price range
 */
export const formatPriceRange = (minPrice: number, maxPrice: number): string => {
    const currency = t("products.currencyLabel");

    if (minPrice === maxPrice) {
        return `${formatPersianPrice(minPrice)} ${currency}`;
    }

    return `${formatPersianPrice(minPrice)} ${t("common.dash")} ${formatPersianPrice(maxPrice)} ${currency}`;
};
