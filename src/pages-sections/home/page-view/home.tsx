"use client";

import Container from "components/Container";
import HeroSlider from "components/hero-slider/HeroSlider";
import FAQSection from "components/faq-section/FAQSection";
import BlogSection from "components/blog-section/BlogSection";

import Section2 from "../section-2";
import Home_banner from "../home_banner";
import Section4 from "../section-4";
import EmptyPage from "@/components/EmptyPage";

import { useShopData } from "@/contexts/ShopDataProvider";
import { hasHomePageContent } from "../../../../utils/pageGuards";

export default function GadgetTwoPageView() {
    const { shopData, loading } = useShopData();

    const heroSlides = shopData?.hero_slider ?? [];
    const faqs = shopData?.faqs ?? [];
    const posts = shopData?.blog_posts ?? [];

    const showHero = loading || heroSlides.length > 0;
    const showFaq = faqs.length > 0;
    const showBlog = posts.length > 0;

    if (!loading && !hasHomePageContent(shopData)) {
        return <EmptyPage />;
    }

    return (
        <>
            {showHero && (
                <Container sx={{ pt: 2 }}>
                    <HeroSlider slides={heroSlides} loading={loading} />
                </Container>
            )}

            <Section2 />
            <Home_banner />
            <Section4 />

            {showFaq && <FAQSection faqs={faqs} />}
            {showBlog && <BlogSection posts={posts} />}
        </>
    );
}