import type { PropsWithChildren } from "react";
import { CustomerDashboardLayout } from "@/components/layouts/customer-dashboard";

export default function Layout1({ children }: PropsWithChildren) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>;
}
