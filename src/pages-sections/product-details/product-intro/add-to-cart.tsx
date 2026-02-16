"use client";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { SkuResource } from "@/types/product.types";
import { useAddToCart } from "@/hooks/useAddToCart";
import { t } from "@/utils/translate";
import AddToCartDialog from "@/components/AddToCartDialog";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

// ================================================================
type Props = { selectedSku: SkuResource | null; productCode: string };
// ================================================================

export default function AddToCart({ selectedSku, productCode }: Props) {
  const { addToCart, loading, dialogOpen, closeDialog } = useAddToCart();
  const { cart, removeItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!selectedSku) return;
    addToCart(selectedSku.id, 1, productCode);
  };

  const handleRemoveFromCart = async () => {
    if (!selectedSku) return;
    const cartItem = cart.find(item => item.sku?.id === selectedSku.id);
    if (cartItem) {
      await removeItem(cartItem.id);
    }
  };

  const isInCart = selectedSku ? cart.some(item => item.sku?.id === selectedSku.id) : false;
  const isDisabled = !selectedSku || selectedSku.stock === 0;

  return (
    <>
      {isInCart ? (
        <Box sx={{ display: 'flex', gap: 1, mb: 4.5 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push('/cart')}
            sx={{ px: "1.75rem", height: 40, minWidth: 200 }}
          >
            {t("View Cart")}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleRemoveFromCart}
            disabled={loading}
            sx={{ height: 40, width: 40, minWidth: 40, p: 0 }}
          >
            <DeleteOutlineIcon />
          </Button>
        </Box>
      ) : (
        <Button
          color="primary"
          variant="contained"
          disabled={isDisabled || loading}
          onClick={handleAddToCart}
          sx={{ mb: 4.5, px: "1.75rem", height: 40, minWidth: 200 }}
        >
          {!selectedSku ? t("Select Variant") : selectedSku.stock === 0 ? t("Out of Stock") : t("Add to Cart")}
        </Button>
      )}
      <AddToCartDialog open={dialogOpen} onClose={closeDialog} />
    </>
  );
}
