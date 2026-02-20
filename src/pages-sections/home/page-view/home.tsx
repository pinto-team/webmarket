"use client";
//navab
import Container from "components/Container";
import HeroSlider from "components/hero-slider/HeroSlider";
import FAQSection from "components/faq-section/FAQSection";
import BlogSection from "components/blog-section/BlogSection";


// LOCAL CUSTOM SECTION COMPONENTS
import Section2 from "../section-2";
import Section3 from "../section-3";
import Section4 from "../section-4";
import {useShopData} from "@/contexts/ShopDataProvider";

export default function GadgetTwoPageView() {
    const { shopData, loading } = useShopData();

    return (
        <>
            {/* HERO SLIDER SECTION */}
            <Container sx={{ pt: 2 }}>
                <HeroSlider slides={shopData?.hero_slider || []} loading={loading} />
            </Container>

            {/* BEST SELLER PRODUCTS SECTION */}
            <Section2 />

            {/* APPLE WATCH BANNER SECTION */}
            <Section3 />

            {/* NEW ARRIVAL PRODUCTS SECTION */}
            <Section4 />

            {/* FAQ SECTION */}
            <FAQSection faqs={shopData?.faqs || []} />

            {/* BLOG SECTION */}
            <BlogSection posts={shopData?.blog_posts || []} />

            {/* NEWSLETTER SECTION */}
            <Section3 />
        </>
    );
}
