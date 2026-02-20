import type { Metadata } from "next";
import { RegisterPageView } from "pages-sections/sessions/page-view";
import { generatePageMetadata } from "@/utils/metadata";
import { t } from "@/i18n/t";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata(
        t("meta.pages.register")
    );
}

export default function Register() {
    return <RegisterPageView />;
}
