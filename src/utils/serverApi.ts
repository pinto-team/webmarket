import type { AxiosInstance } from "axios";

import { createSSRAxiosInstance } from "@/utils/axiosSSR";
import { getOrigin } from "@/utils/getOrigin";

export async function getServerOrigin(explicitOrigin?: string): Promise<string | undefined> {
    if (explicitOrigin) return explicitOrigin;

    if (process.env.TENANT_ORIGIN) return process.env.TENANT_ORIGIN;

    const requestOrigin = await getOrigin();
    if (requestOrigin) return requestOrigin;

    return process.env.NEXT_PUBLIC_SITE_ORIGIN;
}

export async function getServerApi(explicitOrigin?: string): Promise<AxiosInstance> {
    const origin = await getServerOrigin(explicitOrigin);
    return createSSRAxiosInstance(origin);
}
