"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Container from "components/Container";
import { useShopData } from "@/contexts/ShopDataProvider";
import { getServerImageUrl } from "@/utils/imageUtils";
import { toPersianNumber } from "@/utils/persian";

import { bannerSx, overlaySx, contentSx, titleSx, subtitleSx, buttonSx } from "./banner.styles";

export default function Home_banner() {
    const { shopData } = useShopData();
    const banner = shopData?.home_banner;

    // اگر آبجکت نیست => هیچ
    if (!banner) return null;

    const title = banner.title ? toPersianNumber(banner.title) : "";
    const subtitle = banner.subtitle ? toPersianNumber(banner.subtitle) : "";
    const buttonText = banner.button_text ? toPersianNumber(banner.button_text) : "";
    const buttonLink = banner.button_link || "/";

    const imageUrl = banner.image ? getServerImageUrl(banner.image, "1400x400", 80) : "";

    // ✅ شرط اصلی: اگر هیچ محتوایی نداره => اصلاً رندر نشه
    const hasAnything =
        Boolean(imageUrl) ||
        Boolean(title?.trim()) ||
        Boolean(subtitle?.trim()) ||
        Boolean(buttonText?.trim());

    if (!hasAnything) return null;

    const isExternal = /^https?:\/\//i.test(buttonLink);

    return (
        <Container sx={{ mt: { xs: 3, sm: 5 } }}>
            <Box sx={{ ...bannerSx, ...(imageUrl ? { backgroundImage: `url("${imageUrl}")` } : {}) }}>
                <Box sx={overlaySx} />

                <Box sx={contentSx}>
                    <Box sx={{ minWidth: 0 }}>
                        {title && <Typography sx={titleSx}>{title}</Typography>}
                        {subtitle && <Typography sx={subtitleSx}>{subtitle}</Typography>}
                    </Box>

                    {buttonText && (
                        <Button
                            component={Link}
                            href={buttonLink}
                            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            variant="contained"
                            size="small"
                            sx={buttonSx}
                        >
                            {buttonText}
                        </Button>
                    )}
                </Box>
            </Box>
        </Container>
    );
}