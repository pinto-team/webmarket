"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ShopData } from "@/types/shopData.types";
import { shopDataService } from "@/services/shopData.service";
import { productService } from "@/services/product.service";
import { buildCategoryTree } from "@/utils/categoryTree";

interface ShopDataContextType {
    shopData: ShopData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

export function ShopDataProvider({ children }: { children: ReactNode }) {
    const [shopData, setShopData] = useState<ShopData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchShopData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1) shop data
            const data = await shopDataService.getShopData();

            // 2) real categories (same source as /products)
            const realCats = await productService.getCategories();

            // 3) build tree if needed (your CategoryMenu expects tree)
            const treeCats = buildCategoryTree(realCats as any);

            // 4) override product_categories
            setShopData({
                ...data,
                product_categories: treeCats as any
            });
        } catch (err) {
            setError("Failed to load shop data");
            console.error("Shop data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopData();
    }, []);

    return (
        <ShopDataContext.Provider value={{ shopData, loading, error, refetch: fetchShopData }}>
            {children}
        </ShopDataContext.Provider>
    );
}

export function useShopData() {
    const context = useContext(ShopDataContext);
    if (!context) throw new Error("useShopData must be used within ShopDataProvider");
    return context;
}
