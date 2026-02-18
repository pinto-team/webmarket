import { Metadata } from "next";
import BlogSearchPageView from "./BlogSearchPageView";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();

    return generatePageMetadata(
        tServer("blog.search.metaTitle"),
        shopData
    );
}

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export default async function BlogSearch({ searchParams }: Props) {
    const { q } = await searchParams;
    return <BlogSearchPageView searchQuery={q || ""} />;
}
