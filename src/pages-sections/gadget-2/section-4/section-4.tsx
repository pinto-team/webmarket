"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Container from "components/Container";
import ProductCard11 from "components/product-cards/product-card-11";
import ProductsCarousel from "./products-carousel";

import { productService } from "@/services/product.service";
import { t } from "@/i18n/t";

const MOST_VISITED_COUNT = 12;

export default function Section4() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        let alive = true;

        productService
            .getProducts({ sort: "most_visited", count: MOST_VISITED_COUNT })
            .then((response) => {
                if (alive) setProducts(response.items || []);
            })
            .catch((error) => {
                console.error(t("home.mostVisited.fetchError"), error);
            });

        return () => {
            alive = false;
        };
    }, []);


    if (!products.length) return null;

    return (
        <Container>
            <ProductsCarousel>
                {products.map((product) => (
                    <Link key={product.code} href={`/products/${product.code}`}>
                        <ProductCard11 product={product} />
                    </Link>
                ))}
            </ProductsCarousel>
        </Container>
    );
}
