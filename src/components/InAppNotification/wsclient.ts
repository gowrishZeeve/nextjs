import { MessageToServer } from "@/components/InAppNotification/declarations/message";
import InAppNotificationsHandler from "@/components/InAppNotification/InAppNotificationHandler";

export type ClientCallback = {
  notifyOnOpen?: () => void;
  notifyOnClose?: (event: any) => void;
  notifyOnError?: (event: any) => void;
  notifyOnMessage?: (event: any) => void;
};

let pingTimeout: NodeJS.Timeout;
function heartbeat(ws: WebSocket) {
  clearTimeout(pingTimeout);

  pingTimeout = setTimeout(() => {
    ws.close();
  }, 30000 + 2000);
}

export default class WSClient {
  private address: string;

  private ws!: WebSocket;

  private callback: ClientCallback | undefined;

  private notificationsHandler: InAppNotificationsHandler;
  private autoReconnectWaitTime: number = 5000;

  constructor(
    address: string,
    notificationsHandler: InAppNotificationsHandler,
    callback?: ClientCallback
  ) {
    this.address = address;

    this.notificationsHandler = notificationsHandler;
    this.startWebSocketConnection();
    this.callback = callback;
  }

  private startWebSocketConnection() {
    this.ws = new WebSocket(this.address);
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;
  }

  onPing = (): void => {
    console.info("ping received");
    heartbeat(this.ws);
  };

  onOpen = (): void => {
    heartbeat(this.ws);

    console.info("connected");
    if (this.callback && this.callback.notifyOnOpen) {
      this.callback.notifyOnOpen();
    }
  };

  onMessage = (event: any): void => {
    if (this.callback && this.callback.notifyOnMessage) {
      this.callback.notifyOnMessage(event);
    }
    this.notificationsHandler.parseMessage(event.data);
  };

  onError = (event: any): void => {
    if (this.callback && this.callback.notifyOnError) {
      this.callback.notifyOnError(event);
    }

    console.error(event.error);
  };

  onClose = (event: any): void => {
    if (this.callback && this.callback.notifyOnClose) {
      this.callback.notifyOnClose(event);
    }

    console.info("connection closing reason:", event);
    console.info(
      "auto reconnecting in ",
      this.autoReconnectWaitTime / 1000,
      " seconds ...."
    );
    this.reconnectOnClose();
  };
  updateAddress(wsAddress: string): void {
    this.address = wsAddress;
  }

  updateCallbacks(callback: ClientCallback): void {
    if (this.callback) {
      if (callback.notifyOnOpen)
        this.callback.notifyOnOpen = callback.notifyOnOpen;
      if (callback.notifyOnClose)
        this.callback.notifyOnClose = callback.notifyOnClose;
      if (callback.notifyOnMessage)
        this.callback.notifyOnMessage = callback.notifyOnMessage;
      if (callback.notifyOnError)
        this.callback.notifyOnError = callback.notifyOnError;
    } else this.callback = callback;
  }
  reconnectOnClose = (): void => {
    setTimeout(() => {
      // performing auto reconnection
      console.info("performing auto reconnection....");
      this.startWebSocketConnection();
    }, this.autoReconnectWaitTime);
  };

  sendMessage = (msg: MessageToServer): void => {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  };

  closeConnection = (): void => {
    this.ws.close();
  };
}
