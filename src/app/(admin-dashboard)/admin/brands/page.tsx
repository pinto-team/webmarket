import { Metadata } from "next";
import { BrandsPageView } from "pages-sections/vendor-dashboard/brands/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import api from "@/utils/__api__/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("برندها", shopData);
}


export default async function Brands() {
  const brands = await api.brands();
  return <BrandsPageView brands={brands} />;
}
