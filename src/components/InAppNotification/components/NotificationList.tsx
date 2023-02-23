import { useEffect, useState } from "react";
import { AppData } from "@/components/InAppNotification/declarations/message";
import InAppNotificationsManager from "@/components/InAppNotification/InAppNotificationManager";
import NotificationItem from "@/components/InAppNotification/components/NotificationItem";

const NotificationList = () => {
  const [messages, setMessages] = useState<AppData[]>([]);
  useEffect(() => {
    console.log("rendered");
    InAppNotificationsManager.getInstance()
      .getInappNotificationsHandler()
      .registerCallback({
        appNotificationCallback: (mess) => {
          setMessages(mess);
          console.log("new message received");
        },
      });
    return () => {
      InAppNotificationsManager.getInstance()
        .getInappNotificationsHandler()
        .unregisterCallback("App");
      console.log("unregistered app notification callback");
    };
  });
  return (
    <ul className="px-0">
      {messages.map((val,index) => (
        <NotificationItem
          key={index}
          heading={val.heading}
          description={val.description}
          level={val.level}
          readStatus={val.read}
          createdAt={val.createdAt}
        />
      ))}
    </ul>
  );
};
export default NotificationList;
