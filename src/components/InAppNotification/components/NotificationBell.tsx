"use client"
import { useEffect, useState } from "react";
import { prefixPath } from "@/utils/helpers";
import { CountData } from "@/components/InAppNotification/declarations/message";
import NotificationBellIcon from "@/components/InAppNotification/components/Icons/NotificationBellIcon";
import InAppNotificationsManager from "@/components/InAppNotification/InAppNotificationManager";
import { usePathname } from 'next/navigation'

interface props {
  theme: string;
}
const NotificationBell = ({ theme }: props) => {
  // const notificationUrl =
  //   window.location.origin + prefixPath(`/img/${theme}/notification.svg`);
  const [notificationCount, setNotificationCount] = useState<Number>(0);
  const [isAnimating, setIsAnimating] = useState<string>("");
  useEffect(() => {
    console.log("callback registered");
    InAppNotificationsManager.getInstance()
      .getInappNotificationsHandler()
      .registerCallback({
        countCallback: (countData: CountData) => {
          setNotificationCount(countData.count);
          setIsAnimating("is-animating");
        },
      });
    return () => {
      console.log("callback unregistered");
      InAppNotificationsManager.getInstance()
        .getInappNotificationsHandler()
        .unregisterCallback("Count");
    };
  });
  return (
    <div className="col-lg-1 col-xl-2 mt-2  text-center">
      {/* <img className=" cursor" style={{ height: '22' }} data-bs-toggle="offcanvas" data-bs-target="#offcanvasactivity" aria-controls="#offcanvasactivity" src={notificationUrl} alt="" /> */}
      <div
        className="notification-bell"
        data-count={notificationCount > 9 ? "9+" : notificationCount}
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasactivity"
        aria-controls="#offcanvasactivity"
        onClick={() => {
          InAppNotificationsManager.getInstance().requestNotifications();

          setNotificationCount(0);
        }}
      >
        <NotificationBellIcon />
      </div>
    </div>
  );
};
export default NotificationBell;
