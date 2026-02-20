    import type { Metadata } from "next";
import GadgetTwoPageView from "pages-sections/home/page-view";

import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    const pageName = tServer<string>("meta.pageName.shop");

    return generatePageMetadata(pageName);
}

export default function GadgetShopTwo() {
    return <GadgetTwoPageView />;
}
