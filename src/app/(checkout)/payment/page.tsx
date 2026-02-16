import type { Metadata } from "next";
import { PaymentPageViewNew } from "pages-sections/payment/page-view-new";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("پرداخت", shopData);
}

export default function Payment() {
  return <PaymentPageViewNew />;
}
