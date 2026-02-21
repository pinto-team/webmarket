"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getPostLoginNavigation, getSafeNextUrl } from "@/utils/auth-navigation";

export function useLoginContinuation() {
    const searchParams = useSearchParams();

    const next = useMemo(
        () => getSafeNextUrl(searchParams.get("next") ?? searchParams.get("redirect")),
        [searchParams]
    );

    const isModal = searchParams.get("modal") === "1";

    return {
        next,
        isModal,
        postLoginNavigation: getPostLoginNavigation(next, isModal),
        sessionExpired: searchParams.get("session_expired") === "true",
    };
}
