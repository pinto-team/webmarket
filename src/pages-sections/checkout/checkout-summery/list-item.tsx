import Typography from "@mui/material/Typography";
import FlexBetween from "components/flex-box/flex-between";
import { currency } from "lib";
import { toPersianNumber } from "@/utils/persian";
import { t } from "@/i18n/t";

interface Props {
    title: string;
    value?: number;
    currencyLabel?: string;
}

export default function ListItem({ title, value, currencyLabel }: Props) {
    const label = currencyLabel ?? t("products.currencyLabel");
    const hasValue = typeof value === "number" && Number.isFinite(value);

    const isTax = title === t("checkout.tax");
    const isDiscount = title === t("checkout.discount");

    if (!hasValue) {
        return (
            <FlexBetween mb={1}>
                <Typography variant="body1" color="text.secondary">
                    {title}:
                </Typography>
                <Typography variant="h6">-</Typography>
            </FlexBetween>
        );
    }

    // Tax یا Discount اگر صفر بودن → "-"
    if ((isTax || isDiscount) && value === 0) {
        return (
            <FlexBetween mb={1}>
                <Typography variant="body1" color="text.secondary">
                    {title}:
                </Typography>
                <Typography variant="h6">-</Typography>
            </FlexBetween>
        );
    }

    const formatted = toPersianNumber(currency(value));

    return (
        <FlexBetween mb={1}>
            <Typography variant="body1" color="text.secondary">
                {title}:
            </Typography>

            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                {formatted}{" "}
                <Typography component="span" variant="body2" color="text.secondary">
                    {label}
                </Typography>
            </Typography>
        </FlexBetween>
    );
}