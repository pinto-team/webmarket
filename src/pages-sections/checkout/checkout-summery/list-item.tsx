import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexBetween from "components/flex-box/flex-between";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
import { toPersianNumber } from "@/utils/persian";

// ==============================================================
interface Props {
    title: string;
    value?: number;
}
// ==============================================================

export default function ListItem({ title, value }: Props) {
    const formatted = value != null ? toPersianNumber(currency(value)) : "-";

    return (
        <FlexBetween mb={1}>
            <Typography variant="body1" color="text.secondary">
                {title}:
            </Typography>

            <Typography variant="h6">{formatted}</Typography>
        </FlexBetween>
    );
}