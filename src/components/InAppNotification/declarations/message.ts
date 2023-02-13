import { ToastOptions } from "react-toastify";

export type RedirectionData = {
  newTab: boolean;
  URL: string;
};

export type AppNotificationLevels = "success" | "error" | "info" | "warning";

export type CountData = {
  count: Number;
};
export type AppData = {
  heading: string;
  description: string;
  level: AppNotificationLevels;
  redirection?: {
    newTab: boolean;
    URL: string;
  };
  read: boolean;
  createdAt: string;
};
export type MessageToClient = {
  Action: "Message";
  Type: "Count" | "Toast" | "AppNotification";
  Details: {
    id: string;
    data: AppData | CountData | AppData[];
  };
};

export type MessageToServer = {
  Action: "Message";
  Type: "AllNotifications";
};

export type CountCallback = (countData: CountData) => void;
export type AppNotificationCallback = (appNotifications: AppData[]) => void;
export type ToastNotificationCallback = (toastNotification: AppData) => void;
export type NotificationRequestCallback = () => void;

export type NotificationCallbacks = {
  countCallback?: CountCallback;
  appNotificationCallback?: AppNotificationCallback;
  toastNotificationCallback?: ToastNotificationCallback;
  notificationRequestCallback?: NotificationRequestCallback;
};

export type AppNotificationOps = {};
export type InAppNotificationOps = {
  AppNotification?: AppNotificationOps;
  ToastNotification?: ToastOptions;
};

export type Ops = {
  InaApp: InAppNotificationOps;
};
