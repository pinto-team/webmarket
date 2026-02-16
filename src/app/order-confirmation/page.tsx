import type { Metadata } from "next";
import { OrderConfirmationPageView } from "pages-sections/order-confirmation";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("تایید سفارش", shopData);
}

export default function OrderConfirmation() {
  return <OrderConfirmationPageView />;
}
