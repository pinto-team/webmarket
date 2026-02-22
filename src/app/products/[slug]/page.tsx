import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ProductDetailsPageView } from "pages-sections/product-details/page-view";
import { productService } from "@/services/product.service";
import { getServerApi, getServerOrigin } from "@/utils/serverApi";

import type { SlugParams } from "models/Common";
import { t } from "@/i18n/t";
import { getServerImageUrl } from "@/utils/imageUtils";

export const revalidate = 60;

function takeFirst(text?: string, max = 160): string | undefined {
    if (!text) return undefined;
    const trimmed = String(text).trim();
    if (!trimmed) return undefined;
    return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

function safeTitles(list: any[] | undefined): string[] {
    if (!Array.isArray(list)) return [];
    return list
        .map((x) => x?.title)
        .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

const getProductCached = cache(async (slug: string, origin?: string) => {
    const api = await getServerApi(origin);
    return productService.getProduct(slug, api);
});

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
    const { slug } = await params;
    const origin = await getServerOrigin();

    const shopName = t("meta.pageName.shop", t("nav.shops"));

    try {
        const product = await getProductCached(slug, origin);

        // ✅ proxy-only (prefer upload, fallback to attaches[0])
        const imageUrl =
            getServerImageUrl(product?.upload, "1200x630", 80) ||
            getServerImageUrl(product?.attaches?.[0], "1200x630", 80) ||
            undefined;

        const title = product?.title ? `${product.title} | ${shopName}` : shopName;

        const description =
            takeFirst(product?.excerpt, 160) ||
            takeFirst(product?.description, 160) ||
            undefined;

        const keywords = [
            product?.title,
            ...safeTitles(product?.brands),
            ...safeTitles(product?.categories),
            ...safeTitles(product?.tags),
        ].filter((k): k is string => typeof k === "string" && k.trim().length > 0);

        const ogDesc = takeFirst(product?.excerpt, 200) || description;

        return {
            title,
            description,
            keywords,
            openGraph: {
                title: product?.title || shopName,
                description: ogDesc,
                images: imageUrl ? [{ url: imageUrl }] : [],
                type: "website",
            },
        };
    } catch (error) {
        console.error("Error generating metadata for product:", slug, error);
        return {
            title: `${t("errors.notFound")} | ${shopName}`,
            description: t("errors.notFound"),
        };
    }
}

export default async function ProductDetails({ params }: SlugParams) {
    const { slug } = await params;
    const origin = await getServerOrigin();

    let product: any;
    try {
        product = await getProductCached(slug, origin);
    } catch (error) {
        console.error("Error loading product:", slug, error);
        notFound();
    }

    if (!product) notFound();

    const offers = Array.isArray(product?.skus)
        ? product.skus.map((sku: any) => ({
            "@type": "Offer",
            price: sku?.price,
            priceCurrency: "IRR",
            availability:
                (sku?.stock ?? 0) > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            seller: sku?.shop?.title
                ? { "@type": "Organization", name: sku.shop.title }
                : undefined,
        }))
        : [];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product?.title,
        description: product?.excerpt || product?.description,
        image:
            getServerImageUrl(product?.upload, "1200x630", 80) ||
            getServerImageUrl(product?.attaches?.[0], "1200x630", 80) ||
            undefined,
        brand: product?.brands?.[0]
            ? { "@type": "Brand", name: product.brands[0].title }
            : undefined,
        offers,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailsPageView product={product} />
        </>
    );
}