import { toast, ToastContent, ToastOptions } from "react-toastify";
import {
  AppData,
  AppNotificationLevels,
  RedirectionData,
} from "@/components/InAppNotification/declarations/message";

class ToastHandler {
  private ops: ToastOptions;

  constructor(ops: ToastOptions) {
    this.ops = ops;
  }

  changeOptions(ops: ToastOptions): void {
    this.ops = ops;
  }

  showToast(toastNotificationData: AppData): void {
    const data = toastNotificationData.heading;
    const element = ToastHandler.prepareToastElement(
      data,
      toastNotificationData.redirection
    );
    this.toast(element, toastNotificationData.level);
  }

  static prepareToastElement(
    data: string,
    redirection?: RedirectionData
  ): React.ReactNode {
    if (redirection) {
      return (
        <div className="toast-div">
          <a
            href={redirection?.URL}
            className="toast-anchor"
            target={"_blank"}
            rel="noreferrer"
          >
            {data}
          </a>
        </div>
      );
    }
    return <div className="toast-div">{data}</div>;
  }

  toast(content: ToastContent, level: AppNotificationLevels): void {
    switch (level) {
      case "error":
        toast.error(content, this.ops);
        break;
      case "info":
        toast.info(content, this.ops);
        break;
      case "success":
        toast.success(content, this.ops);
        break;
      case "warning":
        toast.warn(content, this.ops);
        break;
      default:
        throw Error("wrong notification level defined" + level);
    }
  }
}
export default ToastHandler;
