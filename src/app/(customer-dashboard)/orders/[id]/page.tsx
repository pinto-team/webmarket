import { OrderDetailsPageView } from "pages-sections/customer-dashboard/orders/page-view";

export default async function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailsPageView orderId={id} />;
}
