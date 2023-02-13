import React from "react";
import { AppNotificationLevels } from "@/components/InAppNotification/declarations/message";
import NotificationIcon from "@/components/InAppNotification/components/Icons/NotificationIcon";
import ReadStatus from "./Icons/ReadStatus";
import prettyMilliseconds from "pretty-ms";

export type NotificationItemDependency = {
  id?: string;
  redirectionURL?: {
    newTab: boolean;
    URL: string;
  };
  heading: string;
  level: AppNotificationLevels;
  description: string;
  readStatus: boolean;
  createdAt: string;
};
const NotificationItem = ({
  id,
  redirectionURL,
  heading,
  description,
  level,
  readStatus,
  createdAt,
}: NotificationItemDependency) => (
  <a
    href={redirectionURL ? redirectionURL.URL : "#"}
    className="notficationItemAnchor"
  >
    <div className="container border-bottom">
      <div className="d-flex mt-2">
        <div className="col-3">
          <NotificationIcon level={level} />
        </div>
        <div className="col-8 mt-2">
          <p className="mb-1 ">
            <strong className={"heading-" + level}>{heading}</strong>
            <br /> <div dangerouslySetInnerHTML={{ __html: description }}></div>
          </p>
          <p className="fontsize">
            {prettyMilliseconds(Date.now() - new Date(createdAt).getTime(), {
              compact: true,
              verbose: true,
            })}{" "}
            ago
          </p>
        </div>
        <div className="col">
          <ReadStatus readStatus={readStatus} />
        </div>
      </div>
    </div>
  </a>
);
export default NotificationItem;
