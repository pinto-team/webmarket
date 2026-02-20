// src/app/login/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPageView } from "pages-sections/sessions/page-view";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";


export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata(tServer("auth.login"));
}

export default async function Login({
                                        searchParams,
                                    }: {
    searchParams?: Promise<{ session_expired?: string }>;
}) {
    const sp = (await searchParams) ?? {};

    if (sp.session_expired === "true") {
        redirect("/");
    }

    return <LoginPageView />;
}
