import { useEffect, useState } from "react";
import { NavLinkProps } from "@/components/NavLink";
import Image, { StaticImageData } from "next/image";
import { useWindowSize } from "@react-hook/window-size";

export interface SidebarItem {
  name: string;
  icon: StaticImageData;
  path: string;
  subTitle?: string;
  subTitleClass?: string;
  className?: string;
  id: string;
  isInternalRoute: boolean;
  navLink?: React.ForwardRefExoticComponent<
    NavLinkProps & React.RefAttributes<HTMLAnchorElement>
  >;
}
export interface SidebarItemChild {
  name: string;
  icon: StaticImageData;
  path: string;
  subTitle?: string;
  subTitleClass?: string;
  className?: string;
  isInternalRoute: boolean;
  navLink?: React.ForwardRefExoticComponent<
    NavLinkProps & React.RefAttributes<HTMLAnchorElement>
  >;
}

export type SidebarMainItem = SidebarItem & {
  children?: Array<SidebarItemChild>;
};

export type ContactUs = {
  showBorder: boolean;
  email: {
    icon: StaticImageData;
    name: string;
  };
  helpdeskURL: {
    link: string;
    title: string;
    icon: StaticImageData;
  };
};
export interface SidebarProps {
  sidebarMainItems: SidebarMainItem[];
  recentWorkspaceList?: { name: string; path: string }[];
  contactUs: ContactUs;
  otherLinks?: { name: string; path: string; icon: string }[];
  newWorkspace: { path: string; icon: StaticImageData };
  recentWorkspaceIcons: { icon: StaticImageData }[];
  activeLink: string;
  activeLinkParent: string;
}

const EmailContactElement = ({
  email,
  icon,
}: {
  email: string;
  icon: StaticImageData;
}) => (
  <>
    <Image src={icon} alt="" />
    <span className="">{email}</span>
  </>
);

const HelpdeskContactElement = ({
  link,
  title,
  icon,
}: {
  link: string;
  title: string;
  icon: StaticImageData;
}) => (
  <>
    <span className="ps-2">
      <Image src={icon} alt="" />
      <a
        href={link}
        className="mx-2 text-decoration-none"
        target="_blank"
        rel="noreferrer"
      >
        {title}
      </a>
      <br />
    </span>
  </>
);

