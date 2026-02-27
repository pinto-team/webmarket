"use client";

import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";

import { t } from "@/i18n/t";
import { useShopData } from "@/contexts/ShopDataProvider";
import { getLogoImageUrl } from "@/utils/imageUtils";

interface LogoWithTitleProps {
    hideTitle?: boolean;
    height?: number;
    gap?: number;
}

export default function LogoWithTitle({
                                          hideTitle = false,
                                          height = 44,
                                          gap = 4,
                                      }: LogoWithTitleProps) {
    const { shopData } = useShopData();

    const fallbackLogo = "/assets/images/logo2.svg";

    const title = shopData?.title || t("common.welcome");

    const logoUrl =
        shopData?.header_logo
            ? getLogoImageUrl(shopData.header_logo, "640x240", 90)
            : fallbackLogo;

    return (
        <FlexRowCenter flexDirection="column" gap={gap} mb={4}>
            <img
                src={logoUrl}
                alt={title}
                loading="lazy"
                style={{
                    height,
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                    display: "block",
                }}
                onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (el.src.includes(fallbackLogo)) return;
                    el.src = fallbackLogo;
                }}
            />

            {!hideTitle && (
                <Typography fontWeight={600} variant="h5">
                    {title}
                </Typography>
            )}
        </FlexRowCenter>
    );
}