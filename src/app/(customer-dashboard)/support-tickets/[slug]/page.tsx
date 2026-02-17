import { notFound } from "next/navigation";
import { TicketsPageView } from "pages-sections/customer-dashboard/support-tickets/page-view";
import { getActiveTicket } from "@/services/ticket.service";

export default async function Page() {
    const ticket = await getActiveTicket();
    if (!ticket) notFound();

    return <TicketsPageView />;
}
