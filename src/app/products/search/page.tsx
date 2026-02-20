import { Metadata } from "next";
import ProductSearchPageView from "./ProductSearchPageView";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata(
        tServer("products.search.metaTitle")
    );
}

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export default async function ProductSearch({ searchParams }: Props) {
    const { q } = await searchParams;
    return <ProductSearchPageView searchQuery={q || ""} />;
}
