"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Button from "@mui/material/Button";

import { useShopData } from "@/contexts/ShopDataProvider";

/**
 * ShopDataLoader
 * - Ensures shop data exists on client without causing refetch loops.
 * - Refetches at most once per "mount session" unless user manually retries.
 * - Avoids re-running effect when refetch function identity changes.
 */
export default function ShopDataLoader({ children }: { children: React.ReactNode }) {
    const { shopData, loading, error, refetch } = useShopData();

    // Track whether we've attempted an auto-refetch during this mount session
    const attemptedAutoRefetchRef = useRef(false);

    // Keep the latest refetch function without re-triggering the effect
    const refetchRef = useRef(refetch);
    useEffect(() => {
        refetchRef.current = refetch;
    }, [refetch]);

    // Optional debug flag (set NEXT_PUBLIC_SHOPDATA_DEBUG=true)
    const debugEnabled = useMemo(() => {
        return process.env.NEXT_PUBLIC_SHOPDATA_DEBUG === "true";
    }, []);

    useEffect(() => {
        // If we already have data, do nothing.
        if (shopData) {
            if (debugEnabled) console.log("[ShopDataLoader] shopData exists → no refetch");
            return;
        }

        // If currently loading, wait.
        if (loading) {
            if (debugEnabled) console.log("[ShopDataLoader] loading=true → wait");
            return;
        }

        // Only try once automatically.
        if (attemptedAutoRefetchRef.current) {
            if (debugEnabled) console.log("[ShopDataLoader] auto-refetch already attempted → stop");
            return;
        }

        attemptedAutoRefetchRef.current = true;
        if (debugEnabled) console.log("[ShopDataLoader] auto-refetch starting...");

        // Use latest refetch without depending on its identity
        void refetchRef.current();
    }, [shopData, loading, debugEnabled]);

    return (
        <>
            {error ? (
                <div className="bg-error-100 text-error px-3 py-2 text-sm" role="alert">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                        }}
                    >
                        <span>اطلاعات فروشگاه بارگذاری نشد. لطفاً دوباره تلاش کنید.</span>

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                // Allow another auto attempt after manual retry
                                attemptedAutoRefetchRef.current = false;
                                if (debugEnabled) console.log("[ShopDataLoader] manual retry clicked");

                                void refetchRef.current();
                            }}
                        >
                            تلاش مجدد
                        </Button>
                    </div>
                </div>
            ) : null}

            {children}
        </>
    );
}