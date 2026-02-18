import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { FlexBetween, FlexBox } from "components/flex-box";
import { currency } from "lib";

import { getProductImageUrl } from "@/utils/imageUtils";
import { formatPersianDate } from "@/utils/persian";
import { t } from "@/i18n/t";

import type { OrderResource } from "@/types/order.types";

type Props = { order: OrderResource };

export default function OrderedProducts({ order }: Props) {
    return (
        <Card
            elevation={0}
            sx={{
                p: 0,
                mb: 4,
                border: "1px solid",
                borderColor: "grey.100",
            }}
        >
            <FlexBetween
                px={3}
                py={2}
                flexWrap="wrap"
                gap={1}
                bgcolor="grey.50"
            >
                <Item
                    title={t("orders.orderNumber")}
                    value={order.code}
                />

                <Item
                    title={t("orders.orderDate")}
                    value={formatPersianDate(order.created_at)}
                />

                <Item
                    title={t("orders.status")}
                    value={order.status_label}
                />
            </FlexBetween>

            {order.shipments.map((shipment) =>
                shipment.items.map((item) => (
                    <FlexBetween
                        key={item.id}
                        px={2}
                        py={1}
                        flexWrap="wrap"
                        gap={1}
                    >
                        <FlexBox gap={2} alignItems="center">
                            <Avatar
                                variant="rounded"
                                sx={{
                                    height: 60,
                                    width: 60,
                                    backgroundColor: "grey.50",
                                }}
                            >
                                <img
                                    alt={item.sku_data.title}
                                    src={getProductImageUrl(
                                        item.sku,
                                        "60x60"
                                    )}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                    loading="lazy"
                                />
                            </Avatar>

                            <div>
                                <Typography noWrap variant="h6">
                                    {item.sku_data.title}
                                </Typography>

                                <Typography
                                    lineHeight={2}
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {currency(item.price)} × {item.quantity}
                                </Typography>
                            </div>
                        </FlexBox>
                    </FlexBetween>
                ))
            )}
        </Card>
    );
}

function Item({
                  title,
                  value,
              }: {
    title: string;
    value: string;
}) {
    return (
        <FlexBox gap={1} alignItems="center">
            <Typography
                variant="body1"
                color="text.secondary"
            >
                {title}
            </Typography>

            <Typography variant="body1">
                {value}
            </Typography>
        </FlexBox>
    );
}
