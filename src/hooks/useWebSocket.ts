import { useEffect } from "react";
import { websocketService } from "@/services/websocket.service";
import { tokenStorage } from "@/utils/token";

export const useWebSocket = (customerId?: number) => {
  useEffect(() => {
    if (!customerId) return;

    const token = tokenStorage.getToken();
    if (!token) return;

    const config = {
      app_key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "",
      wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || "",
      wsPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT || "6001"),
      authEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL}/broadcasting/auth`,
    };

    websocketService.connect(customerId, token, config);

    return () => {
      websocketService.disconnect();
    };
  }, [customerId]);

  return websocketService;
};
