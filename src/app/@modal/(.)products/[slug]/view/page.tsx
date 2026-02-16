"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import ProductQuickView from "./components/product-quick-view";

import api from "utils/__api__/products";
import { SlugParams } from "models/Common";

export default function QuickViewPage({ params }: SlugParams) {
  const { slug } = use(params);
  const { data: product } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.getProduct(slug)
  });

  if (!product) return null;

  return <ProductQuickView product={product} />;
}
