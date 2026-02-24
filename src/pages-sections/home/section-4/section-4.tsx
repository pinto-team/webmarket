"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import Container from "components/Container";
import ProductCard11 from "components/product-cards/product-card-11";
import ProductsCarousel from "./products-carousel";

import { productService } from "@/services/product.service";
import { t } from "@/i18n/t";
import { extractItems } from "@/utils/apiExtract";

const MOST_VISITED_COUNT = 12;

type Props = { onHasContent?: () => void };
type ProductLite = { code?: string; slug?: string; id?: number; [key: string]: any };

export default function Section4({ onHasContent }: Props) {
    const [products, setProducts] = useState<ProductLite[]>([]);
    const signaledRef = useRef(false);

    useEffect(() => {
        let alive = true;

        productService
            .getProducts({ sort: "most_visited", count: MOST_VISITED_COUNT })
            .then((res) => {
                const items = extractItems<ProductLite>(res);

                console.log("[Section4] items:", items.length, items[0]); // ✅ دیباگ کلیدی

                if (!alive) return;

                setProducts(items);

                if (!signaledRef.current && items.length > 0) {
                    signaledRef.current = true;
                    onHasContent?.();
                }
            })
            .catch((error) => {
                console.error(t("home.mostVisited.fetchError"), error);
            });

        return () => {
            alive = false;
        };
    }, [onHasContent]);

    if (products.length === 0) return null;

    return (
        <Container>
            <ProductsCarousel>
                {products.map((product) => {
                    const slugOrCode = product.code ?? product.slug;
                    if (!slugOrCode) return null;

                    const key = String(product.code ?? product.slug ?? product.id ?? slugOrCode);

                    return (
                        <Link key={key} href={`/products/${slugOrCode}`}>
                            <ProductCard11 product={product} />
                        </Link>
                    );
                })}
            </ProductsCarousel>
        </Container>
    );
}