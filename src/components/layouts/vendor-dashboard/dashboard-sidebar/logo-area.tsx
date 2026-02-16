"use client";

import Avatar from "@mui/material/Avatar";
import FlexBetween from "components/flex-box/flex-between";
import { useShopData } from "@/contexts/ShopDataContext";
import { useLayout } from "../dashboard-layout-context";
import { ChevronLeftIcon } from "./styles";

export default function LogoArea() {
  const { TOP_HEADER_AREA, COMPACT, sidebarCompact, handleSidebarCompactToggle } = useLayout();
  const { shopData } = useShopData();
  
  const logoUrl = COMPACT 
    ? (shopData?.mobile_logo?.main_url || "/assets/images/bazaar-white-sm.svg")
    : (shopData?.header_logo?.main_url || "/assets/images/logo.svg");

  return (
    <FlexBetween
      p={2}
      maxHeight={TOP_HEADER_AREA}
      justifyContent={COMPACT ? "center" : "space-between"}>
      <Avatar
        alt="Logo"
        src={logoUrl}
        sx={{ borderRadius: 0, width: "auto", marginLeft: COMPACT ? 0 : 1 }}
      />

      <ChevronLeftIcon
        color="disabled"
        compact={COMPACT}
        onClick={handleSidebarCompactToggle}
        sidebar_compact={sidebarCompact ? 1 : 0}
      />
    </FlexBetween>
  );
}
