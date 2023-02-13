import {
  NotificationCallbacks,
  Ops,
} from "@/components/InAppNotification/declarations/message";
import InAppNotificationsHandler from "@/components/InAppNotification/InAppNotificationHandler";
import WSClient from "./wsclient";

class InAppNotificationsManager {
  private static instance: InAppNotificationsManager;

  private ops: Ops;

  private wsAddress: string;

  private notificationsHandler: InAppNotificationsHandler;

  private wsClient: WSClient;

  private isInitiated: boolean = false;

  private constructor(
    wsAddress: string,
    options: Ops,
    isInitiated?: boolean,
    callbacks?: NotificationCallbacks
  ) {
    if (isInitiated) this.isInitiated = isInitiated;

    this.wsAddress = wsAddress;

    this.ops = options;

    this.notificationsHandler = new InAppNotificationsHandler(
      options.InaApp,
      callbacks
    );

    this.wsClient = new WSClient(this.wsAddress, this.notificationsHandler);
  }

  static createInstance(
    wsAddress: string,
    ops: Ops,
    callbacks?: NotificationCallbacks
  ): InAppNotificationsManager {
    const instance = new InAppNotificationsManager(
      wsAddress,
      ops,
      true,
      callbacks
    );
    InAppNotificationsManager.instance = instance;
    return InAppNotificationsManager.instance;
  }

  static getInstance(): InAppNotificationsManager {
    return InAppNotificationsManager.instance;
  }

  getInappNotificationsHandler(): InAppNotificationsHandler {
    return this.notificationsHandler;
  }

  getOps(): Ops {
    return this.ops;
  }

  requestNotifications(): void {
    this.wsClient.sendMessage({
      Action: "Message",
      Type: "AllNotifications",
    });
    console.log("notification request sent");
    this.notificationsHandler.OnNotificationsRequest();
  }

  updateWsAddress(wsAddress: string): void {
    this.wsAddress = wsAddress;
    this.wsClient.updateAddress(wsAddress);
  }

  getWsClient(): WSClient {
    return this.wsClient;
  }
}
export default InAppNotificationsManager;
