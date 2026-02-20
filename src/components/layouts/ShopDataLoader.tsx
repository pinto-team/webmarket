"use client";

import { useShopData } from "@/contexts/ShopDataContext";

export default function ShopDataLoader({ children }: { children: React.ReactNode }) {
  const { error } = useShopData();

  return (
    <>
      {error && (
        <div className="bg-error-100 text-error px-3 py-2 text-sm" role="alert">
          اطلاعات فروشگاه بارگذاری نشد. لطفاً دوباره تلاش کنید.
        </div>
      )}
      {children}
    </>
  );
}
