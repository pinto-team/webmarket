// src/app/login/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPageView } from "pages-sections/sessions/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();
    return generatePageMetadata(tServer("auth.login"), shopData);
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
