"use client";

import React, { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";

import { getServerImageUrl, isPlaceholderProductImage, PLACEHOLDER_IMAGE_URL } from "@/utils/imageUtils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /**
     * ✅ Prefer entity (server object with proxy_url) OR src (proxy_url string)
     * src wins if provided.
     */
    entity?: any;
    src?: string;

    alt: string;

    /** e.g. "300x300" (recommended for proxy template urls) */
    size?: string;

    /** default 80 */
    quality?: number;

    /** default "lazy" */
    loading?: "lazy" | "eager";

    /** default: true */
    safeFallback?: boolean;
}

const StyledImg = styled("img")({
    width: "100%",
    height: "auto",
    display: "block",
});

const LazyImage = ({
                       entity,
                       src,
                       alt,
                       size,
                       quality = 80,
                       loading = "lazy",
                       safeFallback = true,
                       ...props
                   }: LazyImageProps) => {
    const initialSrc = useMemo(() => {
        if (src) return getServerImageUrl(src, size, quality);
        if (entity) return getServerImageUrl(entity, size, quality);
        return PLACEHOLDER_IMAGE_URL;
    }, [src, entity, size, quality]);

    const [imgSrc, setImgSrc] = useState(initialSrc);

    useEffect(() => {
        setImgSrc(initialSrc);
    }, [initialSrc]);

    return (
        <StyledImg
            src={imgSrc}
            alt={alt}
            loading={loading}
            onError={(e) => {
                props.onError?.(e);

                if (!safeFallback) return;

                const el = e.currentTarget as HTMLImageElement;

                // prevent infinite loops
                if (isPlaceholderProductImage(el.src)) return;

                setImgSrc(PLACEHOLDER_IMAGE_URL);
            }}
            {...props}
        />
    );
};

export default LazyImage;
