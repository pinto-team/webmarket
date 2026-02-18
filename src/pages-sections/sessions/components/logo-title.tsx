"use client";

import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";

import { useShopData } from "@/contexts/ShopDataContext";
import { getServerImageUrl } from "@/utils/imageUtils";
import { t } from "@/i18n/t";

export default function LogoWithTitle() {
    const { shopData } = useShopData();

    const fallbackLogo = "/assets/images/logo2.svg";

    // ✅ فقط مدل proxy_url
    const logoUrl =
        shopData?.header_logo
            ? getServerImageUrl(shopData.header_logo, "90x90")
            : fallbackLogo;

    const title = shopData?.title || t("common.welcome");

    return (
        <FlexRowCenter flexDirection="column" gap={2} mb={4}>
            <img
                width={90}
                height={90}
                src={logoUrl}
                alt={title}
                style={{ objectFit: "contain", display: "block" }}
                loading="lazy"
                onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (el.src.includes(fallbackLogo)) return;
                    el.src = fallbackLogo;
                }}
            />

            <Typography fontWeight={600} variant="h5">
                {title}
            </Typography>
        </FlexRowCenter>
    );
}
