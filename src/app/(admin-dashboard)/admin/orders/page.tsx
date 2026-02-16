import { Metadata } from "next";
import { OrdersPageView } from "pages-sections/vendor-dashboard/orders/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("سفارشات", shopData);
}

export default function Orders() {
  return <OrdersPageView orders={[]} />;
}
