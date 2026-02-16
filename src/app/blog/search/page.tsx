import { Metadata } from "next";
import BlogSearchPageView from "./BlogSearchPageView";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("جستجوی مقالات", shopData);
}

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function BlogSearch({ searchParams }: Props) {
  const { q } = await searchParams;
  return <BlogSearchPageView searchQuery={q || ""} />;
}