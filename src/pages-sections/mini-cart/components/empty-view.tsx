"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";

export default function EmptyCartView() {
  const { t } = useTranslation();
  
  return (
    <FlexBox
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      height="calc(100% - 74px)">
      <Image width={90} height={100} alt="banner" src="/assets/images/logos/shopping-bag.svg" />

      <Typography
        variant="body1"
        fontSize={16}
        color="text.secondary"
        sx={{
          my: 2,
          maxWidth: 200,
          textAlign: "center"
        }}>
        {t("No products in the cart")}
      </Typography>

      <Link href="/products/search">
        <Button variant="contained" color="primary">
          {t("Continue Shopping")}
        </Button>
      </Link>
    </FlexBox>
  );
}
