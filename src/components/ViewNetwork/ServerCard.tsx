import notificationgreen from "@/assets/notifications-green.png";
import notificationtime from "@/assets/notifications-time.png";
import infocircle from "@/assets/info-circle.png";
import VisNetwork from "@/components/ViewNetwork/Network";
import { network } from "@/components/ViewNetwork/ViewNetworkBody";
import Image from "next/image";

interface prop {
  data: network[];
}
const ServerCard = ({ data }: prop) => (
  <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mt-5">
    <div className="card network-process h-100">
      {data.length === 0 && (
        <div
          style={{
            color: "#ABB2B9",
            paddingTop: "100px",
            textAlign: "center",
            fontSize: "20px",
            marginTop: "5%",
          }}
        >
          No Data
        </div>
      )}
      {data.length > 0 && <VisNetwork Data={data} />}

      {/* </div> */}
      <div className="d-flex mx-5 mt-2">
        <div className="col-4 d-flex justify-content-center">
          <Image src={notificationgreen} style={{ height: "20px" }} alt="" />
          <p className="ms-2">Running</p>
        </div>
        <div className="col-4 d-flex justify-content-center">
          <Image src={infocircle} style={{ height: "20px" }} alt="" />
          <p className="ms-2">Stopped</p>
        </div>
        <div className="col-4 d-flex justify-content-center">
          <Image src={notificationtime} style={{ height: "20px" }} alt="" />
          <p className="ms-2">Processing</p>
        </div>
      </div>
    </div>
  </div>
);
export default ServerCard;
