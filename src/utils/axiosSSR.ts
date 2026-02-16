import axios from "axios";
import https from "https";

export const createSSRAxiosInstance = (origin?: string) => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.taavoni.online/api/front",
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(origin && { "Origin": origin })
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      keepAlive: false
    }),
    withCredentials: false
  });

  return instance;
};
