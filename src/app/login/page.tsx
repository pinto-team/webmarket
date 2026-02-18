import type { Metadata } from "next";
import { LoginPageView } from "pages-sections/sessions/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();

    return generatePageMetadata(
        tServer("auth.login"),
        shopData
    );
}

export default function Login() {
    return <LoginPageView />;
}
