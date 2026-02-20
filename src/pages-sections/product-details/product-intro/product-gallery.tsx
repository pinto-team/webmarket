"use client";

import { Fragment, useMemo, useState } from "react";
import { ImageResource } from "@/types/product.types";

import ProductImage from "@/components/common/ProductImage";
// STYLED COMPONENTS
import { PreviewImage, ProductImageWrapper } from "./styles";

export default function ProductGallery({ images }: { images: (ImageResource | undefined)[] }) {
    const [currentImage, setCurrentImage] = useState(0);

    const validImages = useMemo(
        () => images.filter((img): img is ImageResource => !!img),
        [images]
    );

    if (validImages.length === 0) return null;

    const current = validImages[currentImage] ?? validImages[0];

    return (
        <Fragment>
            <ProductImageWrapper>
                <ProductImage
                    entity={current}
                    alt="product"
                    size="800x800"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    loading="lazy"
                    fallback="placeholder"
                    noWrapper
                />
            </ProductImageWrapper>

            <div className="preview-images">
                {validImages.map((img, ind) => (
                    <PreviewImage
                        key={ind}
                        onClick={() => setCurrentImage(ind)}
                        selected={currentImage === ind}
                    >
                        <ProductImage
                            entity={img}
                            alt="product"
                            size="80x80"
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            loading="lazy"
                            fallback="placeholder"
                            noWrapper
                        />
                    </PreviewImage>
                ))}
            </div>
        </Fragment>
    );
}