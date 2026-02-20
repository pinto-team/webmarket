"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { t } from "@/i18n/t";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import IconLink from "components/icon-link";
import Container from "components/Container";
import FlexBetween from "components/flex-box/flex-between";
import ProductCard11 from "components/product-cards/product-card-11";

// API FUNCTIONS
import { productService } from "@/services/product.service";

const BEST_SELLERS_COUNT = 8;

export default function Section2() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        productService
            .getProducts({ sort: "best_sale", count: BEST_SELLERS_COUNT })
            .then((response) => setProducts(response.items || []))
            .catch((error) => {
                // no hardcoded strings ✅
                console.error(t("home.bestSellers.fetchError"), error);
            });
    }, [t]);

    if (!products.length) return null;

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
                {products.map((product) => (
                    <Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={product.code}>
                        <Link href={`/products/${product.code}`}>
                            <ProductCard11 product={product} />
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
