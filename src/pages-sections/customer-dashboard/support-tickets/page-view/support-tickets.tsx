"use client";

import { Fragment, useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";

import Headset from "icons/Headset";
import DashboardHeader from "../../dashboard-header";
import TicketCard from "../ticket-card";
import TicketReply from "../ticket-reply";
import NewTicketForm from "../new-ticket-form";
import ReplyModal from "../reply-modal";

import { useTicket } from "@/hooks/useTicket";
import { TicketResource } from "@/types/ticket.types";
import { t } from "@/i18n/t";

function TicketDetailsView({
                               ticket,
                               onReply,
                           }: {
    ticket: TicketResource;
    onReply: () => void;
}) {
    return (
        <Box>
            <TicketCard ticket={ticket} onReply={onReply} />

            <Divider sx={{ my: 3 }} />

            {Array.isArray(ticket.replies) && ticket.replies.length > 0 ? (
                ticket.replies.map((reply) => (
                    <TicketReply
                        key={reply.id}
                        reply={reply}
                        isCustomer={
                            reply.ownerable?.id === ticket.ownerable?.id
                        }
                    />
                ))
            ) : (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    py={4}
                >
                    {t("tickets.noData")}
                </Typography>
            )}
        </Box>
    );
}

export function TicketsPageView() {
    const { ticket, loading, error, fetchTicket, submitTicket } =
        useTicket();

    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showNewTicketForm, setShowNewTicketForm] =
        useState(false);

    useEffect(() => {
        fetchTicket();
    }, []);

    const handleSubmitTicket = async (
        description: string,
        uploadIds: number[]
    ) => {
        await submitTicket({
            description,
            upload_ids: uploadIds,
        });

        setShowNewTicketForm(false);
        setReplyModalOpen(false);
    };

    if (loading && !ticket) {
        return (
            <Fragment>
                <DashboardHeader
                    title={t("tickets.title")}
                    Icon={Headset}
                />

                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            </Fragment>
        );
    }

    if (showNewTicketForm) {
        return (
            <Fragment>
                <DashboardHeader
                    title={t("tickets.createTitle")}
                    Icon={Headset}
                />

                <NewTicketForm
                    onSubmit={handleSubmitTicket}
                    onCancel={() => setShowNewTicketForm(false)}
                />
            </Fragment>
        );
    }

    if (showDetails && ticket) {
        return (
            <Fragment>
                <DashboardHeader
                    title={t("tickets.title")}
                    Icon={Headset}
                />

                <Button
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onClick={() => setShowDetails(false)}
                >
                    {t("common.back")}
                </Button>

                <TicketDetailsView
                    ticket={ticket}
                    onReply={() => setReplyModalOpen(true)}
                />

                <ReplyModal
                    open={replyModalOpen}
                    ticketId={ticket.id}
                    onClose={() => setReplyModalOpen(false)}
                    onSubmit={handleSubmitTicket}
                />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <DashboardHeader
                title={t("tickets.title")}
                Icon={Headset}
                buttonText={t("tickets.create")}
                buttonIcon={<Add />}
                handleClick={() => setShowNewTicketForm(true)}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {ticket ? (
                <TicketCard
                    ticket={ticket}
                    onReply={() => setReplyModalOpen(true)}
                    onClick={() => setShowDetails(true)}
                />
            ) : (
                <Box py={6} textAlign="center">
                    <Headset
                        sx={{ fontSize: 80, color: "grey.300", mb: 2 }}
                    />

                    <Typography
                        variant="h6"
                        color="text.secondary"
                        mb={1}
                    >
                        {t("tickets.noData")}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.disabled"
                    >
                        {t("tickets.create")}
                    </Typography>
                </Box>
            )}

            {ticket && (
                <ReplyModal
                    open={replyModalOpen}
                    ticketId={ticket.id}
                    onClose={() => setReplyModalOpen(false)}
                    onSubmit={handleSubmitTicket}
                />
            )}
        </Fragment>
    );
}