const Sidebar: React.FC<SidebarProps> = ({
  sidebarMainItems,
  contactUs,
  newWorkspace,
  recentWorkspaceIcons,
  activeLink,
  activeLinkParent,
}) => {
  const [recentList, setRecentList] = useState([]);

  function getCookie(name: string) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    if (match) {
      return match[2];
    }

    return null;
  }

  const updateRecent = () => {
    const data = getCookie("recent");
    if (data) {
      setRecentList(JSON.parse(data));
    }
  };
  const [windowWidth] = useWindowSize();
  const [width, setWidth] = useState<number>(windowWidth);

  function handleWindowSizeChange() {
    setWidth(windowWidth);
  }

  const isMobile = width <= 768;

  useEffect(() => {
    updateRecent();
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capitalizeWord = (str: string) => {
    const arr = str.split(" ");

    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return str2;
  };
  const [toggle, setToggle] = useState(false);
  const toggleSideBar = () => {
    if (isMobile) {
      setToggle(!toggle);
    }
  };
  const showSideDrawer = () => {
    if (!isMobile) {
      return true;
    }
    if (isMobile) {
      return toggle;
    }
    return false;
  };

  const setBullet = (n: number) => {
    if (n < recentWorkspaceIcons.length) {
      return recentWorkspaceIcons[n].icon;
    }
    return recentWorkspaceIcons[0].icon;
  };

  const customStyle = () => {
    return `.activeNavLink{
      color: #3379DF;
      text-decoration: none;
      font-weight: 450;
      padding: 0.5rem 1rem;
      text-decoration: none;
      transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out;
    }
    .group {
      display: table;
      width: 77%;
      font-size: 14px;
    }
    .item {
      display: table-cell;
    }
    .text {
      white-space: nowrap;
      width: 1%;
      padding: 0 10px;
    }
    .line {
      border-bottom: 1px solid;
      position: relative;
      top: -.7rem;
    }
    .nonActiveNavLink{
      text-decoration: none;
      color: black;
      font-weight: 450;
      padding: 0.5rem 1rem;
      text-decoration: none;
      transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out;
    }
    .boldText{
      font-weight: 450;
    }
    `;
  };

  const getClassName = (parent: string, name: string) => {
    if (name === activeLink && parent === activeLinkParent.toLowerCase()) {
      return "nav-link activeNavLink";
    }
    return "nav-link nonActiveNavLink";
  };
  return (
    <>
      <style>{customStyle()}</style>

      <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4 d-flex flex-column flex-shrink-0 sideDrawer ps-1">
        <button
          onClick={() => toggleSideBar()}
          className="col-1  mb-1 navbar-toggler toggle text-center"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fa-solid fa-bars" />
        </button>

        <div
          className={`mt-1 collapse navbar-collapse collapse navbar-collapse show`}
          id="navbarToggler"
        >
          <ul className="nav nav-pills flex-column">
            {sidebarMainItems.map((item, index) => {
              return (
                <li
                  key={`side-nav-bar-main-item-${index}`}
                  className={`${item.className} ${!item.children && ""} ${
                    item.subTitle ? "lh-1 my-1" : "mt-2"
                  }`}
                >
                  {!item.children &&
                    (item.isInternalRoute && item.navLink ? (
                      <item.navLink
                        href={item.path}
                        onClick={() => toggleSideBar()}
                        className={({ isActive }) =>
                          isActive
                            ? "nav-link activeNavLink"
                            : "nav-link nonActiveNavLink"
                        }
                      >
                        <>
                          <Image src={item.icon} alt={`${item.name}-icon`} />
                          <span className="ms-2">{item.name}</span>
                          {item.subTitle && (
                            <>
                              <br />
                              <small className="ms-4 px-2 fw-normal text-muted">
                                {item.subTitle}
                              </small>
                            </>
                          )}
                        </>
                      </item.navLink>
                    ) : (
                      <a
                        href={item.path}
                        className={getClassName(
                          item.name.toLowerCase(),
                          item.name.toLowerCase()
                        )}
                      >
                        <>
                          <Image src={item.icon} alt={`${item.name}-icon`} />
                          <span className="ms-2">{item.name}</span>
                          {item.subTitle && (
                            <>
                              <br />
                              <small
                                className={`ms-4 px-2 fw-normal  ${item.subTitleClass} `}
                              >
                                {item.subTitle}
                              </small>
                            </>
                          )}
                        </>
                      </a>
                    ))}
                  {item.children && (
                    <>
                      <a
                        href={item.path}
                        className={`side-nav-bar-custom-ps rounded-0 nav-link border-bottom-0 ${getClassName(
                          item.name.toLowerCase(),
                          item.name.toLowerCase()
                        )} ${item.className}`}
                        type="button"
                        data-bs-toggle="collapse"
                      >
                        <>
                          <Image src={item.icon} alt={`${item.name}-icon`} />
                          <span className="ms-2">{item.name}</span>
                        </>
                      </a>
                      <div className="accordion accordion-flush" id="item">
                        <div className="accordion-item activebg">
                          <div
                            id={`item-target-${item.id}`}
                            className="accordion-collapse"
                            aria-labelledby="flush-headingOne"
                            data-bs-parent="#item"
                          >
                            <div className="accordion-body px-0">
                              <ul className="nav nav-pills flex-column">
                                {item.children.map(
                                  (itemChildren, itemChildrenIndex) => {
                                    return (
                                      <li
                                        key={`side-nav-bar-main-item-children-${itemChildrenIndex}`}
                                        className={`${itemChildren.className} mt-2`}
                                      >
                                        {itemChildren.isInternalRoute &&
                                        itemChildren.navLink ? (
                                          <itemChildren.navLink
                                            href={itemChildren.path}
                                            className={({ isActive }) =>
                                              isActive
                                                ? "ps-5 rounded-0 py-1 nav-link activeNavLink"
                                                : "ps-5 rounded-0 py-1 nav-link nonActiveNavLink"
                                            }
                                            onClick={() => toggleSideBar()}
                                          >
                                            <>
                                              <Image
                                                src={itemChildren.icon}
                                                alt={`${itemChildren.name}-icon`}
                                              />
                                              <span className="ms-2">
                                                {itemChildren.name}
                                              </span>
                                              {itemChildren.subTitle && (
                                                <>
                                                  <br />
                                                  <small
                                                    className={`ms-4 px-2 fw-normal ${itemChildren.subTitleClass} `}
                                                  >
                                                    {itemChildren.subTitle}
                                                  </small>
                                                </>
                                              )}
                                            </>
                                          </itemChildren.navLink>
                                        ) : (
                                          <a
                                            href={itemChildren.path}
                                            className={`ps-5 rounded-0 py-1 nav-link ${getClassName(
                                              item.name.toLowerCase(),
                                              itemChildren.name.toLowerCase()
                                            )} `}
                                          >
                                            <>
                                              <Image
                                                src={itemChildren.icon}
                                                alt={`${itemChildren.name}-icon`}
                                              />
                                              <span className="ms-2">
                                                {itemChildren.name}
                                              </span>
                                              {itemChildren.subTitle && (
                                                <>
                                                  <br />
                                                  <small
                                                    className={`ms-4 px-2 fw-normal ${itemChildren.subTitleClass} `}
                                                  >
                                                    {itemChildren.subTitle}
                                                  </small>
                                                </>
                                              )}
                                            </>
                                          </a>
                                        )}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <hr style={{ width: "77%" }} />
          <div className="">
            <h6>RECENT</h6>
            <ul className="nav nav-pills flex-column ">
              {recentList.map((d: any, idx: number) => (
                <li className="" key={idx.toString()}>
                  <a href={d.link} className="nav-link link-dark">
                    <Image src={setBullet(idx)} alt="" />
                    <span className="ms-2">{capitalizeWord(d.name)}</span>
                  </a>
                </li>
              ))}
              <li className="mt-3">
                <a
                  href={newWorkspace.path}
                  className="px-2 nav-link nonActiveNavLink"
                >
                  <Image src={newWorkspace.icon} alt="" />
                  <span className="ms-2">New Workspace</span>
                </a>
              </li>
            </ul>
          </div>
          <hr style={{ width: "77%" }} />
          <div className="mt-1">
            <h6>CONTACT US</h6>
            <ul className="nav nav-pills flex-column ">
              {/* {contactUs.map((item, index) => (
                <li className="mt-1" key={`contact-item-${index}`}>
                  <span className="px-1 nav-link nonActiveNavLink">
                    <img src={item.icon} alt="" />
                    <span className="">{item.value}</span>
                    <br />
                  </span>
                </li>
              ))} */}
              <li className="mt-1 ps-2">
                <span className="px-1 nav-link boldText nonActiveTextColor">
                  <HelpdeskContactElement
                    title={contactUs.helpdeskURL.title}
                    icon={contactUs.helpdeskURL.icon}
                    link={contactUs.helpdeskURL.link}
                  />

                  <div className="group text-muted mt-3 mb-2">
                    <div className="item line" />
                    <div className="item text" style={{ fontSize: "10" }}>
                      Or mail us at
                    </div>
                    <div className="item line" />
                  </div>
                  <EmailContactElement
                    email={contactUs.email.name}
                    icon={contactUs.email.icon}
                  />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
