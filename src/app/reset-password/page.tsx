import type { Metadata } from "next";
import { ResetPasswordPageView } from "pages-sections/sessions/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("بازیابی رمز عبور", shopData);
}

export default function ResetPassword() {
  return <ResetPasswordPageView />;
}
