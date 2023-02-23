/* eslint-disable react/no-array-index-key */
import { Dispatch, SetStateAction, useEffect } from "react";
import { network } from "@/components/ViewNetwork/ViewNetworkBody";
import LandingCard from "@/components/ViewNetwork/LandingCard";

interface props {
  networkData: network[];
  setNodeId: (x: string) => void;
  setRpcList: (x: string[]) => void;
  setCodes: Dispatch<SetStateAction<any>>;
}
const NodeCard = ({ networkData, setNodeId, setRpcList, setCodes }: props) => {
  useEffect(() => {
    console.log;
  }, [networkData]);

  return (
    <div>
      <div
        className="alert alert-danger mb-1"
        id="fail"
        style={{ display: "none" }}
        role="alert"
      >
        Operation not supported. Coming soon
      </div>
      <div
        id="actionSuccess"
        className="alert alert-success mb-1"
        style={{ display: "none" }}
        role="alert"
      >
        Action Performed
      </div>
      <div
        className="alert alert-danger mb-1"
        id="actionFail"
        style={{ display: "none" }}
        role="alert"
      >
        Error performing action
      </div>
      <div
        className="alert alert-danger mb-1"
        id="analyticsDiv"
        style={{ display: "none" }}
        role="alert"
      >
        Analytics will start when node is in provisioning state
      </div>
      {networkData &&  networkData.length === 0 && (
        <div
          style={{
            color: "#ABB2B9",
            textAlign: "center",
            fontSize: "20px",
            marginTop: "5%",
          }}
        >
          No Node Data
        </div>
      )}
      <section className="mx-2 mb-2 ">
        {networkData &&
          networkData.length > 0 &&
          networkData.map((data, idx) => (
            <LandingCard
              key={idx.toString()}
              state={data.status}
              endpoint={data.endpoint}
              cloudimage={data.cloud_id.toString()}
              region={data.region_id.toString()}
              networkId={data.network_id}
              node={data.node_id}
              nodeName={data.node_name}
              setNodeId={setNodeId}
              setRpcList={setRpcList}
              setCodes={setCodes}
            />
          ))}
      </section>
    </div>
  );
};
export default NodeCard;
