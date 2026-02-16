"use client";

import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Add from "@mui/icons-material/Add";
import Headset from "icons/Headset";
import DashboardHeader from "../../dashboard-header";
import TicketCard from "../ticket-card/index";
import TicketReply from "../ticket-reply";
import NewTicketForm from "../new-ticket-form";
import ReplyModal from "../reply-modal";
import { useTicket } from "@/hooks/useTicket";
import { TicketResource } from "@/types/ticket.types";

function TicketDetailsView({ ticket, onReply }: { ticket: TicketResource; onReply: () => void }) {
  console.log('Ticket data:', ticket);
  console.log('Replies:', ticket.replies);
  
  return (
    <Box>
      <TicketCard ticket={ticket} onReply={onReply} />
      <Divider sx={{ my: 3 }} />
      {ticket.replies && ticket.replies.length > 0 ? (
        ticket.replies.map((reply) => (
          <TicketReply
            key={reply.id}
            reply={reply}
            isCustomer={reply.ownerable?.id === ticket.ownerable?.id}
          />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          هنوز پاسخی ثبت نشده است
        </Typography>
      )}
    </Box>
  );
}

export function TicketsPageView() {
  const { ticket, loading, error, fetchTicket, submitTicket } = useTicket();
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, []);

  const handleSubmitTicket = async (description: string, uploadIds: number[]) => {
    await submitTicket({ description, upload_ids: uploadIds });
    setShowNewTicketForm(false);
    setReplyModalOpen(false);
  };

  if (loading && !ticket) {
    return (
      <Fragment>
        <DashboardHeader title="تیکتهای پشتیبانی" Icon={Headset} />
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </Fragment>
    );
  }

  if (showNewTicketForm) {
    return (
      <Fragment>
        <DashboardHeader title="تیکت جدید" Icon={Headset} />
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
        <DashboardHeader title="جزئیات تیکت" Icon={Headset} />
        <Button variant="outlined" onClick={() => setShowDetails(false)} sx={{ mb: 2 }}>
          بازگشت به لیست
        </Button>
        <TicketDetailsView ticket={ticket} onReply={() => setReplyModalOpen(true)} />
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
        title="تیکتهای پشتیبانی" 
        Icon={Headset}
        buttonText="تیکت جدید"
        buttonIcon={<Add />}
        handleClick={() => setShowNewTicketForm(true)}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {ticket ? (
        <TicketCard 
          ticket={ticket} 
          onReply={() => setReplyModalOpen(true)}
          onClick={() => setShowDetails(true)}
        />
      ) : (
        <Box py={6} textAlign="center">
          <Headset sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            تیکت فعالی وجود ندارد
          </Typography>
          <Typography variant="body2" color="text.disabled">
            برای ارتباط با پشتیبانی تیکت جدید ایجاد کنید
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
