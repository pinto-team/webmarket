import { ShopData } from "@/types/shopData.types";

export function hasHomePageContent(shopData?: ShopData | null): boolean {
    if (!shopData) return false;

    const hasHero = Array.isArray(shopData.hero_slider) && shopData.hero_slider.length > 0;

    const hasFaq = Array.isArray(shopData.faqs) && shopData.faqs.length > 0;

    const hasBlog = Array.isArray(shopData.blog_posts) && shopData.blog_posts.length > 0;

    const hasBanner =
        !!shopData.home_banner &&
        (
            Boolean(shopData.home_banner.image) ||
            Boolean(shopData.home_banner.title?.trim()) ||
            Boolean(shopData.home_banner.subtitle?.trim()) ||
            Boolean(shopData.home_banner.button_text?.trim())
        );

    return hasHero || hasFaq || hasBlog || hasBanner;
}