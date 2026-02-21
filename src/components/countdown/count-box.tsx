import Typography from "@mui/material/Typography";
import { toPersianNumber } from "@/utils/persian";

// ==============================================================
type Props = { digit: number; title: string };
// ==============================================================

export default function CountBox({ digit = 365, title = "DAYS" }: Props) {
  return (
    <Typography variant="h3">
      {toPersianNumber(digit)}{" "}
      <Typography component="span" fontSize={14} fontWeight={500} color="grey.600">
        {title}
      </Typography>
    </Typography>
  );
}
