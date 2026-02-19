import { shopDataService } from "@/services/shopData.service";
import { ShopsPageView } from "@/pages-sections/shops/page-view";

export default async function GadgetTwoPageView() {
  const shops = await shopDataService.getShops();

  const totalShops = shops.length;
  const totalPages = 1;
  const firstIndex = totalShops ? 1 : 0;
  const lastIndex = totalShops;

  return (
    <ShopsPageView
      shops={shops as any}
      totalShops={totalShops}
      totalPages={totalPages}
      firstIndex={firstIndex}
      lastIndex={lastIndex}
    />
  );
}
