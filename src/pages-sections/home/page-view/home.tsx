"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "components/Container";
import HeroSlider from "components/hero-slider/HeroSlider";
import FAQSection from "components/faq-section/FAQSection";
import BlogSection from "components/blog-section/BlogSection";

import Section2 from "../section-2";
import Home_banner from "../home_banner";
import Section4 from "../section-4";
import EmptyPage from "@/components/EmptyPage";

import { useShopData } from "@/contexts/ShopDataProvider";

/**
 * Goal:
 * - No global guard that prevents sections from mounting
 * - Each section decides if it should render
 * - EmptyPage only if NOTHING ends up showing
 * - Support dynamic (client-fetched) sections like products sections
 *
 * Fixes:
 * - Avoid resetting on shopData reference changes
 * - Avoid showing EmptyPage before shopData is actually resolved
 * - Give client-fetched sections enough time
 */

const EMPTY_PAGE_GRACE_MS = 1200;

export default function GadgetTwoPageView() {
    const { shopData, loading } = useShopData();

    const heroSlides = shopData?.hero_slider ?? [];
    const faqs = shopData?.faqs ?? [];
    const posts = shopData?.blog_posts ?? [];

    const showHero = loading || heroSlides.length > 0;
    const showFaq = faqs.length > 0;
    const showBlog = posts.length > 0;

    /**
     * Any section can report that it has content.
     * If true -> never show EmptyPage.
     */
    const [hasAnySectionContent, setHasAnySectionContent] = useState(false);

    /**
     * Grace period to allow client-fetched sections to load before showing EmptyPage
     */
    const [graceOver, setGraceOver] = useState(false);

    const markHasContent = useCallback(() => {
        setHasAnySectionContent(true);
    }, []);

    /**
     * ✅ Tenant key (stable reset key)
     * We don't need a dedicated slug/id. Any meaningful field works.
     */
    const tenantKey = useMemo(() => {
        const key =
            (shopData?.theme as any)?.code ||
            (shopData as any)?.title ||
            "no-shopdata";
        return String(key);
    }, [shopData]);

    /**
     * ✅ Only reset when tenant meaningfully changes
     * NOT on every shopData object reference change.
     */
    useEffect(() => {
        setHasAnySectionContent(false);
        setGraceOver(false);

        if (loading) return;

        const timer = window.setTimeout(() => setGraceOver(true), EMPTY_PAGE_GRACE_MS);
        return () => window.clearTimeout(timer);
    }, [loading, tenantKey]);

    /**
     * Static content presence:
     * - While loading: treat as content (prevents EmptyPage flicker)
     * - hero / faq / blog are direct signals
     */
    const hasStaticContent = useMemo(() => {
        if (loading) return true;
        return heroSlides.length > 0 || faqs.length > 0 || posts.length > 0;
    }, [loading, heroSlides.length, faqs.length, posts.length]);

    /**
     * ✅ ShopData readiness gate:
     * If shopData is still null, don't show EmptyPage yet.
     * (It might still be fetching or about to arrive.)
     */
    const isShopDataResolved = useMemo(() => {
        return loading || shopData !== null;
    }, [loading, shopData]);

    const shouldShowEmpty =
        !loading &&
        isShopDataResolved &&
        graceOver &&
        !hasStaticContent &&
        !hasAnySectionContent;

    if (shouldShowEmpty) return <EmptyPage />;

    return (
        <>
            {showHero ? (
                <Container sx={{ pt: 2 }}>
                    <HeroSlider slides={heroSlides} loading={loading} />
                </Container>
            ) : null}

            {/* Self-guarded sections (render null if no data) */}
            <Section2 onHasContent={markHasContent} />

            <Home_banner onHasContent={markHasContent} />

            <Section4 onHasContent={markHasContent} />

            {showFaq ? <FAQSection faqs={faqs} /> : null}
            {showBlog ? <BlogSection posts={posts} /> : null}
        </>
    );
}