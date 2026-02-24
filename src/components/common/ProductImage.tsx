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
    entity?: any;
    product?: any;
    src?: string;
    size?: string;
    quality?: number;
    wrapperSx?: SxProps<Theme>;
    fallback?: FallbackMode;
    noWrapper?: boolean;
}

function isNonEmptyString(v: unknown): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

function deriveSize(size?: string, width?: any, height?: any): string | undefined {
    if (isNonEmptyString(size)) return size.trim();

    const w = Number(width);
    const h = Number(height);

    if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(h) || h <= 0) return undefined;

    return `${w}x${h}`;
}

function resolveBaseInput(entity?: any, product?: any, src?: string): any {
    if (isNonEmptyString(src)) return src.trim();
    return entity ?? product ?? null;
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
    const imageSize = useMemo(() => deriveSize(size, width, height), [size, width, height]);

    const initialResolvedSrc = useMemo(() => {
        const base = resolveBaseInput(entity, product, src);

        // No image input at all
        if (!base) return "";

        // Compute proxy/server URL
        const url = getServerImageUrl(base, imageSize, quality);

        // Ensure non-empty string only
        return isNonEmptyString(url) ? url.trim() : "";
    }, [entity, product, src, imageSize, quality]);

    const [imgSrc, setImgSrc] = useState<string>(initialResolvedSrc);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setImgSrc(initialResolvedSrc);
        setFailed(false);
    }, [initialResolvedSrc]);

    // ✅ If no src, decide via fallback (never render <img src="">)
    if (!isNonEmptyString(imgSrc)) {
        if (fallback === "placeholder") {
            return (
                <img
                    {...imgProps}
                    src={PLACEHOLDER_IMAGE_URL}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={loading}
                    className={className}
                    style={style}
                />
            );
        }

        if (fallback === "icon") {
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

        return null;
    }

    const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
        imgProps.onError?.(e);

        const current = (e.currentTarget as HTMLImageElement).src || imgSrc;

        // If we are already on placeholder and it fails, stop.
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

        // no fallback -> show nothing
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

    if (failed && !fallback) return null;

    const imgEl = (
        <img
            {...imgProps}
            src={imgSrc} // ✅ guaranteed non-empty
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

    return <Box sx={{ display: "inline-block", ...wrapperSx }}>{imgEl}</Box>;
}