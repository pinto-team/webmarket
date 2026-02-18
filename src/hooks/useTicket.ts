import { useState } from "react";
import { getActiveTicket, createTicket } from "@/services/ticket.service";
import { TicketResource, TicketCreateRequest } from "@/types/ticket.types";
import { t } from "@/i18n/t";

export const useTicket = () => {
    const [ticket, setTicket] = useState<TicketResource | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTicket = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getActiveTicket();
            setTicket(data);
        } catch (err: any) {
            const message =
                err?.response?.data?.message || t("errors.serverError");

            setError(message);
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
            const message =
                err?.response?.data?.message || t("errors.serverError");

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { ticket, loading, error, fetchTicket, submitTicket };
};
