import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddressDetailsPageView } from "pages-sections/customer-dashboard/address/page-view";
import type { IdParams } from "models/Common";
import type Address from "models/Address.model";
import axiosInstance from "@/utils/axiosInstance";

async function getAddress(id: string): Promise<Address | null> {
    try {
        const res = await axiosInstance.get(`/addresses/${id}`);
        return (res.data?.data ?? res.data ?? null) as Address | null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: IdParams): Promise<Metadata> {
    const { id } = await params;
    const address = await getAddress(id);
    if (!address) notFound();

    return { title: `${address.title} - تاوونی` };
}

export default async function AddressPage({ params }: IdParams) {
    const { id } = await params;
    const address = await getAddress(id);
    if (!address) notFound();

    return <AddressDetailsPageView address={address} />;
}
