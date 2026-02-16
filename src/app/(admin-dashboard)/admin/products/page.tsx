export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { ProductsPageView } from "pages-sections/vendor-dashboard/products/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import api from "utils/__api__/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("محصولات", shopData);
}

export default async function Products() {
  const products = await api.products();
  return <ProductsPageView products={products} />;
}
