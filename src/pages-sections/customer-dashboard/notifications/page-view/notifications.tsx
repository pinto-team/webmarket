"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CheckCircle from "@mui/icons-material/CheckCircle";

import NotificationsIcon from "icons/MobileNotch";
import DashboardHeader from "../../dashboard-header";
import Pagination from "../../pagination";

import { getNotifications, updateNotification } from "@/services/notification.service";
import type { NotificationResource } from "@/types/notification.types";
import { format } from "date-fns/format";
import { t } from "@/i18n/t";

export function NotificationsPageView() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const [notifications, setNotifications] = useState<NotificationResource[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await getNotifications({ paged: page, count: 10 });
            setNotifications(result.items);
            setTotalPages(result.pagination.last_page);
        } catch (err: any) {
            setError(err?.response?.data?.message || t("notifications.fetchError"));
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id: number) => {
        try {
            await updateNotification(id, { status: 1 });
            fetchNotifications();
        } catch {
            // silent
        }
    };

    const pageTitle = t("dashboard.notifications");

    if (loading) {
        return (
            <Fragment>
                <DashboardHeader Icon={NotificationsIcon} title={pageTitle} />
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            </Fragment>
        );
    }

    if (error) {
        return (
            <Fragment>
                <DashboardHeader Icon={NotificationsIcon} title={pageTitle} />
                <Box py={4} textAlign="center">
                    <Typography color="error">{error}</Typography>
                </Box>
            </Fragment>
        );
    }

    if (!notifications || notifications.length === 0) {
        return (
            <Fragment>
                <DashboardHeader Icon={NotificationsIcon} title={pageTitle} />
                <Box py={8} textAlign="center">
                    <NotificationsIcon sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" mb={1}>
                        {t("notifications.empty")}
                    </Typography>
                </Box>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <DashboardHeader Icon={NotificationsIcon} title={pageTitle} />

            {notifications.map((notification) => (
                <Card
                    key={notification.id}
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 2,
                        border: "1px solid",
                        borderColor: "grey.100",
                        bgcolor: notification.status === 0 ? "primary.50" : "transparent",
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                        <Box flex={1}>
                            <Typography variant="h6" mb={0.5}>
                                {notification.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" mb={1}>
                                {notification.description}
                            </Typography>

                            <Typography variant="caption" color="text.disabled">
                                {format(new Date(notification.created_at), t("dateTime.notificationFormat"))}
                            </Typography>
                        </Box>

                        {notification.status === 0 && (
                            <IconButton size="small" onClick={() => handleMarkAsRead(notification.id)}>
                                <CheckCircle color="primary" />
                            </IconButton>
                        )}
                    </Box>
                </Card>
            ))}

            {totalPages > 1 && <Pagination count={totalPages} />}
        </Fragment>
    );
}
