"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, type SxProps, type Theme } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

import {
    getProductImageUrl,
    isPlaceholderProductImage,
    PLACEHOLDER_PRODUCT_IMAGE,
} from "@/utils/imageUtils";
import { t } from "@/i18n/t";

type FallbackMode = "icon" | "placeholder";

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    product?: any;

    /** If provided, src wins over product */
    src?: string;

    alt?: string;

    /** e.g. "300x300" */
    size?: string;

    /** Convenience: if size not provided */
    width?: number;
    height?: number;

    /** Optional wrapper support (useful for MUI layouts) */
    wrapperSx?: SxProps<Theme>;

    /** default: "icon" */
    fallback?: FallbackMode;
}

export const ProductImage: React.FC<ProductImageProps> = ({
                                                              product,
                                                              src,
                                                              alt,
                                                              width = 200,
                                                              height = 200,
                                                              size,
                                                              className = "",
                                                              style,
                                                              wrapperSx,
                                                              fallback = "icon",
                                                              loading = "lazy",
                                                              ...imgProps
                                                          }) => {
    const imageSize = useMemo(() => size || `${width}x${height}`, [size, width, height]);

    const initialSrc = useMemo(() => {
        if (src) return src;
        if (product) return getProductImageUrl(product, imageSize);
        return PLACEHOLDER_PRODUCT_IMAGE;
    }, [src, product, imageSize]);

    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [imgFailed, setImgFailed] = useState(false);

    // if inputs change, reset
    useEffect(() => {
        setImgSrc(initialSrc);
        setImgFailed(false);
    }, [initialSrc]);

    const imageAlt = useMemo(() => {
        return alt || product?.title || t("products.defaultAlt");
    }, [alt, product]);

    const isPlaceholder = isPlaceholderProductImage(imgSrc);
    const showImg = !imgFailed || fallback === "placeholder";

    return (
        <Box sx={{ display: "inline-block", ...wrapperSx }}>
            {showImg ? (
                <img
                    src={imgSrc}
                    alt={imageAlt}
                    width={width}
                    height={height}
                    className={className}
                    style={style}
                    loading={loading}
                    onError={(e) => {
                        // allow user handler first
                        imgProps.onError?.(e);

                        // Prevent infinite loops
                        if (isPlaceholderProductImage(imgSrc)) {
                            setImgFailed(true);
                            return;
                        }

                        if (fallback === "placeholder") {
                            setImgSrc(PLACEHOLDER_PRODUCT_IMAGE);
                            return;
                        }

                        // fallback === "icon"
                        setImgFailed(true);
                    }}
                    {...imgProps}
                />
            ) : (
                <Box
                    sx={{
                        width,
                        height,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.100",
                        borderRadius: 2,
                    }}
                >
                    <ImageIcon sx={{ fontSize: Math.min(60, Math.max(24, width / 3)), color: "grey.400" }} />
                </Box>
            )}
        </Box>
    );
};

export default ProductImage;
