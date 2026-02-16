import Link from "next/link";
// MUI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
// CUSTOM COMPONENTS
import Trash from "icons/Trash";
import FlexBox from "components/flex-box/flex-box";
import { ProductImage } from "@/components/common/ProductImage";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
import { toPersianNumber } from "@/utils/persian";
// CUSTOM DATA MODEL
import { CartItemResource } from "@/types/product.types";

type CartItem = CartItemResource;

// STYLED COMPONENTS
const StyledRoot = styled("div")(({ theme }) => ({
  gap: "1rem",
  display: "flex",
  alignItems: "center",
  padding: "1rem 1.5rem",
  borderBottom: `1px dashed ${theme.palette.divider}`,
  [theme.breakpoints.down("sm")]: {
    padding: "1rem",
    gap: "0.75rem"
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 6,
  backgroundColor: theme.palette.grey[100],
  position: 'relative',
  flexShrink: 0,
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60
  }
}));

const ContentWrapper = styled("div")(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem"
}));

const QuantityWrapper = styled("div")(({ theme }) => ({
  gap: "0.5rem",
  display: "flex",
  alignItems: "center",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 6,
  padding: "2px",
  "& .MuiButtonBase-root": {
    height: 24,
    width: 24,
    minWidth: 24,
    borderRadius: 6,
    padding: 0,
    "& svg": { fontSize: 16 }
  }
}));

// ==============================================================
interface Props {
  item: CartItem;
  onCart: (amount: number, product: CartItem) => () => void;
}
// ==============================================================

export default function MiniCartItem({ item, onCart }: Props) {
  const productCode = item.product?.code || item.sku.product?.code || item.sku.product_code;
  
  return (
    <StyledRoot>
      <Link href={`/products/${productCode}`}>
        <StyledAvatar variant="rounded">
          <ProductImage
            product={item.sku.product || item.sku}
            alt={item.sku.title}
            width={80}
            height={80}
            size="80x80"
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        </StyledAvatar>
      </Link>

      <ContentWrapper>
        <Link href={`/products/${productCode}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography 
            variant="body1" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4
            }}
          >
            {item.sku.title}
          </Typography>
        </Link>

        <Typography variant="body1" fontWeight={500}>
          {currency(item.sku.price * item.quantity)}
        </Typography>

        <FlexBox alignItems="center" justifyContent="space-between" gap={1} flexWrap="nowrap">
          <QuantityWrapper>
            <Button
              size="small"
              color="primary"
              variant="text"
              onClick={onCart(item.quantity + 1, item)}>
              <Add fontSize="small" />
            </Button>

            <Typography variant="body2" fontSize={13} sx={{ minWidth: 20, textAlign: 'center' }}>
              {toPersianNumber(item.quantity)}
            </Typography>

            <Button
              size="small"
              color="primary"
              variant="text"
              disabled={item.quantity === 1}
              onClick={onCart(item.quantity - 1, item)}>
              <Remove fontSize="small" />
            </Button>
          </QuantityWrapper>

          <IconButton size="small" onClick={onCart(0, item)} sx={{ flexShrink: 0 }}>
            <Trash sx={{ fontSize: "1rem" }} />
          </IconButton>
        </FlexBox>
      </ContentWrapper>
    </StyledRoot>
  );
}
