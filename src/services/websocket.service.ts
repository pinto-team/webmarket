import Pusher from "pusher-js";

interface WebSocketConfig {
  app_key: string;
  wsHost: string;
  wsPort: number;
  authEndpoint: string;
}

export class WebSocketService {
  private pusher: Pusher | null = null;
  private channel: any = null;

  connect(customerId: number, token: string, config: WebSocketConfig) {
    this.pusher = new Pusher(config.app_key, {
      wsHost: config.wsHost,
      wsPort: config.wsPort,
      forceTLS: true,
      enabledTransports: ["ws", "wss"],
      authEndpoint: config.authEndpoint,
      cluster: "mt1",
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    this.channel = this.pusher.subscribe(`private-customer.channel.${customerId}`);
    return this.channel;
  }

  onProfileUpdate(callback: (data: any) => void) {
    this.channel?.bind("customer.PROFILE_UPDATE", callback);
  }

  onVerificationStatus(callback: (data: any) => void) {
    this.channel?.bind("customer.VERIFICATION_STATUS", callback);
  }

  onEvent(eventName: string, callback: (data: any) => void) {
    this.channel?.bind(eventName, callback);
  }

  onAllEvents(callback: (eventName: string, data: any) => void) {
    this.channel?.bind_global(callback);
  }

  disconnect() {
    if (this.channel) {
      this.pusher?.unsubscribe(this.channel.name);
    }
    this.pusher?.disconnect();
  }
}

export const websocketService = new WebSocketService();
