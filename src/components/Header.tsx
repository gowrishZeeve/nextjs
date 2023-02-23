import Image, { StaticImageData } from "next/image";
import { redirect } from 'next/navigation'

export interface HeaderProps {
  dashboardUrl: string;
  children: any;
  zeevelogo: StaticImageData;
  logoutIcon: StaticImageData;
  editIcon: StaticImageData;
  fileIcon: StaticImageData;
  userIcon: StaticImageData;
  helpdeskIcon: StaticImageData;
  helpdeskURL: string;
  email: string;
  firstName: string;
  lastName: string;
  accountUrl: string;
  avatar: StaticImageData;
  nameflag: boolean;
  path: StaticImageData;
  logout: () => void;
  docUrl: string;
}

export const Header = ({
  children,
  dashboardUrl,
  zeevelogo,
  logoutIcon,
  editIcon,
  fileIcon,
  userIcon,
  helpdeskIcon,
  helpdeskURL,
  email,
  firstName,
  lastName,
  accountUrl,
  avatar,
  nameflag,
  path,
  logout,
  docUrl,
}: HeaderProps) => {
  return (
    <section>
      <div className="mt-1 container-fluid">
        <div className="row pt-1 justify-content-between">
          <div className="col-lg-2 col-xl-2 col-md-2 col-sm-4 col-5">
            <Image
              src={zeevelogo}
              onClick={() => {
                redirect(dashboardUrl);
                // window.open(dashboardUrl, "_self");
              }}
              className="img-responsive ms-1 ps-1"
              alt="zeeve-logo"
            />
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 search col-auto" />
          <div className="avatar col-xl-3 col-lg-6 col-md-6 col-sm-5 col-6">
            <div className="d-flex justify-content-end">
              <div className="col-xl-9 col-lg-12 col-sm-12 col-md-12">
                <div className="d-flex justify-content-center border-end cursor pt-1 border-end">
                  <div
                    className="d-flex "
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="rounded-circle avatar-image">
                      {!nameflag && <Image src={avatar} alt="Profile-1" />}
                      {nameflag && (
                        <div
                          className="container-username"
                          id="container-username"
                        >
                          <div className="username" id="username">
                            {" "}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 mx-2">
                      <p className="avatar-title mb-0">{email}</p>
                      <p className="avatar-name mb-0 ps-1">
                        <strong>{`${firstName} ${lastName}`}</strong>
                      </p>
                    </div>
                    <div className="align-self-center mx-2">
                      <Image src={path} alt="" />
                    </div>
                  </div>
                  <ul
                    className="dropdown-menu "
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <a className="dropdown-item" href={accountUrl}>
                        <Image src={editIcon} className="mx-2" alt="" />
                        Edit Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href={accountUrl}>
                        <Image src={userIcon} className="mx-2" alt="" />
                        My Account
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href={helpdeskURL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image src={helpdeskIcon} className="mx-2" alt="" />
                        Helpdesk
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href={docUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image src={fileIcon} className="mx-2" alt="" />
                        Docs
                      </a>
                    </li>
                    <li>
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          logout();
                        }}
                      >
                        <Image src={logoutIcon} className="mx-2" alt="" />
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
