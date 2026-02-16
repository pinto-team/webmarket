"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShopData } from "@/contexts/ShopDataContext";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";

export default function ShopDataLoader({ children }: { children: React.ReactNode }) {
  const { shopData, loading, error } = useShopData();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/shop-error");
    }
  }, [error, router]);

  if (loading) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return null;
  }

  return <>{children}</>;
}
