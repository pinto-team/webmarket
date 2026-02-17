import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { StyledCard } from "./styles";
import { SkuResource } from "@/types/product.types";
import { groupSkusByShop } from "@/utils/product";
import { currency } from "lib";
import { useAddToCart } from "@/hooks/useAddToCart";
import { toPersianNumber } from "@/utils/numberFormatter";
import AddToCartDialog from "@/components/AddToCartDialog";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import {t} from "i18next";

interface Props {
  skus: SkuResource[];
  productCode: string;
}


export default function AvailableShops({ skus, productCode }: Props) {
  const shopGroups = groupSkusByShop(skus);
  const { addToCart, loading, dialogOpen, closeDialog } = useAddToCart();
  const { cart, removeItem } = useCart();
  const router = useRouter();

  if (shopGroups.length === 0) return null;

  const handleAddToCart = (skuId: number) => {
    addToCart(skuId, 1, productCode);
  };

  const handleRemoveFromCart = async (skuId: number) => {
    const cartItem = cart.find(item => item.sku?.id === skuId);
    if (cartItem) {
      await removeItem(cartItem.id);
    }
  };

  const isInCart = (skuId: number) => {
    return cart.some(item => item.sku?.id === skuId);
  };

  return (
    <Box sx={{ mb: 4 }} id="sellers-section">
      <Typography variant="h3" sx={{ mb: 3, mt: 4 }}>
        {t("All Sellers")}
      </Typography>

      {shopGroups.map((group) => 
        group.skus.map((sku) => {
          const hasStock = sku.stock > 0;
          const inCart = isInCart(sku.id);
          const guaranteeText = sku.guarantee 
            ? `${toPersianNumber(sku.guarantee.duration)} ${t("Month Warranty")}` 
            : t("Warranty Available");
          
          return (
            <StyledCard key={`${group.shop.title}-${sku.id}`}>
              <Box className="shop-info">
                <Typography variant="h6">{group.shop.title}</Typography>
                <Typography variant="body2" color="text.secondary">{sku.title}</Typography>
              </Box>

              <Box className="delivery-info">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocalShippingOutlinedIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {guaranteeText}
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  color={hasStock ? "success.main" : "error.main"}
                >
                  {hasStock ? t("Available") : t("Out of Stock")}
                </Typography>
              </Box>

              <Box className="price-section">
                {inCart ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined"
                      color="primary"
                      onClick={() => router.push('/cart')}
                      sx={{ minWidth: 140 }}
                    >
                      {t("View Cart")}
                    </Button>
                    <Button 
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveFromCart(sku.id)}
                      disabled={loading}
                      sx={{ minWidth: 50 }}
                    >
                      <DeleteOutlineIcon />
                    </Button>
                  </Box>
                ) : (
                  <Button 
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(sku.id)}
                    disabled={loading || !hasStock}
                    sx={{ minWidth: 140 }}
                  >
                    {t("Add to Cart")}
                  </Button>
                )}
                
                <Box className="price-info">
                  <Typography variant="h6" color="primary">
                    {currency(sku.price)}
                  </Typography>
                </Box>
              </Box>
            </StyledCard>
          );
        })
      )}
      <AddToCartDialog open={dialogOpen} onClose={closeDialog} />
    </Box>
  );
}
