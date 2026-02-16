export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { CustomersPageView } from "pages-sections/vendor-dashboard/customers/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import api from "utils/__api__/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("مشتریان", shopData);
}

export default async function Customers() {
  const customers = await api.customers();
  return <CustomersPageView customers={customers} />;
}
