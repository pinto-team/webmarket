import type { Metadata } from "next";
import { ResetPasswordPageView } from "pages-sections/sessions/page-view";
import { generatePageMetadata } from "@/utils/metadata";
import { t } from "@/i18n/t";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata(t("auth.resetPassword"));
}

export default function ResetPassword() {
    return <ResetPasswordPageView />;
}
