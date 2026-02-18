"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Reply from "@mui/icons-material/Reply";

import { TicketResource, TicketStatusEnum } from "@/types/ticket.types";

import { t } from "@/i18n/t";
import { formatPersianDate } from "@/utils/persian";

interface TicketCardProps {
    ticket: TicketResource;
    onReply?: () => void;
    onClick?: () => void;
}

const STATUS_CONFIG = {
    [TicketStatusEnum.CLOSED]: {
        color: "default" as const,
        label: t("orders.statuses.cancelled"),
    },
    [TicketStatusEnum.OPEN]: {
        color: "info" as const,
        label: t("orders.statuses.pending"),
    },
    [TicketStatusEnum.PROGRESS]: {
        color: "warning" as const,
        label: t("orders.statuses.processing"),
    },
    [TicketStatusEnum.REPLIED]: {
        color: "success" as const,
        label: t("orders.statuses.delivered"),
    },
};

export default function TicketCard({
                                       ticket,
                                       onReply,
                                       onClick,
                                   }: TicketCardProps) {
    const statusConfig =
        STATUS_CONFIG[ticket.status] ||
        STATUS_CONFIG[TicketStatusEnum.OPEN];

    const lastReply =
        Array.isArray(ticket.replies) && ticket.replies.length > 0
            ? ticket.replies[ticket.replies.length - 1]
            : undefined;

    const hasAttachments =
        lastReply &&
        Array.isArray(lastReply.uploads) &&
        lastReply.uploads.length > 0;

    return (
        <Card
            sx={{
                p: 2,
                mb: 2,
                cursor: onClick ? "pointer" : "default",
                transition: "all 0.2s",
                "&:hover": onClick ? { boxShadow: 2 } : {},
            }}
        >
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
            >
                <Box
                    flex={1}
                    onClick={onClick}
                    sx={{ cursor: onClick ? "pointer" : "default" }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold">
                            {t("tickets.title")} #{ticket.id}
                        </Typography>

                        <Chip
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                        />

                        {hasAttachments && (
                            <Chip label="📎" size="small" variant="outlined" />
                        )}

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            flex={1}
                        >
                            {lastReply?.description || t("common.unknown")}
                        </Typography>
                    </Stack>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography
                        variant="caption"
                        color="text.disabled"
                        whiteSpace="nowrap"
                    >
                        {formatPersianDate(ticket.updated_at)}
                    </Typography>

                    {onReply && (
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Reply />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onReply();
                            }}
                        >
                            {t("common.submit")}
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Card>
    );
}
