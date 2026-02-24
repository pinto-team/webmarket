"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";

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

function isMeaningfulString(v: unknown): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

function hasAnyArray(v: unknown): boolean {
    return Array.isArray(v) && v.length > 0;
}

/**
 * ✅ Determine whether the initialShopData is actually usable.
 * We treat "empty shell objects" as invalid to avoid false "loaded" states.
 */
function isValidShopData(data: ShopData | null | undefined): data is ShopData {
    if (!data || typeof data !== "object") return false;

    return (
        isMeaningfulString((data as any).title) ||
        isMeaningfulString((data as any).theme?.code) ||
        hasAnyArray((data as any).main_navigation) ||
        hasAnyArray((data as any).hero_slider) ||
        hasAnyArray((data as any).product_categories) ||
        hasAnyArray((data as any).faqs) ||
        hasAnyArray((data as any).blog_posts)
    );
}

export function ShopDataProvider({ children, initialShopData = null }: ShopDataProviderProps) {
    const hasInitial = useMemo(() => isValidShopData(initialShopData), [initialShopData]);

    const [shopData, setShopData] = useState<ShopData | null>(hasInitial ? initialShopData : null);
    const [loading, setLoading] = useState<boolean>(!hasInitial);
    const [error, setError] = useState<string | null>(null);

    const reqIdRef = useRef(0);

    const fetchShopData = useCallback(async () => {
        const reqId = ++reqIdRef.current;

        try {
            setLoading(true);
            setError(null);

            const data = await shopDataService.getShopData();

            // ✅ Ignore stale responses (dev strict mode / remounts)
            if (reqId !== reqIdRef.current) return;

            setShopData(data);
        } catch (err) {
            if (reqId !== reqIdRef.current) return;

            setError("Failed to load shop data");
            console.error("Shop data fetch error:", err);
            setShopData(null);
        } finally {
            if (reqId === reqIdRef.current) {
                setLoading(false);
            }
        }
    }, []);

    // ✅ Always ensure we fetch if initial is missing/invalid
    useEffect(() => {
        if (!hasInitial) {
            fetchShopData();
        } else {
            // initial exists but later invalidates? keep state consistent
            setShopData(initialShopData);
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasInitial]);

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