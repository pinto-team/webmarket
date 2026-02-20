import axios from "axios";
import https from "https";

const shouldVerifyTLS = process.env.NODE_ENV === "production";

export const createSSRAxiosInstance = (origin?: string) => {
    const originUrl = origin ? new URL(origin) : undefined;

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.taavoni.online/api/front",
        timeout: 30000,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            // ✅ tenant context, without breaking upstream routing
            ...(origin && {
                Origin: origin,
                "X-Forwarded-Host": originUrl?.host,
                "X-Forwarded-Proto": originUrl?.protocol.replace(":", ""),
            }),
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: shouldVerifyTLS,
            keepAlive: true,
        }),
        withCredentials: false,
    });
};