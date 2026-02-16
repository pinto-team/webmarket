"use client";

import { styled } from "@mui/material/styles";
import type { StaticImageData } from "next/image";

interface LazyImageProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  loading?: "lazy" | "eager";
}

const StyledImg = styled('img')({ 
  width: "100%", 
  height: "auto"
});

const LazyImage = ({ src, alt, width, height, style, className, loading = "lazy", ...props }: LazyImageProps) => {
  const imgSrc = typeof src === 'string' ? src : src.src;
  
  return (
    <StyledImg
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      style={style}
      className={className}
      loading={loading}
      {...props}
    />
  );
};

export default LazyImage;
