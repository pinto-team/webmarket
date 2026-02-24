"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Container from "components/Container";
import { useShopData } from "@/contexts/ShopDataProvider";
import { getServerImageUrl } from "@/utils/imageUtils";
import { toPersianNumber } from "@/utils/persian";

import { bannerSx, overlaySx, contentSx, titleSx, subtitleSx, buttonSx } from "./banner.styles";

type Props = {
    /**
     * Called once when banner has meaningful content.
     * Used by Home page to decide whether to show EmptyPage.
     */
    onHasContent?: () => void;
};

export default function Home_banner({ onHasContent }: Props) {
    const { shopData } = useShopData();
    const banner = shopData?.home_banner;

    // if missing => render nothing
    if (!banner) return null;

    const title = banner.title ? toPersianNumber(banner.title) : "";
    const subtitle = banner.subtitle ? toPersianNumber(banner.subtitle) : "";
    const buttonText = banner.button_text ? toPersianNumber(banner.button_text) : "";
    const buttonLink = banner.button_link || "/";

    const imageUrl = banner.image ? getServerImageUrl(banner.image, "1400x400", 80) : "";

    const hasAnything =
        Boolean(imageUrl) ||
        Boolean(title.trim()) ||
        Boolean(subtitle.trim()) ||
        Boolean(buttonText.trim());

    // signal once if we have content
    const signaledRef = useRef(false);

    useEffect(() => {
        if (!hasAnything) return;
        if (signaledRef.current) return;

        signaledRef.current = true;
        onHasContent?.();
    }, [hasAnything, onHasContent]);

    if (!hasAnything) return null;

    const isExternal = useMemo(() => /^https?:\/\//i.test(buttonLink), [buttonLink]);

    return (
        <Container sx={{ mt: { xs: 3, sm: 5 } }}>
            <Box sx={{ ...bannerSx, ...(imageUrl ? { backgroundImage: `url("${imageUrl}")` } : {}) }}>
                <Box sx={overlaySx} />

                <Box sx={contentSx}>
                    <Box sx={{ minWidth: 0 }}>
                        {title ? <Typography sx={titleSx}>{title}</Typography> : null}
                        {subtitle ? <Typography sx={subtitleSx}>{subtitle}</Typography> : null}
                    </Box>

                    {buttonText ? (
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
                    ) : null}
                </Box>
            </Box>
        </Container>
    );
}