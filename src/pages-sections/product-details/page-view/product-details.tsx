"use client";

import Container from "@mui/material/Container";
// LOCAL CUSTOM COMPONENTS
import ProductTabs from "../product-tabs";
import ProductIntro from "../product-intro";
import ProductReviews from "../product-reviews";
import AvailableShops from "../available-shops";
import RelatedProducts from "../related-products";
import FrequentlyBought from "../frequently-bought";
import ProductDescription from "../product-description";
// TYPES
import { ProductResource } from "@/types/product.types";
// HOOKS
import { useProductVariants } from "@/hooks/useProductVariants";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";

// ==============================================================
interface Props {
  product: ProductResource;
}
// ==============================================================

export default function ProductDetailsPageView({ product }: Props) {
  const { variantGroups, selectedVariants, selectedSku, selectVariant, isVariantAvailable } = 
    useProductVariants(product.skus);

  const { products: relatedProducts } = useRelatedProducts(
    product.categories[0]?.code,
    product.code
  );

  return (
    <Container className="mt-2 mb-2">
      {/* PRODUCT DETAILS INFO AREA */}
      <ProductIntro 
        product={product}
        selectedSku={selectedSku}
        variantGroups={variantGroups}
        selectedVariants={selectedVariants}
        onVariantSelect={selectVariant}
        isVariantAvailable={isVariantAvailable}
      />

      {/* AVAILABLE SHOPS */}
      <AvailableShops skus={product.skus} productCode={product.code} />

      {/* FREQUENTLY BOUGHT TOGETHER */}
      <FrequentlyBought products={[]} />

      {/* PRODUCT DESCRIPTION AND REVIEW */}
      <ProductTabs 
        description={<ProductDescription description={product.description} />} 
        reviews={<ProductReviews comments={product.comments} productCode={product.code} />}
        reviewCount={product.comments?.length || 0}
      />

      {/* RELATED PRODUCTS AREA */}
      <RelatedProducts products={relatedProducts} />
    </Container>
  );
}
