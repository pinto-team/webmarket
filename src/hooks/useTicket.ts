import { useState } from "react";
import { getActiveTicket, createTicket } from "@/services/ticket.service";
import { TicketResource, TicketCreateRequest } from "@/types/ticket.types";

export const useTicket = () => {
  const [ticket, setTicket] = useState<TicketResource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveTicket();
      console.log('Fetched ticket data:', data);
      console.log('Ticket replies:', data?.replies);
      setTicket(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در دریافت تیکت");
    } finally {
      setLoading(false);
    }
  };

  const submitTicket = async (request: TicketCreateRequest) => {
    try {
      setLoading(true);
      setError(null);
      await createTicket(request);
      await fetchTicket();
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در ارسال تیکت");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { ticket, loading, error, fetchTicket, submitTicket };
};
