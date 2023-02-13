import {
  AppData,
  AppNotificationCallback,
  CountCallback,
  CountData,
  InAppNotificationOps,
  MessageToClient,
  MessageToServer,
  NotificationCallbacks,
  NotificationRequestCallback,
  Ops,
  ToastNotificationCallback,
} from "./declarations/message";
import ToastHandler from "@/components/InAppNotification/ToastHandler";
import { ToastOps } from "@/utils/default";

class InAppNotificationsHandler {
  private toastHandler: ToastHandler;

  private countCallback?: CountCallback;

  private appNotificationCallback?: AppNotificationCallback;

  private toastNotificationCallback?: ToastNotificationCallback;

  private notificationRequestCallback?: NotificationRequestCallback;

  private inAppNotifications: Array<AppData>;

  private ops: InAppNotificationOps;

  constructor(ops: InAppNotificationOps, callbacks?: NotificationCallbacks) {
    this.ops = ops;
    // setting callbacks
    if (callbacks) this.registerCallback(callbacks);

    // initialize inapp message state
    this.inAppNotifications = [];

    this.toastHandler = new ToastHandler(
      this.ops.ToastNotification || ToastOps
    );
  }

  parseMessage(message: string): void {
    const messageFromServer: MessageToClient = JSON.parse(message);
    console.log("reachable", messageFromServer);
    switch (messageFromServer.Type) {
      case "AppNotification":
        if (this.appNotificationCallback) {
          this.appNotificationCallback(
            messageFromServer.Details.data as AppData[]
          );
        }
        this.inAppNotifications = messageFromServer.Details.data as AppData[];
        console.log(this.inAppNotifications, "messages");
        break;

      case "Toast":
        if (this.toastNotificationCallback) {
          this.toastNotificationCallback(
            messageFromServer.Details.data as AppData
          );
        }
        this.toastHandler.showToast(messageFromServer.Details.data as AppData);
        break;

      case "Count":
        if (this.countCallback) {
          this.countCallback(messageFromServer.Details.data as CountData);
        }
        break;

      default:
        console.log("default case reached");
    }
  }

  getInAppNotificationsList(): AppData[] {
    return this.inAppNotifications;
  }

  OnNotificationsRequest(): void {
    if (this.notificationRequestCallback) this.notificationRequestCallback();
    console.log("notifications requested");
  }

  onCountNotification(countData: CountData): void {
    if (this.countCallback) this.countCallback(countData);
    console.log("count notification received", countData);
  }

  onToastNotification(toastNotification: AppData): void {
    if (this.toastNotificationCallback)
      this.toastNotificationCallback(toastNotification);
    console.log("toast notification received", toastNotification);
  }

  onAppNotification(appNotification: AppData[]): void {
    if (this.appNotificationCallback)
      this.appNotificationCallback(appNotification);
    console.log("app notifications received", appNotification);
  }

  registerCallback(callback: NotificationCallbacks): void {
    if (callback.appNotificationCallback)
      this.appNotificationCallback = callback.appNotificationCallback;
    if (callback.countCallback) this.countCallback = callback.countCallback;
    if (callback.toastNotificationCallback)
      this.toastNotificationCallback = callback.toastNotificationCallback;
    if (callback.notificationRequestCallback)
      this.notificationRequestCallback = callback.notificationRequestCallback;
  }

  unregisterCallback(
    callbackName: "Toast" | "App" | "Count" | "NotificationRequest"
  ): void {
    switch (callbackName) {
      case "App":
        this.appNotificationCallback = undefined;
        break;
      case "Toast":
        this.toastNotificationCallback = undefined;
        break;
      case "Count":
        this.countCallback = undefined;
        break;
      case "NotificationRequest":
        this.notificationRequestCallback = undefined;
        break;
      default:
        console.log("not a good callback");
    }
  }

  static sendNotificationRequest(): MessageToServer {
    const message: MessageToServer = {
      Action: "Message",
      Type: "AllNotifications",
    };
    return message;
  }
}

export default InAppNotificationsHandler;
