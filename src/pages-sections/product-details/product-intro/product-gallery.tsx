"use client";

import { Fragment, useState } from "react";
import { ImageResource } from "@/types/product.types";
import { getProductImageUrl, PLACEHOLDER_PRODUCT_IMAGE } from "@/utils/imageUtils";
// STYLED COMPONENTS
import { PreviewImage, ProductImageWrapper } from "./styles";

export default function ProductGallery({ images }: { images: (ImageResource | undefined)[] }) {
    const [currentImage, setCurrentImage] = useState(0);
    const validImages = images.filter((img): img is ImageResource => !!img);

    if (validImages.length === 0) return null;

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const img = e.currentTarget;
        if (img.src.includes(PLACEHOLDER_PRODUCT_IMAGE)) return;
        img.src = PLACEHOLDER_PRODUCT_IMAGE;
    };

    return (
        <Fragment>
            <ProductImageWrapper>
                <img
                    alt="product"
                    src={getProductImageUrl(validImages[currentImage], "800x800")}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    loading="lazy"
                    onError={handleError}
                />
            </ProductImageWrapper>

            <div className="preview-images">
                {validImages.map((img, ind) => (
                    <PreviewImage
                        key={ind}
                        onClick={() => setCurrentImage(ind)}
                        selected={currentImage === ind}
                    >
                        <img
                            alt="product"
                            src={getProductImageUrl(img, "80x80")}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            loading="lazy"
                            onError={handleError}
                        />
                    </PreviewImage>
                ))}
            </div>
        </Fragment>
    );
}
