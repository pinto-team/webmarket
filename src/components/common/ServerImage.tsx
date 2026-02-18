"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, type SxProps, type Theme } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

import { getServerImageUrl, isPlaceholderProductImage, PLACEHOLDER_IMAGE_URL } from "@/utils/imageUtils";

type FallbackMode = "icon" | "placeholder";

interface ServerImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    entity?: any;      // anything containing proxy_url
    src?: string;      // optional direct proxy_url (wins)
    size?: string;     // "300x300"
    quality?: number;  // default 80
    wrapperSx?: SxProps<Theme>;
    fallback?: FallbackMode;
}

export default function ServerImage({
                                        entity,
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
                                        ...imgProps
                                    }: ServerImageProps) {
    const initialSrc = useMemo(() => {
        if (src) return getServerImageUrl(src, size, quality);
        if (entity) return getServerImageUrl(entity, size, quality);
        return PLACEHOLDER_IMAGE_URL;
    }, [src, entity, size, quality]);

    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setImgSrc(initialSrc);
        setFailed(false);
    }, [initialSrc]);

    const isPlaceholder = isPlaceholderProductImage(imgSrc);
    const showImg = !failed || fallback === "placeholder";

    return (
        <Box sx={{ display: "inline-block", ...wrapperSx }}>
            {showImg ? (
                <img
                    {...imgProps}
                    src={imgSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={loading}
                    style={style}
                    onError={(e) => {
                        imgProps.onError?.(e);

                        const el = e.currentTarget as HTMLImageElement;
                        if (isPlaceholderProductImage(el.src)) {
                            setFailed(true);
                            return;
                        }

                        if (fallback === "placeholder") {
                            setImgSrc(PLACEHOLDER_IMAGE_URL);
                            return;
                        }

                        setFailed(true);
                    }}
                />
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
