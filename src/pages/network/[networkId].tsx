"use client"
import { useRouter } from "next/router";
import Navbar from "@/components/NavBar";
import SideDrawer from "@/components/SideNavBar";
import ViewEndpointBody from "@/components/ViewNetwork/ViewNetworkBody";

const ViewNetwork: React.FC = () => {
  const router = useRouter();

  const { networkId } = router.query;

  return (
    <main>
      <Navbar />
      <section className="mt-2 container-fluid">
        <div className="row">
          <SideDrawer
            activeLinkParent={"manage services"}
            activeLink={"dedicated nodes"}
          />
          <div className="col-xl-10 col-lg-10 col-md-9 col-sm-8 d-flex flex-column flex-shrink-0 ps-1">
            {typeof networkId === "string" && (
              <ViewEndpointBody id={networkId} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewNetwork;
