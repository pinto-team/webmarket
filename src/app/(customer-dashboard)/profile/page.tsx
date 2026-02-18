"use client";

import { ProfilePageView } from "pages-sections/customer-dashboard/profile/page-view";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated]);
    if (isLoading || !user) return null;

    return <ProfilePageView user={user} />;
}
