"use client";

import Image from "next/image";
import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";
import { useShopData } from "@/contexts/ShopDataContext";
import logo from "../../../../public/assets/images/logo2.svg";
import { t } from "@/i18n/t";

export default function LogoWithTitle() {
    const { shopData } = useShopData();

    const logoUrl = shopData?.header_logo?.main_url || logo;
    const title = shopData?.title || t("common.welcome");

    return (
        <FlexRowCenter flexDirection="column" gap={2} mb={4}>
            <Image
                width={90}
                height={90}
                src={logoUrl}
                alt={title}
                style={{ objectFit: "contain" }}
            />

            <Typography fontWeight={600} variant="h5">
                {title}
            </Typography>
        </FlexRowCenter>
    );
}
