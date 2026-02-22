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

export interface ProductImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement> {
    entity?: any;
    product?: any;
    src?: string;
    size?: string;
    quality?: number;
    wrapperSx?: SxProps<Theme>;
    fallback?: FallbackMode;
    noWrapper?: boolean;
}

function deriveSize(size?: string, width?: any, height?: any): string | undefined {
    if (size && String(size).trim().length > 0) return size;

    const w = Number(width);
    const h = Number(height);

    if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(h) || h <= 0)
        return undefined;

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
                                         fallback,
                                         loading = "lazy",
                                         style,
                                         className,
                                         noWrapper = false,
                                         ...imgProps
                                     }: ProductImageProps) {
    const imageSize = useMemo(
        () => deriveSize(size, width, height),
        [size, width, height]
    );

    const initialSrc = useMemo(() => {
        if (src) return getServerImageUrl(src, imageSize, quality);

        const base = entity ?? product;
        if (base) return getServerImageUrl(base, imageSize, quality);

        return "";
    }, [src, entity, product, imageSize, quality]);

    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setImgSrc(initialSrc);
        setFailed(false);
    }, [initialSrc]);

    // 🚫 اگر هیچ تصویری نداریم → اصلاً رندر نشود
    if (!imgSrc) {
        return null;
    }

    const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
        imgProps.onError?.(e);

        const current = (e.currentTarget as HTMLImageElement).src || imgSrc;

        if (isPlaceholderProductImage(current)) {
            setFailed(true);
            return;
        }

        if (fallback === "placeholder") {
            setImgSrc(PLACEHOLDER_IMAGE_URL);
            return;
        }

        if (fallback === "icon") {
            setFailed(true);
            return;
        }

        // اگر fallback تعریف نشده → چیزی نمایش داده نشود
        setFailed(true);
    };

    if (failed && fallback === "icon") {
        return (
            <Box
                sx={{
                    width: width || 48,
                    height: height || 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                    borderRadius: 2,
                    ...wrapperSx,
                }}
            >
                <ImageIcon sx={{ fontSize: 32, color: "grey.400" }} />
            </Box>
        );
    }

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

    if (failed && !fallback) {
        return null;
    }

    if (noWrapper) return imgEl;

    return (
        <Box sx={{ display: "inline-block", ...wrapperSx }}>
            {imgEl}
        </Box>
    );
}