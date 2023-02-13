import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Image from "next/image";

import TokenManager from "@zeeve-platform/login-utility";
import {
  NotificationBell,
  NotificationList,
} from "@/components/InAppNotification";

import cross from "@/assets/CloseSquare.png";
import notification from "@/assets/notifications.png";
import userimage from "@/assets/User.png";
import zeevelogo from "@/assets/zeeve-logo.png";
import statuscomplete from "@/assets/status-completed.png";
import statusrunning from "@/assets/status-running.png";
import statuscancel from "@/assets/status-cancel.png";
import Componentfailedcreateinst from "@/assets/Component-failedcreateinst.png";
import moredropdown from "@/assets/more-dropdown.png";
import sub3 from "@/assets/sub-3.png";
import sub4 from "@/assets/sub-4.png";
import avatar from "@/assets/avatar.png";
import path from "@/assets/Path.png";
import editIcon from "@/assets/edit.svg";
import user from "@/assets/user.svg";
import fileIcon from "@/assets/file-text.svg";
import logoutIcon from "@/assets/log-out.svg";
import helpdeskIcon from "@/assets/helpdesk.svg";

import Urls from "@/utils/baseURLs";
import { getUserDetails } from "@/services/apiService";

const Navbar = () => {
  const nameflag: boolean = true;
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const setProfile = (first: string, last: string) => {
    const initials: string | null = `${first.charAt(0).toUpperCase()}${last
      .charAt(0)
      .toUpperCase()}`;
    const docx: HTMLElement | null = document.getElementById("username");
    if (docx) {
      docx.innerHTML = initials;
    }
  };
  const delete_cookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };
  const logout = async () => {
    delete_cookie("recent");
    await TokenManager.getInstance().logout();
  };

  const userDetails = async () => {
    const response: any = await getUserDetails();
    if (response && response.success) {
      if (response.data) {
        setEmail(response.data.usercred);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setProfile(response.data.first_name, response.data.last_name);
      } else {
        setFirstName("Not");
        setLastName("Found");
        setEmail("Not Found");
        setProfile("Not", "Found");
      }
    } else {
      setFirstName("Not");
      setLastName("Found");
      setEmail("Not Found");
      setProfile("Not", "Found");
    }
  };

  useEffect(() => {
    userDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Header
      dashboardUrl={Urls.getDashboardUrl()}
      zeevelogo={zeevelogo}
      logoutIcon={logoutIcon}
      editIcon={editIcon}
      fileIcon={fileIcon}
      userIcon={user}
      email={email}
      firstName={firstName}
      lastName={lastName}
      accountUrl={Urls.getMyAccountUrl()}
      avatar={avatar}
      nameflag={nameflag}
      path={path}
      logout={logout}
      helpdeskIcon={helpdeskIcon}
      helpdeskURL={Urls.getContactDetails().helpdeskURL}
      docUrl="https://zeeve.readthedocs.io/en/latest/"
    >
      <div className="avatar col-xl-3 col-lg-6 col-md-6 col-sm-5 col-6">
        <div className="d-flex justify-content-end">
          <div className="col-lg-12 col-xl-12 mt-2 text-center">
            {/* <NotificationBell theme="zeeve" /> */}
          </div>
          {/* notifications starts heere */}
          <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasactivity"
            aria-labelledby="offcanvasRight"
          >
            <div className=" border-bottom offcanvas-header">
              <h2 id="offcanvasRight">Notifications</h2>
              <div className="text-end">
                <Image
                  src={cross}
                  className="cursor text-reset"
                  data-bs-dismiss="offcanvas"
                  alt=""
                />
              </div>
            </div>
            {/* <div className="mt-3"><NotificationList /></div> */}
          </div>
        </div>
      </div>
    </Header>
  );
};
export default Navbar;
