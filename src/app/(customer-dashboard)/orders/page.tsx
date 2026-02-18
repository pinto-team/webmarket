"use client";

import { OrdersPageView } from "pages-sections/customer-dashboard/orders/page-view";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Orders() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated]); // router لازم نیست

    if (isLoading || !isAuthenticated) return null;

    return <OrdersPageView />;
}
