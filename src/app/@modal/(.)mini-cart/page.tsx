"use client";

import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import Drawer from "@mui/material/Drawer";
// GLOBAL CUSTOM COMPONENTS
import { MiniCart } from "pages-sections/mini-cart";

function MiniCartContent() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname !== "/mini-cart") return null;

  return (
    <Drawer open anchor="right" onClose={router.back} sx={{ zIndex: 9999 }}>
      <MiniCart />
    </Drawer>
  );
}

export default function MiniCartDrawer() {
  return (
    <Suspense fallback={null}>
      <MiniCartContent />
    </Suspense>
  );
}
