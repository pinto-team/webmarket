"use client";

import React, { useEffect, useRef } from "react";
import Button from "@mui/material/Button";

import { useShopData } from "@/contexts/ShopDataProvider";

export default function ShopDataLoader({ children }: { children: React.ReactNode }) {
    const { shopData, loading, error, refetch } = useShopData();

    // prevent refetch loops
    const triedRef = useRef(false);

    useEffect(() => {
        // If we already have data, we're done.
        if (shopData) return;

        // If already loading, wait.
        if (loading) return;

        // If we tried once, don't hammer.
        if (triedRef.current) return;

        // No data + not loading => try once.
        triedRef.current = true;
        void refetch();
    }, [shopData, loading, refetch]);

    return (
        <>
            {error ? (
                <div className="bg-error-100 text-error px-3 py-2 text-sm" role="alert">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <span>اطلاعات فروشگاه بارگذاری نشد. لطفاً دوباره تلاش کنید.</span>

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                triedRef.current = false; // allow retry
                                void refetch();
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