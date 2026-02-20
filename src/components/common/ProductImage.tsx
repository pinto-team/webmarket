"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, type SxProps, type Theme } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

import {
    getServerImageUrl,
    isPlaceholderProductImage,
    PLACEHOLDER_IMAGE_URL,
} from "@/utils/imageUtils";

type FallbackMode = "icon" | "placeholder";

export interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /**
     * Any entity that may include proxy_url in one of these forms:
     * - entity.upload.proxy_url
     * - entity.proxy_url
     * - entity.image.proxy_url
     * - entity.icon.proxy_url
     */
    entity?: any;

    /**
     * Backward compatible alias:
     * Many places in your code likely use `product={...}`.
     * If both entity and product exist, entity wins.
     */
    product?: any;

    /**
     * If provided, src wins over entity/product.
     * src is expected to be a proxy_url (may include {WIDTH}/{HEIGHT}/{QUALITY} template).
     */
    src?: string;

    /**
     * e.g. "300x300"
     * If not provided, it will be derived from width/height.
     */
    size?: string;

    /**
     * Applied only when proxy_url is a template (has {WIDTH}/{HEIGHT}/{QUALITY}).
     * default: 80
     */
    quality?: number;

    /**
     * Optional wrapper support (useful in MUI layouts)
     */
    wrapperSx?: SxProps<Theme>;

    /**
     * - "icon": show an icon box if image fails
     * - "placeholder": fallback to PLACEHOLDER_IMAGE_URL if image fails
     * default: "icon"
     */
    fallback?: FallbackMode;

    /**
     * If true, renders only <img .../> without a wrapper <Box>.
     * default: false
     */
    noWrapper?: boolean;
}

function deriveSize(size?: string, width?: any, height?: any): string | undefined {
    if (size && String(size).trim().length > 0) return size;

    const w = Number(width);
    const h = Number(height);

    // If width/height are not provided, let backend choose defaults (via template)
    if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(h) || h <= 0) return undefined;

    return `${w}x${h}`;
}

export default function ProductImage({
                                         entity,
                                         product,
                                         src,
                                         size,
                                         quality = 80,
                                         alt = "image",
                                         width,
                                         height,
                                         wrapperSx,
                                         fallback = "icon",
                                         loading = "lazy",
                                         style,
                                         className,
                                         noWrapper = false,
                                         ...imgProps
                                     }: ProductImageProps) {
    const imageSize = useMemo(() => deriveSize(size, width, height), [size, width, height]);

    const initialSrc = useMemo(() => {
        // src wins (assumed proxy_url)
        if (src) return getServerImageUrl(src, imageSize, quality);

        // entity wins over product
        const base = entity ?? product;
        if (base) return getServerImageUrl(base, imageSize, quality);

        return PLACEHOLDER_IMAGE_URL;
    }, [src, entity, product, imageSize, quality]);

    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [failed, setFailed] = useState(false);

    // reset when inputs change
    useEffect(() => {
        setImgSrc(initialSrc);
        setFailed(false);
    }, [initialSrc]);

    const showImg = !failed || fallback === "placeholder";

    const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
        // allow user handler first
        imgProps.onError?.(e);

        // prevent infinite loop
        const current = (e.currentTarget as HTMLImageElement).src || imgSrc;
        if (isPlaceholderProductImage(current) || isPlaceholderProductImage(imgSrc)) {
            setFailed(true);
            return;
        }

        if (fallback === "placeholder") {
            setImgSrc(PLACEHOLDER_IMAGE_URL);
            return;
        }

        // fallback === "icon"
        setFailed(true);
    };

    const imgEl = (
        <img
            {...imgProps}
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            className={className}
            style={style}
            onError={handleError}
        />
    );

    if (noWrapper) return imgEl;

    return (
        <Box sx={{ display: "inline-block", ...wrapperSx }}>
            {showImg ? (
                imgEl
            ) : (
                <Box
                    sx={{
                        width: width || 48,
                        height: height || 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.100",
                        borderRadius: 2,
                    }}
                >
                    <ImageIcon sx={{ fontSize: 32, color: "grey.400" }} />
                </Box>
            )}
        </Box>
    );
}