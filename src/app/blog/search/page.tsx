import { Metadata } from "next";
import BlogSearchPageView from "./BlogSearchPageView";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata(
        tServer("blog.search.metaTitle")
    );
}

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export default async function BlogSearch({ searchParams }: Props) {
    const { q } = await searchParams;
    return <BlogSearchPageView searchQuery={q || ""} />;
}
