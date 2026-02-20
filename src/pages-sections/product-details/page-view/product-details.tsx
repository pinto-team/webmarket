"use client";

import dynamic from "next/dynamic";
import Container from "@mui/material/Container";

import ProductTabs from "../product-tabs";
import ProductIntro from "../product-intro";
import ProductDescription from "../product-description";

import type { ProductResource } from "@/types/product.types";
import { useProductVariants } from "@/hooks/useProductVariants";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";

// ✅ Lazy-load heavy sections to reduce initial hydration cost
const AvailableShops = dynamic(() => import("../available-shops"), { ssr: false });
const ProductReviews = dynamic(() => import("../product-reviews"), { ssr: false });
const RelatedProducts = dynamic(() => import("../related-products"), { ssr: false });
const FrequentlyBought = dynamic(() => import("../frequently-bought"), { ssr: false });

interface Props {
    product: ProductResource;
}

export default function ProductDetailsPageView({ product }: Props) {
    const { variantGroups, selectedVariants, selectedSku, selectVariant, isVariantAvailable } =
        useProductVariants(product.skus);

    const categoryCode = product?.categories?.[0]?.code;

    // If category is missing, skip related fetch
    const { products: relatedProducts } = useRelatedProducts(
        categoryCode || "",
        product.code
    );

    return (
        <Container className="mt-2 mb-2">
            {/* ✅ Render the critical above-the-fold content immediately */}
            <ProductIntro
                product={product}
                selectedSku={selectedSku}
                variantGroups={variantGroups}
                selectedVariants={selectedVariants}
                onVariantSelect={selectVariant}
                isVariantAvailable={isVariantAvailable}
            />

            {/* ✅ Defer heavy sections */}
            <AvailableShops skus={product.skus} productCode={product.code} />

            <FrequentlyBought products={[]} />

            <ProductTabs
                description={<ProductDescription description={product.description} />}
                reviews={<ProductReviews comments={product.comments} productCode={product.code} />}
                reviewCount={product.comments?.length || 0}
            />

            <RelatedProducts products={relatedProducts} />
        </Container>
    );
}