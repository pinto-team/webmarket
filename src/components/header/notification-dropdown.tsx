"use client";

import { useState, useEffect, MouseEvent } from "react";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import IconButton from "@mui/material/IconButton";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Notifications from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";

import { getNotifications, updateNotification } from "@/services/notification.service";
import { NotificationResource } from "@/types/notification.types";
import { t } from "@/i18n/t";
import { formatPersianNumber, formatPersianRelativeTime, toPersianNumber } from "@/utils/persian";

export default function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [notifications, setNotifications] = useState<NotificationResource[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications({ count: 10 });
            setNotifications(data.items);
            setUnreadCount(data.items.filter((n) => n.status === 0).length);
        } catch (error) {
            console.error(t("notifications.fetchError"), error);
        }
    };

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setOpen((state) => !state);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    const handleNotificationClick = async (notification: NotificationResource) => {
        if (notification.status === 0) {
            await updateNotification(notification.id, { status: 1 });
            fetchNotifications();
        }

        if (notification.url) {
            router.push(notification.url);
        }

        handleClose();
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div>
                <IconButton onClick={handleClick}>
                    <Badge color="error" badgeContent={formatPersianNumber(unreadCount)}>
                        <Notifications sx={{ color: "grey.600" }} />
                    </Badge>
                </IconButton>

                <Popper
                    open={open}
                    anchorEl={anchorEl}
                    placement="bottom-end"
                    sx={{
                        zIndex: 11111,
                        maxWidth: 350,
                        minWidth: 350,
                        top: "10px !important",
                        boxShadow: 2,
                    }}
                >
                    <Paper sx={{ maxHeight: 400, overflow: "auto" }}>
                        {notifications.length === 0 ? (
                            <Typography
                                variant="body2"
                                sx={{ p: 3, textAlign: "center", color: "grey.500" }}
                            >
                                {t("notifications.empty")}
                            </Typography>
                        ) : (
                            notifications.map((notification) => (
                                <Box
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    sx={{
                                        p: 2,
                                        cursor: "pointer",
                                        borderBottom: "1px solid",
                                        borderColor: "grey.200",
                                        bgcolor: notification.status === 0 ? "info.50" : "transparent",
                                        "&:hover": { bgcolor: "grey.100" },
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={notification.status === 0 ? 600 : 400}
                                    >
                                        {toPersianNumber(notification.title)}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {toPersianNumber(notification.description)}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.disabled"
                                        sx={{ mt: 0.5, display: "block" }}
                                    >
                                        {formatPersianRelativeTime(notification.created_at)}
                                    </Typography>
                                </Box>
                            ))
                        )}
                    </Paper>
                </Popper>
            </div>
        </ClickAwayListener>
    );
}
