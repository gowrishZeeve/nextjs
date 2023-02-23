"use client"
import { useRouter } from "next/router";
import Navbar from "@/components/NavBar";
import SideDrawer from "@/components/SideNavBar";

import ViewEndpointBody from "@/components/ViewEndpoint";

const Endpoint: React.FC = () => {
  const router = useRouter();

  const { endpointId } = router.query;

  return (
    <main>
      <Navbar />
      <section className="mt-2 container-fluid">
        <div className="row">
          <SideDrawer activeLinkParent={""} activeLink={""} />
          <div className="col-xl-10 col-lg-10 col-md-9 col-sm-8 d-flex flex-column flex-shrink-0 ps-1">
            {typeof endpointId === "string" && (
              <ViewEndpointBody id={endpointId} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Endpoint;
