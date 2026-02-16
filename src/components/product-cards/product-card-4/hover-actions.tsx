"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// MUI
import Typography from "@mui/material/Typography";
import Favorite from "@mui/icons-material/Favorite";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
// GLOBAL CUSTOM HOOKS
import { useCart } from "hooks/useCart";
// STYLED COMPONENT
import { HoverWrapper } from "./styles";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function HoverActions({ product }: Props) {
  const { id, title, price, thumbnail, slug } = product;

  const router = useRouter();
  const [isFavorite, setFavorite] = useState(false);

  const handleFavorite = () => {
    setFavorite((state) => !state);
  };

  const handleAddToCart = () => {
    // Product cards don't have SKU information
    // Redirect to product detail page to select variant and add to cart
    router.push(`/products/${slug}`, { scroll: false });
  };

  return (
    <HoverWrapper className="controller">
      <span onClick={() => router.push(`/products/${slug}/view`, { scroll: false })}>
        <RemoveRedEye />
      </span>

      <Typography
        component="span"
        onClick={handleFavorite}
        sx={{ borderLeft: "1px solid", borderRight: "1px solid", borderColor: "divider" }}>
        {isFavorite ? (
          <Favorite color="primary" fontSize="small" />
        ) : (
          <FavoriteBorder fontSize="small" color="disabled" />
        )}
      </Typography>

      <span onClick={handleAddToCart}>
        <ShoppingCart />
      </span>
    </HoverWrapper>
  );
}
