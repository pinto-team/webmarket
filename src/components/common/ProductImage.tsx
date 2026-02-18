import React from "react";
import { getProductImageUrl } from "@/utils/imageUtils";
import { t } from "@/i18n/t";

interface ProductImageProps {
    product: any;
    alt?: string;
    width?: number;
    height?: number;
    size?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const ProductImage: React.FC<ProductImageProps> = ({
                                                              product,
                                                              alt,
                                                              width = 200,
                                                              height = 200,
                                                              size,
                                                              className = "",
                                                              style,
                                                              ...props
                                                          }) => {
    const imageSize = size || `${width}x${height}`;
    const imageUrl = getProductImageUrl(product, imageSize);

    const imageAlt =
        alt ||
        product?.title ||
        t("products.defaultAlt");

    return (
        <img
            src={imageUrl}
            alt={imageAlt}
            width={width}
            height={height}
            className={className}
            style={style}
            loading="lazy"
            {...props}
        />
    );
};

export default ProductImage;
