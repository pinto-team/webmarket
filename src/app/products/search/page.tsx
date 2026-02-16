import { Metadata } from "next";
import ProductSearchPageView from "./ProductSearchPageView";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("جستجوی محصولات", shopData);
}

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProductSearch({ searchParams }: Props) {
  const { q } = await searchParams;
  return <ProductSearchPageView searchQuery={q || ""} />;
}
