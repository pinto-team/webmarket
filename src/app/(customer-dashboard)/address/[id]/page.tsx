import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AddressDetailsPageView } from "pages-sections/customer-dashboard/address/page-view";

import type { IdParams } from "models/Common";
import type Address from "models/Address.model";

import axiosInstance from "@/utils/axiosInstance";
import { getShopDataServer } from "@/utils/shopDataCache";
import { tServer } from "@/i18n/serverT";

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

    const shopData = await getShopDataServer();
    const siteTitle =
        shopData?.title?.trim() || tServer<string>("meta.defaultTitle");

    return {
        title: `${address.title} - ${siteTitle}`,
    };
}

export default async function AddressPage({ params }: IdParams) {
    const { id } = await params;

    const address = await getAddress(id);
    if (!address) notFound();

    return <AddressDetailsPageView address={address} />;
}
