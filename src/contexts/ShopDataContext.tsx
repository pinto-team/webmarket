"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { ShopData } from "@/types/shopData.types";
import { shopDataService } from "@/services/shopData.service";

interface ShopDataContextType {
    shopData: ShopData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

interface ShopDataProviderProps {
    children: ReactNode;
    initialShopData?: ShopData | null;
}

export function ShopDataProvider({ children, initialShopData = null }: ShopDataProviderProps) {
    const [shopData, setShopData] = useState<ShopData | null>(initialShopData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchShopData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await shopDataService.getShopData();
            setShopData(data);
        } catch (err) {
            setError("Failed to load shop data");
            console.error("Shop data fetch error:", err);
        } finally {
            setLoading(false);
        }
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
