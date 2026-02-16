import type { Metadata } from "next";
import { notFound } from "next/navigation";
// PAGE VIEW COMPONENT
import { ProductDetailsPageView } from "pages-sections/product-details/page-view";
// API SERVICE
import { productService } from "@/services/product.service";
import { getOrigin } from "@/utils/getOrigin";
// CUSTOM DATA MODEL
import { SlugParams } from "models/Common";

// Force dynamic rendering for product pages
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const origin = await getOrigin();
  
  try {
    const product = await productService.getProduct(slug, origin);
    const imageUrl = product.upload?.main_url || product.attaches?.[0]?.main_url;
    
    return {
      title: `${product.title} | فروشگاه تعاونی`,
      description: product.excerpt || product.description?.substring(0, 160),
      keywords: [
        product.title,
        ...product.brands.map(b => b.title).filter(Boolean),
        ...product.categories.map(c => c.title).filter(Boolean),
        ...product.tags.map(t => t.title).filter(Boolean)
      ].filter((k): k is string => typeof k === 'string'),
      openGraph: {
        title: product.title,
        description: product.excerpt,
        images: imageUrl ? [{ url: imageUrl }] : [],
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: product.excerpt,
        images: imageUrl ? [imageUrl] : []
      }
    };
  } catch (error) {
    console.error('Error generating metadata for product:', slug, error);
    return {
      title: 'محصول یافت نشد | فروشگاه تعاونی',
      description: 'محصول مورد نظر یافت نشد.'
    };
  }
}

export default async function ProductDetails({ params }: SlugParams) {
  const { slug } = await params;
  const origin = await getOrigin();
  
  try {
    const product = await productService.getProduct(slug, origin);
    
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.excerpt || product.description,
      image: product.upload?.main_url,
      brand: product.brands[0] ? { '@type': 'Brand', name: product.brands[0].title } : undefined,
      offers: product.skus.map(sku => ({
        '@type': 'Offer',
        price: sku.price,
        priceCurrency: 'IRR',
        availability: sku.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: sku.shop.title }
      }))
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
    console.error('Error loading product:', slug, error);
    notFound();
  }
}
