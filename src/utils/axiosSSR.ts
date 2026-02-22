import axios from "axios";
import https from "https";

const shouldVerifyTLS = process.env.NODE_ENV === "production";

export const createSSRAxiosInstance = (origin?: string) => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.taavoni.online/api/front",
        timeout: 30000,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: shouldVerifyTLS,
            keepAlive: true,
        }),
        withCredentials: false,
    });

    if (origin) {
        instance.defaults.headers.common.Origin = origin;
    }

    return instance;
};
