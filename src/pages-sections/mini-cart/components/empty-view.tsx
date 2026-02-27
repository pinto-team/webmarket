"use client";

import { t } from "@/i18n/t";
import Image from "next/image";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FlexBox from "components/flex-box/flex-box";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function EmptyCartView() {
    const router = useRouter();
    const { closeMiniCart } = useCart();

    const handleContinueShopping = () => {
        closeMiniCart();
        router.push("/products");
    };

    return (
        <FlexBox
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            height="calc(100% - 74px)"
        >
            <Image
                width={90}
                height={100}
                alt="banner"
                src="/assets/images/logos/shopping-bag.svg"
            />

            <Typography
                variant="body1"
                fontSize={16}
                color="text.secondary"
                sx={{ my: 2, maxWidth: 200, textAlign: "center" }}
            >
                {t("cart.emptyTitle")}
            </Typography>

            <Button variant="contained" color="primary" onClick={handleContinueShopping}>
                {t("cart.continueShopping")}
            </Button>
        </FlexBox>
    );
}