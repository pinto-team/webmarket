export const dynamic = "force-dynamic";


import { Metadata } from "next";
import { CategoriesPageView } from "pages-sections/vendor-dashboard/categories/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import api from "@/utils/__api__/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("دسته‌بندی‌ها", shopData);
}


export default async function Categories() {
  const categories = await api.category();
  return <CategoriesPageView categories={categories} />;
}
