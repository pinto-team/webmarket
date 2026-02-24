"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import { t } from "@/i18n/t";

type Props = {
    href?: string;
    src?: string;          // should already be a final url (from buildShopChrome)
    alt?: string;
    width?: number;
    height?: number;
    maxHeight?: number;
    fallbackSrc?: string;  // e.g. "/assets/images/logo2.svg"
};

export default function LogoImage({
                                      href = "/",
                                      src,
                                      alt,
                                      width = 90,
                                      height = 50,
                                      maxHeight = 44,
                                      fallbackSrc = "/assets/images/logo2.svg",
                                  }: Props) {
    const [failed, setFailed] = useState(false);

    const cleanSrc = useMemo(() => (src || "").trim(), [src]);
    const finalSrc = cleanSrc && !failed ? cleanSrc : fallbackSrc;

    // اگر حتی fallback هم نداریم، هیچی رندر نکن
    if (!finalSrc) return null;

    const img = (
        <img
            src={finalSrc}
            alt={alt || t("common.logoAlt")}
            width={width}
            height={height}
            loading="lazy"
            style={{
                objectFit: "contain",
                maxHeight,
                width: "auto",
                display: "block",
            }}
            onError={() => {
                // اگر src اصلی fail شد، برو fallback
                if (finalSrc !== fallbackSrc) setFailed(true);
            }}
        />
    );

    return (
        <Link href={href} style={{ display: "inline-flex", alignItems: "center" }}>
            {img}
        </Link>
    );
}