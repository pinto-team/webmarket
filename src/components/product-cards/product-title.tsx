import Link from "next/link";
import Typography from "@mui/material/Typography";
import { toPersianNumber } from "@/utils/persian";

// ==============================================================
type Props = { title: string; slug: string };
// ==============================================================

export default function ProductTitle({ title, slug }: Props) {
    return (
        <Link href={`/products/${slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography noWrap variant="h6" className="title" color="textSecondary">
                {toPersianNumber(title ?? "")}
            </Typography>
        </Link>
    );
}