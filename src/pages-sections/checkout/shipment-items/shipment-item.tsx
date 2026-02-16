"use client";

import Link from "next/link";
import Image from "next/image";
import { Box, Card, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import Inventory from "@mui/icons-material/Inventory";
import ImageIcon from "@mui/icons-material/Image";
import { CartItemResource } from "@/types/product.types";
import { cartService } from "@/services/cart.service";
import { getProductImageUrl } from "@/utils/imageUtils";
import { formatPersianPrice, toPersianNumber } from "@/utils/persian";

interface ShipmentItemProps {
  item: CartItemResource;
}

const calculateDeliveryDate = (days: number): string => {
  if (!days || days === 0) return 'نامشخص';
  
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + days);
  
  try {
    return deliveryDate.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    const year = deliveryDate.getFullYear();
    const month = deliveryDate.getMonth() + 1;
    const day = deliveryDate.getDate();
    return `${year}/${month}/${day}`;
  }
};

export default function ShipmentItem({ item }: ShipmentItemProps) {
  const { sku, quantity, product } = item;
  const deliveryDays = sku?.delivery || 0;
  const price = sku?.price || 0;
  const total = price * quantity;
  const productCode = product?.code || sku.product?.code || cartService.getProductCodeForSku(sku.id) || sku.code;
  const imageUrl = getProductImageUrl(sku.product || sku);
  const hasImage = imageUrl !== '/images/placeholder-product.jpg';
  const deliveryDate = calculateDeliveryDate(deliveryDays);

  return (
    <Card
      elevation={0}
      sx={{
        overflow: "hidden",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        position: "relative",
        borderRadius: 3,
        mb: 2,
        p: { xs: 1.5, sm: 2 },
        bgcolor: "grey.50",
        border: 1,
        borderColor: "divider",
        gap: 2
      }}
    >
      <Box
        sx={{
          width: { xs: 120, sm: 180 },
          height: { xs: 120, sm: 180 },
          minWidth: { xs: 120, sm: 180 },
          position: "relative",
          bgcolor: "grey.100",
          borderRadius: 2
        }}
      >
        {hasImage ? (
          <Image
            alt={sku.title}
            fill
            src={imageUrl}
            sizes="180px"
            style={{ objectFit: "contain" }}
            priority
          />
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
            <ImageIcon sx={{ fontSize: 60, color: "grey.400" }} />
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 1.5, minWidth: 0 }}>
        <div>
          <Link href={`/products/${productCode}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" fontSize={{ xs: 16, sm: 18 }} fontWeight={500} gutterBottom>
              {sku.title}
            </Typography>
          </Link>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 3 }, fontSize: { xs: "0.75rem", sm: "0.875rem" }, color: "text.secondary", flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <VerifiedUser sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
              گارانتی
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Inventory sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
              موجود
            </Box>
            {deliveryDate && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocalShippingIcon sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                {deliveryDate}
              </Box>
            )}
          </Box>
        </div>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: { xs: 1.5, sm: 2 },
            bgcolor: "grey.100",
            borderRadius: 2,
            mt: 1,
            flexWrap: "wrap",
            gap: 1
          }}
        >
          <Typography variant="body2" color="text.secondary">
            تعداد: {toPersianNumber(quantity)}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              حداکثر
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {formatPersianPrice(total)} تومان
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
