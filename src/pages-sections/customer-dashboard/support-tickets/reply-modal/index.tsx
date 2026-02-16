"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import TicketReplyForm from "../ticket-reply-form";

interface ReplyModalProps {
  open: boolean;
  ticketId: number;
  onClose: () => void;
  onSubmit: (description: string, uploadIds: number[]) => Promise<void>;
}

export default function ReplyModal({ open, ticketId, onClose, onSubmit }: ReplyModalProps) {
  const handleSubmit = async (description: string, uploadIds: number[]) => {
    await onSubmit(description, uploadIds);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        پاسخ به تیکت #{ticketId}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", left: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TicketReplyForm onSubmit={handleSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
