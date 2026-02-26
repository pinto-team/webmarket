import Typography from "@mui/material/Typography";
import FlexBetween from "components/flex-box/flex-between";
import { currency } from "lib";

// ==============================================================
type Props = { title: string; amount?: number; currencyLabel?: string };
// ==============================================================

export default function PaymentItem({ title, amount, currencyLabel }: Props) {
    const hasAmount = typeof amount === "number" && Number.isFinite(amount);

    return (
        <FlexBetween mb={1}>
            <Typography variant="body1" sx={{ color: "grey.600" }}>
                {title}
            </Typography>

            {hasAmount ? (
                <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    {currency(amount)}{" "}
                    {currencyLabel ? (
                        <Typography component="span" variant="body2" color="text.secondary">
                            {currencyLabel}
                        </Typography>
                    ) : null}
                </Typography>
            ) : (
                <Typography variant="h6">-</Typography>
            )}
        </FlexBetween>
    );
}