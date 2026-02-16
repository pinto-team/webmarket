"use client";

import { Fragment, useState } from "react";
import { ImageResource } from "@/types/product.types";
import { getProductImageUrl } from "@/utils/imageUtils";
// STYLED COMPONENTS
import { PreviewImage, ProductImageWrapper } from "./styles";

export default function ProductGallery({ images }: { images: (ImageResource | undefined)[] }) {
  const [currentImage, setCurrentImage] = useState(0);
  const validImages = images.filter((img): img is ImageResource => !!img);

  if (validImages.length === 0) return null;

  return (
    <Fragment>
      <ProductImageWrapper>
        <img
          alt="product"
          src={getProductImageUrl(validImages[currentImage], "800x800")}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          loading="lazy"
        />
      </ProductImageWrapper>

      <div className="preview-images">
        {validImages.map((img, ind) => (
          <PreviewImage
            key={ind}
            onClick={() => setCurrentImage(ind)}
            selected={currentImage === ind}>
            <img
              alt="product"
              src={getProductImageUrl(img, "80x80")}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              loading="lazy"
            />
          </PreviewImage>
        ))}
      </div>
    </Fragment>
  );
}
