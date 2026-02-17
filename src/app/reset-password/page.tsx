import type { Metadata } from "next";
import { ResetPasswordPageView } from "pages-sections/sessions/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import { t } from "@/i18n/t";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();
    return generatePageMetadata(t("auth.resetPassword"), shopData);
}

export default function ResetPassword() {
    return <ResetPasswordPageView />;
}
