"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { t } from "@/i18n/t";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import IconLink from "components/icon-link";
import Container from "components/Container";
import FlexBetween from "components/flex-box/flex-between";
import ProductCard11 from "components/product-cards/product-card-11";

import { productService } from "@/services/product.service";

const BEST_SELLERS_COUNT = 8;

type Props = {
    onHasContent?: () => void;
};

type ProductLite = {
    code?: string;
    slug?: string;
    id?: number;
    [key: string]: any;
};

function extractItems<T = any>(res: unknown): T[] {
    const r: any = res;
    const items =
        r?.items ??
        r?.data?.items ??
        r?.data?.data?.items ??
        r?.data?.data ??
        r?.data ??
        [];

    return Array.isArray(items) ? items : [];
}

export default function Section2({ onHasContent }: Props) {
    const [products, setProducts] = useState<ProductLite[]>([]);
    const signaledRef = useRef(false);

    useEffect(() => {
        let alive = true;

        productService
            .getProducts({ sort: "best_sale", count: BEST_SELLERS_COUNT })
            .then((res) => {
                const items = extractItems<ProductLite>(res);

                console.log("[Section2] items:", items.length, items[0]); // ✅ دیباگ کلیدی

                if (!alive) return;

                setProducts(items);

                if (!signaledRef.current && items.length > 0) {
                    signaledRef.current = true;
                    onHasContent?.();
                }
            })
            .catch((error) => {
                console.error(t("home.bestSellers.fetchError"), error);
            });

        return () => {
            alive = false;
        };
    }, [onHasContent]);

    if (products.length === 0) return null;

    return (
        <Container>
            <FlexBetween gap={2} mb={3}>
                <div>
                    <Typography variant="h2" fontWeight={700} fontSize={{ sm: 32, xs: 27 }}>
                        {t("home.bestSellers.title")}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" fontSize={{ sm: 16, xs: 14 }}>
                        {t("home.bestSellers.subtitle")}
                    </Typography>
                </div>

                <IconLink title={t("home.bestSellers.viewMore")} url="/products" />
            </FlexBetween>

            <Grid container spacing={3}>
                {products.map((product) => {
                    const slugOrCode = product.code ?? product.slug;
                    if (!slugOrCode) return null;

                    const key = String(product.code ?? product.slug ?? product.id ?? slugOrCode);

                    return (
                        <Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={key}>
                            <Link href={`/products/${slugOrCode}`}>
                                <ProductCard11 product={product} />
                            </Link>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
}