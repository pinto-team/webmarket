"use client";

import { ProfileEditPageView } from "pages-sections/customer-dashboard/profile/page-view";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileEdit() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated]); // router لازم نیست

    if (isLoading || !isAuthenticated || !user) return null;

    return <ProfileEditPageView user={user} />;
}
