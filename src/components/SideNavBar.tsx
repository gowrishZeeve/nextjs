import Sidebar from "@/components/SideBar";
import Urls from "@/utils/baseURLs";
import settings from "@/assets/Settings-icon.png";
import iconMarket from "@/assets/marketplace_logo.svg";
import iconDashbord from "@/assets/Icon-dashboard.png";
import iconWorkspace from "@/assets/workspace.png";
import iconNetworks from "@/assets/networks.png";
import iconCloud from "@/assets/SoundCloud.png";
import addchannel from "@/assets/AddChannel.png";
import emailIcon from "@/assets/email.png";
import endpointImg from "@/assets/endpoint.png";
import zdfsIcon from "@/assets/zdfsicon.png";
import sub1 from "@/assets/sub-1.png";
import sub2 from "@/assets/sub-2.png";
import sub3 from "@/assets/sub-3.png";
import sub4 from "@/assets/sub-4.png";
import sub5 from "@/assets/sub-5.png";
import helpdeskSVG from "@/assets/helpdesk.svg";
import ThreeSquare from "@/assets/ThreeSquare.svg";

interface Props {
  activeLink: string;
  activeLinkParent: string;
}
function SideDrawer({ activeLink, activeLinkParent }: Props) {
  return (
    <Sidebar
      sidebarMainItems={[
        {
          name: "Dashboard",
          path: Urls.getDashboardUrl(),
          icon: iconDashbord,
          id: "dash",
          isInternalRoute: false,
        },
        {
          name: "Workspace",
          path: Urls.getWorkspaceUrl(),
          icon: iconWorkspace,
          id: "work",
          isInternalRoute: true,
        },
        {
          name: "Buy Services",
          path: Urls.getMarketplaceUrl(),
          icon: iconMarket,
          id: "market",
          className: "font14",
          isInternalRoute: true,
          children: [
            {
              name: "RPC & Blockchain APIs",
              icon: endpointImg,
              path: Urls.getEndpointHttpUrl(),
              isInternalRoute: true,
            },
            {
              name: "Dedicated Nodes",
              path: Urls.getMarketplaceUrl(),
              icon: iconNetworks,
              isInternalRoute: true,
            },
            {
              name: "Staking Nodes",
              path: Urls.getStakingMarketplaceUrl(),
              icon: iconNetworks,
              isInternalRoute: true,
            },
            {
              name: "ZDFS",
              path: Urls.getZdfsPurchaseUrl(),
              icon: zdfsIcon,
              isInternalRoute: true,
            },
          ],
        },
        {
          name: "Manage Services",
          path: Urls.getAllNetworkUrl(),
          icon: iconCloud,
          id: "manage",
          className: "font14",
          isInternalRoute: true,
          children: [
            {
              name: "RPC API Endpoints",
              icon: endpointImg,
              path: Urls.getEndpointsUrl(),
              isInternalRoute: true,
            },
            {
              name: "Dedicated Nodes",
              path: Urls.getAllNetworkUrl(),
              icon: iconNetworks,
              isInternalRoute: true,
            },
            {
              name: "Staking Nodes",
              path: Urls.getAllStakingNetworkUrl(),
              icon: iconNetworks,
              isInternalRoute: true,
            },
            {
              name: "ZDFS",
              path: Urls.getZdfsManageUrl(),
              icon: zdfsIcon,
              isInternalRoute: true,
            },
            {
              name: "Blockchain Data",
              path: Urls.getZdexerURL(),
              icon: ThreeSquare,
              isInternalRoute: false,
              subTitle: "New",
              subTitleClass: "MenuTag",
            },
          ],
        },
        {
          name: "Settings",
          path: Urls.getMyAccountUrl(),
          icon: settings,
          id: "settings",
          isInternalRoute: true,
        },
      ]}
      contactUs={{
        showBorder: true,
        email: { icon: emailIcon, name: Urls.getContactDetails().email },
        helpdeskURL: {
          title: "Helpdesk",
          link: Urls.getContactDetails().helpdeskURL,
          icon: helpdeskSVG,
        },
      }}
      newWorkspace={{ path: Urls.getWorkspaceUrl(), icon: addchannel }}
      activeLink={activeLink}
      activeLinkParent={activeLinkParent}
      recentWorkspaceIcons={[
        { icon: sub1 },
        { icon: sub2 },
        { icon: sub3 },
        { icon: sub4 },
        { icon: sub5 },
      ]}
    />
  );
}

export default SideDrawer;
