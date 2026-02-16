import React from 'react';
import { getProductImageUrl } from '@/utils/imageUtils';

interface ProductImageProps {
  product: any;
  alt?: string;
  width?: number;
  height?: number;
  size?: string; // e.g., '300x300', '500x500'
  className?: string;
  style?: React.CSSProperties;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  alt,
  width = 200,
  height = 200,
  size,
  className = '',
  style,
  ...props
}) => {
  // Auto-generate size from width/height if not provided
  const imageSize = size || `${width}x${height}`;
  const imageUrl = getProductImageUrl(product, imageSize);
  const imageAlt = alt || product?.title || 'محصول';

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