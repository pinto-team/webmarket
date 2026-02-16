"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// GLOBAL CUSTOM COMPONENTS
import Container from "components/Container";
import ProductCard11 from "components/product-cards/product-card-11";
// LOCAL CUSTOM COMPONENTS
import ProductsCarousel from "./products-carousel";
// API FUNCTIONS
import { productService } from "@/services/product.service";

export default function Section4() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    productService.getProducts({ sort: "most_visited", count: 12 })
      .then(response => setProducts(response.items || []))
      .catch(error => console.error("Failed to fetch products:", error));
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
