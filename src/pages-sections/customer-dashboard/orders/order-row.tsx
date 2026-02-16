import Link from "next/link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import East from "@mui/icons-material/East";
import TableRow from "../table-row";
import { currency } from "lib";
import type { OrderResource } from "@/types/order.types";
import {West} from "@mui/icons-material";

type Props = { order: OrderResource };

const STATUS_COLOR_MAP: Record<number, "default" | "secondary" | "info" | "success" | "error" | "warning"> = {
  0: "secondary",  // ONHOLD
  1: "info",        // PENDING
  2: "error",       // FAILED
  3: "warning",     // MODERATION
  4: "info",        // PREPARE
  5: "success",     // COMPLETED
  6: "error"        // CANCELLED
};

export default function OrderRow({ order }: Props) {
  const statusColor = STATUS_COLOR_MAP[order.status] || "default";

  return (
    <Link href={`/orders/${order.id}`}>
      <TableRow elevation={0} sx={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
        <Typography noWrap variant="h5">
          #{order.code}
        </Typography>

        <Box textAlign={{ sm: "center", xs: "right" }}>
          <Chip size="small" label={order.status_label} color={statusColor} />
        </Box>

        <Typography noWrap variant="body1" sx={{ textAlign: { sm: "center", xs: "left" } }}>
          {new Date(order.created_at).toLocaleDateString("fa-IR")}
        </Typography>

        <Typography
          variant="body1"
          fontWeight={500}
          sx={{ textAlign: { sm: "center", xs: "right" } }}>
          {currency(order.total_price)}
        </Typography>

        <Box justifyContent="end" display={{ sm: "inline-flex", xs: "none" }}>
          <IconButton>
            <West className="east" fontSize="small" />
          </IconButton>
        </Box>
      </TableRow>
    </Link>
  );
}
