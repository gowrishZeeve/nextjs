import { AppNotificationLevels } from "@/components/InAppNotification/declarations/message";
import ErrorIcon from "@/components/InAppNotification/components/Icons/Error";
import InfoIcon from "@/components/InAppNotification/components/Icons/Info";
import SuccessIcon from "@/components/InAppNotification/components/Icons/Success";
import WarningIcon from "@/components/InAppNotification/components/Icons/Warning";

const NotificationIcon = ({ level }: { level: AppNotificationLevels }) => {
  switch (level) {
    case "info":
      return <InfoIcon />;
    case "success":
      return <SuccessIcon />;
    case "warning":
      return <WarningIcon />;
    case "error":
      return <ErrorIcon />;
    default:
      throw Error("wrong notification level " + level);
  }
};

export default NotificationIcon;
