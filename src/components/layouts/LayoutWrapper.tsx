"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import ShopLayout1 from "./shop-layout-1";
import LayoutModel from "models/Layout.model";

interface Props {
  children: ReactNode;
  data: LayoutModel;
}

const AUTH_PAGES = ["/login", "/register", "/reset-password"];

export default function LayoutWrapper({ children, data }: Props) {
  const pathname = usePathname();
  
  // Check if current page is an auth page
  const isAuthPage = AUTH_PAGES.includes(pathname);
  
  // For auth pages, return children without layout
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // For other pages, use ShopLayout1
  return <ShopLayout1 data={data}>{children}</ShopLayout1>;
}