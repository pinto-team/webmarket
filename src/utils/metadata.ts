import { Metadata } from "next";
import { ShopData } from "@/types/shopData.types";

export function generatePageMetadata(
  pageTitle: string,
  shopData?: ShopData | null
): Metadata {
  const shopTitle = shopData?.title || "فروشگاه";
  const title = `${pageTitle} - ${shopTitle}`;
  
  return {
    title,
    description: `${pageTitle} در ${shopTitle}`,
    authors: [{ name: shopTitle }],
    keywords: [pageTitle, shopTitle, "فروشگاه آنلاین", "خرید اینترنتی"]
  };
}
