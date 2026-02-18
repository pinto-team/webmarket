import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailsPageView } from "pages-sections/product-details/page-view";
import { productService } from "@/services/product.service";
import { getOrigin } from "@/utils/getOrigin";

import { SlugParams } from "models/Common";
import { t } from "@/i18n/t";

export const dynamic = "force-dynamic";

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

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
    const { slug } = await params;
    const origin = await getOrigin();

    const shopName = t("meta.pageName.shop", t("nav.shops"));

    try {
        const product = await productService.getProduct(slug, origin);

        const imageUrl =
            product?.upload?.main_url ||
            product?.attaches?.[0]?.main_url ||
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
            twitter: {
                card: "summary_large_image",
                title: product?.title || shopName,
                description: ogDesc,
                images: imageUrl ? [imageUrl] : [],
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
    const origin = await getOrigin();

    try {
        const product = await productService.getProduct(slug, origin);

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
            image: product?.upload?.main_url,
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
    } catch (error) {
        console.error("Error loading product:", slug, error);
        notFound();
    }
}
