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

import { bannerSx, contentSx, titleSx, subtitleSx, buttonSx } from "./banner.styles";

type Props = {
    /**
     * Called once when banner has meaningful content.
     * Used by Home page to decide whether to show EmptyPage.
     */
    onHasContent?: () => void;
};

function isHttpUrl(url: string) {
    return /^https?:\/\//i.test(url);
}

export default function Home_banner({ onHasContent }: Props) {
    const { shopData } = useShopData();
    const banner = shopData?.home_banner;

    // if missing => render nothing
    if (!banner) return null;

    const title = banner.title ? toPersianNumber(banner.title) : "";
    const subtitle = banner.subtitle ? toPersianNumber(banner.subtitle) : "";

    // ✅ only show button if server provided button_text
    const buttonText = banner.button_text ? toPersianNumber(banner.button_text) : "";

    // ✅ banner is clickable only if we have a link (otherwise no Link wrapper)
    const buttonLink = (banner.button_link || "").trim();

    const imageUrl = banner.image ? getServerImageUrl(banner.image, "1920x800", 100) : "";

    const hasAnything =
        Boolean(imageUrl) || Boolean(title.trim()) || Boolean(subtitle.trim()) || Boolean(buttonText.trim());

    // signal once if we have content
    const signaledRef = useRef(false);

    useEffect(() => {
        if (!hasAnything) return;
        if (signaledRef.current) return;

        signaledRef.current = true;
        onHasContent?.();
    }, [hasAnything, onHasContent]);

    if (!hasAnything) return null;

    const hasLink = Boolean(buttonLink);
    const isExternal = useMemo(() => (hasLink ? isHttpUrl(buttonLink) : false), [buttonLink, hasLink]);

    // ✅ common props for Link wrapper when banner is clickable
    const linkProps = hasLink
        ? {
            href: buttonLink,
            ...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        }
        : null;

    const BannerBox = (
        <Box
            sx={{
                ...bannerSx,
                ...(imageUrl ? { backgroundImage: `url("${imageUrl}")` } : {}),
                ...(hasLink
                    ? {
                        cursor: "pointer",
                        textDecoration: "none",
                        // nice UX hover (optional)
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                            transform: "translateY(-1px)",
                        },
                    }
                    : null),
            }}
        >
            <Box sx={contentSx}>
                <Box sx={{ minWidth: 0 }}>
                    {title ? <Typography sx={titleSx}>{title}</Typography> : null}
                    {subtitle ? <Typography sx={subtitleSx}>{subtitle}</Typography> : null}
                </Box>

                {/* ✅ show button ONLY if text exists (but DO NOT make it a Link to avoid nested anchors) */}
                {buttonText ? (
                    <Button
                        variant="contained"
                        size="small"
                        sx={buttonSx}
                        // ✅ prevent accidental double-trigger when parent is clickable
                        onClick={(e) => {
                            // parent Link will handle navigation
                            e.preventDefault();
                            e.stopPropagation();
                            // manually navigate so click on button still works
                            if (hasLink) {
                                if (isExternal) window.open(buttonLink, "_blank", "noopener,noreferrer");
                                else window.location.assign(buttonLink);
                            }
                        }}
                    >
                        {buttonText}
                    </Button>
                ) : null}
            </Box>
        </Box>
    );

    // ✅ If link exists => wrap whole banner in Link. Otherwise render plain.
    return (
        <Container sx={{ mt: { xs: 3, sm: 5 } }}>
            {hasLink ? (
                <Box component={Link} {...(linkProps as any)} sx={{ textDecoration: "none", display: "block" }}>
                    {BannerBox}
                </Box>
            ) : (
                BannerBox
            )}
        </Container>
    );
}